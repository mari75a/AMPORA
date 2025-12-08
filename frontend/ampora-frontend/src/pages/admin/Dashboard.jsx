import { useMemo, useState } from "react";
import {
  Plus,
  Plug,
  FileText,
  Users,
  Car,
  TrendingUp,
  MapPin,
  DollarSign,
  Activity,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const [selectedPeriod] = useState("week");

  const stats = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: "$125,430",
        change: "+12.5%",
        icon: DollarSign,
        color: "from-emerald-400 to-emerald-500",
      },
      {
        label: "Active Sessions",
        value: "48",
        change: "+8.2%",
        icon: Activity,
        color: "from-green-400 to-green-500",
      },
      {
        label: "Total Users",
        value: "1,234",
        change: "+23.1%",
        icon: Users,
        color: "from-lime-400 to-lime-500",
      },
      {
        label: "Charging Stations",
        value: "45",
        change: "+5.0%",
        icon: MapPin,
        color: "from-teal-400 to-teal-500",
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        label: "Add Station",
        icon: Plus,
        gradient: "from-emerald-400 to-emerald-500",
      },
      {
        label: "Add Charger",
        icon: Plug,
        gradient: "from-green-400 to-green-500",
      },
      {
        label: "View Payments",
        icon: FileText,
        gradient: "from-lime-400 to-lime-500",
      },
      {
        label: "Manage Users",
        icon: Users,
        gradient: "from-teal-400 to-teal-500",
      },
      {
        label: "Register Vehicle",
        icon: Car,
        gradient: "from-emerald-500 to-green-500",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen  overflow-x-hidden bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-8">
      <div className="  mx-auto space-y-6 min-w-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your overview
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 min-w-0"
              >
                <div className="flex items-start justify-between min-w-0">
                  <div className="min-w-0">
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </h3>

                    <div className="flex items-center mt-2">
                      <TrendingUp size={16} className="text-green-500 mr-1" />
                      <span className="text-green-500 font-semibold text-sm">
                        {stat.change}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-lg min-w-0">
            <div className="flex items-center justify-between mb-4 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">
                Live Map Overview
              </h2>

              <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                View Details <ChevronRight size={18} />
              </button>
            </div>

            {/* Map SVG Placeholder */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-white min-w-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="text-emerald-300" size={56} />
              </div>

              {/* Station Markers */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute top-1/5 right-1/4 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" /> Available
              </span>

              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" /> Busy
              </span>

              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" /> Offline
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-0">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="relative group overflow-hidden bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="relative z-10 flex flex-col items-center">
                    <Icon
                      className="text-gray-700 group-hover:text-white transition-colors mb-3"
                      size={32}
                    />
                    <p className="font-semibold text-gray-900 group-hover:text-white text-sm transition-colors">
                      {action.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Revenue Trend
            </h2>

            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="text-green-400 mx-auto mb-2" size={48} />
                <p className="text-gray-500 font-medium">Chart visualization</p>
              </div>
            </div>
          </div>

          {/* Top Stations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Top Stations
            </h2>

            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="text-green-400 mx-auto mb-2" size={48} />
                <p className="text-gray-500 font-medium">Chart visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
