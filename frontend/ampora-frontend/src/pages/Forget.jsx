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
     
      <div className="w-[500px]  bg-gray-100 rounded-2xl shadow-xl/30 p-10 text-center ">
        <div className=" p-8">
        <h2 className="text-2xl font-bold text-black mb-2 ">Forget Password?</h2>
        <p className="text-gray-600 mb-4 font-medium">
          Enter your New password below to complete the reset process
        </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 ">
          {/* Password */}
          <div className="text-left">
            <label className="font-medium text-black">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-[13px] font-regular text-gray-700 mt-1">
              password must be contain at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="text-left">
            <label className="font-medium text-black">confirm Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="text-[13px] font-regular text-gray-700 mt-1">
              Password must be identical
            </p>
          </div>

           <a className="w-[300px] flex items-center justify-center  p-3 ml-15 bg-[#0ABAB5] hover:bg-[#56DFCF] rounded-lg  shadow-md" href="">
            
            <span className=" text-white font-bold">Reset Password</span>
          </a>
          
        

        {/* Back to login */}
        
          <a href="/login">
            <p className="text-black underline p-1 ">Back to Login</p>
          </a>
        </form>
      </div>
    </div>
  );
}
