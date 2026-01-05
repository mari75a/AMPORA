// src/components/AdminNavbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import "../pages/admin/adminstyle.css";

import MessageCenter from "../pages/admin/MessageCenter.jsx";

import logo from "../assets/logo.png";

const letters = ["A", "M", "P", "O", "R", "A"];

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Vehicle", path: "/admin/vehicle" },
  { label: "User", path: "/admin/users" },
  { label: "Charging Station", path: "/admin/charger-stations" },
  {
    label: "Charging",
    children: [
      { label: "Charger", path: "/admin/charger" },
      { label: "Subscriptions", path: "/admin/subscriptions" },
    ],
  },
  { label: "BookingStation", path: "/admin/BookingStation" },
];

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.36 },
    }),
  };

  return (
    <>
      <header className="admin-navbar fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-md border-b border-black/30 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo + title */}
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

          {/* Desktop nav */}
          <nav className=" hidden md:flex gap-8 font-medium text-white/80">
            {menuItems.map((item) =>
              item.children ? (
                // Dropdown for Charging
                <div
                  key={item.label}
                  className="relative group inline-flex items-center"
                >
                  <button
                    nav-button
                    type="button"
                    className="flex items-center gap-1 hover:text-white transition"
                  >
                    {item.label}
                    <FiChevronDown className="text-xs mt-0.5" />
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute left-0 mt-2 w-48 bg-black/95 border border-white/10 rounded-xl shadow-lg opacity-0 scale-95 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150">
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="hover:text-white transition"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center gap-5 text-white">
            <button className="nav-button flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 backdrop-blur hover:bg-white/20 transition text-sm">
              <FaGooglePlay className="text-sm" />
              <FaAppStoreIos className="text-sm" />
              App
            </button>

            <button
              onClick={() => setMessagesOpen(true)}
              className="bell-btn p-2 "
              aria-label="Messages"
            >
              <FiBell />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
          >
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

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white px-6 pb-4 shadow-lg">
            <nav className="flex flex-col gap-4 text-gray-700 font-medium mt-2">
              {menuItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-gray-900 font-semibold">
                      {item.label}
                    </span>
                    <div className="flex flex-col gap-2 ml-4 border-l border-gray-200 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setOpen(false)}
                          className="hover:text-green-600 text-sm"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className="hover:text-green-600"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex gap-3 mt-4">
              <button className="nav-button flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
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

      {messagesOpen && (
        <MessageCenter
          isOpen={messagesOpen}
          onClose={() => setMessagesOpen(false)}
        />
      )}
    </>
  );
}
