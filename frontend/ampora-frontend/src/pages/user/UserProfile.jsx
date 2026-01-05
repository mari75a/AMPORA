import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiCalendar,
  FiCreditCard,
  FiZap,
  FiLogOut,
} from "react-icons/fi";
import { LuCar } from "react-icons/lu";
import SideNav from "../../components/dashboard/SideNav";

const glass =
  "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function UserProfile() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const res = await fetch(
      "http://localhost:8083/api/users/32389639-de6e-464a-afc9-d18060391373"
    );
    const data = await res.json();
    setUser(data);
  }

  async function updateFunction() {
    const resp = await fetch(
      "http://localhost:8083/api/users/32389639-de6e-464a-afc9-d18060391373",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }
    );
    if (resp.ok) alert("User updated successfully");
  }

  function logoutFunction() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  const quickActions = [
    { title: "User Details", icon: <FiUser />, to: "/profile" },
    { title: "Vehicle Details", icon: <LuCar />, to: "/vehicles" },
    { title: "Bookings", icon: <FiCalendar />, to: "/bookings" },
    { title: "Plans & Subscription", icon: <FiCreditCard />, to: "/package" },
    { title: "Charging History", icon: <FiZap />, to: "/history" },
    { title: "Logout", icon: <FiLogOut />, onClick: logoutFunction, to: "/" },
  ];

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-b mt-20 from-emerald-50 via-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <div className="w-full lg:w-[260px] lg:sticky lg:top-24">
            <SideNav actions={quickActions} />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-700">
                User Profile
              </h1>

              <button
                onClick={() => {
                  if (editing) updateFunction();
                  setEditing(!editing);
                }}
                className="inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                <FiEdit2 />
                {editing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className={`${glass} rounded-2xl p-4 sm:p-6 lg:col-span-2`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LabelInput
                    icon={<FiUser />}
                    label="Full Name"
                    name="fullName"
                    value={user.fullName}
                    editable={editing}
                    onChange={handleChange}
                  />
                  <LabelInput
                    icon={<FiMail />}
                    label="Email"
                    name="email"
                    value={user.email}
                    editable={editing}
                    onChange={handleChange}
                  />
                  <LabelInput
                    icon={<FiPhone />}
                    label="Phone"
                    name="phone"
                    value={user.phone}
                    editable={editing}
                    onChange={handleChange}
                  />
                  <LabelInput
                    icon={<FiMapPin />}
                    label="Address"
                    name="address"
                    value={user.address}
                    editable={editing}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <StatCard title="Total Charges" value="42 Sessions" />
                <StatCard title="This Month Spend" value="LKR 18,450" />
                <StatCard title="Energy Used (30 Days)" value="212.4 kWh" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function LabelInput({ icon, label, name, value, onChange, editable }) {
  return (
    <div>
      <label className="text-sm font-semibold text-emerald-900/80">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-emerald-600">{icon}</span>
        {editable ? (
          <input
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-xl border border-emerald-200 px-3 py-3 bg-white/80 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
        ) : (
          <div className="w-full px-3 py-3 rounded-xl bg-white/70 border border-emerald-100">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow rounded-2xl p-4">
      <p className="text-sm text-emerald-900/70">{title}</p>
      <p className="text-2xl font-extrabold text-emerald-700">{value}</p>
    </div>
  );
}
