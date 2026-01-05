import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BoltIcon,
  CurrencyDollarIcon,
  SignalIcon,
  MapPinIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* ---------------- MOCK DATA ---------------- */

const makeEnergySeries = () =>
  Array.from({ length: 8 }).map((_, i) => ({
    time: i === 7 ? "Now" : `${(7 - i) * 10}s`,
    kW: 120 + Math.random() * 80,
  }));

const liveSessions = [
  {
    id: "S-01",
    customer: "A. Silva",
    slot: "Slot 3",
    power: "42 kW",
    remaining: "18 min",
    status: "Charging",
  },
  {
    id: "S-02",
    customer: "K. Fernando",
    slot: "Slot 1",
    power: "0 kW",
    remaining: "-",
    status: "Paused",
  },
];

const upcomingBookings = [
  {
    id: "BK-1201",
    customer: "A. Silva",
    phone: "+94 77 123 4567",
    tier: "Premium",
    vehicle: "Tesla Model 3",
    connector: "CCS2",
    station: "Station 2",
    slot: "Slot 3",
    date: "2025-01-19",
    time: "09:30 AM",
    status: "Confirmed",
  },
  {
    id: "BK-1202",
    customer: "K. Fernando",
    phone: "+94 71 987 6543",
    tier: "Basic",
    vehicle: "Nissan Leaf",
    connector: "CHAdeMO",
    station: "Station 1",
    slot: "Slot 1",
    date: "2025-01-19",
    time: "11:00 AM",
    status: "Pending",
  },
];

/* ================= MAIN COMPONENT ================= */

export default function OperatorPremium() {
  const [series, setSeries] = useState(makeEnergySeries);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
const [messages, setMessages] = useState([
  { from: "admin", text: "Hello Operator, how can we help?" },
]);


  useEffect(() => {
    const id = setInterval(() => {
      setSeries((s) => [
        ...s.slice(1),
        { time: "Now", kW: 120 + Math.random() * 90 },
      ]);
    }, 10000);
    return () => clearInterval(id);
  }, []);
  const handleSend = () => {
  if (message.trim() === "") return;

  setMessages((oldMessages) => [
    ...oldMessages,
    { from: "operator", text: message },
  ]);

  setMessage("");
};


  const kpis = useMemo(
    () => [
      { label: "Charging Slots", value: 12, icon: MapPinIcon },
      { label: "Live Sessions", value: 2, icon: SignalIcon },
      { label: "Energy Delivered", value: "412 kWh", icon: BoltIcon },
      { label: "Revenue Today", value: "$184.90", icon: CurrencyDollarIcon },
      { label: "System Health", value: "98.6%", icon: CpuChipIcon },
    ],
    []
  );

  return (
    <div className="pt-6 px-8 pb-8 space-y-6 bg-emerald-50 min-h-screen">



      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Operator Dashboard</h1>
        <div className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
          Live System • Auto-refresh
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* ENERGY + LIVE SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnergyChart series={series} />
        <LiveSessions />
      </div>

      {/* UPCOMING BOOKINGS */}
      <UpcomingBookings />

      {/* CHAT BUTTON */}
      <motion.button
        onClick={() => setChatOpen(true)}
        whileHover={{ scale: 1.1 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: "#10b981",
          border: "none",
          boxShadow: "0 20px 40px rgba(16,185,129,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
          <path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10c-1.7 0-3.3-.4-4.7-1.2L2 22l1.2-5.3C2.4 15.3 2 13.7 2 12z" />
        </svg>
      </motion.button>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-80 h-[420px] bg-white rounded-2xl shadow-2xl flex flex-col z-50"
          >
            <div className="bg-emerald-500 text-white p-4 rounded-t-2xl flex justify-between">
              <strong>Admin Support</strong>
             <button
  onClick={() => setChatOpen(false)}
  className="!w-8 !h-8 !flex !items-center !justify-center !rounded-full 
             !bg-white/20 !text-white !text-lg 
             hover:!bg-white/30 transition"
>
  ✕
</button>

            </div>

            <div className="flex-1 p-4 space-y-2 overflow-y-auto text-sm">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`p-2 rounded-lg max-w-[75%] ${
        msg.from === "operator"
          ? "ml-auto bg-emerald-500 text-white"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {msg.text}
    </div>
  ))}
</div>

            
            
            
            

            <div className="p-3 border-t flex gap-2">
             
             <input
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSend()}
  className="flex-1 border rounded-lg px-3 py-2 text-sm"
  placeholder="Type message..."
/>

             
             


<button
  onClick={handleSend}
  className="!bg-emerald-500 !text-white !px-4 !py-2 !rounded-lg hover:!bg-emerald-600"
>
  Send
</button>





            
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function KpiCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white p-4 rounded-xl shadow-md border border-slate-100"
    >
      <div className="flex items-center gap-3 text-slate-500">
        <Icon className="w-6 text-emerald-500" />
        {label}
      </div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </motion.div>
  );
}

function EnergyChart({ series }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-semibold mb-3">Live Energy Load (kW)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 6" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line dataKey="kW" stroke="#10b981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
      
    </div>
  );
}

function LiveSessions() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-semibold mb-4">Live Charging Sessions</h3>
      <div className="space-y-3">
        {liveSessions.map((s) => (
          <div
            key={s.id}
            className="flex justify-between items-center p-3 rounded-lg border border-emerald-300 bg-emerald-50 shadow-sm"
          >
            <div>
              <div className="font-medium">{s.customer}</div>
              <div className="text-xs text-slate-500">{s.slot}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">{s.power}</div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  s.status === "Charging"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}













function UpcomingBookings() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-semibold mb-4">Upcoming Bookings</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="text-left py-2">Booking</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Vehicle</th>
              <th className="text-left">Station</th>
              <th className="text-left">Schedule</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {upcomingBookings.map((b) => (
              <tr
                key={b.id}
                className="border-b last:border-none hover:bg-slate-50 transition"
              >
                <td className="py-3 font-medium">{b.id}</td>

                <td>
                  <div className="font-medium">{b.customer}</div>
                  <div className="text-xs text-slate-500">{b.phone}</div>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                      b.tier === "Premium"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {b.tier}
                  </span>
                </td>

                <td>
                  <div className="font-medium">{b.vehicle}</div>
                  <div className="text-xs text-slate-500">
                    Connector: {b.connector}
                  </div>
                </td>

                <td>
                  {b.station}
                  <div className="text-xs text-slate-500">{b.slot}</div>
                </td>

                <td>
                  <div>{b.date}</div>
                  <div className="text-xs text-slate-500">{b.time}</div>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      b.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
