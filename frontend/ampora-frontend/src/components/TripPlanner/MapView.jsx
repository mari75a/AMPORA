import React from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const center = {
  lat: 6.9271,   // Colombo
  lng: 79.8612,
};

export default function MapView() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD_H771Wgvooihry65Tgl9WTa8UivUmScU",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="w-full h-[500px]">
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
