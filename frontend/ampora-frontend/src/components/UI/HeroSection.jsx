import React from "react";
import { motion } from "framer-motion";
import heroVideo from "../ev-video.mp4"; // <-- your video here

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const HeroSection = () => {
  return (
    <div className="relative w-screen h-[90vh] overflow-hidden">
      
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

     
     <div className="absolute inset-0 bg-black/60"></div>


      {/* ---------------- CONTENT ---------------- */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-[10%]">
        
        {/* TITLE */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-white text-[65px] font-extrabold leading-tight drop-shadow-2xl"
        >
          Power Your Journey  
          <br />  
          with Intelligence ⚡
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
          className="text-gray-200 text-xl mt-4 max-w-2xl"
        >
          Discover EV charging stations, plan ultra-efficient routes,  
          and experience the future of electric travel.
        </motion.p>

        {/* SEARCH BAR */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="mt-8 w-full"
        >
          <input
            type="text"
            placeholder="Search EV chargers or locations..."
            className="w-[450px] h-[55px] px-6 rounded-full bg-white/90 backdrop-blur-md 
                       text-black text-lg outline-none focus:ring-4 focus:ring-emerald-400
                        shadow-lg"
          />
        </motion.div>

        {/* ELECTRICITY BARS */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 1 }}
          className="flex gap-5 mt-10"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.15 }}
              animate={{ height: ["60px", "90px", "60px"] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2,
              }}
              className="w-5 bg-emerald-400 rounded-md shadow-xl"
            ></motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;
