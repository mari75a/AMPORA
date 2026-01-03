import React from "react";

const MultiStopInput = ({ stops, setStops }) => {
  const updateStop = (id, value) => {
    setStops(
      stops.map((stop) =>
        stop.id === id ? { ...stop, location: value } : stop
      )
    );
  };

  const addStop = () => {
    setStops([...stops, { id: Date.now(), location: "" }]);
  };

  return (
    <div className="flex flex-col gap-4">
      {stops.map((stop, index) => (
        <input
          key={stop.id}
          type="text"
          placeholder={index === 0 ? "Starting Point" : index === stops.length - 1 ? "Destination" : "Stop"}
          value={stop.location}
          onChange={(e) => updateStop(stop.id, e.target.value)}
          className="w-full h-[50px] rounded-xl border-2 px-4 border-emerald-400"
        />
      ))}

      <button
        className="bg-emerald-500 text-white px-4 py-2 rounded-xl w-40"
        onClick={addStop}
      >
        + Add Stop
      </button>
    </div>
  );
};

export default MultiStopInput;
