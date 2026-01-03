// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiCalendar, FiCreditCard, FiZap, FiLogOut } from "react-icons/fi";
import { LuCar } from "react-icons/lu";
import { motion } from "framer-motion";
const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

export default function UserProfile() {
  const [user, setUser] = useState({
    fullName: "Sangeeth Lakshan",
    email: "sangeethlakshan0@gmail.com",
    phone: "0779693100",
    address: "36, Badulla Road, Bibile",
  });

  React.useEffect(() => {
    fetchUserData();
  }, []);

  function logoutFunction(){
    localStorage.removeItem("token");
    window.location.href="/";
  }

  async function updateFunction(){
    const updatedUser = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
    const resp=await fetch("http://localhost:8083/api/users/32389639-de6e-464a-afc9-d18060391373",{
      method : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });
    if(resp.ok){
     
      alert("User updated successfully");
    }else{
      console.error("Failed to update user");
    }
  }
  async function fetchUserData() {
    const useresponse = await fetch("http://localhost:8083/api/users/32389639-de6e-464a-afc9-d18060391373", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
       
      },
    });
    const userData = await useresponse.json();
    setUser(userData);
  }

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
   const quickActions = [
      { title: "User Details", icon: <FiUser />, to: "/profile" },
      { title: "Vehicle Details", icon: <LuCar />, to: "/vehicles" }, // ✅ FIXED
      { title: "Bookings", icon: <FiCalendar />, to: "/bookings" },
      { title: "View Plans & Subscription", icon: <FiCreditCard />, to: "/payments" },
      { title: "Charging History", icon: <FiZap />, to: "/history" },
      { title: "Logout", icon: <FiLogOut />, onClick: logoutFunction , to: "/" },
    ];

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b mt-20 from-emerald-50 via-teal-50 to-white text-gray-900">
      <div className="mx-auto w-11/12 max-w-6xl py-8 space-y-8">
     
        {/* Row 1: Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {quickActions.map((a, idx) => (
            <a
              key={idx}
              href={a.to}
              className={`${glass} rounded-2xl p-4 hover:shadow-xl transition group`}
            >
              <div className="flex items-center gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 text-lg group-hover:scale-105 transition">
                  {a.icon}
                </div>
                <div className="font-semibold text-sm text-emerald-900">
                  {a.title}
                </div>
              </div>
            </a>
          ))}
        </motion.div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">User Profile</h1>
          
          <button

            onClick={() => {
              if(editing){
                updateFunction();

                setEditing(!editing);
              }else{
                setEditing(!editing);
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <FiEdit2 /> {editing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className={`${glass} rounded-2xl p-6 lg:col-span-2`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <LabelInput
                icon={<FiUser className="text-emerald-600" />}
                label="Full Name"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                editable={editing}
              />
              <LabelInput
                icon={<FiMail className="text-emerald-600" />}
                label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                editable={editing}
              />
              <LabelInput
                icon={<FiPhone className="text-emerald-600" />}
                label="Phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                editable={editing}
              />
              <LabelInput
                icon={<FiMapPin className="text-emerald-600" />}
                label="Address"
                name="address"
                value={user.address}
                onChange={handleChange}
                editable={editing}
              />
            </div>
          </div>

          
          <div className="space-y-4">
            <StatCard title="Total Charges" value="42 Sessions" />
            <StatCard title="This Month Spend" value="LKR 18,450" />
            <StatCard title="Energy Used (30d)" value="212.4 kWh" />
          </div>
        </div>

        
      </div>
    </div>
  );
}

function LabelInput({ icon, label, name, value, onChange, editable }) {
  return (
    <div>
      <label className="text-sm font-semibold text-emerald-900/80">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        {icon}
        {editable ? (
          <input
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 bg-white/80 text-black"
          />
        ) : (
          <div className="w-full px-3 py-2 rounded-xl bg-white/70 border border-emerald-100">{value}</div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  const glass = "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow";
  return (
    <div className={`${glass} rounded-2xl p-4`}>
      <div className="text-sm text-emerald-900/70">{title}</div>
      <div className="text-2xl font-extrabold text-emerald-700">{value}</div>
    </div>
  );
}
