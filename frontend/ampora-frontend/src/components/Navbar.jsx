// src/components/Navbar.jsx
import React, { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const palette = {
    vibrant: "#00FF9A",
    dark: "#158D5C",
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: palette.vibrant }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={palette.dark}>
              <path d="M12 2L3 7v7c0 5 3 9 9 9s9-4 9-9V7l-9-5z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl text-gray-800">AMPORA</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="/" className="hover:text-black"><span className="text-gray-700 font-medium hover:text-black ">Home</span> </a>
          <a href="/trip" className="hover:text-black"><span className="text-gray-700 font-medium hover:text-black ">Trip Planner</span> </a>
          <a href="/stations" className="hover:text-black"><span className="text-gray-700 font-medium hover:text-black ">Station</span> </a>
          <a href="/bookings" className="hover:text-black"><span className="text-gray-700 font-medium hover:text-black ">Bookings</span> </a>
          <a href="/payments" className="hover:text-black"><span className="text-gray-700 font-medium hover:text-black ">Payments</span> </a>
        </nav>

        {/* Profile */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-gray-600">Hello, Sangeeth</span>
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center"
            style={{ background: palette.vibrant }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={palette.dark}>
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-8 h-8 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4 shadow-lg">
          <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            <a href="/">Home</a>
            <a href="/trip">Trip Planner</a>
            <a href="/stations">Stations</a>
            <a href="/bookings">Bookings</a>
            <a href="/payments">Payments</a>
          </nav>

          {/* Mobile Profile */}
          <div className="mt-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full border shadow-md flex items-center justify-center"
              style={{ background: palette.vibrant }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={palette.dark}>
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            </div>
            <div className="text-sm text-gray-600">Hello, Sangeeth</div>
          </div>
        </div>
      )}
    </header>
  );
}
