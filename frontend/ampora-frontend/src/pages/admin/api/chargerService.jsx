const BASE_URL =
  import.meta.env.VITE_CHARGER_API_URL || "http://localhost:8083/api/charger";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}

export async function fetchChargers() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function createCharger(charger) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(charger),
  });
  return handleResponse(res);
}

export async function updateCharger(id, charger) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(charger),
  });
  return handleResponse(res);
}

export async function deleteCharger(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
