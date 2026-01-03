const BASE_URL =
  import.meta.env.VITE_BOOKING_API_URL || "http://localhost:8083/api/bookings";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Requst failed with status ${res.status}`);
  }

  if (res.status == 204) return null;

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}

export async function fetchBokking() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function createBooking(booking) {
  alert(booking);
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  return handleResponse(res);
}

export async function updateBooking(id, Booking) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Booking),
  });
  return handleResponse(res);
}

export async function deleteCharger(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
