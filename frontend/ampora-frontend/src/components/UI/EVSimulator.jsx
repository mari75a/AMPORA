import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChargingStation, FaCarSide, FaBatteryHalf, FaRoute } from "react-icons/fa";

const EVSimulator = () => {
  const [car, setCar] = useState("Tesla Model 3");
  const [battery, setBattery] = useState(60);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const estimatedRange = (battery * 4.5).toFixed(0); // 4.5 km per % example

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full px-10 py-14 bg-[#EFFFFA] rounded-[40px] shadow-xl mt-16"
    >
      <h2 className="text-4xl font-extrabold text-emerald-600 text-center tracking-wide">
        ⚡ EV Smart Simulator
      </h2>
      <p className="text-center text-gray-600 mt-2">
        Calculate range, charging needs & trip efficiency instantly
      </p>

      <div className="grid grid-cols-3 gap-8 mt-12">

        {/* Car Select */}
        <motion.div className="flex flex-col gap-2"
          whileHover={{ scale: 1.03 }}
        >
          <label className="font-semibold text-gray-700 flex gap-2 items-center">
            <FaCarSide /> Select EV Model
          </label>
          <select
            value={car}
            onChange={(e) => setCar(e.target.value)}
            className="p-3 border border-emerald-400 rounded-xl text-black focus:ring-2 focus:ring-emerald-300"
          >
            <option>Tesla Model 3</option>
            <option>Nissan Leaf</option>
            <option>Kia EV6</option>
            <option>Hyundai Ioniq 5</option>
            <option>BYD Dolphin</option>
          </select>
        </motion.div>

        {/* Start Location */}
        <motion.div className="flex flex-col gap-2"
          whileHover={{ scale: 1.03 }}
        >
          <label className="font-semibold text-gray-700 flex gap-2 items-center">
            <FaRoute /> Start Location
          </label>
          <input
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Enter starting point"
            className="p-3 border border-emerald-400 rounded-xl text-black focus:ring-2 focus:ring-emerald-300"
          />
        </motion.div>

        {/* End Location */}
        <motion.div className="flex flex-col gap-2"
          whileHover={{ scale: 1.03 }}
        >
          <label className="font-semibold text-gray-700 flex gap-2 items-center">
            <FaRoute /> Destination
          </label>
          <input
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="Enter destination"
            className="p-3 border border-emerald-400 rounded-xl text-black focus:ring-2 focus:ring-emerald-300"
          />
        </motion.div>
      </div>

      {/* Battery Slider */}
      <div className="mt-10">

        <label className="font-semibold text-gray-700 flex gap-2 items-center mb-2">
          <FaBatteryHalf /> Battery Level (%)
        </label>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={battery}
            onChange={(e) => setBattery(e.target.value)}
            className="w-full accent-emerald-500"
          />
          <span className="font-bold text-emerald-600">{battery}%</span>
        </div>

        {/* Animated Range Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-white p-6 rounded-2xl shadow-lg border border-emerald-300 flex justify-between"
        >
          <div>
            <p className="text-gray-500">Estimated Range</p>
            <h2 className="text-3xl font-extrabold text-emerald-600">
              {estimatedRange} km
            </h2>
          </div>

          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-emerald-600 text-5xl"
          >
            ⚡
          </motion.div>
        </motion.div>

      </div>

      <div className="mt-10 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="px-10 py-4 bg-emerald-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-emerald-700"
        >
          Simulate Trip
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EVSimulator;
