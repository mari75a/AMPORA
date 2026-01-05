import React from "react";
import { motion } from "framer-motion";

const glass =
  "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

const SideNav = ({ actions }) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${glass} w-full lg:w-64 rounded-3xl p-4`}
    >
      <h3 className="mb-4 px-2 text-sm font-semibold text-emerald-900/70">
        Quick Actions
      </h3>

      <nav className="space-y-2">
        {actions.map((a, idx) => (
          <a
            key={idx}
            href={a.to}
            onClick={a.onClick}
            className="flex items-center gap-3 px-3 py-3 rounded-xl
                       hover:bg-emerald-50 transition group"
          >
            <div
              className="grid place-items-center w-9 h-9 rounded-lg
                         bg-emerald-100 text-emerald-600 text-lg
                         group-hover:scale-105 transition"
            >
              {a.icon}
            </div>

            <span className="font-medium text-sm text-emerald-900">
              {a.title}
            </span>
          </a>
        ))}
      </nav>
    </motion.aside>
  );
};

export default SideNav;
