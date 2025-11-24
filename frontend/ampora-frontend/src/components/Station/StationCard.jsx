import React from "react";
import { FiMapPin } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";

const StationCard = ({ station }) => {
  return (
    <div className="w-full bg-white rounded-3xl shadow-md p-6 border border-emerald-200 hover:shadow-xl transition-all cursor-pointer">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-black">{station.name}</h2>

          <div className="flex items-center text-gray-500 mt-1">
            <FiMapPin size={16} className="mr-1 text-emerald-500" />
            <p>{station.address}</p>
          </div>
        </div>

        {/* GREEN ENERGY BADGE */}
        <div className="flex items-center bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold">
          <LuLeaf size={18} className="mr-1" />
          {station.renewable}% Green Energy
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 text-center mt-6">
        <div>
          <p className="text-gray-600 text-sm">Chargers</p>
          <p className="text-emerald-600 text-lg font-bold">
            {station.available}/{station.total}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Queue Length</p>
          <p className="text-emerald-600 text-lg font-bold">{station.queue}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Est. Wait Time</p>
          <p className="text-emerald-600 text-lg font-bold">0 min</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Renewable %</p>
          <p className="text-emerald-600 text-lg font-bold">{station.renewable}%</p>
        </div>
      </div>

      {/* CHARGERS LIST */}
      <div className="w-12/12 flex justify-center items-center mt-5">
        <button className="p-2 w-6/12 border-2 border-b-emerald-500 bg-white ">Book now</button>
      </div>


      <div className="grid grid-cols-2 gap-4">
        {station.chargers?.map((charger, index) => (
          <div
            key={index}
            className="border border-emerald-200 rounded-2xl p-4 hover:shadow-md transition-all"
          >
            {/* Charger Info */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-black">{charger.type}</p>
                <p className="text-gray-500 text-sm">{charger.power}Kw</p>
              </div>

              {/* PRICE TAG */}
              <div className="bg-emerald-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                ${charger.price}/kWh
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-emerald-100 rounded-full mt-3">
              <div
                className="h-3 bg-emerald-500 rounded-full"
                style={{ width: `${charger.load}%` }} // fake load %
              ></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StationCard;
