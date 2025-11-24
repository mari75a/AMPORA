import React, { useState } from "react";
import { motion } from "framer-motion";
import MapView from "./MapView";
import RouteSummary from "./RouteSummary";
import calculateEnergy from "./EnergyCalculator";
import pin from "../../assets/placeholder.png";
import herobg from "../../assets/hero-bg.png";
import HeroBanner from "./HeroBanner";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const glass =
  "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.15)]";

const TripPlanner = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [battery, setBattery] = useState("");

  const [stops] = useState([{ id: 1, location: "" }]);
  const [routeData, setRouteData] = useState(null);
  const [stations, setStations] = useState([]);
  const [energy, setEnergy] = useState(null);

  const handleRouteCalculated = (data) => {
    setRouteData(data);
    const totalDistance = data?.totalDistanceKm || 0;

    const energyUsage = calculateEnergy(totalDistance, 0.18);
    setEnergy(energyUsage);

    setStations([
      { id: 1, name: "Ampora Station – Colombo 03", distance: 1.2, status: "Available", price: 98 },
      { id: 2, name: "Ampora Fast – Borella", distance: 3.7, status: "Busy", price: 105 },
      { id: 3, name: "Ampora Green – Nugegoda", distance: 5.1, status: "Available", price: 99 },
    ]);
  };

  const batteryPct = Math.max(0, Math.min(100, Number(battery) || 0));

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900 overflow-hidden">

      {/* HERO */}
      <div
        className="relative w-full h-[40vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${herobg})`,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text */}
        {/* <h1 className="relative text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl px-4">
          Plan Your Electric Journey
        </h1> */}
      </div>



      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row w-full relative lg:h-[75vh]">

        {/* MAP (responsive full width on mobile) */}
        <div className="w-full lg:w-full h-[45vh] md:h-[55vh] lg:h-full">
          <MapView
            stops={[{ location: currentLocation }, { location: destination }]}
            onRouteReady={handleRouteCalculated}
          />
        </div>

        {/* LEFT CARD: INPUTS */}
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className={`
            ${glass} rounded-2xl p-5 
            w-[92%] mx-auto mt-6 lg:mt-0
            lg:absolute lg:left-6 lg:top-6 lg:w-[350px]
          `}
        >
          <h2 className="text-xl font-bold text-emerald-700">Trip Inputs</h2>

          <div className="mt-4 space-y-4">

            {/* Current Location */}
            <div>
              <label className="text-xs font-semibold text-emerald-800">Current Location</label>
              <div className="mt-1 flex items-center gap-2">
                <img src={pin} alt="" className="w-4 h-4 opacity-70" />
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="w-full rounded-xl border border-emerald-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 bg-white/70 text-black"
                  placeholder="Colombo, Sri Lanka"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="text-xs font-semibold text-emerald-800">Destination</label>
              <div className="mt-1 flex items-center gap-2">
                <img src={pin} alt="" className="w-4 h-4 opacity-70" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-xl border border-emerald-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 bg-white/70 text-black"
                  placeholder="Kandy, Sri Lanka"
                />
              </div>
            </div>

            {/* Battery */}
            <div>
              <label className="text-xs font-semibold text-emerald-800">Battery Level (%)</label>
              <input
                type="number"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                min="0"
                max="100"
                className="mt-1 w-full rounded-xl border border-emerald-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 bg-white/70 text-black"
                placeholder="e.g., 62"
              />

              {/* Battery bar */}
              <div className="mt-3">
                <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${batteryPct}%` }}
                    className={`h-full ${batteryPct < 20
                      ? "bg-red-400"
                      : batteryPct < 50
                        ? "bg-yellow-400"
                        : "bg-emerald-500"
                      }`}
                  />
                </div>
                <p className="text-xs mt-1 text-emerald-800/80">
                  Battery: <span className="font-semibold">{batteryPct}%</span>
                </p>
              </div>
            </div>

          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="mt-5 w-full px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg"
            onClick={() => handleRouteCalculated(routeData)}
          >
            Calculate Route
          </motion.button>
        </motion.div>

        {/* RIGHT CARD: STATIONS (moves under map on mobile) */}
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className={`
            ${glass} rounded-2xl 
            p-5 mt-6 w-[92%] mx-auto
            lg:absolute lg:right-6 lg:top-6 lg:w-[350px] lg:mt-0
            max-h-[40vh] lg:max-h-[60vh] overflow-y-auto
          `}
        >
          <h2 className="text-xl font-bold text-emerald-700">Nearby Stations</h2>
          <p className="text-xs text-emerald-900/70">Based on your route</p>

          <div className="mt-4 space-y-4">
            {stations.length === 0 ? (
              <p className="text-center text-sm text-emerald-900/60 py-8">
                Calculate a route to see stations.
              </p>
            ) : (
              stations.map((s) => (
                <motion.div
                  key={s.id}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl border border-emerald-200 bg-white/80 p-4 shadow hover:shadow-md"
                >
                  <p className="font-semibold text-emerald-900">{s.name}</p>
                  <p className="text-xs text-emerald-800/70">{s.distance} km away</p>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-emerald-800/80">Price</span>
                    <span className="font-semibold text-emerald-700">LKR {s.price}/kWh</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* ROUTE SUMMARY (bottom center on all screens) */}
        {routeData && (
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className={`
              absolute left-1/2 -translate-x-1/2 bottom-4 
              ${glass} rounded-2xl p-4 w-[94%] md:w-[70%] lg:w-[820px]
            `}
          >
            <RouteSummary data={routeData} energy={energy} battery={battery} />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default TripPlanner;
