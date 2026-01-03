import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "./api/userService";
import { fetchStations } from "./api/stationService";
import { fetchSessions } from "./api/chargerSession";
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
import SimpleRevenueChart from "./component/SimpleRevenueChart";
import DashboardMap from "./component/DashboardMap";
import TopStationsFromSessionsFetch from "./component/TopStationsStatic";

export default function Dashboard() {
  const [selectedPeriod] = useState("week");
  const navigate = useNavigate();
  const [stations, setStations] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activesessions, setActiveSessions] = useState(0);
  const [users, setUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetchStations();
        setStations(response.length);
        const sessions = await fetchSessions();
        setSessions(sessions);
        const activeSessionsCount = sessions.filter(
          (session) => session.sessionStatus === "ONGOING"
        ).length;
        setActiveSessions(activeSessionsCount);
        const revenueData = sessions.reduce((total, session) => {
          return total + (session.cost || 0);
        }, 0);
        setRevenue(revenueData);
        const usersData = await fetchUser();
        setUsers(usersData.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: revenue.toString(),
        change: "+12.5%",
        icon: DollarSign,
        color: "from-emerald-400 to-emerald-500",
      },
      {
        label: "Active Sessions",
        value: activesessions.toString(),
        change: "+8.2%",
        icon: Activity,
        color: "from-green-400 to-green-500",
      },
      {
        label: "Total Users",
        value: users.toString(),
        change: "+23.1%",
        icon: Users,
        color: "from-lime-400 to-lime-500",
      },
      {
        label: "Charging Stations",
        value: stations.toString(),
        change: "+5.0%",
        icon: MapPin,
        color: "from-teal-400 to-teal-500",
      },
    ],
    [activesessions, users, stations]
  );

  const actions = useMemo(
    () => [
      {
        key: "add-station",
        label: "Add Station",
        icon: Plus,
        gradient: "from-emerald-400 to-emerald-500",
        onClick: () =>
          navigate("/admin/charger-stations", {
            state: { openAddModal: true },
          }),
      },
      {
        key: "add-charger",
        label: "Add Charger",
        icon: Plug,
        gradient: "from-green-400 to-green-500",
        onClick: () =>
          navigate("/admin/charger", { state: { openAddModal: true } }),
      },
      {
        key: "view-payments",
        label: "View Payments",
        icon: FileText,
        gradient: "from-lime-400 to-lime-500",
        onClick: () => navigate("/admin/subscriptions"),
      },
      {
        key: "manage-users",
        label: "Manage Users",
        icon: Users,
        gradient: "from-teal-400 to-teal-500",
        onClick: () =>
          navigate("/admin/users", { state: { openAddModal: true } }),
      },
      {
        key: "register-vehicle",
        label: "Register Vehicle",
        icon: Car,
        gradient: "from-emerald-500 to-green-500",
        onClick: () =>
          navigate("/admin/vehicle", { state: { openAddModal: true } }),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen   overflow-x-hidden bg-gradient-to-br from-gray-50 to-green-50 p-4 my-20 md:p-8">
      <div className="  mx-auto space-y-6 min-w-0">
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

        <div className="relative w-full h-96 rounded-xl overflow-hidden bg-white shadow">
          <DashboardMap />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-0">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.key}
                  onClick={action.onClick}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          <div className="bg-white rounded-2xl p-6 shadow min-w-0">
            <SimpleRevenueChart sessions={sessions} />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg min-w-0">
            <TopStationsFromSessionsFetch sessions={sessions} topN={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
