import { sessionUser } from "./session.js";

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

const MAX_BODY_BYTES = 32 * 1024;

// Vercel already parses JSON bodies into req.body; the local dev server does not.
export async function readJson(req) {
  if (req.body !== undefined) {
    if (typeof req.body === "string") return req.body ? JSON.parse(req.body) : {};
    return req.body ?? {};
  }
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY_BYTES) throw Object.assign(new Error("Body too large"), { status: 413 });
  }
  return raw ? JSON.parse(raw) : {};
}

// Wraps a handler: method check, JSON errors and a generic 500.
export function handler(methods) {
  return async (req, res) => {
    const fn = methods[req.method];
    if (!fn) {
      res.setHeader("Allow", Object.keys(methods).join(", "));
      return send(res, 405, { error: "Method not allowed" });
    }
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof SyntaxError) return send(res, 400, { error: "Invalid JSON" });
      if (err.status) return send(res, err.status, { error: err.message });
      console.error(err);
      send(res, 500, { error: "Server error" });
    }
  };
}

export function requireUser(req, res) {
  const user = sessionUser(req);
  if (!user) send(res, 401, { error: "Not signed in" });
  return user;
}
