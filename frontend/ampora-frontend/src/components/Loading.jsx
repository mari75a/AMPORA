import React from "react";
import "./loading.css";
import logo from "../assets/logo.png";

export default function Loading() {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <img src={logo} className="loader-logo" alt="logo" />
        <div className="loader-glow" />
      </div>
    </div>
  );
}
