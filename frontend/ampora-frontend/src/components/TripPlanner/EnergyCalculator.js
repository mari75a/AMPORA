export default function calculateEnergy(distanceKm, kwhPerKm = 0.18) {
  const requiredKwh = distanceKm * kwhPerKm;

  return {
    distanceKm,
    requiredKwh,
    percentage: (requiredKwh / 60) * 100, // assuming 60kWh battery
  };
}
