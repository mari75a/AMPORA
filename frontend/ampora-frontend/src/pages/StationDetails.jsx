// src/pages/StationDetails.jsx
import React from "react";
import { MdEvStation } from "react-icons/md";
import { FiMapPin, FiClock } from "react-icons/fi";

const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function StationDetails() {
  const station = {
    name: "Ampora SuperCharge – Borella",
    address: "No.45 Kandy Rd, Kiribathgoda",
    open: "24/7",
    connectors: [
      { type: "CCS2", power: "100 kW", price: 120, available: 3, total: 6 },
      { type: "CHAdeMO", power: "50 kW", price: 105, available: 2, total: 4 },
      { type: "Type 2", power: "22 kW", price: 85, available: 5, total: 8 },
    ],
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-5xl py-10 space-y-6">
        <div className={`${glass} rounded-2xl p-6`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 text-2xl">
                <MdEvStation />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-emerald-800">{station.name}</h1>
                <div className="text-sm text-emerald-900/70 flex items-center gap-2">
                  <FiMapPin /> {station.address}
                </div>
              </div>
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-2">
              <FiClock /> Open: {station.open}
            </div>
          </div>
        </div>

        <div className={`${glass} rounded-2xl p-6`}>
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">Connectors & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {station.connectors.map((c) => (
              <div key={c.type} className="rounded-xl border border-emerald-200 p-4 bg-white/70">
                <div className="font-bold text-emerald-800">{c.type} • {c.power}</div>
                <div className="mt-1 text-sm text-emerald-900/80">LKR {c.price}/kWh</div>
                <div className="mt-2 text-sm">
                  <span className="text-emerald-800/80">Available: </span>
                  <span className="font-semibold text-emerald-700">{c.available}</span> / {c.total}
                </div>
                <button className="mt-4 w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                  Book Slot
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`${glass} rounded-2xl p-6`}>
          <h2 className="text-lg font-semibold text-emerald-800 mb-2">Description</h2>
          <p className="text-sm text-emerald-900/80">
            High-speed charging hub optimized for city commuters. Supports smart queueing, real-time availability, and
            priority bookings for Premium users.
          </p>
        </div>
      </div>
    </div>
  );
}
