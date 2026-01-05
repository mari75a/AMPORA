import React from "react";
import { TbBatteryCharging } from "react-icons/tb";
import { FiZap } from "react-icons/fi";

export default function ChargingLiveCard({ data, connected }) {
  return (
    <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl shadow-lg border border-emerald-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-emerald-900">
          Live Charging Status
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            connected
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Current</p>
          <p className="text-2xl font-bold text-emerald-900">
            {data.current.toFixed(2)} A
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Power</p>
          <p className="text-2xl font-bold text-emerald-900">
            {data.power.toFixed(1)} W
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Energy</p>
          <p className="text-2xl font-bold text-emerald-900">
            {data.energy.toFixed(3)} kWh
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4 flex items-center gap-2">
          <TbBatteryCharging className="text-emerald-600 text-2xl" />
          <span className="font-semibold text-emerald-800">
            {data.charging ? "Charging" : "Idle"}
          </span>
        </div>
      </div>
    </div>
  );
}
