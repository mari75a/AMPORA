// TopStationsFromSessionsFetch.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchChargers } from "../api/chargerService";

export default function TopStationsFromSessionsFetch({
  sessions = [],
  topN = 5,
}) {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchChargers();
        if (mounted) setChargers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("failed to fetch chargers", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const data = useMemo(() => {
    const chargerToStation = new Map();
    chargers.forEach((ch) => {
      const cid = ch.chargerId || ch.chargerID || ch.id;
      const stName =
        ch.stationName || ch.stationName || ch.stationId || "Unknown Station";
      if (cid) chargerToStation.set(cid, stName);
    });

    const agg = new Map();
    sessions.forEach((s) => {
      const cid = s.chargerId || s.chargerID || s.charger;
      const stationName = chargerToStation.get(cid) || "Unknown Station";
      const cost = Number(s.cost || s.amount || 0);
      agg.set(stationName, (agg.get(stationName) || 0) + cost);
    });

    const arr = Array.from(agg.entries()).map(([station, revenue]) => ({
      station,
      revenue,
    }));
    arr.sort((a, b) => b.revenue - a.revenue);
    return arr.slice(0, topN);
  }, [sessions, chargers, topN]);

  if (loading)
    return (
      <div className="p-4 text-sm text-gray-500">Loading top stations...</div>
    );
  if (data.length === 0)
    return (
      <div style={{ padding: 12 }}>
        <h3>Top Stations</h3>
        <div className="text-sm text-gray-500">No data to display</div>
      </div>
    );

  return (
    <div style={{ width: "100%", height: 300, padding: 12 }}>
      <h3 style={{ marginBottom: 8 }}>Top Stations</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="station" />
          <YAxis />
          <Tooltip formatter={(value) => `₹ ${value}`} />
          <Bar dataKey="revenue" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
