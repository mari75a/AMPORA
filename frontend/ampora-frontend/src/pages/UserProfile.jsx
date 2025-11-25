// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2 } from "react-icons/fi";

const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "Sangeeth Lakshan",
    email: "sangeethlakshan0@gmail.com",
    phone: "0779693100",
    address: "36, Badulla Road, Bibile",
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-6xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">User Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <FiEdit2 /> {editing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className={`${glass} rounded-2xl p-6 lg:col-span-2`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <LabelInput
                icon={<FiUser className="text-emerald-600" />}
                label="Full Name"
                name="name"
                value={user.name}
                onChange={handleChange}
                editable={editing}
              />
              <LabelInput
                icon={<FiMail className="text-emerald-600" />}
                label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                editable={editing}
              />
              <LabelInput
                icon={<FiPhone className="text-emerald-600" />}
                label="Phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                editable={editing}
              />
              <LabelInput
                icon={<FiMapPin className="text-emerald-600" />}
                label="Address"
                name="address"
                value={user.address}
                onChange={handleChange}
                editable={editing}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <StatCard title="Total Charges" value="42 Sessions" />
            <StatCard title="This Month Spend" value="LKR 18,450" />
            <StatCard title="Energy Used (30d)" value="212.4 kWh" />
          </div>
        </div>

        {/* Activity */}
        <div className={`${glass} rounded-2xl p-6`}>
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-sm text-emerald-900/80">
            <li>• Booked Ampora SuperCharge (Borella) for 22 Nov, 11:00 AM</li>
            <li>• Updated vehicle: Nissan Leaf 40kWh</li>
            <li>• Completed charge at EcoCharge Hub – LKR 1,450</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function LabelInput({ icon, label, name, value, onChange, editable }) {
  return (
    <div>
      <label className="text-sm font-semibold text-emerald-900/80">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        {icon}
        {editable ? (
          <input
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 bg-white/80 text-black"
          />
        ) : (
          <div className="w-full px-3 py-2 rounded-xl bg-white/70 border border-emerald-100">{value}</div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow";
  return (
    <div className={`${glass} rounded-2xl p-4`}>
      <div className="text-sm text-emerald-900/70">{title}</div>
      <div className="text-2xl font-extrabold text-emerald-700">{value}</div>
    </div>
  );
}
