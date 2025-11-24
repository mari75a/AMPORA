import React from "react";
import { FiMapPin } from "react-icons/fi";
import { MdEvStation } from "react-icons/md";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf 
} from "react-icons/fa";
import { motion } from "framer-motion";

const BookingsPage = () => {
  const bookings = [
    {
      id: 1,
      station: "GreenCharge Downtown",
      address: "123 Main St, Colombo",
      date: "2025-11-20",
      time: "4:30 PM",
      charger: "CHAdeMO • 50kW",
      status: "Confirmed",
      price: "$12.50",
    },
    {
      id: 2,
      station: "Ampora SuperCharge",
      address: "No. 45 Kandy Rd, Kiribathgoda",
      date: "2025-11-22",
      time: "11:00 AM",
      charger: "CCS • 100kW",
      status: "Pending",
      price: "$8.20",
    },
    {
      id: 3,
      station: "EcoCharge Hub",
      address: "Galle Road, Panadura",
      date: "2025-10-05",
      time: "6:00 PM",
      charger: "Type 2 • 22kW",
      status: "Cancelled",
      price: "$4.90",
    },
  ];

  const statusColor = {
    Confirmed: "text-emerald-600 bg-emerald-100",
    Pending: "text-yellow-600 bg-yellow-100",
    Cancelled: "text-red-600 bg-red-100",
  };

  const statusIcon = {
    Confirmed: <FaCheckCircle />,
    Pending: <FaHourglassHalf />,
    Cancelled: <FaTimesCircle />,
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white px-6 py-10 flex flex-col items-center">

      {/* PAGE TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-emerald-700 drop-shadow-md"
      >
        My Bookings
      </motion.h1>

      {/* BOOKINGS */}
      <div className="mt-10 w-11/12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {bookings.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl p-6 backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.15)]"
          >
            {/* TOP SECTION */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-emerald-800">
                  {b.station}
                </h2>

                <div className="flex items-center text-gray-600 mt-2 text-sm">
                  <FiMapPin className="text-emerald-600 mr-1" />
                  {b.address}
                </div>
              </div>

              {/* STATUS BADGE */}
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-sm ${statusColor[b.status]}`}
              >
                {statusIcon[b.status]}
                {b.status}
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-3 mt-6 text-center">
              <div>
                <p className="text-gray-600 text-xs">DATE</p>
                <p className="text-black font-semibold">{b.date}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">TIME</p>
                <p className="text-black font-semibold">{b.time}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">COST</p>
                <p className="text-black font-semibold">{b.price}</p>
              </div>
            </div>

            {/* CHARGER TYPE */}
            <div className="flex items-center mt-5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
              <MdEvStation className="text-emerald-600 mr-3" size={25} />
              <span className="font-medium text-emerald-800">{b.charger}</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-xl text-sm font-medium border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition">
                View Details
              </button>

              {b.status !== "Cancelled" && (
                <button className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition">
                  Rebook
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
