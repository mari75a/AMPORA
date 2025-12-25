import React from "react";
import { FiMapPin } from "react-icons/fi";
import { LuLeaf, LuZap } from "react-icons/lu";

const StationCard = ({ station }) => {
  return (
    <div className="w-full bg-white rounded-[28px] shadow-md p-6
                    border border-emerald-200 hover:shadow-xl
                    transition-all cursor-pointer">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {station.name}
          </h2>

          <div className="flex items-center text-gray-500 mt-1 text-sm">
            <FiMapPin size={14} className="mr-1 text-emerald-500" />
            <p className="line-clamp-1">{station.address}</p>
          </div>
        </div>

        {/* Green Energy Badge */}
        <div className="flex items-center gap-1 bg-emerald-100
                        text-emerald-700 px-3 py-1.5 rounded-full
                        text-xs font-semibold whitespace-nowrap">
          <LuLeaf size={16} />
          {station.renewable}% Green
        </div>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-4 gap-3 text-center mt-6">

        <Stat label="Chargers">
          {station.available}/{station.total}
        </Stat>

        <Stat label="Queue">
          {station.queue}
        </Stat>

        <Stat label="Wait">
          0 min
        </Stat>

        <Stat label="Renewable">
          {station.renewable}%
        </Stat>

      </div>

      {/* ================= CTA ================= */}
      <div className="mt-6">
        <button
          className="w-full py-3 rounded-2xl font-semibold
                     bg-emerald-500 text-black
                     hover:bg-emerald-400
                     active:scale-[0.98]
                     transition-all shadow-sm"
        >
          Book Charging Slot
        </button>
      </div>

      {/* ================= CHARGERS ================= */}
      {station.chargers?.length > 0 && (
        <>
          <h4 className="mt-6 mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
            <LuZap className="text-emerald-500" />
            Available Chargers
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {station.chargers.map((charger, index) => (
              <div
                key={index}
                className="rounded-2xl border border-emerald-200
                           p-4 bg-[#edffff]
                           hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {charger.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {charger.power} kW
                    </p>
                  </div>

                  <span className="bg-white border px-3 py-1 rounded-full text-xs font-medium">
                    ${charger.price}/kWh
                  </span>
                </div>

                {/* Load Bar */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${charger.load}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Load {charger.load}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ================= STAT SUB COMPONENT ================= */
function Stat({ label, children }) {
  return (
    <div className="bg-[#edffff] rounded-xl py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-emerald-600">
        {children}
      </p>
    </div>
  );
}

export default StationCard;
