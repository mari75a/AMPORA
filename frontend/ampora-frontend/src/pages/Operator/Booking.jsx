import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  BoltIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

/* ---------------- SAMPLE BOOKINGS DATA ---------------- */
const initialBookings = [
  {
    id: "BK-1001",
    date: "2025-01-22",
    time: "10:30 AM – 11:30 AM",
    slot: "Fast Charger – Slot 2",
    status: "Confirmed",

    customer: {
      name: "Nimal Perera",
      plan: "Premium",
      phone: "+94 77 123 4567",
      email: "nimal@gmail.com",
    },

    station: {
      name: "Colombo Central EV Station",
      location: "Union Place, Colombo 02",
      power: "22 kW",
    },
  },
  {
    id: "BK-1002",
    date: "2025-01-23",
    time: "02:00 PM – 03:00 PM",
    slot: "Standard Charger – Slot 5",
    status: "Pending",

    customer: {
      name: "Saman Silva",
      plan: "Basic",
      phone: "+94 71 987 6543",
      email: "saman@yahoo.com",
    },

    station: {
      name: "Kandy EV Hub",
      location: "Peradeniya Road, Kandy",
      power: "11 kW",
    },
  },
];

export default function Bookings() {
  const [bookings] = useState(initialBookings);

  return (
    <div className="min-h-screen pt-24 px-6 pb-24 bg-gradient-to-br from-white via-sky-50 to-emerald-50">

      {/* PAGE TITLE */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-7 h-7 text-emerald-700" />
          Station Bookings
        </h1>
      </div>

      {/* BOOKINGS LIST */}
      <div className="max-w-6xl mx-auto space-y-6">
        {bookings.map(booking => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- BOOKING CARD ---------------- */
function BookingCard({ booking }) {
  const planColor = {
    Basic: "bg-slate-100 text-slate-700",
    Premium: "bg-amber-100 text-amber-700",
    Enterprise: "bg-indigo-100 text-indigo-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border rounded-xl shadow-lg p-6 space-y-5"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Booking ID: {booking.id}
          </h2>
          <p className="text-sm text-slate-500">
            {booking.date} • {booking.time}
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
          {booking.status}
        </span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CUSTOMER DETAILS */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Customer Details
          </h3>

          <p className="text-sm"><strong>Name:</strong> {booking.customer.name}</p>
          <p className="text-sm flex items-center gap-1">
            <PhoneIcon className="w-4 h-4" />
            {booking.customer.phone}
          </p>
          <p className="text-sm">{booking.customer.email}</p>

          <span
            className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${planColor[booking.customer.plan]}`}
          >
            {booking.customer.plan} Customer
          </span>
        </div>

        {/* STATION DETAILS */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            Station Information
          </h3>

          <p className="text-sm"><strong>Name:</strong> {booking.station.name}</p>
          <p className="text-sm">{booking.station.location}</p>
          <p className="text-sm flex items-center gap-1">
            <BoltIcon className="w-4 h-4" />
            {booking.station.power}
          </p>
        </div>

        {/* BOOKING DETAILS */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5" />
            Booking Details
          </h3>

          <p className="text-sm"><strong>Slot:</strong> {booking.slot}</p>
          <p className="text-sm"><strong>Date:</strong> {booking.date}</p>
          <p className="text-sm"><strong>Time:</strong> {booking.time}</p>
        </div>

      </div>
    </motion.div>
  );
}
