import React, { useState } from "react";
import { FiCreditCard, FiLock } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

const EV_GREEN = "#00d491";

export default function Payment() {
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  // Example booking/payment data (replace with real props/state)
  const paymentData = {
    orderId: "ORDER_123456",
    amount: "2700.00",
    currency: "LKR",
    firstName: "Sangeeth",
    lastName: "Lakshan",
    email: "user@email.com",
    phone: "0770000000",
  };

  async function handlePayHerePayment() {
    try {
      setLoading(true);

      // 1️⃣ Request secure hash from backend
      const res = await fetch("http://localhost:8083/api/payment/payhere/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
        }),
      });

      const data = await res.json();

      if (!data.hash) {
        alert("Payment initialization failed");
        return;
      }

      // 2️⃣ Create PayHere form dynamically
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout"; // PROD: https://www.payhere.lk/pay/checkout

      const fields = {
        merchant_id: data.merchantId,
        return_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-cancel",
        notify_url: "http://localhost:8083/api/payment/payhere/notify",

        order_id: paymentData.orderId,
        items: "EV Charging Session",
        currency: paymentData.currency,
        amount: paymentData.amount,

        first_name: paymentData.firstName,
        last_name: paymentData.lastName,
        email: paymentData.email,
        phone: paymentData.phone,
        address: "Sri Lanka",
        city: "Colombo",
        country: "Sri Lanka",

        hash: data.hash,
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
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-teal-100 pb-16">

      {/* ================= HEADER ================= */}
      <div className="relative h-[32vh] rounded-b-[70px] overflow-hidden
                      bg-gradient-to-tr from-teal-900 via-emerald-800 to-teal-700">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120">
          <path
            fill="rgba(255,255,255,0.15)"
            d="M0,64L60,58.7C120,53,240,43,360,53.3C480,64,600,96,720,101.3C840,107,960,85,1080,69.3C1200,53,1320,43,1380,37.3L1440,32V120H0Z"
          />
        </svg>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            Secure <span className="text-emerald-300">Payment</span>
          </h1>
          <p className="mt-3 text-emerald-100 text-lg">
            Fast • Safe • Transparent
          </p>
        </div>
      </div>

      {/* ================= INTRO ================= */}
      <div className="max-w-4xl mx-auto mt-10 px-6 text-center">
        <p className="text-lg text-gray-700 leading-relaxed">
          Complete your charging session payment securely.
          Review your booking details, choose a payment method,
          and confirm with confidence.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Encrypted payments • No hidden fees • Instant confirmation
        </p>
      </div>

      {/* ================= PAYMENT CONTENT ================= */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

        {/* ===== PAYMENT SUMMARY ===== */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Payment Summary
          </h2>

          <div className="space-y-4">
            <SummaryRow label="Station" value="Colombo Fast Charge Hub" />
            <SummaryRow label="Charger Type" value="DC Fast Charger (50kW)" />
            <SummaryRow label="Duration" value="2 Hours" />
            <SummaryRow label="Energy Cost" value="LKR 2,500.00" />
            <SummaryRow label="Service Fee" value="LKR 200.00" />

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-emerald-600">LKR 2,700.00</span>
            </div>
          </div>
        </div>

        {/* ===== PAYMENT METHOD ===== */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-4">Payment Method</h2>

          <button
            onClick={() => setMethod("card")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border
              ${method === "card"
                ? "border-emerald-500 bg-[#edffff]"
                : "border-gray-200"}`}
          >
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-emerald-600 text-xl" />
              <span className="font-medium">Card / PayHere</span>
            </div>

            <div className="flex gap-2 text-2xl text-gray-500">
              <FaCcVisa />
              <FaCcMastercard />
            </div>
          </button>

          <button
            disabled
            className="mt-3 w-full p-4 rounded-2xl border border-dashed
                       text-gray-400 cursor-not-allowed"
          >
            Mobile Wallet (Coming Soon)
          </button>

          <button
            onClick={handlePayHerePayment}
            disabled={loading}
            className="mt-6 w-full py-4 rounded-2xl font-semibold text-black
                       shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
            style={{ background: EV_GREEN }}
          >
            {loading ? "Redirecting..." : "Pay with PayHere"}
          </button>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 justify-center">
            <FiLock />
            <span>Secure 256-bit SSL encrypted payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== SUB COMPONENT ===== */
function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-gray-700">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
