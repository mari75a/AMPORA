import React from "react";

/**
 * Compact, readable station card.
 * Props:
 *  - station
 *  - isBest (boolean)
 *  - onSelect() -> open modal
 *  - onAddStop() -> add as stop
 */
export default function TripPlannerStationCard({ station, isBest, onSelect, onAddStop }) {
  const power = station.max_power_kw || 0;
  const dist = station.distance_to_route_km;

  return (
    <div
      className={`border rounded-lg p-3 hover:shadow-sm transition bg-white ${
        isBest ? "border-emerald-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className={`font-semibold ${isBest ? "text-emerald-700" : "text-slate-800"}`}>
            {station.name || "Charging Station"}
          </div>
          <div className="text-xs text-slate-500 line-clamp-1">
            {station.address || "—"}
          </div>
        </div>
        <div className={`text-[10px] px-2 py-0.5 rounded-full ${isBest ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
          {isBest ? "Recommended" : "Nearby"}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
          {power} kW
        </span>
        {dist != null && (
          <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
            {dist} km from route
          </span>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onSelect}
          className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-white"
        >
          Details
        </button>
        <button
          onClick={onAddStop}
          className="flex-1 px-3 py-2 rounded-md bg-emerald-600 text-white"
        >
          Add Stop
        </button>
      </div>
    </div>
  );
}
