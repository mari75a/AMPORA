export default function ChargingStatusBadge({ charging }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        charging
          ? "bg-emerald-100 text-emerald-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {charging ? "Charging" : "Idle"}
    </span>
  );
}
