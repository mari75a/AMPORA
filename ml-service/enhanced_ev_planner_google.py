# enhanced_ev_planner_google.py
import os
import math
from typing import Any, Dict, List, Tuple

import async_lru
import httpx
from geopy.distance import geodesic
from pydantic import BaseModel
from sqlalchemy import Column, Float, Integer, String, create_engine, func
from sqlalchemy.orm import Session, declarative_base

# ---------------- Pydantic DTOs ----------------
class RouteDTO(BaseModel):
    distance_km: float
    duration_min: float
    path: List[Tuple[float, float]]  # [(lat, lon), ...]

class StationDTO(BaseModel):
    station_id: int
    name: str | None = None
    address: str | None = None
    lat: float
    lon: float
    max_power_kw: float = 0.0
    charger_count: int = 0
    distance_to_route_km: float | None = None

# ---------------- SQLAlchemy Models ----------------
Base = declarative_base()

class Station(Base):
    __tablename__ = "station"
    station_id = Column(Integer, primary_key=True)
    name = Column(String)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

class Charger(Base):
    __tablename__ = "charger"
    charger_id = Column(Integer, primary_key=True)
    station_id = Column(Integer)
    power_kw = Column(Float)

# ---------------- Helpers ----------------
def _decode_polyline5(polyline_str: str) -> List[Tuple[float, float]]:
    index = lat = lng = 0
    coordinates = []

    while index < len(polyline_str):
        result = shift = 0
        while True:
            b = ord(polyline_str[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlat = ~(result >> 1) if result & 1 else (result >> 1)
        lat += dlat

        result = shift = 0
        while True:
            b = ord(polyline_str[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlng = ~(result >> 1) if result & 1 else (result >> 1)
        lng += dlng

        coordinates.append((lat / 1e5, lng / 1e5))
    return coordinates

def _haversine_km(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    return geodesic(a, b).km

def _point_segment_distance_km(p: Tuple[float, float], a: Tuple[float, float], b: Tuple[float, float]) -> float:
    # sample endpoints + midpoint (fast & accurate enough for overview polylines)
    d_pa = _haversine_km(p, a)
    d_pb = _haversine_km(p, b)
    mid = ((a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0)
    d_pm = _haversine_km(p, mid)
    return min(d_pa, d_pb, d_pm)

# ---------------- Planner ----------------
class GoogleEVPlanner:
    def __init__(self, google_api_key: str, max_station_distance_km: float = 5.0):
        if not google_api_key:
            raise RuntimeError("GOOGLE_MAPS_API_KEY / VITE_GOOGLE_MAPS_API_KEY is not set")
        self.google_api_key = google_api_key
        self.max_station_distance_km = max_station_distance_km

        # DB connection
        pg_host = os.getenv("POSTGRES_HOST", "localhost")
        pg_port = os.getenv("POSTGRES_PORT", "5432")
        pg_db = os.getenv("POSTGRES_DB", "ampora")
        pg_user = os.getenv("POSTGRES_USER", "ampora_user")
        pg_pw = os.getenv("POSTGRES_PASSWORD", "")

        self.engine = create_engine(
            f"postgresql+psycopg2://{pg_user}:{pg_pw}@{pg_host}:{pg_port}/{pg_db}",
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )

        # single async client with connection pool
        self._client = httpx.AsyncClient(
            headers={"Accept": "application/json"},
            timeout=httpx.Timeout(7.0, connect=3.0),  # tight deadlines
            limits=httpx.Limits(max_keepalive_connections=50, max_connections=100),
        )

    # --------------- Google Directions ---------------
    @async_lru.alru_cache(maxsize=256)
    async def _google_directions_cached(
        self,
        origin: Tuple[float, float],
        destination: Tuple[float, float],
        waypoints: Tuple[Tuple[float, float], ...],
        alternatives: bool,
    ) -> Dict[str, Any]:
        base_url = "https://maps.googleapis.com/maps/api/directions/json"

        origin_str = f"{origin[0]},{origin[1]}"
        dest_str = f"{destination[0]},{destination[1]}"

        params = {
            "origin": origin_str,
            "destination": dest_str,
            "mode": "driving",
            "alternatives": "true" if alternatives else "false",
            "key": self.google_api_key,
        }

        if waypoints:
            w = "|".join([f"{lat},{lng}" for (lat, lng) in waypoints])
            params["waypoints"] = w

        r = await self._client.get(base_url, params=params)
        r.raise_for_status()
        return r.json()

    async def get_routes_from_google(
        self,
        start: Tuple[float, float],
        end: Tuple[float, float],
        waypoints: List[Tuple[float, float]] | None = None,
        alternatives: bool = True,
    ) -> List[RouteDTO]:

        data = await self._google_directions_cached(
            start, end, tuple(waypoints or []), alternatives
        )

        if data.get("status") != "OK":
            return []

        routes: List[RouteDTO] = []
        for rt in data.get("routes", []):
            overview = rt.get("overview_polyline", {}).get("points")
            if not overview:
                continue
            path = _decode_polyline5(overview)

            # Sum over legs
            dist_m = 0
            dur_s = 0
            for leg in rt.get("legs", []):
                dist_m += leg.get("distance", {}).get("value", 0)
                dur_s += leg.get("duration", {}).get("value", 0)

            routes.append(
                RouteDTO(
                    distance_km=round(dist_m / 1000.0, 2),
                    duration_min=round(dur_s / 60.0, 1),
                    path=path,
                )
            )

        # fastest first (Google already orders, but ensure)
        routes.sort(key=lambda r: r.duration_min)
        return routes

    # --------------- Stations ---------------
    @async_lru.alru_cache(maxsize=1)
    async def load_stations(self) -> List[StationDTO]:
        """Load stations and aggregate charger power/count."""
        with Session(self.engine) as s:
            stations = s.query(Station).all()

            agg = (
                s.query(
                    Charger.station_id,
                    func.max(Charger.power_kw).label("max_power_kw"),
                    func.count(Charger.charger_id).label("charger_count"),
                )
                .group_by(Charger.station_id)
                .all()
            )
            agg_map = {
                row.station_id: {
                    "max_power_kw": float(row.max_power_kw or 0.0),
                    "charger_count": int(row.charger_count or 0),
                }
                for row in agg
            }

        out: List[StationDTO] = []
        for st in stations:
            meta = agg_map.get(st.station_id, {"max_power_kw": 0.0, "charger_count": 0})
            out.append(
                StationDTO(
                    station_id=st.station_id,
                    name=st.name,
                    address=st.address,
                    lat=float(st.latitude),
                    lon=float(st.longitude),
                    max_power_kw=meta["max_power_kw"],
                    charger_count=meta["charger_count"],
                )
            )
        return out

    # --------------- Station proximity ---------------
    def stations_near_route(
        self,
        route_polyline: List[Tuple[float, float]],
        stations: List[StationDTO],
    ) -> List[StationDTO]:
        """Return stations within threshold from the route polyline."""
        near: List[StationDTO] = []
        n = len(route_polyline)

        for st in stations:
            p = (st.lat, st.lon)
            best = float("inf")

            # scan in coarse steps to reduce checks on long polylines
            # but sample neighbors to maintain accuracy
            step = 3 if n > 300 else 1
            i = 0
            while i < n - 1:
                a = route_polyline[i]
                b = route_polyline[i + 1]
                d = _point_segment_distance_km(p, a, b)
                if d < best:
                    best = d
                    if best < 0.15:  # ~150m early stop
                        break
                i += step

            if best <= self.max_station_distance_km:
                st_copy = st.copy()
                st_copy.distance_to_route_km = round(best, 2)
                near.append(st_copy)

        near.sort(key=lambda s: (s.distance_to_route_km or 0.0, -s.max_power_kw))
        return near
