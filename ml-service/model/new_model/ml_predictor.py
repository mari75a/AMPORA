import os
import joblib
import pandas as pd
import pytz
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH", "models/ev_recommendation_model_v4.pkl")

model_pipeline = None
mlb = None

def load_model():
    global model_pipeline, mlb
    try:
        model_data = joblib.load(MODEL_PATH)
        model_pipeline = model_data["pipeline"]
        mlb = model_data["mlb"]
        print("✅ ML model loaded:", MODEL_PATH)
    except Exception as e:
        print("⚠️ ML model not loaded:", e)

def app_user_to_model_user(app_user_type: str) -> str:
    """
    Your UI types -> training types
    UI: Business_Man, Tourist, Delivery_Driver, Casual_Driver
    Model: Office_Worker, Tourist, Delivery_Driver, Casual_User
    """
    mapping = {
        "Business_Man": "Office_Worker",
        "Casual_Driver": "Casual_User",
        "Delivery_Driver": "Delivery_Driver",
        "Tourist": "Tourist",
    }
    return mapping.get(app_user_type, "Casual_User")

def predict_activities(app_user_type: str, charging_time_minutes: int) -> str:
    if model_pipeline is None or mlb is None:
        return "Coffee, snack, short walk"

    lk_tz = pytz.timezone("Asia/Colombo")
    now_lk = datetime.now(lk_tz)

    model_user_type = app_user_to_model_user(app_user_type)

    input_df = pd.DataFrame([{
        "user_type": model_user_type,
        "charging_time": int(charging_time_minutes),
        "time": now_lk.strftime("%H:%M"),
        "day": now_lk.strftime("%A"),
        "month": now_lk.strftime("%B"),
        "is_festival": 0,
        "is_weekend": 1 if now_lk.weekday() >= 5 else 0,
    }])

    try:
        pred = model_pipeline.predict(input_df)
        labels = mlb.inverse_transform(pred)

        if labels and labels[0]:
            cleaned = [x for x in labels[0] if x != "none"]
            if cleaned:
                return ", ".join(cleaned)

        return "Coffee, snack, short walk"
    except Exception as e:
        print("⚠️ ML predict error:", e)
        return "Coffee, snack, short walk"
