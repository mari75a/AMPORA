import React, { useState } from "react";

export default function TripPlanner() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const palette = {
    vibrant: "#00FF9A",
    dark: "#159E5C",
  };

  const handlePlanTrip = () => {
    if (!start || !destination) return alert("Please fill both fields!");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("AI Powered Trip Optimization Complete!");
    }, 1200);
  };

  return (
    <div className="bg-gray-50 w-screen min-h-screen pb-20">
      {/* Header */}
      <div className="text-center pt-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Plan Your Smart EV Trip
        </h1>
        <p className="mt-2 text-gray-600">
          AI-powered route optimization with charging station predictions
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto mt-12 bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Trip Details</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Location */}
          <div>
            <label className="text-gray-700 font-medium">Start Location</label>
            <input
              type="text"
              placeholder="Enter starting point"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: palette.vibrant }}
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-gray-700 font-medium">Destination</label>
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: palette.vibrant }}
            />
          </div>
        </div>

        {/* Plan Button */}
        <button
          onClick={handlePlanTrip}
          className="w-full mt-8 py-4 rounded-xl text-white font-semibold text-lg shadow-md hover:opacity-90 transition"
          style={{ background: palette.dark }}
        >
          {loading ? "Optimizing..." : "Plan My Trip"}
        </button>
      </div>

      {/* Section Title */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-800">Route Preview</h2>
        <p className="text-gray-600 mt-1">
          Map preview and AI recommendations appear here
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="w-full h-64 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
          Map will render here (Google Maps)
        </div>
      </div>

      {/* Recommended Stops */}
      <div className="max-w-5xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recommended Charging Stations
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-5 border">
            <h3 className="text-lg font-bold">Station A</h3>
            <p className="text-gray-600">Fast Charging • 5 km from route</p>
            <p className="text-green-600 mt-2 font-semibold">Slot Available</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-5 border">
            <h3 className="text-lg font-bold">Station B</h3>
            <p className="text-gray-600">Ultra-Fast • 12 km from route</p>
            <p className="text-red-500 mt-2 font-semibold">Queue: 4 Vehicles</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-5 border">
            <h3 className="text-lg font-bold">Station C</h3>
            <p className="text-gray-600">Fast Charging • 8 km from route</p>
            <p className="text-yellow-500 mt-2 font-semibold">Limited Slots</p>
          </div>
        </div>
      </div>
    </div>
  );
}
