import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCreditCard, FiLock } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

const EV_GREEN = "#00d491";
const BACKEND = "http://localhost:8083";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ================= SAFETY ================= */
  if (!state || !state.bill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">
          Invalid or expired payment session
        </p>
      </div>
    );
  }

  /* ================= SESSION DATA ================= */
  const energy = state.energy;
  const amount = state.bill.toFixed(2);
  const orderId = `EV_${Date.now()}`;

  const user = {
    firstName: "Sangeeth",
    lastName: "Lakshan",
    email: "user@email.com",
    phone: "0770000000",
  };

  /* ================= PAYHERE ================= */
  async function handlePayHerePayment() {
    try {
      setLoading(true);

      const res = await fetch(`${BACKEND}/api/payment/payhere/hash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
          currency: "LKR",
        }),
      });

      const data = await res.json();

      if (!data.hash) {
        alert("Payment initialization failed");
        return;
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";

      const fields = {
        merchant_id: data.merchantId,
        return_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-cancel",
        notify_url: `${BACKEND}/api/payment/payhere/notify`,

        order_id: orderId,
        items: "EV Charging Session",
        currency: "LKR",
        amount,

        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone,
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

      {/* HEADER */}
      <div className="relative h-[32vh] rounded-b-[70px] overflow-hidden
                      bg-gradient-to-tr from-teal-900 via-emerald-800 to-teal-700">
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl font-extrabold text-white">
            Secure <span className="text-emerald-300">Payment</span>
          </h1>
          <p className="mt-3 text-emerald-100 text-lg">
            Charging session completed
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

        {/* SUMMARY */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Charging Summary
          </h2>

          <div className="space-y-4">
            <SummaryRow label="Energy Used" value={`${energy.toFixed(3)} kWh`} />
            <SummaryRow label="Rate" value="LKR 85 / kWh" />

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-emerald-600">LKR {amount}</span>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-4">Payment Method</h2>

          <div className="w-full flex items-center justify-between p-4 rounded-2xl border
                          border-emerald-500 bg-[#edffff]">
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-emerald-600 text-xl" />
              <span className="font-medium">Card / PayHere</span>
            </div>
            <div className="flex gap-2 text-2xl text-gray-500">
              <FaCcVisa />
              <FaCcMastercard />
            </div>
          </div>

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
