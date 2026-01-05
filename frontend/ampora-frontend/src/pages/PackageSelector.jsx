import React, { useState } from "react";
import { FiZap, FiShield, FiLayers } from "react-icons/fi";

const KWH_RATE = 85;

// TODO: Replace with real logged-in user id from auth context / JWT
const LOGGED_USER_ID = "USER_123";

export const EV_PACKAGES = [
  {
    id: "basic",
    name: "Ampora Basic Card",
    kwh: 100,
    discount: 10,
    price: 7650,
    icon: FiZap,
    theme: {
      bg: "from-black via-neutral-900 to-black",
      glow: "shadow-[0_0_40px_rgba(212,175,55,0.25)]",
      accent: "text-yellow-400",
      border: "border-yellow-500/40"
    },
    benefits: [
      "100 kWh prepaid charging credit",
      "10% bulk energy discount",
      "Multi-session usage",
      "Standard charger access",
      "Email receipts"
    ]
  },
  {
    id: "premium",
    name: "Ampora Premium Card",
    kwh: 500,
    discount: 15,
    price: 36125,
    icon: FiShield,
    recommended: true,
    theme: {
      bg: "from-black via-slate-900 to-black",
      glow: "shadow-[0_0_60px_rgba(45,212,191,0.35)]",
      accent: "text-teal-400",
      border: "border-teal-500/50"
    },
    benefits: [
      "500 kWh prepaid charging credit",
      "15% bulk energy discount",
      "Priority charger access",
      "Charging history dashboard",
      "SMS & Email notifications"
    ]
  },
  {
    id: "enterprise",
    name: "Ampora Enterprise Card",
    kwh: 1000,
    discount: 20,
    price: 68000,
    icon: FiLayers,
    theme: {
      bg: "from-blue-900 via-sky-800 to-blue-700",
      glow: "shadow-[0_0_70px_rgba(56,189,248,0.35)]",
      accent: "text-sky-300",
      border: "border-sky-400/40"
    },
    benefits: [
      "1000 kWh prepaid charging credit",
      "20% bulk energy discount",
      "Fleet & multi-vehicle support",
      "Admin dashboard",
      "Monthly usage reports",
      "Priority technical support"
    ]
  }
];

export default function PackageSelector() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePayHerePayment(pkg) {
    if (!pkg) {
      alert("Please select a package first");
      return;
    }

    try {
      setLoading(true);

      const orderId = `AMPORA_${pkg.id}_${Date.now()}`;

      // 1️⃣ Request secure hash
      const res = await fetch(
        "http://localhost:8083/api/payment/payhere/hash",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: pkg.price.toFixed(2),
            currency: "LKR"
          })
        }
      );

      const data = await res.json();

      if (!data.hash) {
        alert("Payment initialization failed");
        return;
      }

      // 2️⃣ Build PayHere form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";
      // PROD: https://www.payhere.lk/pay/checkout

      const fields = {
        merchant_id: data.merchantId,

        return_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/package",
        notify_url: "http://localhost:8083/api/payment/payhere/notify",

        order_id: orderId,
        items: pkg.name,
        currency: "LKR",
        amount: pkg.price.toFixed(2),

        // 🔐 Custom secure identifiers
        custom_1: pkg.id,          // plan id
        custom_2: LOGGED_USER_ID,  // user id

        first_name: "Sangeeth",
        last_name: "Lakshan",
        email: "user@email.com",
        phone: "0770000000",

        address: "Sri Lanka",
        city: "Colombo",
        country: "Sri Lanka",

        hash: data.hash
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      alert("Payment error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto mt-20 px-6">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Choose Your <span className="text-emerald-600">Ampora Smart Card</span>
        </h2>
        <p className="mt-4 text-gray-600 text-lg">
          NFC-based EV charging • Pay-As-You-Go • Bulk kWh discounts
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {EV_PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          const active = selected?.id === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelected(pkg)}
              className={`relative cursor-pointer rounded-[28px] p-[2px]
                transition-all duration-300
                ${active ? "scale-[1.05]" : "hover:scale-[1.02]"}`}
            >
              <div
                className={`absolute inset-0 rounded-[28px] border ${pkg.theme.border}`}
              />

              <div
                className={`relative rounded-[26px] p-8 h-full text-white
                bg-gradient-to-br ${pkg.theme.bg}
                ${pkg.theme.glow}`}
              >
                {pkg.recommended && (
                  <span className="absolute top-5 right-5 px-4 py-1 rounded-full
                                   text-xs font-bold bg-emerald-500 text-black">
                    MOST POPULAR
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`text-3xl ${pkg.theme.accent}`} />
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                </div>

                <div className="mt-6">
                  <span className="text-5xl font-extrabold">{pkg.kwh}</span>
                  <span className="ml-2 text-lg text-gray-300">kWh</span>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 line-through">
                    LKR {(pkg.kwh * KWH_RATE).toLocaleString()}
                  </p>
                  <p className="text-3xl font-extrabold">
                    LKR {pkg.price.toLocaleString()}
                  </p>
                  <p className={`text-sm ${pkg.theme.accent}`}>
                    Save {pkg.discount}%
                  </p>
                </div>

                <div className="my-6 h-px bg-white/20" />

                <ul className="space-y-3 text-sm text-gray-200">
                  {pkg.benefits.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className={pkg.theme.accent}>✔</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePayHerePayment(pkg);
                  }}
                  disabled={loading}
                  className={`mt-8 w-full py-4 rounded-xl font-semibold transition-all
                    ${
                      active
                        ? "bg-white text-black"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                >
                  {loading && active
                    ? "Processing..."
                    : active
                    ? "Pay Now"
                    : "Choose Card"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
