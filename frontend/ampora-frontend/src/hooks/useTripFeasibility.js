// src/hooks/useTripFeasibility.js
import { useEffect, useState } from "react";
import { sortStationsByRouteProgress } from "../utils/tripUtils";

export default function useTripFeasibility({
  selectedVehicle,
  batteryPercent,
  routeKm,
  stations,
}) {
  const [feasible, setFeasible] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!selectedVehicle || !routeKm) {
      setFeasible(null);
      setReason("");
      return;
    }

    const maxRangeKm =
      (selectedVehicle.rangeKm * batteryPercent) / 100;

    // Can complete without charging
    if (maxRangeKm >= routeKm) {
      setFeasible(true);
      setReason("Trip possible without charging.");
      return;
    }

    // Charging logic
    let remainingRange = maxRangeKm;
    let distanceCovered = 0;

    const sortedStations = sortStationsByRouteProgress(stations);

    for (let st of sortedStations) {
      const gap = st.distanceFromStartKm - distanceCovered;

      if (gap > remainingRange) {
        setFeasible(false);
        setReason(
          "Battery will deplete before reaching next charging station."
        );
        return;
      }

      // Reach station → recharge to full
      distanceCovered += gap;
      remainingRange = selectedVehicle.rangeKm;
    }

    // Final leg
    if (remainingRange >= routeKm - distanceCovered) {
      setFeasible(true);
      setReason(
        "Trip possible with charging stops along the route."
      );
    } else {
      setFeasible(false);
      setReason("Final segment unreachable even with charging.");
    }
  }, [selectedVehicle, batteryPercent, routeKm, stations]);

  return { feasible, reason };
}
