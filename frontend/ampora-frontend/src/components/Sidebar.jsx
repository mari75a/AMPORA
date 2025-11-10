import { NavLink } from "react-router-dom";
import { Home, Map, Plug, Calendar, CreditCard, History, User, HelpCircle } from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/dashboard", icon: <Home />, label: "Home" },
    { to: "/trip-planner", icon: <Map />, label: "Trip Planner" },
    { to: "/stations", icon: <Plug />, label: "Charging Stations" },
    { to: "/bookings", icon: <Calendar />, label: "My Bookings" },
    { to: "/payments", icon: <CreditCard />, label: "Subscription & Payments" },
    { to: "/history", icon: <History />, label: "Charging History" },
    { to: "/profile", icon: <User />, label: "Profile & Settings" },
    { to: "/support", icon: <HelpCircle />, label: "Help & Support" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-xl border-r border-[#ADEED9] shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#0ABAB5] mb-10">⚡ AMPORA</h2>
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-[#043D3A] hover:bg-[#ADEED9]/40 transition ${
                isActive ? "bg-[#56DFCF]/40 text-[#0ABAB5] font-semibold" : ""
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-sm text-[#043D3A]/60 pt-6 border-t border-[#ADEED9]">
        © {new Date().getFullYear()} AMPORA
      </div>
    </aside>
  );
}
