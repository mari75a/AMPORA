// src/utils/tripUtils.js

/* ================= HAVERSINE DISTANCE ================= */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ================= ROUTE DISTANCE ================= */
export function routeDistanceKm(route) {
  return route.legs.reduce(
    (sum, leg) => sum + leg.distance.value / 1000,
    0
  );
}

/* ================= SORT STATIONS ALONG ROUTE ================= */
export function sortStationsByRouteProgress(stations) {
  return [...stations].sort(
    (a, b) => a.distanceToRouteKm - b.distanceToRouteKm
  );
}
