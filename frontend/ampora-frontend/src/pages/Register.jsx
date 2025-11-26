
import React, { useState } from "react";
import Reg from "../assets/Reg.jpg"; 

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-screen flex  flex-row overflow-hidden p-4 justify-center bg-[#EDFEFF] fixed top-0 right-0 left-0">
     
     <div className="bg-[#EDFEFF] w-[900px] h-[700px] flex flex-row  shadow-xl/30 overflow-hidden">
      {/* =============Image============= */}
      <div className="w-1/2 h-full ">
        <img
          src={Reg}
          alt="Signup Visual"
          className=" w-full h-full object-cover"
        />
      </div>

      {/* =================Form===================== */}
      <div className="w-1/2 flex  pl-13 items-center rounded-3xl bg-white">
        <form className="w-[400px]  h-full  p-4 pl-10">
          
          <h2 className="font-inter font-bold text-[36px] text-[#000000]  mb-6">Sign up</h2>

          <input
              type="text"
              placeholder="First name"
              className="w-[300px] h-[45px] border border-gray-500 rounded-2xl p-2 mb-5 focus:outline-none"
          />

          <input
              type="text"
              placeholder="Last name"
              className="w-[300px]  h-[45px] border border-gray-500 rounded-2xl p-2 mb-5 focus:outline-none"
          />

          <input
              type="text"
              placeholder="Phone no"
              className="w-[300px]  h-[45px] border border-gray-500 rounded-2xl p-2 mb-5 focus:outline-none"
          />
          
          <input
            type="email"
            placeholder="Enter your email"
            className="w-[300px]   h-[45px] border border-gray-500 rounded-2xl p-2 mb-5 focus:outline-none"
          />

          
          
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-[300px]  h-[45px] border border-gray-500 rounded-2xl p-2 mb-3 focus:outline-none"
          />

          <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-[300px]  h-[45px] border border-gray-500 rounded-2xl p-2 mb-2 focus:outline-none"
          />

          
          <div className="font-inter font-regular text-black flex items-center gap-2 mb-8">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label>Show password</label>
          </div>
          
          <a className="w-[300px] flex items-center justify-center  p-3  bg-[#0ABAB5] hover:bg-[#56DFCF] rounded-lg  shadow-md" href="">
            
            <span className=" text-white font-bold">Sing Up</span>
          </a>
          
     
          <div className="flex items-center mb-8 w-[200px]  ml-12 ">
            <hr className="flex-grow border-black" />
            <span className="mx-3 text-black">or</span>
            <hr className="flex-grow border-black" />
          </div>

          {/* Google Button */}
          <a className="w-[300px]   flex items-center justify-center gap-2 p-3  bg-black hover:bg-[#505252]  rounded-full shadow-md" href="">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-4"
              alt="Google"
            />
            <span className=" text-white font-bold">Continue With Google</span>
          </a>
          </form>
        </div>
        </div>
     </div>
  );
}
