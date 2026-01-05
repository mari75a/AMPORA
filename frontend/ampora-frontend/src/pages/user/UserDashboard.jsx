import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  FiUser,
  FiCalendar,
  FiZap,
  FiCreditCard,
  FiLogOut,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

import { MdEvStation } from "react-icons/md";
import { TbBatteryCharging } from "react-icons/tb";
import { LuCar } from "react-icons/lu";
import SessionEndModal from "../../components/SessionEndModal";

import SideNav from "../../components/dashboard/SideNav";
import { logout } from "../../utils/auth";

import useChargingSocket from "../../hooks/useChargingSocket";
import ChargingLiveCard from "../../components/LiveChargingCard";

const BACKEND = "http://localhost:8083";

const glass =
  "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function UserDashboard() {
  const userId = localStorage.getItem("userId");
  const {
  data,
  connected,
  sessionEnded,
  billInfo,
  resetSession
} = useChargingSocket();

  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (!userId) return;

    async function loadDashboard() {
      try {
        const userRes = await fetch(`${BACKEND}/api/users/${userId}`);
        const userData = await userRes.json();

        const vehicleRes = await fetch(
          `${BACKEND}/api/vehicles/user/${userId}`
        );
        const vehicleData = await vehicleRes.json();

        setUser(userData);
        setVehicles(vehicleData || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [userId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-emerald-700 font-semibold">
        Loading dashboard…
      </div>
    );
  }

  const quickActions = [
    { title: "Profile", icon: <FiUser />, to: "/profile" },
    { title: "Vehicles", icon: <LuCar />, to: "/vehicles" },
    { title: "Bookings", icon: <FiCalendar />, to: "/bookings" },
    { title: "Payments", icon: <FiCreditCard />, to: "/package" },
    { title: "Charging History", icon: <FiZap />, to: "/history" },
    { title: "Logout", icon: <FiLogOut />, onClick: logout, to: "/" },
  ];

  const selectedVehicle = vehicles[0];

  return (
    
    <div className="w-screen min-h-screen mt-20 bg-gradient-to-b from-emerald-50 via-teal-50 to-white">
{sessionEnded && billInfo && (
  <SessionEndModal
    billInfo={billInfo}
    onClose={resetSession}
  />
)}
      {/* ================= HEADER ================= */}
      <div className="mx-auto w-11/12 max-w-7xl py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">
          {user.fullName}
        </h1>
        <p className="text-emerald-900/70">{user.email}</p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="mx-auto w-11/12 max-w-7xl pb-12
                      grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

        {/* SIDE NAV */}
        <SideNav actions={quickActions} />

        {/* CONTENT */}
        <div className="space-y-8">

          {/* ===== MONTHLY STATS ===== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className={`${glass} rounded-2xl p-6`}>
              <h3 className="text-sm font-semibold text-emerald-900/80">
                Energy used
              </h3>
              <p className="text-3xl font-extrabold text-emerald-700 mt-2">
                212.4 kWh
              </p>
            </div>

            <div className={`${glass} rounded-2xl p-6`}>
              <h3 className="text-sm font-semibold text-emerald-900/80">
                Amount spent
              </h3>
              <p className="text-3xl font-extrabold text-emerald-700 mt-2">
                LKR 18,450
              </p>
            </div>
          </motion.div>

          {/* ===== SELECTED VEHICLE ===== */}
          {selectedVehicle && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${glass} rounded-2xl p-6`}
            >
              <h3 className="font-semibold text-emerald-900 mb-3">
                Selected Vehicle
              </h3>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {selectedVehicle.brand_name} {selectedVehicle.model_name}
                </span>
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700">
                  Range {selectedVehicle.rangeKm} km
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {selectedVehicle.plate}
                </span>
              </div>

              <a
                href="/trip"
                className="inline-block mt-4 px-4 py-2 rounded-lg
                           bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white font-semibold"
              >
                Plan Trip with this Vehicle
              </a>
            </motion.div>
          )}
        <motion.div
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
>
  <ChargingLiveCard data={data} connected={connected} />
</motion.div>

          {/* ===== UPCOMING BOOKING (PLACEHOLDER) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glass} rounded-2xl p-6`}
          >
            <h3 className="font-semibold text-emerald-900 mb-3">
              Upcoming Booking
            </h3>

            <div className="flex items-center gap-2 text-sm">
              <MdEvStation className="text-emerald-600" />
              Ampora SuperCharge – Borella
            </div>

            <div className="flex items-center gap-2 text-sm mt-1">
              <FiClock /> 22 Nov • 11:00 AM
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
