import React, { useEffect, useMemo, useState } from "react";
import {
  HomeIcon,
  MapPinIcon,
  BoltIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";

/* -------------------- HELPERS -------------------- */
const makeSeries = () =>
  Array.from({ length: 7 }).map((_, i) => ({
    time: i === 6 ? "Now" : `-${(6 - i) * 10}s`,
    kW: 160 + i * 18 + Math.random() * 10,
  }));

/* ==================== MAIN ==================== */
export default function Operator() {
  const [series, setSeries] = useState(makeSeries);

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => [
        ...s.slice(1),
        { time: "Now", kW: s.at(-1).kW + 6 },
      ]);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Charging slots ", value: 12, icon: MapPinIcon },
      { label: "Live Sessions", value: 2, icon: SignalIcon },
      { label: "Energy Delivered", value: "393 kWh", icon: BoltIcon },
      { label: "Revenue Today", value: "$128.40", icon: CurrencyDollarIcon },
    ],
    []
  );

  return (
    <div className="min-h-screen flex pt-20 bg-gradient-to-br from-white via-emerald-50 to-teal-100">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <Header />

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* CHART + ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LiveChart series={series} />
          <ActiveAlerts />
        </div>

        {/* UPCOMING BOOKINGS */}
        <UpcomingBookings />
      </main>
    </div>
  );
}

/* ==================== SIDEBAR ==================== */


function Sidebar() {
  const navigate = useNavigate();

  const nav = [
    [HomeIcon, "Overview", "/"],
    [MapPinIcon, "Stations", "/station-op"], // navigate here
    [BoltIcon, "Booking", "/bookkings"],
    [CurrencyDollarIcon, "Payments", "/"],
    [WrenchScrewdriverIcon, "Maintenance", "/"],
    [DocumentTextIcon, "Reports", "/reports"],
    [Cog6ToothIcon, "Settings", "/"],
  ];

  return (
    <aside className="w-64 bg-white border-r border-emerald-100 p-5 space-y-4">
      <div className="text-xl font-bold text-emerald-500 tracking-wide">
        ⚡ AMPORA
      </div>

      {nav.map(([Icon, label, path]) => (
        <div
          key={label}
          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-emerald-50 transition text-slate-600"
          onClick={() => navigate(path)}
        >
          <Icon className="w-5" />
          {label}
        </div>
      ))}
    </aside>
  );
}








/* ==================== HEADER ==================== */
function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Operator Dashboard</h1>
      <div className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
        Auto-refresh • 10s
      </div>
    </div>
  );
}

/* ==================== STAT CARD ==================== */
function StatCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-emerald-100 shadow-sm p-4"
    >
      <div className="flex items-center gap-3 text-slate-500">
        <Icon className="w-6 text-emerald-500" />
        {label}
      </div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </motion.div>
  );
}

/* ==================== LIVE CHART ==================== */
function LiveChart({ series }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2 bg-white rounded-xl border border-emerald-100 p-5 shadow-sm"
    >
      <h3 className="font-semibold mb-1">Live Charging Power (kW)</h3>
      <p className="text-xs text-slate-400 mb-3">
        Real-time — last 60 seconds
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 6" stroke="#d1fae5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="kW"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* ==================== ALERTS ==================== */
function ActiveAlerts() {
  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Active Alerts</h3>
        <span className="text-sm text-emerald-600 cursor-pointer">
          View All
        </span>
      </div>

      <AnimatePresence>
        <AlertItem
          text="Station 3 offline"
          time="2 min"
          status="Offline"
        />
        <AlertItem
          text="Station 7 high temperature"
          status="Overheat"
        />
      </AnimatePresence>
    </div>
  );
}

function AlertItem({ text, time, status }) {
  const isOffline = status === "Offline";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-50 border border-slate-200"
    >
      <div className="flex items-center gap-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
        <span className="text-sm font-medium text-slate-700">
          {text}
          {time && (
            <span className="text-slate-400 font-normal">
              {" "}
              ({time})
            </span>
          )}
        </span>
      </div>

      <span
        className={`text-xs font-medium px-3 py-1 rounded-full ${
          isOffline
            ? "bg-rose-100 text-rose-500"
            : "bg-orange-100 text-orange-500"
        }`}
      >
        {status}
      </span>
    </motion.div>
  );
}

/* ==================== UPCOMING BOOKINGS ==================== */
function UpcomingBookings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Upcoming Charging Bookings
        </h3>
        <span className="text-sm text-emerald-600 cursor-pointer">
          View All
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-3 text-left font-medium">Booking ID</th>
              <th className="py-3 text-left font-medium">Customer</th>
              <th className="py-3 text-left font-medium">Station</th>
              <th className="py-3 text-left font-medium">Date</th>
              <th className="py-3 text-left font-medium">Time</th>
              <th className="py-3 text-left font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            <BookingRow
              id="BK-1201"
              customer="A. Silva"
              station="Station 2"
              date="2025-01-19"
              time="09:30 AM"
              status="Confirmed"
              confirmed
            />
            <BookingRow
              id="BK-1202"
              customer="N. Perera"
              station="Station 4"
              date="2025-01-19"
              time="11:00 AM"
              status="Pending"
            />
            <BookingRow
              id="BK-1203"
              customer="S. Fernando"
              station="Station 1"
              date="2025-01-19"
              time="02:45 PM"
              status="Confirmed"
              confirmed
            />
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function BookingRow({
  id,
  customer,
  station,
  date,
  time,
  status,
  confirmed,
}) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-slate-100 last:border-none"
    >
      <td className="py-4 font-medium text-slate-700">{id}</td>
      <td className="py-4">{customer}</td>
      <td className="py-4">{station}</td>
      <td className="py-4">{date}</td>
      <td className="py-4">{time}</td>
      <td className="py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            confirmed
              ? "bg-emerald-100 text-emerald-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {status}
        </span>
      </td>
    </motion.tr>
  );
}
