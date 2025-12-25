/* global google */
import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import StationCard from "../components/Station/StationCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "http://127.0.0.1:8083";
const RADIUS_KM = 10;

/* ================= DISTANCE ================= */
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function StationFinder() {
  const [searchPlace, setSearchPlace] = useState("");
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchRef = useRef(null);

  /* Booking */
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [availability, setAvailability] = useState(null);

  const userId = localStorage.getItem("userId");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapContainerStyle = { width: "100%", height: "100%" };
  const [mapCenter, setMapCenter] = useState({
    lat: 6.9271,
    lng: 79.8612,
  });

  /* ================= LOAD STATIONS ================= */
  useEffect(() => {
    async function loadStations() {
      try {
        const res = await fetch(`${API_BASE}/api/stations`);
        const data = await res.json();

        const formatted = (Array.isArray(data) ? data : []).map((s) => ({
          id: s.stationId,
          name: s.name,
          address: s.address || "No Address",
          lat: s.latitude,
          lng: s.longitude,
          chargerId:
            s.chargers && s.chargers.length > 0
              ? s.chargers[0].chargerID
              : null,
          maxPower: s.powerKw || 0,
        }));

        setStations(formatted);
        setFilteredStations(formatted);
      } finally {
        setLoading(false);
      }
    }
    loadStations();
  }, []);

  function filterByDistance(lat, lng) {
    setFilteredStations(
      stations.filter(
        (st) => distanceKm(lat, lng, st.lat, st.lng) <= RADIUS_KM
      )
    );
  }

  function handlePlaceSelect() {
    const place = searchRef.current.getPlace();
    if (!place || !place.geometry) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    setSearchPlace(place.formatted_address);
    setMapCenter(location);
    filterByDistance(location.lat, location.lng);
  }

  /* ================= BOOKING ================= */
  async function checkAvailability() {
    if (!bookingDate || !bookingTime || !duration) return;

    const dateStr = bookingDate.toISOString().split("T")[0];
    const [hh, mm] = bookingTime.split(":");
    const endHour = Number(hh) + duration;

    const res = await fetch(`${API_BASE}/api/bookings/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chargerId: selectedStation.chargerId,
        date: dateStr,
        startTime: `${hh}:${mm}`,
        endTime: `${endHour}:${mm}`,
      }),
    });

    const data = await res.json();
    setAvailability(data.available);
  }

  async function createBooking() {
    if (!availability) return;

    const dateStr = bookingDate.toISOString().split("T")[0];
    const [hh, mm] = bookingTime.split(":");

    await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        chargerId: selectedStation.chargerId,
        startTime: `${dateStr}T${hh}:${mm}:00`,
        endTime: `${dateStr}T${Number(hh) + duration}:${mm}:00`,
        bookingStatus: "PENDING",
      }),
    });

    setSelectedStation(null);
  }

  if (!isLoaded || loading) return <p className="p-10">Loading…</p>;

  return (
    <div className="w-screen bg-teal-100 pb-20">

      {/* ================= HEADER ================= */}
      <div className="relative h-[34vh] rounded-b-[70px] overflow-hidden
                      bg-gradient-to-tr from-teal-900 via-emerald-800 to-teal-700">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120">
          <path
            fill="rgba(255,255,255,0.15)"
            d="M0,64L60,58.7C120,53,240,43,360,53.3C480,64,600,96,720,101.3C840,107,960,85,1080,69.3C1200,53,1320,43,1380,37.3L1440,32V120H0Z"
          />
        </svg>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            Find <span className="text-emerald-300">EV</span> Charging Stations
          </h1>
          <p className="mt-3 text-emerald-100 text-lg">
            Fast • Smart • Sustainable
          </p>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="max-w-5xl mx-auto -mt-12 px-4">
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl
                        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                        flex gap-4 items-center">
          <FiSearch size={22} className="text-emerald-500" />
          <Autocomplete
            onLoad={(ref) => (searchRef.current = ref)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              className="w-full p-3 rounded-xl outline-none"
              placeholder="Search your area…"
              value={searchPlace}
              onChange={(e) => setSearchPlace(e.target.value)}
            />
          </Autocomplete>
        </div>
      </div>
      {/* ================= INTRODUCTION ================= */}
<div className="max-w-4xl mx-auto mt-10 px-6 text-center">
  <p className="text-lg text-gray-700 leading-relaxed">
    Discover reliable <span className="font-semibold text-emerald-600">EV charging stations</span> 
    near you with ease.  
    Search any location to instantly view nearby stations, compare availability,
    and book your charging slot — all in one place.
  </p>

  <p className="mt-3 text-sm text-gray-500">
    Smart routing • Real-time availability • Hassle-free booking
  </p>
</div>

      {/* ================= MAP ================= */}
      <div className="max-w-6xl mx-auto mt-14 px-4">
        <div className="h-[65vh] bg-white rounded-[32px]
                        shadow-[0_30px_80px_rgba(0,0,0,0.25)]
                        overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={13}
          >
            {filteredStations.map((st) => (
              <Marker
                key={st.id}
                position={{ lat: st.lat, lng: st.lng }}
                onClick={() => setSelectedStation(st)}
              />
            ))}
          </GoogleMap>
        </div>
      </div>

      {/* ================= STATIONS ================= */}
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-emerald-600">
            Stations within {RADIUS_KM} km
          </h2>
          <span className="text-sm bg-emerald-100 px-3 py-1 rounded-full">
            ⚡ {filteredStations.length}
          </span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6
                        snap-x snap-mandatory">
          {filteredStations.map((st) => (
            <div
              key={st.id}
              className="min-w-[320px] snap-start"
              onClick={() => setSelectedStation(st)}
            >
              <StationCard station={st} />
            </div>
          ))}
        </div>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm
                        flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md">
            <StationCard station={selectedStation} />

            <h3 className="text-xl font-bold text-emerald-700 mt-4">
              Book Charging Slot
            </h3>

            <DatePicker
              selected={bookingDate}
              onChange={setBookingDate}
              minDate={new Date()}
              className="w-full p-2 border rounded mt-2"
            />

            <input
              type="time"
              className="w-full p-2 border rounded mt-2"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />

            <select
              className="w-full p-2 border rounded mt-2"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
            </select>

            {availability !== null && (
              <p
                className={`mt-3 font-bold ${
                  availability ? "text-green-600" : "text-red-600"
                }`}
              >
                {availability ? "Slot available ✔" : "Slot unavailable ✖"}
              </p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={checkAvailability}
                className="flex-1 bg-emerald-500 text-white py-2 rounded-xl"
              >
                Check
              </button>
              <button
                onClick={createBooking}
                className="flex-1 bg-black text-white py-2 rounded-xl"
              >
                Book
              </button>
            </div>

            <button
              className="mt-4 w-full bg-gray-200 py-2 rounded-xl"
              onClick={() => setSelectedStation(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
