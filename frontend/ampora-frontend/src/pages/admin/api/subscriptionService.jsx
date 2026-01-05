const BASE_URL =
  import.meta.env.VITE_SUBSCRIPTION_API_URL ||
  "http://localhost:8083/api/subscription";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  if (res.status == 204) return null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
}

export async function fetchSubscription() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function createSubscription(subscription) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  return handleResponse(res);
}

export async function updateSubscription(id, subscription) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  return handleResponse(res);
}

export async function deleteSubscription(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
