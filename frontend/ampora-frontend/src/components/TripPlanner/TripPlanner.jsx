/* global google */
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

import PulsingMarker from "../PulsingMarker";
import elec from "../../assets/bolt.png";

const BACKEND = "http://localhost:8083";
const USER_ID = "8d8c1937-efc4-4cbe-9d60-635bb4f47486";

const containerStyle = { width: "100%", height: "100%" };

/* ================= POLYLINE DECODER ================= */
function decodePolyline(encoded) {
  if (!encoded || typeof encoded !== "string") {
    console.warn("Invalid polyline:", encoded);
    return [];
  }

  let points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}


/* ================= COMPONENT ================= */
export default function TripPlanner() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapCenter = { lat: 7.8731, lng: 80.7718 };
const [avoidHighways, setAvoidHighways] = useState(false);
  /* ===== START / END ===== */
  const [startText, setStartText] = useState("");
  const [endText, setEndText] = useState("");
  const acStartRef = useRef(null);
  const acEndRef = useRef(null);

  /* ===== VEHICLE ===== */
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [batteryPct, setBatteryPct] = useState(100);

  /* ===== ROUTES ===== */
  const [rawDirections, setRawDirections] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  /* ===== STATIONS ===== */
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  /* ===== RESULT ===== */
  const [tripStatus, setTripStatus] = useState(null);

  /* ================= LOAD VEHICLES ================= */
  useEffect(() => {
    fetch(`${BACKEND}/api/vehicles/user/${USER_ID}`)
      .then((res) => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);
  function latLng(p) {
    return new google.maps.LatLng(p.lat, p.lng);
  }

  function distanceKm(a, b) {
    return (
      google.maps.geometry.spherical.computeDistanceBetween(
        latLng(a),
        latLng(b)
      ) / 1000
    );
  }
  /* ================= FIND ROUTES ================= */
  async function findRoutes() {
    if (!startText || !endText) return alert("Select start and destination");

    const service = new google.maps.DirectionsService();
    const res = await service.route({
      origin: startText,
      destination: endText,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
      avoidHighways: avoidHighways,
    });

    setRawDirections(res);
    setRoutes(res.routes);
    setSelectedRouteIndex(null);
    setStations([]);
    setTripStatus(null);
  }

  /* ================= SELECT ROUTE ================= */
  async function selectRoute(index) {
    setSelectedRouteIndex(index);
    setTripStatus(null);

    const route = routes[index];

    const polyline =
      route.overview_polyline?.points ||
      route.overview_polyline?.encodedPolyline ||
      route.overview_polyline;

    const decoded = decodePolyline(polyline);

    if (decoded.length === 0) {
      alert("Route polyline error. Try another route.");
      return;
    }

    const resp = await fetch(`${BACKEND}/api/trip/stations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        polylinePoints: decoded.map(p => [p.lat, p.lng]),
      }),
    });

    const data = await resp.json();
    setStations(data.stations || []);

    evaluateTrip(route, data.stations || []);
  }


  /* ================= TRIP LOGIC ================= */
  function evaluateTrip(route, stations) {
    if (!selectedVehicle) {
      setTripStatus({ ok: false, msg: "Select a vehicle first" });
      return;
    }

    const fullRangeKm = selectedVehicle.rangeKm;
    const availableKm = (batteryPct / 100) * fullRangeKm;

    // ROAD distance from Google Directions
    const routeDistanceKm = route.legs[0].distance.value / 1000;

    // Case 1: No stations on route → must reach destination directly
    if (stations.length === 0) {
      if (availableKm >= routeDistanceKm) {
        setTripStatus({
          ok: true,
          msg: "Trip possible without charging",
        });
      } else {
        setTripStatus({
          ok: false,
          msg: `Trip NOT possible. Need ${routeDistanceKm.toFixed(
            1
          )} km but only ${availableKm.toFixed(1)} km available.`,
        });
      }
      return;
    }

    // Case 2: Stations exist → check FIRST station only
    const firstStation = stations[0];

    // IMPORTANT:
    // backend must provide distance from start to station (road distance)
    const distanceToFirstStationKm = firstStation.distanceFromStartKm;

    if (availableKm >= distanceToFirstStationKm) {
      setTripStatus({
        ok: true,
        msg: "Trip possible (can reach first charging station)",
      });
    } else {
      setTripStatus({
        ok: false,
        msg: `Trip NOT possible. Cannot reach first charging station (${distanceToFirstStationKm.toFixed(
          1
        )} km). Available range is ${availableKm.toFixed(1)} km.`,
      });
    }
  }





  if (!isLoaded) return <div>Loading maps…</div>;

  return (
    <div className="min-h-screen bg-[#edffff] p-8 space-y-6">
      <div className="relative h-[34vh] rounded-b-[70px] overflow-hidden bg-gradient-to-tr from-teal-900 via-emerald-800 to-teal-700"> <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120"> <path fill="rgba(255,255,255,0.15)" d="M0,64L60,58.7C120,53,240,43,360,53.3C480,64,600,96,720,101.3C840,107,960,85,1080,69.3C1200,53,1320,43,1380,37.3L1440,32V120H0Z" /> </svg> <div className="relative h-full flex flex-col items-center justify-center text-center px-6"> <h1 className="text-5xl md:text-6xl font-extrabold text-white"> EV Trip <span className="text-emerald-300">Planner</span> </h1> <p className="mt-3 text-emerald-100 text-lg"> Smart • Efficient • Stress-Free </p> </div> </div>
      {/* ===== INPUT PANEL ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg space-y-6"
      >
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg space-y-6 border border-emerald-100">
          <h2 className="text-lg font-semibold text-gray-700">
            Plan Your Trip
          </h2>

          <div className=" grid md:grid-cols-2 gap-4">
            <Autocomplete onLoad={(r) => (acStartRef.current = r)}
              onPlaceChanged={() =>
                setStartText(acStartRef.current.getPlace().formatted_address)
              }>
              <input
                className="p-4 w-full rounded-2xl bg-[#edffff] outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Start location"
              />
            </Autocomplete>

            <Autocomplete onLoad={(r) => (acEndRef.current = r)}
              onPlaceChanged={() =>
                setEndText(acEndRef.current.getPlace().formatted_address)
              }>
              <input
                className="p-4 w-full rounded-2xl bg-[#edffff] outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Destination"
              />
            </Autocomplete>
          </div>
          <div className="flex items-center justify-between bg-[#edffff] rounded-2xl px-4 py-3">
  <div>
    <p className="text-sm font-medium text-gray-700">
      Avoid Highways
    </p>
    <p className="text-xs text-gray-500">
      Prefer city & scenic roads
    </p>
  </div>

  <button
    onClick={() => setAvoidHighways((v) => !v)}
    className={`relative w-14 h-8 rounded-full transition-colors ${
      avoidHighways ? "bg-emerald-500" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
        avoidHighways ? "translate-x-6" : ""
      }`}
    />
  </button>
</div>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              className="p-4 rounded-2xl bg-[#edffff] outline-none"
              onChange={(e) =>
                setSelectedVehicle(
                  vehicles.find(v => v.vehicleId === e.target.value)
                )
              }
            >
              <option>Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.brand_name} {v.model_name} ({v.plate})
                </option>
              ))}
            </select>

            <div className="bg-[#edffff] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Battery Level
                </span>
                <span className="text-sm font-semibold text-emerald-700">
                  {batteryPct}%
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                value={batteryPct}
                onChange={(e) => setBatteryPct(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />

              {selectedVehicle && (
                <p className="mt-2 text-xs text-gray-600">
                  Estimated range:
                  <span className="font-semibold ml-1">
                    {((batteryPct / 100) * selectedVehicle.rangeKm).toFixed(0)} km
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={findRoutes}
              className="rounded-2xl bg-emerald-500 text-white font-semibold shadow-md hover:scale-[1.02] transition"
            >
              Find Routes
            </button>
          </div>
        </div>
      </motion.div>
      {/* ===== STATUS ===== */}
      <AnimatePresence>
        {tripStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`p-5 rounded-2xl text-center font-semibold shadow-md ${tripStatus.ok
              ? "bg-emerald-100 text-emerald-900"
              : "bg-red-100 text-red-900"
              }`}
          >
            {tripStatus.msg}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid md:grid-cols-4 gap-6">

        {/* ROUTES PANEL */}
        <div className="md:col-span-1 bg-white rounded-3xl p-4 shadow-md space-y-3 max-h-[550px] overflow-y-auto">
          <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="md:col-span-1 bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-md"
  >
          <h3 className="font-semibold text-gray-700 mb-2">
            Available Routes
          </h3>
         

          {routes.map((r, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectRoute(i)}
              className={`w-full p-4 rounded-2xl text-left transition ${selectedRouteIndex === i
                ? "bg-emerald-500 text-white"
                : "bg-[#edffff]"
                }`}
            >
              <div className="font-medium">Route {i + 1}</div>
              <div className="text-sm opacity-80">
                {(r.legs[0].distance.value / 1000).toFixed(1)} km
              </div>
            </motion.button>
          ))}
           </motion.div>
        </div>

        {/* MAP PANEL */}
        <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="md:col-span-3 h-[550px] rounded-3xl overflow-hidden shadow-2xl"
  >
        <div className="md:col-span-3 h-[550px] rounded-3xl overflow-hidden shadow-xl">
          
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={7}
          >
            {selectedRouteIndex !== null && rawDirections && (
              <DirectionsRenderer
                directions={{
                  ...rawDirections,
                  routes: [rawDirections.routes[selectedRouteIndex]],
                }}
              />
            )}

            {stations.map((s) => (
              <PulsingMarker
                key={s.stationId}
                position={{ lat: s.lat, lng: s.lon }}
                onClick={() => setSelectedStation(s)}
              />
            ))}

            {selectedStation && (
              <InfoWindow
                position={{ lat: selectedStation.lat, lng: selectedStation.lon }}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className="text-sm">
                  <strong>{selectedStation.name}</strong>
                  <p>{selectedStation.powerKw} kW</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
        </motion.div>
      </div>




    </div>
  );
}
