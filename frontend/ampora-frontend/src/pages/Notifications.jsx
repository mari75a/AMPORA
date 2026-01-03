// src/pages/Notifications.jsx
import React from "react";
import { FiBell, FiCheckCircle, FiInfo } from "react-icons/fi";

const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function Notifications() {
  const groups = [
    {
      date: "Today",
      items: [
        { id: 1, type: "success", text: "Your booking for 11:00 AM is confirmed." },
        { id: 2, type: "info", text: "Station Kelaniya added 2 new CCS chargers." },
      ],
    },
    {
      date: "Yesterday",
      items: [{ id: 3, type: "success", text: "Payment received for session #A1029." }],
    },
  ];

  const iconMap = {
    success: <FiCheckCircle className="text-emerald-600" />,
    info: <FiInfo className="text-emerald-600" />,
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-4xl py-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 text-2xl">
            <FiBell />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">Notifications</h1>
            <p className="text-emerald-900/70">Your latest updates & alerts</p>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.date} className={`${glass} rounded-2xl p-5`}>
            <div className="text-sm font-semibold text-emerald-900/80 mb-3">{g.date}</div>
            <div className="space-y-3">
              {g.items.map((n) => (
                <div key={n.id} className="flex items-center gap-3 text-sm">
                  {iconMap[n.type]}
                  <div className="text-emerald-900/90">{n.text}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
