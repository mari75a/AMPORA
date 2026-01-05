import React from "react";

const StationCard = ({ station }) => {
  return (
    <div className="p-4 bg-[#EDFFFF] rounded-xl shadow mb-4 hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{station.name}</h3>
      <p className="text-sm text-gray-500">{station.distance} km away</p>
      <span className={`mt-2 inline-block px-3 py-1 rounded-full text-white 
        ${station.status === "Available" ? "bg-emerald-500" : "bg-orange-500"}`}>
        {station.status}
      </span>
    </div>
  );
};

export default StationCard;
