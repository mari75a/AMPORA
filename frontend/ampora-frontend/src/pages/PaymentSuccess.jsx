import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const EV_GREEN = "#00d491";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read order_id from query params
  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");

  return (
    <div className="min-h-screen bg-teal-100 flex items-center justify-center px-4">
      <div
        className="max-w-lg w-full bg-white rounded-[32px] p-10 text-center
                   shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
      >
        {/* Icon */}
        <div
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: EV_GREEN }}
        >
          <FiCheckCircle className="text-black text-4xl" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900">
          Payment Successful 🎉
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-600">
          Your EV charging payment has been completed successfully.
        </p>

        {/* Order Info */}
        <div className="mt-6 bg-[#edffff] rounded-2xl p-4">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-semibold text-gray-900 break-all">
            {orderId || "N/A"}
          </p>
        </div>

        {/* Info */}
        <p className="mt-6 text-sm text-gray-500 leading-relaxed">
          A confirmation has been sent to your account.
          You can now proceed to view your bookings or plan another trip.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => navigate("/bookings")}
            className="w-full py-3 rounded-2xl font-semibold text-black
                       transition-all shadow-lg hover:scale-[1.02]"
            style={{ background: EV_GREEN }}
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/trip")}
            className="w-full py-3 rounded-2xl font-semibold
                       border border-gray-300 hover:bg-gray-100"
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    </div>
  );
}
