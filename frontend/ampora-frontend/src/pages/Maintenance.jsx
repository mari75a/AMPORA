import React, { useMemo } from "react";
import {
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

/* ---------------- MOCK DATA ---------------- */

const stations = [
  { id: "CH-100", name: "Station 1", health: "offline", lastChecked: "1 min ago" },
  { id: "CH-101", name: "Station 2", health: "good", lastChecked: "2 min ago" },
  {
    id: "CH-102",
    name: "Station 3",
    health: "warning",
    issue: "Overheating",
  },
  { id: "CH-103", name: "Station 4", health: "good", lastChecked: "3 min ago" },
  { id: "CH-104", name: "Station 5", health: "good", lastChecked: "6 min ago" },
];

const maintenanceTasks = [
  {
    station: "Station 3",
    issue: "Overheating Warning",
    status: "In Progress",
    date: "Apr 24, 2024",
  },
  {
    station: "Station 1",
    issue: "Communication Failure",
    status: "Pending",
    date: "Apr 23, 2024",
  },
  {
    station: "Station 7",
    issue: "Card Reader Malfunction",
    status: "Resolved",
    date: "Apr 20, 2024",
  },
  {
    station: "Station 5",
    issue: "Connector Inspection",
    status: "Completed",
    date: "Apr 18, 2024",
  },
];

/* ---------------- PAGE ---------------- */

export default function Maintenance() {
  const stats = useMemo(() => {
    return {
      attention: stations.filter(
        (s) => s.health === "offline" || s.health === "warning"
      ).length,
      healthy: stations.filter((s) => s.health === "good").length,
      open: maintenanceTasks.filter(
        (t) => t.status === "Pending" || t.status === "In Progress"
      ).length,
      completed: maintenanceTasks.filter(
        (t) => t.status === "Completed" || t.status === "Resolved"
      ).length,
    };
  }, []);

  return (
    <div className="p-8 animate-fadeIn">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Maintenance
        </h2>
        <p className="text-sm text-gray-500">
          Monitor and manage the health of your charging stations
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Stations Requiring Attention"
          value={stats.attention}
          color="red"
        />
        <SummaryCard
          title="Stations in Good Health"
          value={stats.healthy}
          color="green"
        />
        <SummaryCard
          title="Open Maintenance Tasks"
          value={stats.open}
          color="amber"
        />
        <SummaryCard
          title="Tasks Completed This Month"
          value={stats.completed}
          color="teal"
        />
      </section>

      {/* TABLES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STATION HEALTH */}
        <div className="bg-white rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Charging Station Status
            </h3>
            <span className="text-sm text-green-700 cursor-pointer">
              View All
            </span>
          </div>

          <div className="space-y-3">
            {stations.map((s) => (
              <StationRow key={s.id} station={s} />
            ))}
          </div>

          <button className="mt-5 w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded-lg text-sm font-medium">
            Request Maintenance
          </button>
        </div>

        {/* MAINTENANCE TASKS */}
        <div className="bg-white rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Recent Maintenance Tasks
            </h3>
            <span className="text-sm text-green-700 cursor-pointer">
              View All
            </span>
          </div>

          <div className="space-y-3">
            {maintenanceTasks.map((t, i) => (
              <TaskRow key={i} task={t} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SummaryCard({ title, value, color }) {
  const colors = {
    red: "from-red-50 to-red-100 text-red-600",
    green: "from-green-50 to-green-100 text-green-700",
    amber: "from-amber-50 to-amber-100 text-amber-600",
    teal: "from-teal-50 to-teal-100 text-teal-600",
  };

  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br ${colors[color]} card-shadow`}
    >
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function StationRow({ station }) {
  const statusMap = {
    good: {
      label: "Good",
      color: "text-green-700",
      icon: CheckCircleIcon,
    },
    warning: {
      label: "Warning: Overheating",
      color: "text-amber-600",
      icon: ExclamationTriangleIcon,
    },
    offline: {
      label: "Offline",
      color: "text-red-600",
      icon: ExclamationTriangleIcon,
    },
  };

  const Icon = statusMap[station.health].icon;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <div>
        <div className="font-medium text-gray-800">{station.name}</div>
        <div className="text-xs text-gray-500">
          ID: {station.id}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${statusMap[station.health].color}`} />
        <span className={`text-sm ${statusMap[station.health].color}`}>
          {statusMap[station.health].label}
        </span>
      </div>
    </div>
  );
}

function TaskRow({ task }) {
  const badge = {
    "In Progress": "bg-amber-100 text-amber-700",
    Pending: "bg-orange-100 text-orange-700",
    Resolved: "bg-green-100 text-green-700",
    Completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <div>
        <div className="text-sm font-medium text-gray-800">
          {task.station}: {task.issue}
        </div>
        <div className="text-xs text-gray-500">{task.date}</div>
      </div>

      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badge[task.status]}`}
      >
        {task.status}
      </span>
    </div>
  );
}
