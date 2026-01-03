export function isLoggedIn() {
  const token = localStorage.getItem("token");
  return token != null && token.trim() !== "";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
}

// Optional: decode JWT payload
export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload)).userId;
  } catch {
    return null;
  }
}