import React from "react";

export default function Maintenance() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-100 p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Maintenance</h1>
        <p className="text-gray-500">
          Monitor and manage charging station health
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 w-full">
        {[
          { label: "Needs Attention", value: 2 },
          { label: "Healthy Stations", value: 3 },
          { label: "Offline Stations", value: 2 },
          { label: "Total Stations", value: 5 },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-5"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>
            <h2 className="text-2xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Station Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Charging Station Status
          </h2>

          {[
            { name: "Station 1", id: "CH-100", status: "Offline", color: "text-red-500" },
            { name: "Station 2", id: "CH-101", status: "Good", color: "text-green-500" },
            { name: "Station 3", id: "CH-102", status: "Warning", color: "text-orange-500" },
            { name: "Station 4", id: "CH-103", status: "Good", color: "text-green-500" },
          ].map((station, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 mb-3 rounded-lg bg-gray-50"
            >
              <div>
                <p className="font-medium">{station.name}</p>
                <p className="text-sm text-gray-500">ID: {station.id}</p>
              </div>
              <span className={`font-semibold ${station.color}`}>
                {station.status}
              </span>
            </div>
          ))}
        </div>

        {/* Maintenance Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">
            Maintenance Panel
          </h2>
          <p className="text-gray-500 mb-4">
            Select a station to edit health status or report breakage.
          </p>

          <div className="border-2 border-dashed rounded-lg p-10 text-center text-gray-400">
            No station selected
          </div>
        </div>

      </div>
    </div>
  );
}
