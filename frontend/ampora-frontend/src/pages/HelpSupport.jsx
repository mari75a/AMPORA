// src/pages/HelpSupport.jsx
import React, { useState } from "react";
import { FiHelpCircle, FiSend } from "react-icons/fi";

const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function HelpSupport() {
  const faqs = [
    { q: "How do I book a charger?", a: "Visit Station Details and click 'Book Slot'. Choose time and connector." },
    { q: "How is energy usage calculated?", a: "We estimate kWh based on route distance and your vehicle efficiency." },
    { q: "Can I share a subscription?", a: "Enterprise plans support fleets and multiple drivers under one billing." },
  ];

  const [form, setForm] = useState({ email: "", message: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-5xl py-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 text-2xl">
            <FiHelpCircle />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">Help & Support</h1>
            <p className="text-emerald-900/70">Find answers or contact our team</p>
          </div>
        </div>

        {/* FAQ */}
        <div className={`${glass} rounded-2xl p-6`}>
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="border border-emerald-100 rounded-xl p-4 bg-white/60">
                <div className="font-semibold text-emerald-800">{f.q}</div>
                <div className="text-sm text-emerald-900/80 mt-1">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className={`${glass} rounded-2xl p-6`}>
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">Contact us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Your email"
              className="rounded-xl border border-emerald-200 px-3 py-2 bg-white/80"
            />
            <div className="md:col-span-2">
              <input
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Write your message"
                className="w-full rounded-xl border border-emerald-200 px-3 py-2 bg-white/80"
              />
            </div>
          </div>
          <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
            <FiSend /> Send
          </button>
        </div>

        {/* Quick links */}
        <div className="text-sm text-emerald-900/70">
          Need billing help? <a href="/payments" className="text-emerald-700 underline">Go to Plans & Subscription</a>
        </div>
      </div>
    </div>
  );
}
