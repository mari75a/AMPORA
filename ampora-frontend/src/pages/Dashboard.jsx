import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [battery, setBattery] = useState(84);
  const [range, setRange] = useState(312);

  // Mock chart data for trips (later load from backend)
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: [22, 24, 18, 30, 27, 25, 20],
        borderColor: "#0ABAB5",
        backgroundColor: "#56DFCF30",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: "#043D3A" } },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "#043D3A" }, grid: { display: false } },
      y: { ticks: { color: "#043D3A" }, grid: { color: "#ADEED9" } },
    },
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-[#FFEDF3] via-[#ADEED9] to-[#56DFCF] flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-lg border-r border-[#ADEED9] shadow-lg p-6">
        <h2 className="text-2xl font-bold text-[#0ABAB5] mb-10">⚡ AMPORA</h2>
        <nav className="space-y-4 text-[#043D3A] font-medium">
          <a href="/" className="block hover:text-[#0ABAB5]">🏠 Home</a>
          <a href="/trip-planner" className="block hover:text-[#0ABAB5]">🧭 Trip Planner</a>
          <a href="/dashboard" className="block text-[#0ABAB5] font-semibold">📊 Dashboard</a>
          <a href="/profile" className="block hover:text-[#0ABAB5]">👤 Profile</a>
          <a href="/settings" className="block hover:text-[#0ABAB5]">⚙️ Settings</a>
        </nav>
        <div className="mt-auto text-sm text-[#043D3A]/60 pt-10 border-t border-[#ADEED9]">
          © {new Date().getFullYear()} AMPORA
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-[#043D3A] mb-8">Welcome back, Sangeeth 👋</h1>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white/70 border border-[#ADEED9] rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-[#043D3A]/80 mb-2">🔋 Battery Level</h2>
            <p className="text-4xl font-bold text-[#0ABAB5]">{battery}%</p>
            <p className="text-[#043D3A]/60 mt-1">Optimal performance</p>
          </div>

          <div className="bg-white/70 border border-[#ADEED9] rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-[#043D3A]/80 mb-2">🚗 Estimated Range</h2>
            <p className="text-4xl font-bold text-[#0ABAB5]">{range} km</p>
            <p className="text-[#043D3A]/60 mt-1">Based on recent driving</p>
          </div>

          <div className="bg-white/70 border border-[#ADEED9] rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-[#043D3A]/80 mb-2">⚡ Active Trips</h2>
            <p className="text-4xl font-bold text-[#0ABAB5]">3</p>
            <p className="text-[#043D3A]/60 mt-1">In progress today</p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-white/80 backdrop-blur-lg border border-[#ADEED9] rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-[#043D3A] mb-6">
            Weekly Energy Consumption
          </h2>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* UPCOMING CHARGING SESSIONS */}
        <div className="mt-10 bg-[#FFEDF3] border border-[#ADEED9] rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-[#043D3A] mb-4">
            Upcoming Charging Sessions
          </h2>
          <ul className="space-y-3 text-[#043D3A]/80">
            <li className="bg-white/70 p-4 rounded-xl shadow-sm flex justify-between">
              <span>🔌 Colombo SuperCharge</span>
              <span className="text-[#0ABAB5] font-semibold">Today, 5:30 PM</span>
            </li>
            <li className="bg-white/70 p-4 rounded-xl shadow-sm flex justify-between">
              <span>🔌 Negombo GreenCharge</span>
              <span className="text-[#0ABAB5] font-semibold">Tomorrow, 10:00 AM</span>
            </li>
            <li className="bg-white/70 p-4 rounded-xl shadow-sm flex justify-between">
              <span>🔌 Galle EV Hub</span>
              <span className="text-[#0ABAB5] font-semibold">Wed, 3:00 PM</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
