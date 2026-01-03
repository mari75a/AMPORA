// src/pages/Settings.jsx
import React, { useState } from "react";
import { FiLock, FiBell, FiGlobe } from "react-icons/fi";

const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function Settings() {
  const [prefs, setPrefs] = useState({
    language: "en",
    emailAlerts: true,
    pushAlerts: true,
    shareAnalytics: false,
  });

  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-4xl py-10 space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">Settings</h1>

        <div className={`${glass} rounded-2xl p-6`}>
          <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <FiGlobe /> Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-emerald-900/80">Language</label>
              <select
                value={prefs.language}
                onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 bg-white/80"
              >
                <option value="en">English</option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
            <ToggleRow icon={<FiBell />} label="Email Alerts" value={prefs.emailAlerts} onClick={() => toggle("emailAlerts")} />
            <ToggleRow icon={<FiBell />} label="Push Notifications" value={prefs.pushAlerts} onClick={() => toggle("pushAlerts")} />
            <ToggleRow icon={<FiLock />} label="Share anonymous analytics" value={prefs.shareAnalytics} onClick={() => toggle("shareAnalytics")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, value, onClick }) {
  return (
    <div className="flex items-center justify-between border border-emerald-100 rounded-xl px-4 py-3 bg-white/60">
      <div className="flex items-center gap-2 text-emerald-900/90">
        <span className="text-emerald-600">{icon}</span> {label}
      </div>
      <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full relative transition ${
          value ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
            value ? "left-6" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
