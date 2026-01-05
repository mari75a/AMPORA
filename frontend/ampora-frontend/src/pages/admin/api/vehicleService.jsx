const BASE_URL =
  import.meta.env.VITE_VEHICLE_API_URL || "http://localhost:8083/api/vehicles";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;

  return res.json();
}

export async function fetchVehicles() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function createVehicle(vehicle) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  return handleResponse(res);
}

export async function updateVehicle(id, vehicle) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  return handleResponse(res);
}

export async function deleteVehicleApi(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
