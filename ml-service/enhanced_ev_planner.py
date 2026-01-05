# ml-service/enhanced_ev_planner.py
import json
import math
import os
from typing import List, Tuple, Dict, Any

import requests
from geopy.distance import geodesic
from flask import current_app
from sqlalchemy import func

from models import db, Station, Charger

OSRM_URL = "https://router.project-osrm.org/route/v1/driving"

def _haversine_km(a: Tuple[float, float], b: Tuple[float, float]) -> float:
  # quick haversine in km
  return geodesic(a, b).km

def _decode_polyline5(polyline_str: str) -> List[Tuple[float, float]]:
    # Polyline algorithm (Google, precision 1e-5)
    index, lat, lng, coordinates = 0, 0, 0, []
    while index < len(polyline_str):
        result, shift = 0, 0
        while True:
            b = ord(polyline_str[index]) - 63
            index += 1
            result |= (b & 0x1f) << shift
            shift += 5
            if b < 0x20:
                break
        dlat = ~(result >> 1) if result & 1 else (result >> 1)
        lat += dlat

        result, shift = 0, 0
        while True:
            b = ord(polyline_str[index]) - 63
            index += 1
            result |= (b & 0x1f) << shift
            shift += 5
            if b < 0x20:
                break
        dlng = ~(result >> 1) if result & 1 else (result >> 1)
        lng += dlng

        coordinates.append((lat / 1e5, lng / 1e5))
    return coordinates

def _point_segment_distance_km(p: Tuple[float, float], a: Tuple[float, float], b: Tuple[float, float]) -> float:
    # distance from point p to segment ab by sampling — use geodesic for accuracy
    # project approximately by subdividing segment if very long; here direct min of endpoints + midpoint is fine for short polylines
    d_pa = _haversine_km(p, a)
    d_pb = _haversine_km(p, b)
    mid = ((a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0)
    d_pm = _haversine_km(p, mid)
    return min(d_pa, d_pb, d_pm)

class EnhancedEVPlanner:
    def __init__(self, max_station_distance_km: float = 5.0):
        self.max_station_distance_km = max_station_distance_km

    # ---------- ROUTING (OSRM) ----------
    def get_routes_from_osrm(
        self,
        start: Tuple[float, float],
        end: Tuple[float, float],
        waypoints: List[Tuple[float, float]] = None,
        alternatives: int = 2
    ) -> List[Dict[str, Any]]:
        """
        Returns a list of alternative routes sorted by duration (ascending).
        Each route: { distance_km, duration_min, path: [(lat,lon), ...] }
        """
        coords_chain = [f"{start[1]},{start[0]}"]
        waypoints = waypoints or []
        for w in waypoints:
            coords_chain.append(f"{w[1]},{w[0]}")
        coords_chain.append(f"{end[1]},{end[0]}")

        url = f"{OSRM_URL}/{';'.join(coords_chain)}"
        params = {
            "overview": "full",
            "alternatives": str(alternatives).lower(),  # 'true' or 'false'
            "geometries": "polyline",
            "steps": "false",
            "annotations": "false",
        }

        # NOTE: OSRM's 'alternatives' param accepts true/false. We emulate multiple by
        # requesting 'true' and OSRM returns up to 3. Set 'alternatives=true'.
        params["alternatives"] = "true" if alternatives and alternatives > 0 else "false"

        r = requests.get(url, params=params, timeout=20)
        r.raise_for_status()
        data = r.json()
        if data.get("code") != "Ok" or not data.get("routes"):
            return []

        routes = []
        for rt in data["routes"]:
            dist_km = (rt["distance"] or 0) / 1000.0
            dur_min = (rt["duration"] or 0) / 60.0
            path = _decode_polyline5(rt["geometry"])
            routes.append({
                "distance_km": dist_km,
                "duration_min": dur_min,
                "path": path
            })

        # Sort by duration ascending, shortest first
        routes.sort(key=lambda x: x["duration_min"])
        return routes

    # ---------- STATIONS ----------
    def load_stations(self) -> List[Dict[str, Any]]:
        """
        Load all stations + their charger info (max power, status counts).
        """
        # Pull stations
        stations = db.session.query(Station).all()

        # Build map for chargers grouped by station
        chargers = (
            db.session.query(
                Charger.station_id,
                func.max(Charger.power_kw).label("max_power_kw"),
                func.count(Charger.charger_id).label("charger_count")
            )
            .group_by(Charger.station_id)
            .all()
        )
        chargers_by_station = {c.station_id: {"max_power_kw": float(c.max_power_kw or 0.0),
                                              "charger_count": int(c.charger_count or 0)}
                               for c in chargers}

        out = []
        for st in stations:
            meta = chargers_by_station.get(st.station_id, {"max_power_kw": 0.0, "charger_count": 0})
            out.append({
                "station_id": st.station_id,
                "name": st.name,
                "address": st.address,
                "lat": float(st.latitude),
                "lon": float(st.longitude),
                "max_power_kw": meta["max_power_kw"],
                "charger_count": meta["charger_count"],
            })
        return out

    def stations_near_route(self, route_polyline: List[Tuple[float, float]], stations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Returns stations within self.max_station_distance_km from the route polyline.
        Adds distance_to_route_km to each matched station and sorts by it.
        """
        near = []
        for s in stations:
            p = (s["lat"], s["lon"])
            # min distance to any route segment (sample endpoints + midpoint)
            best = float("inf")
            for i in range(len(route_polyline) - 1):
                a = route_polyline[i]
                b = route_polyline[i + 1]
                d = _point_segment_distance_km(p, a, b)
                if d < best:
                    best = d
                    if best <= self.max_station_distance_km:
                        # small optimization: if already inside threshold and very close, break early
                        if best < 0.1:
                            break
            if best <= self.max_station_distance_km:
                s2 = dict(s)
                s2["distance_to_route_km"] = round(best, 2)
                near.append(s2)
        near.sort(key=lambda x: x["distance_to_route_km"])
        return near

    # ---------- Optional map builder (Folium) ----------
    def build_map(self, start, end, routes, stations, filename=None):
        """
        If you want a shareable HTML map, enable Folium in your env and use this.
        """
        try:
            import folium
        except ImportError:
            return None

        m = folium.Map(location=start, zoom_start=7, control_scale=True)

        # Markers
        folium.Marker(start, tooltip="Start", icon=folium.Icon(color="green")).add_to(m)
        folium.Marker(end, tooltip="Destination", icon=folium.Icon(color="red")).add_to(m)

        # Routes
        colors = ["#3498db", "#e74c3c", "#2ecc71"]
        for idx, r in enumerate(routes[:3]):
            folium.PolyLine(
                r["path"],
                color=colors[idx % len(colors)],
                weight=5,
                opacity=0.8,
            ).add_to(m)

        # Stations (near)
        for s in stations:
            folium.CircleMarker(
                location=(s["lat"], s["lon"]),
                radius=4,
                color="#ff8c00",
                fill=True,
                fill_opacity=0.9,
                tooltip=f'{s["name"]} • {s.get("max_power_kw",0)} kW',
            ).add_to(m)

        os.makedirs("maps", exist_ok=True)
        name = filename or f"route_{abs(hash((start, end))) % 10**8}.html"
        path = os.path.join("maps", name)
        m.save(path)
        return name
