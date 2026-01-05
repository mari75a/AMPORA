# ml-service/planner_google.py
import time
from typing import List, Tuple, Any
import httpx
from geopy.distance import geodesic
from pydantic import BaseModel

GOOGLE_DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"

# ---------------- DTOs ----------------
class RouteDTO(BaseModel):
    distance_km: float
    duration_min: float
    path: List[Tuple[float, float]]

class StationDTO(BaseModel):
    station_id: int
    name: str
    address: str | None = None
    lat: float
    lon: float
    max_power_kw: float = 0
    charger_count: int = 0
    distance_to_route_km: float | None = None

# ---------------- Polyline decode ----------------
def decode_polyline5(polyline_str: str) -> List[Tuple[float, float]]:
    index, lat, lng, coordinates = 0, 0, 0, []
    while index < len(polyline_str):
        result, shift = 0, 0
        while True:
            b = ord(polyline_str[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlat = ~(result >> 1) if result & 1 else result >> 1
        lat += dlat

        result, shift = 0, 0
        while True:
            b = ord(polyline_str[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlng = ~(result >> 1) if result & 1 else result >> 1
        lng += dlng

        coordinates.append((lat / 1e5, lng / 1e5))

    return coordinates


def haversine_km(a, b):
    return geodesic(a, b).km


def point_segment_distance_km(p, a, b):
    # simple & fast midpoint heuristic
    return min(
        haversine_km(p, a),
        haversine_km(p, b),
        haversine_km(p, ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)),
    )

# ---------------- Directions + stations ----------------
class TTLCache:
    def __init__(self, ttl=25):
        self.ttl = ttl
        self.store = {}

    def get(self, key):
        item = self.store.get(key)
        if not item:
            return None
        ts, val = item
        if time.time() - ts > self.ttl:
            self.store.pop(key, None)
            return None
        return val

    def set(self, key, val):
        self.store[key] = (time.time(), val)


class GoogleEVPlanner:
    def __init__(self, google_api_key: str, max_station_distance_km: float = 5):
        self.key = google_api_key
        self.max_station_distance_km = max_station_distance_km
        self.cache = TTLCache(ttl=25)

    async def get_routes_from_google(self, start, end, waypoints=None):
        waypoints = waypoints or []
        wp_string = "|".join(f"{lat},{lng}" for (lat, lng) in waypoints) if waypoints else None

        cache_key = f"{start}-{end}-{wp_string}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        params = {
            "origin": f"{start[0]},{start[1]}",
            "destination": f"{end[0]},{end[1]}",
            "mode": "driving",
            "key": self.key,
            "alternatives": "true",
        }

        if wp_string:
            params["waypoints"] = f"optimize:true|{wp_string}"

        async with httpx.AsyncClient(timeout=8.5) as client:
            r = await client.get(GOOGLE_DIRECTIONS_URL, params=params)
            data = r.json()

        routes = []
        for rt in data.get("routes", []):
            legs = rt.get("legs", [])
            dist_m = sum(l.get("distance", {}).get("value", 0) for l in legs)
            dur_s = sum(l.get("duration", {}).get("value", 0) for l in legs)
            poly = rt.get("overview_polyline", {}).get("points", "")
            path = decode_polyline5(poly)

            routes.append(
                RouteDTO(
                    distance_km=round(dist_m / 1000, 2),
                    duration_min=round(dur_s / 60, 1),
                    path=path,
                )
            )

        routes.sort(key=lambda r: r.duration_min)
        self.cache.set(cache_key, routes)
        return routes

    def stations_near_any_route(self, routes: List[RouteDTO], stations: List[StationDTO]):
        if not routes:
            return []

        path = routes[0].path
        if len(path) < 2:
            return []

        near = []
        for s in stations:
            p = (s.lat, s.lon)
            best = 9999
            for i in range(len(path) - 1):
                a = path[i]
                b = path[i + 1]
                d = point_segment_distance_km(p, a, b)
                if d < best:
                    best = d
                    if best <= self.max_station_distance_km:
                        break

            if best <= self.max_station_distance_km:
                s2 = s.model_copy()
                s2.distance_to_route_km = round(best, 2)
                near.append(s2)

        near.sort(key=lambda s: s.distance_to_route_km or 9999)
        return near
