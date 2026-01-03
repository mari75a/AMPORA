import React from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className=" w-full bg-gradient-to-b from-white/80 via-emerald-50/60 to-emerald-100/70 backdrop-blur-xl border-t border-emerald-200/40">
      
      {/* Top Section */}
      <div className="w-11/12 max-w-7xl mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold text-emerald-700">AMPORA ⚡</h2>
          <p className="mt-3 text-emerald-900/70 text-sm leading-relaxed">
            Smart EV charging, intelligent routing, real-time bookings &
            personalized trip planning — all in one platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-emerald-800">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-emerald-900/70">
            <li><a href="/trip" className="hover:text-emerald-700"> <span className="text-emerald-900/70" >Trip Planner</span></a></li>
            <li><a href="/bookings" className="hover:text-emerald-700"><span className="text-emerald-900/70">My Bookings</span></a></li>
            <li><a href="/vehicles" className="hover:text-emerald-700"><span className="text-emerald-900/70">My Vehicles</span></a></li>
            <li><a href="/history" className="hover:text-emerald-700"><span className="text-emerald-900/70">Charging History</span></a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-emerald-800">Support</h3>
          <ul className="mt-3 space-y-2 text-emerald-900/70">
            <li><a href="/faq" className="hover:text-emerald-700"><span className="text-emerald-900/70">FAQ</span></a></li>
            <li><a href="/contact" className="hover:text-emerald-700"><span className="text-emerald-900/70">Contact Us</span></a></li>
            <li><a href="/privacy" className="hover:text-emerald-700"><span className="text-emerald-900/70">Privacy Policy</span></a></li>
            <li><a href="/terms" className="hover:text-emerald-700"><span className="text-emerald-900/70">Terms & Conditions</span></a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-emerald-800">Contact</h3>
          <ul className="mt-3 space-y-3 text-emerald-900/70">
            <li className="flex items-center gap-2">
              <FiMapPin className="text-emerald-600" />
              Colombo, Sri Lanka
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-emerald-600" />
              +94 77 969 3100
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-emerald-600" />
              support@ampora.com
            </li>
          </ul>

          {/* Social */}
          <div className="flex gap-4 mt-5">
            <a className="p-2 rounded-xl bg-white/70 border border-emerald-200 hover:bg-emerald-50 transition" href="#">
              <FiFacebook className="text-emerald-700" />
            </a>
            <a className="p-2 rounded-xl bg-white/70 border border-emerald-200 hover:bg-emerald-50 transition" href="#">
              <FiInstagram className="text-emerald-700" />
            </a>
            <a className="p-2 rounded-xl bg-white/70 border border-emerald-200 hover:bg-emerald-50 transition" href="#">
              <FiTwitter className="text-emerald-700" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-emerald-200/50 py-4">
        <p className="text-center text-sm text-emerald-900/70">
          © {new Date().getFullYear()} <span className="font-semibold">AMPORA</span>.  
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
