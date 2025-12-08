import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import logo from "../assets/logo.png";

const letters = "AMPORA".split("");

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Vehicle", path: "/admin/vehicle" },
    { label: "User", path: "/admin/users" },
    { label: "Charging Station", path: "/admin/charger-stations" },
    { label: "Billing", path: "/admin/billing" },
    { label: "Charging Session", path: "/admin/charger-session" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.36 },
    }),
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-md border-b border-black/30 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" alt="logo" />

          <motion.div
            initial="hidden"
            animate="show"
            className="flex text-2xl font-extrabold tracking-wide select-none"
          >
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={fadeUp}
                className="text-white drop-shadow"
              >
                {ch}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hover:text-white/80 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: app button + profile */}
        <div className="hidden md:flex items-center gap-6 text-white">
          {/* App button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 backdrop-blur hover:bg-white/20 transition text-sm">
            <FaGooglePlay className="text-sm" />
            <FaAppStoreIos className="text-sm" />
            App
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full border border-green-500 flex items-center justify-center"
            >
              <FiUser className="text-green-500 text-xl" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl shadow-lg rounded-xl py-2 text-gray-700">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                >
                  <FiSettings /> Profile Settings
                </Link>
                <Link
                  to="/logout"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                >
                  <FiLogOut /> Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4 shadow-lg">
          <nav className="flex flex-col gap-4 text-gray-700 font-medium mt-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className="hover:text-green-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile buttons */}
          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <FaGooglePlay />
              Android
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <FaAppStoreIos />
              iOS
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
