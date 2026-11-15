// Small client for the backend in api/. The session lives in an HttpOnly cookie,
// so the browser sends it automatically and JavaScript never sees the token.

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data);
  return data;
}

export const api = {
  me: () => request("/api/me"),
  login: (username, password) => request("/api/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request("/api/logout", { method: "POST" }),
  entries: () => request("/api/entries").then((d) => d.entries),
  saveEntry: (entry) => request("/api/entries", { method: "PUT", body: JSON.stringify(entry) }).then((d) => d.entry),
};
