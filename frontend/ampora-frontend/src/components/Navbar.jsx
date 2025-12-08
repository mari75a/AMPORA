import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { FaGooglePlay, FaAppStoreIos } from "react-icons/fa";
import logo from "../assets/logo.png";

const letters = "AMPORA".split("");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <header className="bg-black backdrop-blur-md fixed top-0 w-full z-50 shadow-md border-b border-black/30">
      <div className="w-screen px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <img src={logo} alt="Logo" className="w-[50px]" />

          <motion.div
            initial="hidden"
            animate="show"
            className="flex text-2xl font-extrabold tracking-wide"
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={fadeUp}
                className="text-white drop-shadow transition"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 font-medium">
          {[
            ["Home", "/"],
            ["Trip Planner", "/trip"],
            ["Station", "/stations"],
            ["Bookings", "/bookings"],
            ["Payments", "/payments"],
            ["Dashboard", "/user-dashboard"],
          ].map(([name, link]) => (
            <a
              key={name}
              href={link}
              className="text-white hover:text-white/80"
            >
              <span className="text-white hover:text-white/80">{name}</span>
            </a>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-6vtext-white">
          {/* App Download Button */}
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/30 backdrop-blur hover:bg-white/20 transition text-white text-sm"
          >
            <FaGooglePlay className="text-sm" />
            <FaAppStoreIos className="text-sm" />
            <span className="text-white">App</span>
          </a>

          {/* Profile Avatar */}
          <div className="relative ">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full   border border-green-500 flex items-center justify-center"
            >
              <FiUser className="text-white text-xl" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl shadow-lg rounded-xl py-2 text-gray-700">
                <a
                  href="/user-dashboard"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                >
                  <FiSettings /> Profile Settings
                </a>
                <a
                  href="/logout"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                >
                  <FiLogOut /> Logout
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
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
          {/* Mobile nav links */}
          <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            <a href="/">Home</a>
            <a href="/trip">Trip Planner</a>
            <a href="/stations">Stations</a>
            <a href="/bookings">Bookings</a>
            <a href="/payments">Payments</a>
            <a href="/user-dashboard">Dashboard</a>
          </nav>

          {/* Mobile App Download */}
          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <FaGooglePlay /> Android
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <FaAppStoreIos /> iOS
            </button>
          </div>

          {/* Mobile Profile */}
          <div className="mt-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="text-gray-600 text-xl" />
            </div>
            <a href="/user-dashboard" className="text-gray-700">
              Profile
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
