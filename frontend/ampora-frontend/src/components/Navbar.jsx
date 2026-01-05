import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import logo from "../assets/logo.png";

const letters = "AMPORA".split("");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ================= AUTH CHECK =================
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  // ================= NAV ITEMS =================
  const navItems = [
    ["Home", "/", "public"],
    ["Trip Planner", "/trip", "public"],
    ["Stations", "/stations", "public"],
    ["Bookings", "/bookings", "private"],
    ["Payments", "/payments", "private"],
    ["Dashboard", "/user-dashboard", "private"],
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <div className="flex items-center gap-3 select-none">
          <img src={logo} alt="Logo" className="w-10 h-10" />

          <motion.div className="flex text-xl font-extrabold tracking-wide">
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
          {navItems
            .filter(([_, __, type]) => type === "public" || isLoggedIn)
            .map(([name, link]) => (
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

          {/* ================= AUTH BUTTONS ================= */}
          {!isLoggedIn ? (
            <>
              <a
                href="/login"
                className="px-4 py-2 rounded-full border border-[#00d491]
                           text-white hover:bg-[#00d491]/10 transition"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 rounded-full bg-[#00d491]
                           text-black font-semibold hover:opacity-90 transition"
              >
                Sign Up
              </a>
            </>
          ) : (
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
                <div className="absolute right-0 mt-3 w-52 rounded-2xl
                               bg-white shadow-xl overflow-hidden">
                  <a
                    href="/user-dashboard"
                    className="flex items-center gap-3 px-4 py-3
                               hover:bg-gray-100 text-gray-700"
                  >
                    <FiSettings /> Profile
                  </a>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3
                               hover:bg-gray-100 text-gray-700 text-left"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl px-6 pb-6 border-t border-white/10">
          <nav className="flex flex-col gap-4 text-white/90 mt-4">
            {navItems
              .filter(([_, __, type]) => type === "public" || isLoggedIn)
              .map(([name, link]) => (
                <a key={name} href={link}>
                  {name}
                </a>
              ))}
          </nav>

          {!isLoggedIn ? (
            <div className="flex gap-3 mt-6">
              <a
                href="/login"
                className="w-full text-center py-2 bg-white/10
                           rounded-xl text-white"
              >
                Login
              </a>
              <a
                href="/signup"
                className="w-full text-center py-2 bg-[#00d491]
                           rounded-xl text-black font-semibold"
              >
                Sign Up
              </a>
            </div>
          ) : (
            <button
              onClick={logout}
              className="mt-6 w-full py-2 bg-red-500
                         rounded-xl text-white"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
