import React, { useState } from "react";
import MapView from "./MapView";
import RouteSummary from "./RouteSummary";
import calculateEnergy from "./EnergyCalculator";
import icon1 from "../../assets/placeholder.png";
import HeroBanner from "../components/TripPlanner/HeroBanner";

const TripPlanner = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [battery, setBattery] = useState("");

  const [stops, setStops] = useState([{ id: 1, location: "" }]);
  const [routeData, setRouteData] = useState(null);
  const [stations, setStations] = useState([]);
  const [energy, setEnergy] = useState(null);

  const handleRouteCalculated = (data) => {
    setRouteData(data);
    const totalDistance = data?.totalDistanceKm || 0;

    const energyUsage = calculateEnergy(totalDistance, 0.18);
    setEnergy(energyUsage);

    setStations([
      { id: 1, name: "Ampora Station 1", distance: 1.2, status: "Available" },
      { id: 2, name: "Ampora Station 2", distance: 3.7, status: "Busy" },
      { id: 3, name: "Ampora Station 3", distance: 5.1, status: "Available" },
    ]);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#ECFFFA]">

      {/* 🌈 HERO BANNER */}
      <HeroBanner />

      {/* 🚗 ROUTE INPUT PANEL */}
      <div className="w-10/12 bg-white rounded-3xl shadow-[0_8px_35px_rgba(0,0,0,0.08)] px-10 py-8 mt-[-50px] border border-emerald-100 backdrop-blur-xl">

        <h2 className="text-2xl font-bold text-emerald-700 mb-5">
          Enter Trip Details
        </h2>

        {/* INPUT GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* Current Location */}
          <div className="flex flex-col">
            <label className="text-emerald-700 font-semibold mb-2">
              Current Location
            </label>
            <input
              type="text"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              placeholder="Colombo, Sri Lanka"
              className="p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 text-black outline-none shadow-sm"
            />
          </div>

          {/* Destination */}
          <div className="flex flex-col">
            <label className="text-emerald-700 font-semibold mb-2">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Kandy, Sri Lanka"
              className="p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 text-black outline-none shadow-sm"
            />
          </div>

          {/* Battery */}
          <div className="flex flex-col">
            <label className="text-emerald-700 font-semibold mb-2">
              Battery Level (%)
            </label>
            <input
              type="number"
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
              placeholder="60"
              className="p-3 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 text-black outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end mt-6">
          <button className="px-10 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all">
            Calculate Route
          </button>
        </div>
      </div>

      {/* 🗺 MAP + STATIONS */}
      <div className="w-10/12 mt-10 flex gap-6">

        {/* MAP */}
        <div className="w-8/12 h-[70vh] rounded-3xl shadow-xl overflow-hidden bg-white border border-emerald-100">
          <MapView stops={stops} onRouteReady={handleRouteCalculated} />
        </div>

        {/* STATION LIST */}
        <div className="w-4/12 h-[70vh] overflow-y-auto bg-white rounded-3xl shadow-xl p-6 border border-emerald-100">

          <h2 className="text-2xl font-bold text-emerald-700 mb-5">Nearby Stations</h2>

          {stations.length === 0 ? (
            <p className="text-gray-500 text-center mt-20">
              Start a route to view charging stations.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {stations.map(s => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow hover:shadow-md transition-all"
                >
                  <p className="text-xl font-bold text-emerald-700">{s.name}</p>

                  <div className="flex items-center gap-2 mt-2 text-black">
                    <img src={icon1} className="w-[20px] h-[20px]" />
                    <p>{s.distance} km away</p>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">Status</p>
                  <p className={`font-semibold ${
                    s.status === "Available" ? "text-green-600" : "text-red-500"
                  }`}>
                    {s.status}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* SUMMARY */}
      {routeData && (
        <div className="w-10/12 mt-10">
          <RouteSummary data={routeData} energy={energy} battery={battery} />
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
