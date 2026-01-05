import os
import random
import googlemaps
from dotenv import load_dotenv

load_dotenv()

GMAPS_API_KEY = os.getenv("GMAPS_API_KEY")
if not GMAPS_API_KEY:
    raise RuntimeError("GMAPS_API_KEY missing in .env")

gmaps_client = googlemaps.Client(key=GMAPS_API_KEY)


def analyze_stations_logic(origin, stations_list, min_wait_hours: float = 0.01):
    """
    Returns:
      best_station: dict | None
      sorted_list: list[dict] sorted by smallest wait (but ONLY stations with wait > 0)

    Uses Google Distance Matrix for real driving time/distance.

    Wait is demo (queue_initial random) but stable per station name.

    min_wait_hours:
      - stations with wait_at_arrival < min_wait_hours are ignored
      - use 0.01 to avoid float rounding issues showing "0.0"
    """
    if not stations_list:
        return None, []

    dest_coords = [(float(s["lat"]), float(s["lng"])) for s in stations_list]

    try:
        matrix = gmaps_client.distance_matrix(
            origins=[origin],
            destinations=dest_coords,
            mode="driving",
        )

        rows = matrix.get("rows") or []
        if not rows:
            return None, []

        elements = rows[0].get("elements") or []

        processed = []
        for i, s in enumerate(stations_list):
            if i >= len(elements):
                continue

            el = elements[i]
            if el.get("status") != "OK":
                continue

            duration_sec = el["duration"]["value"]
            distance_m = el["distance"]["value"]
            trip_time_hrs = duration_sec / 3600.0

            # Stable pseudo queue per station (demo until you have real queues)
            random.seed(hash(s.get("name", "")) % 10_000)
            queue_hrs = random.uniform(1, 10)

            wait_at_arrival = max(0.0, queue_hrs - trip_time_hrs)

            # ✅ Only keep stations with wait > 0
            if wait_at_arrival < min_wait_hours:
                continue

            processed.append({
                "name": s["name"],
                "address": s.get("address", "N/A"),
                "status": s.get("status", None),

                "wait": round(wait_at_arrival, 2),          # hours (display)
                "travel_time": el["duration"]["text"],
                "distance": el["distance"]["text"],

                "queue_initial": round(queue_hrs, 2),       # demo
                "lat": float(s["lat"]),
                "lng": float(s["lng"]),

                # sorting helpers
                "_wait_raw": wait_at_arrival,
                "_duration_sec": duration_sec,
                "_distance_m": distance_m,
            })

        # ✅ Sort: smallest wait first, then shortest drive time, then shortest distance
        processed.sort(key=lambda x: (x["_wait_raw"], x["_duration_sec"], x["_distance_m"]))

        # Remove helper fields
        for p in processed:
            p.pop("_wait_raw", None)
            p.pop("_duration_sec", None)
            p.pop("_distance_m", None)

        best = processed[0] if processed else None
        return best, processed

    except Exception as e:
        print(f"Logic Error: {e}")
        return None, []
