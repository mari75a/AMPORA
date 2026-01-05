import React, { useEffect, useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { MdEvStation } from "react-icons/md";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE = "http://127.0.0.1:8083";
const EV_GREEN = "#00d491";

/* ================= STATUS CONFIG ================= */
const STATUS_META = {
  CONFIRMED: {
    label: "Confirmed",
    icon: <FaCheckCircle />,
    style: "text-emerald-700 bg-emerald-100",
  },
  PENDING: {
    label: "Pending",
    icon: <FaHourglassHalf />,
    style: "text-yellow-700 bg-yellow-100",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <FaTimesCircle />,
    style: "text-red-700 bg-red-100",
  },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  /* ================= LOAD BOOKINGS ================= */
  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetch(
          `${API_BASE}/api/bookings/user/${userId}`
        );
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [userId]);

  return (
    <div className="min-h-screen mt-7 bg-gradient-to-b from-teal-900 via-emerald-900 to-white pb-20">

      {/* ================= HEADER (PAYMENT STYLE) ================= */}
      <div className="relative h-[32vh] rounded-b-[70px] overflow-hidden
                      bg-gradient-to-tr from-teal-900 via-emerald-800 to-teal-700">

        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120">
          <path
            fill="rgba(255,255,255,0.15)"
            d="M0,64L60,58.7C120,53,240,43,360,53.3C480,64,600,96,720,101.3C840,107,960,85,1080,69.3C1200,53,1320,43,1380,37.3L1440,32V120H0Z"
          />
        </svg>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            My <span className="text-emerald-300">Bookings</span>
          </h1>
          <p className="mt-3 text-emerald-100 text-lg">
            Track • Manage • Rebook Instantly
          </p>
        </div>
      </div>

      {/* ================= INTRO ================= */}
      <div className="max-w-4xl mx-auto mt-10 px-6 text-center">
        <p className="text-lg text-gray-700">
          View all your EV charging reservations in one place.
          Monitor status, review details, and quickly rebook your favorite stations.
        </p>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="mt-12 max-w-7xl mx-auto px-6">

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading your bookings…
          </p>
        )}

        {/* EMPTY */}
        {!loading && bookings.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl">
            <p className="text-gray-600">
              You don’t have any bookings yet.
            </p>
          </div>
        )}

        {/* BOOKINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bookings.map((b) => {
            const meta = STATUS_META[b.status] || STATUS_META.PENDING;

            return (
              <motion.div
                key={b.bookingId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
                className="rounded-[28px] p-6 bg-white/80 backdrop-blur-xl
                           border border-emerald-200
                           shadow-[0_25px_70px_rgba(16,185,129,0.18)]"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-800">
                      {b.stationName || "EV Charging Station"}
                    </h2>

                    <div className="flex items-center text-gray-600 mt-2 text-sm">
                      <FiMapPin className="text-emerald-600 mr-1" />
                      {b.address || "Station address"}
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-1
                                rounded-full text-sm font-semibold ${meta.style}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </div>
                </div>

                {/* INFO GRID */}
                <div className="grid grid-cols-3 mt-6 text-center">
                  <Info label="Date" value={b.date} />
                  <Info
                    label="Time"
                    value={`${b.startTime} - ${b.endTime}`}
                  />
                  <Info
                    label="Cost"
                    value={
                      b.amount != null
                        ? `LKR ${Number(b.amount).toFixed(2)}`
                        : "—"
                    }
                  />
                </div>

                {/* CHARGER */}
                <div className="flex items-center mt-5 bg-emerald-50 border
                                border-emerald-200 rounded-xl p-3">
                  <MdEvStation
                    className="text-emerald-600 mr-3"
                    size={24}
                  />
                  <span className="font-medium text-emerald-800">
                    {b.chargerType || "EV Charger"}
                    {b.powerKw ? ` • ${b.powerKw} kW` : ""}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-xl text-sm font-medium
                               border border-emerald-300 text-emerald-700
                               hover:bg-emerald-50 transition"
                  >
                    View Details
                  </button>

                  {b.status !== "CANCELLED" && (
                    <button
                      className="px-4 py-2 rounded-xl text-sm font-medium
                                 text-black transition hover:scale-[1.03]"
                      style={{ background: EV_GREEN }}
                    >
                      Rebook
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENT ================= */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="text-black font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}
