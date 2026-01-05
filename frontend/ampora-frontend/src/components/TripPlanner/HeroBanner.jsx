import React from "react";
import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[30vh] md:h-[45vh] flex flex-col items-center justify-center text-center overflow-hidden">

      {/* ➤ Glowing background blobs (soft, premium) */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-emerald-300/20 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-teal-300/20 blur-[70px]" />

      {/* ➤ Main Heading */}
      <motion.h1
        variants={fade}
        initial="hidden"
        animate="show"
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm"
      >
        Plan Your Electric Journey
      </motion.h1>

      {/* ➤ Subtext */}
      <motion.p
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.3 }}
        className="mt-3 text-gray-600 text-sm md:text-base"
      >
        Smart EV routing • Charging stations • Energy prediction
      </motion.p>

      {/* ➤ Minimal EV Charging Cable Animation */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.6 }}
        className="relative mt-8 flex justify-center items-center"
      >

        {/* Cable Path */}
        <svg width="280" height="80" viewBox="0 0 280 80" fill="none">
          <path
            d="M5 40 Q 100 10, 180 40 T 275 40"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
            className="animate-cable-minimal"
          />
        </svg>

        {/* Plug */}
        <div className="absolute right-0 -mr-3 mt-3 animate-plug-minimal">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-1.5 h-3 bg-black rounded-b-md mx-auto mt-1"></div>
        </div>
      </motion.div>

    </div>
  );
};

export default HeroBanner;
