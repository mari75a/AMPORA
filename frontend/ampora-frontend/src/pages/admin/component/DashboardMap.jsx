// DashboardMap.jsx
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { fetchStations } from "../api/stationService";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };

export default function DashboardMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load stations
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStations();

        const formatted = (Array.isArray(data) ? data : []).map((s) => ({
          id: s.stationId,
          name: s.name,
          lat: Number(s.latitude),
          lng: Number(s.longitude),
        }));

        setStations(formatted.filter((s) => s.lat && s.lng));
      } catch (err) {
        console.error("DashboardMap error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading map...
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading stations...
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={
        stations.length > 0
          ? { lat: stations[0].lat, lng: stations[0].lng }
          : DEFAULT_CENTER
      }
      zoom={11}
    >
      {stations.map((s) => (
        <Marker key={s.id} position={{ lat: s.lat, lng: s.lng }} />
      ))}
    </GoogleMap>
  );
}
