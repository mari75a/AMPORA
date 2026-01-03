const BASE_URL =
  import.meta.env.VITE_CHARGERSESSION_API_URL ||
  "http://localhost:8083/api/chargersession";

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

export async function fetchSessions() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function createSession(session) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  return handleResponse(res);
}

export async function updateSession(id, session) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  return handleResponse(res);
}

export async function deleteSession(id) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
