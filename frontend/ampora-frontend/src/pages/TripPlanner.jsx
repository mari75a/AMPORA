import { useState } from "react";

export default function TripPlanner() {
  const [vehicle, setVehicle] = useState("");
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [planned, setPlanned] = useState(false);

  // Mock vehicle data
  const vehicles = [
    { id: 1, name: "Nissan Leaf", range: "270 km" },
    { id: 2, name: "BMW i3", range: "300 km" },
    { id: 3, name: "Tesla Model 3", range: "500 km" },
  ];

  // Mock station recommendations
  const stations = [
    { id: 1, name: "Colombo SuperCharge", distance: "2.5 km", status: "Available" },
    { id: 2, name: "Kandy EV Hub", distance: "4.8 km", status: "In Use" },
    { id: 3, name: "Negombo GreenCharge", distance: "6.2 km", status: "Available" },
  ];

  const handleUseGPS = () => {
    setLocation("📍 GPS Location Detected");
  };

  const handlePlan = () => {
    if (vehicle && location && destination) setPlanned(true);
    else alert("Please fill in all fields before planning your trip!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFEDF3] via-[#ADEED9] to-[#56DFCF] flex flex-col items-center pt-24 pb-10 px-6">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT CARD - INPUT SECTION */}
        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl border border-[#ADEED9] p-8">
          <h2 className="text-3xl font-bold text-[#043D3A] mb-8">
            🧭 Plan Your Trip
          </h2>

          {/* Vehicle Select */}
          <div className="mb-6">
            <label className="block text-[#043D3A]/80 font-semibold mb-2">
              Select Your Vehicle
            </label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full px-4 py-3 border border-[#ADEED9] rounded-xl text-[#043D3A] focus:ring-2 focus:ring-[#0ABAB5]"
            >
              <option value="">-- Choose Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.range})
                </option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div className="mb-6">
            <label className="block text-[#043D3A]/80 font-semibold mb-2">
              Your Current Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location manually..."
                className="flex-1 px-4 py-3 border border-[#ADEED9] rounded-xl text-[#043D3A] focus:ring-2 focus:ring-[#0ABAB5]"
              />
              <button
                onClick={handleUseGPS}
                className="bg-[#0ABAB5] hover:bg-[#56DFCF] text-white px-5 py-3 rounded-xl font-semibold shadow-md"
              >
                📍
              </button>
            </div>
          </div>

          {/* Destination Input */}
          <div className="mb-8">
            <label className="block text-[#043D3A]/80 font-semibold mb-2">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter your destination..."
              className="w-full px-4 py-3 border border-[#ADEED9] rounded-xl text-[#043D3A] focus:ring-2 focus:ring-[#0ABAB5]"
            />
          </div>

          {/* Plan Button */}
          <button
            onClick={handlePlan}
            className="w-full bg-[#0ABAB5] hover:bg-[#56DFCF] text-white text-lg font-semibold py-3 rounded-xl shadow-md transition-transform hover:scale-105"
          >
            🤖 Plan with AI
          </button>

          {/* Recommended Stations */}
          {planned && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-[#043D3A] mb-4">
                🔋 Recommended Charging Stations
              </h3>
              <div className="space-y-4">
                {stations.map((s) => (
                  <div
                    key={s.id}
                    className="bg-[#FFEDF3] border border-[#ADEED9] rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="font-bold text-[#0ABAB5]">{s.name}</h4>
                    <p className="text-sm text-[#043D3A]/70">{s.distance}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                        s.status === "Available"
                          ? "bg-[#56DFCF] text-[#043D3A]"
                          : s.status === "In Use"
                          ? "bg-[#0ABAB5]/70 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MAP SECTION */}
        <div className="lg:col-span-2 bg-[#ADEED9]/60 backdrop-blur-md border border-[#56DFCF] rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
          {!planned ? (
            <p className="text-[#043D3A]/70 text-xl font-medium">
              🗺️ Map preview will appear here after planning your route.
            </p>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#56DFCF]/40 to-[#FFEDF3]/30 rounded-2xl"></div>
              <p className="relative text-[#043D3A]/80 text-2xl font-semibold">
                AI-Optimized Route Loaded ✅
              </p>
              <p className="relative text-[#043D3A]/70 mt-2">
                Showing optimal path with charging stops...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
