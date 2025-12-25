import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import logo from "../assets/logo.png";

const letters = "AMPORA".split("");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <div className="flex items-center gap-3 select-none">
          <img src={logo} alt="Logo" className="w-10 h-10" />

          <motion.div
            initial="hidden"
            animate="show"
            className="flex text-xl font-extrabold tracking-wide"
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="text-white"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {[
            ["Home", "/"],
            ["Trip Planner", "/trip"],
            ["Stations", "/stations"],
            ["Bookings", "/bookings"],
            ["Payments", "/payments"],
            ["Dashboard", "/user-dashboard"],
          ].map(([name, link]) => (
            <a
              key={name}
              href={link}
              className="relative text-white/80 hover:text-white transition
                         after:absolute after:left-0 after:-bottom-1
                         after:w-0 after:h-[2px] after:bg-[#00d491]
                         hover:after:w-full after:transition-all"
            >
              {name}
            </a>
          ))}
        </nav>

        {/* ================= ACTIONS ================= */}
        <div className="hidden md:flex items-center gap-4">

          {/* App Button */}
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-white/10 border border-white/20
                       hover:bg-white/20 transition text-white text-sm"
          >
            <FaGooglePlay />
            <FaAppStoreIos />
            <span>App</span>
          </a>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full border border-[#00d491]
                         flex items-center justify-center
                         hover:bg-[#00d491]/10 transition"
            >
              <FiUser className="text-white text-lg" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-3 w-52 rounded-2xl
                           bg-white shadow-xl overflow-hidden"
              >
                <a
                  href="/user-dashboard"
                  className="flex items-center gap-3 px-4 py-3
                             hover:bg-gray-100 text-gray-700"
                >
                  <FiSettings /> Profile Settings
                </a>
                <a
                  href="/logout"
                  className="flex items-center gap-3 px-4 py-3
                             hover:bg-gray-100 text-gray-700"
                >
                  <FiLogOut /> Logout
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
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

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl px-6 pb-6 border-t border-white/10">
          <nav className="flex flex-col gap-4 text-white/90 mt-4">
            <a href="/">Home</a>
            <a href="/trip">Trip Planner</a>
            <a href="/stations">Stations</a>
            <a href="/bookings">Bookings</a>
            <a href="/payments">Payments</a>
            <a href="/user-dashboard">Dashboard</a>
          </nav>

          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white">
              <FaGooglePlay /> Android
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white">
              <FaAppStoreIos /> iOS
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
