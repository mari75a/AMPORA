/* global google */
import React from "react";
import { Marker } from "@react-google-maps/api";
import elec from "../assets/bolt4.png";

export default function PulsingMarker({ position, onClick }) {
  return (
    <>
      {/* Actual marker icon */}
      <Marker
        position={position}
        onClick={onClick}
        icon={{
          url: elec,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        }}
      />

      {/* Pulsing glow */}
      <div
        className="pulse-marker"
        style={{
          position: "absolute",
          left: `${position.lng}px`,
          top: `${position.lat}px`,
        }}
      >
        <div className="pulse-ring"></div>
        <img src={elec} width={32} height={32} className="pulse-icon" />
      </div>
    </>
  );
}
