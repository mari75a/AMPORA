import React from "react";
import { motion } from "framer-motion";
import icon1 from "../assets/battery1.png";
import roadtrip from "../assets/one-way-trip.png";
import mark from "../assets/location.png";
import bg1 from "../assets/bg1.jpg";
import EVSimulator from "../components/UI/EVSimulator";
import HeroSection from "../components/UI/HeroSection";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Home = () => {
  return (
    <div className="w-screen min-h-screen bg-[#EDFFFF] overflow-hidden">

      <HeroSection />

      {/* ============== ELECTRIC FLOW LINE ============== */}
      <div className="relative w-full flex justify-center mt-10">
        <div className="electric-line"></div>
      </div>

      {/* ============== FEATURE CARDS ============== */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="mt-20 flex flex-col lg:flex-row justify-center gap-10 px-16"
      >
        {[
          { title: "Find Stations", img: mark },
          { title: "Plan Trip", img: roadtrip },
          { title: "Smart Routing", img: icon1 },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, y: -10 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-12/12 lg:w-3/12 h-[230px] bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-2xl cursor-pointer"
          >
            <h3 className="font-bold text-xl text-gray-800">{item.title}</h3>
            <img src={item.img} className="w-20 h-20 mt-4" />
          </motion.div>
        ))}
      </motion.div>

      {/* ============== WHY CHOOSE US ============== */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="w-full mt-28 bg-[#D0FBE7] py-16 flex justify-center"
      >
        <h2 className="text-[38px] font-extrabold text-gray-900 text-center">
          Why You Should Choose Ampora ⚡
        </h2>
      </motion.div>

      {/* ============== STATS ============== */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        className="flex flex-col lg:flex-row justify-center gap-10 mt-10 px-16"
      >
        {[
          {num: "150+", label: "Active Charging Stations"},
          {num: "99%", label: "Uptime Availability"},
          {num: "50k+", label: "Trips Optimized"},
        ].map((i, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.12 }}
            className=" w-12/12 lg:w-3/12 bg-white p-8 h-[200px] shadow-xl rounded-2xl  flex flex-col items-center justify-center hover:shadow-2xl cursor-pointer"
          >
            <h1 className="text-[55px] font-extrabold text-emerald-500">{i.num}</h1>
            <p className="text-gray-700 mt-2 text-sm">{i.label}</p>
          </motion.div>
        ))}
      </motion.div>

<EVSimulator />

      {/* ============== BOTTOM INFO SECTIONS ============== */}
      <div className="flex flex-col lg:flex-row justify-center mt-20 gap-8 px-16">

        {/* LEFT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="w-12/12 lg:w-5/12 bg-[#F8F8F8] rounded-[40px] shadow-xl p-8"
        >
          <h2 className="text-[32px] font-bold text-gray-800">Power Up Your Life ⚡</h2>

          <div className="flex mt-6">
            <img src={icon1} className="w-32 h-32" />

            <div className="ml-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-black">Lightning Fast Charging</h3>
              <p className="text-gray-600 mt-2">
                Experience ultra-fast charging to keep your EV running at full power.
              </p>
              <button className="mt-5 px-6 py-2 bg-white border-2 border-emerald-400 rounded-xl shadow-sm hover:shadow-lg">
                See Chargers
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          className="w-12/12 lg:w-5/12 bg-[#A0F5CD] rounded-[40px] shadow-xl p-8"
        >
          <h2 className="text-[32px] font-bold text-gray-800">Effortless Trip Planning</h2>

          <div className="flex mt-6">
            <img src={roadtrip} className="w-32 h-32" />

            <div className="ml-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-black">Smart Route Optimization</h3>
              <p className="text-gray-700 mt-2">
                Plan the most efficient route with real-time station data.
              </p>
              <button className="mt-5 px-6 py-2 bg-white border-2 border-emerald-400 rounded-xl shadow-sm hover:shadow-lg">
                Plan Trip
              </button>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Home;
