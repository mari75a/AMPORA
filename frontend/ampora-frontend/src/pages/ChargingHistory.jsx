// src/pages/ChargingHistory.jsx
import React, { useMemo, useState } from "react";
import { MdEvStation } from "react-icons/md";
import { FiFilter } from "react-icons/fi";

const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function ChargingHistory() {
  const [filter, setFilter] = useState("all");
  const sessions = [
    { id: 1, station: "EcoCharge Hub – Panadura", date: "2025-10-05", kwh: 24.1, cost: 1450, type: "AC" },
    { id: 2, station: "Ampora SuperCharge – Borella", date: "2025-10-12", kwh: 38.3, cost: 3100, type: "DC" },
    { id: 3, station: "GreenCharge Downtown", date: "2025-10-20", kwh: 12.4, cost: 820, type: "AC" },
    { id: 4, station: "Ampora Express – Kelaniya", date: "2025-11-01", kwh: 44.6, cost: 3520, type: "DC" },
  ];

  const summary = useMemo(() => {
    const list = filter === "all" ? sessions : sessions.filter(s => s.type === filter);
    const totalKwh = list.reduce((a, b) => a + b.kwh, 0);
    const totalCost = list.reduce((a, b) => a + b.cost, 0);
    return { totalKwh, totalCost, count: list.length };
  }, [filter]);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-6xl py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">Charging History</h1>
            <p className="text-emerald-900/70">Your past sessions with totals and quick filters.</p>
          </div>

          <div className={`${glass} rounded-2xl p-2 flex items-center gap-2`}>
            <FiFilter className="text-emerald-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent outline-none text-emerald-800"
            >
              <option value="all">All</option>
              <option value="AC">AC Only</option>
              <option value="DC">DC Only</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Sessions" value={summary.count} />
          <SummaryCard title="Energy (kWh)" value={summary.totalKwh.toFixed(1)} />
          <SummaryCard title="Total Spend (LKR)" value={summary.totalCost.toLocaleString()} />
        </div>

        {/* Table */}
        <div className={`${glass} rounded-2xl overflow-hidden`}>
          <div className="grid grid-cols-12 px-5 py-3 bg-emerald-50 text-emerald-800 font-semibold text-sm">
            <div className="col-span-5">Station</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1">kWh</div>
            <div className="col-span-2 text-right">Cost (LKR)</div>
          </div>
          {sessions
            .filter(s => filter === "all" || s.type === filter)
            .map((s) => (
              <div key={s.id} className="grid grid-cols-12 px-5 py-3 border-t border-emerald-100 text-sm">
                <div className="col-span-5 flex items-center gap-2">
                  <MdEvStation className="text-emerald-600" /> {s.station}
                </div>
                <div className="col-span-2">{s.date}</div>
                <div className="col-span-2">{s.type}</div>
                <div className="col-span-1">{s.kwh.toFixed(1)}</div>
                <div className="col-span-2 text-right">{s.cost.toLocaleString()}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow";
  return (
    <div className={`${glass} rounded-2xl p-5`}>
      <div className="text-sm text-emerald-900/70">{title}</div>
      <div className="text-2xl font-extrabold text-emerald-700">{value}</div>
    </div>
  );
}
