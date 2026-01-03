# ml-service/app.py
import os
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv

from models import db, Station, Charger
from enhanced_ev_planner import EnhancedEVPlanner

load_dotenv()

def _pg_uri():
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    dbn  = os.getenv("POSTGRES_DB", "ampora")
    usr  = os.getenv("POSTGRES_USER", "ampora_user")
    pwd  = os.getenv("POSTGRES_PASSWORD", "a")
    return f"postgresql+psycopg2://{usr}:{pwd}@{host}:{port}/{dbn}"

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = _pg_uri()
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# CORS for local dev
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

db.init_app(app)
planner = EnhancedEVPlanner(max_station_distance_km=5)  # 5km band from route polyline

@app.get("/api/health")
def health():
    return {"ok": True, "time": datetime.utcnow().isoformat()}

@app.post("/api/route")
def api_route():
    """
    Body:
    {
      "start": {"lat": <float>, "lng": <float>},
      "end": {"lat": <float>, "lng": <float>},
      "stops": [ {"lat":..., "lng":...}, ... ]  # optional
    }
    """
    data = request.get_json(force=True)
    start = data.get("start")
    end   = data.get("end")
    stops = data.get("stops", [])

    if not start or not end:
        return jsonify({"success": False, "error": "start {lat,lng} and end {lat,lng} required"}), 400

    s = (float(start["lat"]), float(start["lng"]))
    e = (float(end["lat"]), float(end["lng"]))
    waypoints = [(float(p["lat"]), float(p["lng"])) for p in stops if p and "lat" in p and "lng" in p]

    try:
        # 1) Routes via OSRM (with waypoints)
        routes = planner.get_routes_from_osrm(s, e, waypoints=waypoints, alternatives=2)
        if not routes:
            return jsonify({"success": False, "error": "No routes returned"}), 404

        # 2) Load stations once (from DB) and compute proximity to the first (shortest) route
        stations = planner.load_stations()
        near = planner.stations_near_route(routes[0]["path"], stations)

        # 3) Optional: build a folium map file (commented by default)
        # map_name = planner.build_map(s, e, routes, near)

        return jsonify({
            "success": True,
            "routes": [{
                "distance_km": round(r["distance_km"], 1),
                "duration_min": round(r["duration_min"], 0),
                "path": r["path"],  # [ [lat,lon], ... ]
            } for r in routes],
            "nearby_stations": near[:60],
            # "map_file": map_name
        })
    except Exception as ex:
        return jsonify({"success": False, "error": str(ex)}), 500


if __name__ == "__main__":
    with app.app_context():
        # Verify DB connectivity (no create_all; matches your existing schema)
        db.session.execute(db.text("SELECT 1"))
    app.run(host="127.0.0.1", port=8000, debug=True)
