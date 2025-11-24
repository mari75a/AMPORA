import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import StationCard from "../components/Station/StationCard"; // You will paste your card component here

const StationFinder = () => {
  const [search, setSearch] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);

  // Fake station list (later load from backend)
  const stations = [
    {
      id: 1,
      name: "GreenCharge Downtown",
      address: "123 Main St, Colombo",
      lat: 6.9271,
      lng: 79.8612,
      available: 4,
      total: 10,
      renewable: 84,
      queue: 1,
    },
    {
      id: 2,
      name: "Ampora FastCharge",
      address: "Galle Rd, Mount Lavinia",
      lat: 6.8393,
      lng: 79.8645,
      available: 7,
      total: 12,
      renewable: 92,
      queue: 0,
    },
    {
      id: 2,
      name: "Electric FastCharge",
      address: "Galle Rd, Mount Lavinia",
      lat: 6.8393,
      lng: 79.9645,
      available: 7,
      total: 12,
      renewable: 92,
      queue: 0,
    },
  ];

  const filteredStations = stations.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Google Maps loader
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 6.9271,
    lng: 79.8612,
  };

  return (
    <div className="w-screen min-h-screen bg-[#EDFFFF] flex flex-col items-center pb-10">

      {/* Banner */}
      <div className="w-full h-[30vh] bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-b-[50px] flex justify-center items-center shadow-md">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg text-center">
          Find Charging Stations ⚡
        </h1>
      </div>

      {/* Search */}
      <div className="w-10/12 mt-[-40px] bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <FiSearch size={24} className="text-emerald-500" />
        <input
          type="text"
          placeholder="Search station name, city, or location..."
          className="w-full p-3 rounded-xl border border-emerald-300 outline-none focus:ring-2 text-black focus:ring-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Layout */}
      <div className="w-10/12 mt-10 flex flex-col lg:flex-row gap-6">

        {/* MAP SECTION */}
        <div className="sm:w-12/12 md:w-12/12 lg:w-7/12 h-[75vh] bg-white rounded-3xl shadow-xl overflow-hidden">
          {!isLoaded ? (
            <p className="text-center mt-10 text-gray-500">Loading Map...</p>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={12}
              center={center}
            >
              {filteredStations.map((station) => (
                <Marker
                  key={station.id}
                  position={{ lat: station.lat, lng: station.lng }}
                  onClick={() => setSelectedStation(station)}
                />
              ))}
            </GoogleMap>
          )}
        </div>

        {/* STATION LIST */}
        <div className="sm:w-12/12 md:w-12/12 lg:w-5/12 h-[75vh] overflow-y-scroll bg-white rounded-3xl shadow-xl p-5">
          <h2 className="text-2xl font-bold text-emerald-600 mb-4">
            Nearby Stations
          </h2>

          {filteredStations.length === 0 && (
            <p className="text-gray-500">No stations found.</p>
          )}

          {/* STATION CARDS */}
          <div className="flex flex-col gap-5">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                onClick={() => setSelectedStation(station)}
              >
                <StationCard station={station} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* POPUP CARD WHEN MARKER CLICKED */}
      {selectedStation && (
        <div className="fixed bottom-10 w-10/12 lg:w-4/12 bg-white rounded-3xl shadow-2xl p-5 animate-slideUp border border-emerald-200">
          <StationCard station={selectedStation} />
          <button
            onClick={() => setSelectedStation(null)}
            className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StationFinder;
