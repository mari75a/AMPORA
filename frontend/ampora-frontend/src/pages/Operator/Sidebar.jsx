import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import {
  HomeIcon,
  MapPinIcon,
  BoltIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const nav = [
    [HomeIcon, "Overview", "/operator"],
    [MapPinIcon, "Stations", "/station-op"],
    [BoltIcon, "Booking", "/bookkings"],
    [CurrencyDollarIcon, "Payments", "/payments"],
    [WrenchScrewdriverIcon, "Maintenance", "/maintenance"],
    [DocumentTextIcon, "Reports", "/reports"],
    [Cog6ToothIcon, "Settings", "/settings-op"],
  ];

  return (
    <aside className="w-64 min-h-screen bg-black text-white flex flex-col px-6 py-5">
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">
        <img src={Logo} alt="Ampora Logo" className="w-10 h-10" />
        <span className="text-xl font-semibold tracking-widest">
          AMPORA
        </span>
      </div>

      {/* NAV */}
      <nav className="space-y-2">
        {nav.map(([Icon, label, path]) => {
          const active = location.pathname === path;

          return (
            <div
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition
                ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 text-xs text-white/40">
        Ampora Operator Panel
      </div>
    </aside>
  );
}
