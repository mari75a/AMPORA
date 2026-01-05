import os
import json
import random
import traceback
from typing import Optional, List, Dict, Any

import pandas as pd
from dotenv import load_dotenv

# =========================================================
# ✅ CRITICAL: function must exist BEFORE joblib.load() runs
# because your saved model references __main__.transform_features
# =========================================================
def transform_features(X_df: pd.DataFrame) -> pd.DataFrame:
    X_copy = X_df.copy()

    time_split = X_copy["time"].str.split(":", expand=True).astype(int)
    X_copy["total_minutes"] = (time_split[0] * 60) + time_split[1]

    user_mapping = {
        "Office_Worker": 0,
        "Tourist": 1,
        "Delivery_Driver": 2,
        "Casual_User": 3,
    }
    day_mapping = {
        "Monday": 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
        "Sunday": 6,
    }
    month_mapping = {
        "January": 0, "February": 1, "March": 2, "April": 3,
        "May": 4, "June": 5, "July": 6, "August": 7,
        "September": 8, "October": 9, "November": 10, "December": 11,
    }

    X_copy["user_type_code"] = X_copy["user_type"].map(user_mapping)
    X_copy["day_code"] = X_copy["day"].map(day_mapping)
    X_copy["month_code"] = X_copy["month"].map(month_mapping)

    return X_copy.drop(["time", "day", "month", "user_type"], axis=1)


# ✅ Bind into __main__ so pickle can resolve __main__.transform_features
import __main__  # noqa: E402
__main__.transform_features = transform_features

# ✅ Load .env early
load_dotenv()

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from pydantic import BaseModel, Field  # noqa: E402

from groq import Groq  # noqa: E402
from psycopg2.extras import RealDictCursor  # noqa: E402

from database import get_db_connection  # noqa: E402
from distance_time import analyze_stations_logic  # noqa: E402
from ml_predictor import load_model, predict_activities  # noqa: E402


# ✅ Load ML model AFTER transform_features exists
try:
    load_model()
except Exception as e:
    print(f"⚠️ ML model load failed: {e}")

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Chat memory per trip
# -----------------------
CHAT_STORE: Dict[str, Dict[str, Any]] = {}
# { conversation_id: { "messages": [{"role":"user/ai","text":"..."}], "user_type": "Tourist" } }

APP_USER_TYPES = ["Delivery_Driver", "Business_Man", "Casual_Driver", "Tourist"]

# -----------------------
# Request/Response models
# -----------------------
class Station(BaseModel):
    name: str
    lat: float
    lng: float
    address: Optional[str] = None
    status: Optional[str] = None


class NearbyStationsRequest(BaseModel):
    path_points: List[dict]
    buffer_km: float = 5.0


class ChatRequest(BaseModel):
    conversation_id: str = Field(..., description="Trip/chat id")
    start_city: str
    end_city: str
    start_lat: Optional[float] = None
    start_lng: Optional[float] = None
    soc_level: int = 50
    user_text: str
    stations: List[Station] = []


class ChatResponse(BaseModel):
    conversation_id: str
    assistant_text: str
    user_type: str
    best_station: Optional[dict] = None
    sorted_stations: List[dict] = []


# -----------------------
# Helpers
# -----------------------
def get_origin(req: ChatRequest):
    if req.start_lat is not None and req.start_lng is not None:
        return (req.start_lat, req.start_lng)
    return req.start_city


def infer_user_type_llm(user_text: str, recent_messages: List[dict], start_city: str, end_city: str) -> str:
    history_text = "\n".join([f"{m['role']}: {m['text']}" for m in recent_messages[-8:]])

    prompt = f"""
Classify the user into exactly ONE type:
- Delivery_Driver
- Business_Man
- Casual_Driver
- Tourist

Trip: {start_city} -> {end_city}

Conversation:
{history_text}

User message:
{user_text}

Return ONLY JSON:
{{"user_type":"Casual_Driver"}}
"""
    try:
        res = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
        )
        data = json.loads(res.choices[0].message.content)
        ut = data.get("user_type", "Casual_Driver")
        return ut if ut in APP_USER_TYPES else "Casual_Driver"
    except Exception:
        return "Casual_Driver"


def generate_chatbot_reply_llm(
    user_text: str,
    user_type: str,
    best: dict,
    sorted_list: list,
    activities: str,
    charging_minutes: int,
    start_city: str,
    end_city: str
) -> str:
    alternatives = [s for s in sorted_list if s["name"] != best["name"]][:2]
    alt_text = "\n".join(
        [f"- {a['name']}: wait {a['wait']}h, drive {a['travel_time']}, distance {a['distance']}"
         for a in alternatives]
    ) or "No strong alternatives found."

    prompt = f"""
You are AMPORA ⚡, a friendly and reliable EV travel assistant. Be clear, natural, and practical.

User type: {user_type}
Trip: {start_city} -> {end_city}
User message: "{user_text}"

IMPORTANT CONSTRAINT:
- The station decision is already computed. Do NOT change the best station.

BEST STATION:
- Name: {best['name']}
- Wait hours: {best['wait']}
- Drive time: {best['travel_time']}
- Distance: {best['distance']}
- Address: {best.get('address','N/A')}

Alternatives:
{alt_text}

Charging time estimate (temporary): {charging_minutes} minutes
Activities predicted by ML: {activities}

Knowledge & search rules:
1) If you know the answer with high confidence, answer directly.
2) If the user’s question involves real-world, location-based, time-sensitive, or uncertain information
   (e.g. station ratings, nearby cafés/restrooms/shops, opening hours, pricing, traffic, availability),
   automatically search the internet to verify.
   The user does NOT need to ask you to search.
3) When you use online information, clearly mention the source(s) briefly
   (example: “Source: Google Maps reviews”, “Source: operator website”).
4) Never invent ratings, reviews, prices, or availability. If data is unavailable, say so briefly.

Conversation behavior:
- Do NOT repeat the same long explanation if the user asks again or says “no”.
  Adapt the response and move forward.
- If the user already indicated work or holiday, do NOT ask again.
- Ask at most ONE short follow-up question only if it genuinely helps refine the answer.
- If battery level (SOC) is missing and required, ask once:
  “What’s your battery level right now? (0–100%)”
  If still missing, continue with reasonable assumptions.

Response goals:
1) Explain why this station is the best choice and briefly mention 1–2 alternatives.
2) Suggest how to spend the charging wait using ML-predicted activities.
3) If helpful, include nearby highly rated places (cafés/food/shops) with ratings and source.
4) Friendly tone. Short paragraphs. Light emojis only if helpful (⚡🔋⭐).

Output rules:
- Be concise and user-friendly.
- Do NOT change the computed station decision.
- Return ONLY valid JSON in this exact format:

{{"assistant_text":"..."}}

"""
    try:
        res = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Return ONLY valid JSON."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
        )
        data = json.loads(res.choices[0].message.content)
        return (data.get("assistant_text") or "").strip() or "Done."
    except Exception:
        return "Done."


# -----------------------
# Endpoint: get-nearby-stations
# -----------------------
@app.post("/get-nearby-stations")
async def get_nearby_stations(req: NearbyStationsRequest):
    path_points = req.path_points or []
    if not path_points:
        return {"stations": []}

    lats = [p["lat"] for p in path_points]
    lngs = [p["lng"] for p in path_points]

    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT name, latitude as lat, longitude as lng, address, status
                FROM station
                WHERE latitude BETWEEN %s AND %s
                  AND longitude BETWEEN %s AND %s
                """,
                (min(lats) - 0.1, max(lats) + 0.1, min(lngs) - 0.1, max(lngs) + 0.1),
            )
            rows = cur.fetchall()

        for r in rows:
            r["lat"] = float(r["lat"])
            r["lng"] = float(r["lng"])

        return {"stations": rows}
    except Exception as e:
        print("❌ DB error:", e)
        return {"stations": [], "error": str(e)}
    finally:
        conn.close()


# -----------------------
# Endpoint: chat
# -----------------------
@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        # Init memory
        if req.conversation_id not in CHAT_STORE:
            CHAT_STORE[req.conversation_id] = {"messages": [], "user_type": None}

        store = CHAT_STORE[req.conversation_id]
        store["messages"].append({"role": "user", "text": req.user_text})

        # Infer / update user type (LLM)
        if not store["user_type"]:
            store["user_type"] = infer_user_type_llm(
                req.user_text, store["messages"], req.start_city, req.end_city
            )

        stations_list = [s.model_dump() for s in req.stations] if req.stations else []

        origin = get_origin(req)
        best, sorted_list = analyze_stations_logic(origin, stations_list)

        if not best:
            assistant_text = "⚠️ I couldn't find a suitable station. Try another route or increase station coverage."
            store["messages"].append({"role": "ai", "text": assistant_text})
            return ChatResponse(
                conversation_id=req.conversation_id,
                assistant_text=assistant_text,
                user_type=store["user_type"] or "Casual_Driver",
                best_station=None,
                sorted_stations=[],
            )

        charging_minutes = random.choice([30, 60, 90, 120, 150, 180, 210])

        activities = predict_activities(store["user_type"], charging_minutes)

        assistant_text = generate_chatbot_reply_llm(
            user_text=req.user_text,
            user_type=store["user_type"],
            best=best,
            sorted_list=sorted_list,
            activities=activities,
            charging_minutes=charging_minutes,
            start_city=req.start_city,
            end_city=req.end_city,
        )

        store["messages"].append({"role": "ai", "text": assistant_text})

        return ChatResponse(
            conversation_id=req.conversation_id,
            assistant_text=assistant_text,
            user_type=store["user_type"],
            best_station=best,
            sorted_stations=sorted_list,
        )

    except Exception:
        traceback.print_exc()
        return ChatResponse(
            conversation_id=req.conversation_id,
            assistant_text="⚠️ Error processing chat. Please try again.",
            user_type="Casual_Driver",
            best_station=None,
            sorted_stations=[],
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
