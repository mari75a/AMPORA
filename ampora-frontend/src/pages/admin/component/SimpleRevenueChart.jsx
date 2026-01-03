import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SimpleRevenueChart({ sessions = [] }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const data = useMemo(() => {
    const totals = Object.fromEntries(days.map((d) => [d, 0]));

    sessions.forEach((s) => {
      if (s == null || s.cost == null) return;

      const raw = s.startTime ?? s.createdAt ?? s.date;
      const date = raw ? new Date(raw) : null;
      if (!date || Number.isNaN(date.getTime())) return;

      const dayIndex = (date.getDay() + 6) % 7;
      const dayName = days[dayIndex];

      const cost = Number(s.cost);
      if (!Number.isFinite(cost)) return;

      totals[dayName] += cost;
    });

    return days.map((day) => ({ day, revenue: totals[day] }));
  }, [sessions]);

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        background: "white",
        padding: 12,
        borderRadius: 12,
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 8 }}>Weekly Revenue</h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4ade80"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
