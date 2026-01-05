import React from "react";

const RouteSummary = ({ data, energy }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-emerald-600">Trip Summary</h2>

      <p className="mt-2 text-gray-700">
        Total Distance: <strong>{data.totalDistanceKm} km</strong>
      </p>

      <p className="mt-1 text-gray-700">
        Estimated Battery Usage:{" "}
        <strong>{energy.requiredKwh.toFixed(1)} kWh</strong>
      </p>

      <p className="mt-1 text-gray-700">
        Battery Percentage Required:{" "}
        <strong>{energy.percentage.toFixed(0)}%</strong>
      </p>

      <p className="mt-1 text-gray-700">
        Total Stops: <strong>{data.totalStops}</strong>
      </p>
    </div>
  );
};

export default RouteSummary;
