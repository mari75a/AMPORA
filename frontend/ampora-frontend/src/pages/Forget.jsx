import React, { useState } from "react";

export default function ForgetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must contain at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Password Reset Successful");
  };

  return (
    <div className="min-h-screen w-screen flex  flex-row overflow-hidden p-4 justify-center bg-[#EDFEFF] fixed top-0 right-0 left-0">
     
      <div className="w-[500px] bg-white rounded-2xl shadow-xl p-10 text-center">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">Forget Password?</h2>
        <p className="text-gray-600 mb-8">
          Enter your New password below to complete the <br /> reset process
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div className="text-left">
            <label className="font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-[13px] text-gray-500 mt-1">
              password must be contain at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="text-left">
            <label className="font-medium">confirm Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="text-[13px] text-gray-500 mt-1">
              Password must be identical
            </p>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
          >
            Reset Password
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-6">
          <a href="/login" className="text-black underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
