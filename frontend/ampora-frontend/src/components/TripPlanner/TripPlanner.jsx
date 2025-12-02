// src/components/TripPlanner/TripPlanner.jsx
import React, { useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";

const API_BASE = "http://127.0.0.1:8000";

const containerStyle = { width: "100%", height: "100%" };

export default function TripPlanner() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "Google API KEY",
    libraries: ["places"],
  });

  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [stations, setStations] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const acStartRef = useRef(null);
  const acEndRef = useRef(null);

  const center = useMemo(() => ({ lat: 7.8731, lng: 80.7718 }), []);

  /** Convert Google Places → {lat,lng} */
  const onPlaceChanged = (ref, setter) => {
    const place = ref.current.getPlace();
    if (!place?.geometry) return;

    setter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  /** MAIN: Google route + backend OSRM */
  async function planRoute() {
    if (!start || !end) return;

    // 1️⃣ Google route (UI only)
    const svc = new google.maps.DirectionsService();
    const res = await svc.route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    });
    setDirections(res);

    // 2️⃣ ML-SERVICE route + stations
    try {
      const response = await fetch(`${API_BASE}/api/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Backend error:", data.error);
        return;
      }

      setRouteInfo(data.routes?.[0] || null);
      setStations(data.nearby_stations || []);
    } catch (err) {
      console.error("Network error:", err);
    }
  }

  // ---------------- RENDER UI ----------------

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white">
      {/* Input Bar */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          
          {/* Start */}
          <div className="bg-white/80 p-3 border rounded-xl">
            <label className="text-xs font-semibold text-emerald-700">Start</label>
            {isLoaded && (
              <Autocomplete
                onLoad={(ref) => (acStartRef.current = ref)}
                onPlaceChanged={() => onPlaceChanged(acStartRef, setStart)}
              >
                <input
                  className="w-full px-2 py-2 rounded-lg outline-none text-black"
                  placeholder="Search start…"
                />
              </Autocomplete>
            )}
          </div>

          {/* End */}
          <div className="bg-white/80 p-3 border rounded-xl">
            <label className="text-xs font-semibold text-emerald-700">Destination</label>
            {isLoaded && (
              <Autocomplete
                onLoad={(ref) => (acEndRef.current = ref)}
                onPlaceChanged={() => onPlaceChanged(acEndRef, setEnd)}
              >
                <input
                  className="w-full px-2 py-2 rounded-lg outline-none text-black"
                  placeholder="Search destination…"
                />
              </Autocomplete>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={planRoute}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow"
          >
            Plan Trip
          </button>
        </div>
      </div>

      {/* MAP */}
      <div className="max-w-6xl mx-auto h-[70vh] rounded-2xl mt-4 overflow-hidden border shadow">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={start || center}
            zoom={7}
          >
            {directions && <DirectionsRenderer directions={directions} />}

            {stations.map((s) => (
              <Marker
                key={s.station_id}
                position={{ lat: s.lat, lng: s.lon }}   // IMPORTANT FIX
                title={`${s.name} • ${s.max_power_kw || 0} kW`}
              />
            ))}
          </GoogleMap>
        )}
      </div>

      {/* SUMMARY */}
      {routeInfo && (
        <div className="max-w-6xl mx-auto mt-6 grid md:grid-cols-3 gap-4 px-4 pb-10">
          
          {/* Route Summary */}
          <div className="bg-white/80 p-4 rounded-xl border">
            <h3 className="font-bold text-emerald-700">Route Summary</h3>
            <p className="mt-2 text-sm">Distance: <b>{routeInfo.distance_km} km</b></p>
            <p className="text-sm">Duration: <b>{routeInfo.duration_min} min</b></p>
          </div>

          {/* Stations */}
          <div className="bg-white/80 p-4 rounded-xl border md:col-span-2">
            <h3 className="font-bold text-emerald-700">Nearby Stations</h3>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stations.map((s) => (
                <div key={s.station_id} className="p-3 border rounded-xl bg-white">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-emerald-900/70">{s.address || "—"}</p>
                  <div className="text-xs mt-1">
                    <div>Max Power: <b>{s.max_power_kw}</b> kW</div>
                    <div>Distance: <b>{s.distance_to_route_km}</b> km</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
