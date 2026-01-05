


import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import Loginimg from "../assets/Loginimg.png";

const BACKEND = "http://localhost:8083";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= EMAIL LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user_id);
      if(data.role == "ADMIN"){
        window.location.href = "/admin";
      }else if(data.role == "OPERATOR"){
        window.location.href = "/operator";
      }else if(data.role == "USER"){
        window.location.href = "/user-dashboard";
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async (cred) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: cred.credential }),
      });

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user_id);

      window.location.href = "/user-dashboard";
    } catch (err) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white flex items-center justify-center px-4">

      <div className="w-full h-[80vh]  max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ================= LEFT IMAGE ================= */}
        <div className="hidden h-[80vh] md:block relative">
          <img
            src={Loginimg}
            alt="Ampora Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-700/60 to-teal-500/40" />
          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-3xl font-extrabold">AMPORA</h2>
            <p className="opacity-90 mt-2">
              Powering the future of EV charging
            </p>
          </div>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="p-10 md:p-12 flex flex-col justify-center">

          <h1 className="text-3xl font-extrabold text-emerald-700">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to continue your EV journey
          </p>

          {/* ERROR */}
          {error && (
            <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ================= GOOGLE ================= */}
          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed")}
              width="100%"
            />
          </div>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* ================= EMAIL FORM ================= */}
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email address"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forget" className="text-emerald-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* ================= SIGN UP ================= */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
