import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "ahm_session";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days
const DEV_SECRET = "dev-only-secret-change-me";

let warned = false;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (s) return s;
  // Deployed: refuse to sign sessions with a public secret.
  if (process.env.VERCEL) throw new Error("SESSION_SECRET is not set. Add it to the environment variables.");
  // Local (npm run dev / preview): fall back to a dev secret, with a warning.
  if (!warned) {
    console.warn("[session] SESSION_SECRET is not set; using an insecure development secret.");
    warned = true;
  }
  return DEV_SECRET;
}

const b64 = (buf) => Buffer.from(buf).toString("base64url");
const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("base64url");

// Stateless session token: base64url(JSON payload) + "." + HMAC signature.
export function createToken(user) {
  const payload = b64(JSON.stringify({ sub: user.id, name: user.name, username: user.username, exp: Date.now() + MAX_AGE_SECONDS * 1000 }));
  return `${payload}.${sign(payload)}`;
}

export function readToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { id: data.sub, name: data.name, username: data.username };
  } catch {
    return null;
  }
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").map((c) => c.trim().split("=")).filter(([k]) => k).map(([k, ...v]) => [k, decodeURIComponent(v.join("="))])
  );
}

const isHttps = (req) => req.headers["x-forwarded-proto"] === "https" || Boolean(req.socket?.encrypted);

export function sessionUser(req) {
  return readToken(parseCookies(req.headers.cookie)[COOKIE]);
}

export function setSessionCookie(req, res, token) {
  const parts = [`${COOKIE}=${token}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${MAX_AGE_SECONDS}`];
  if (isHttps(req)) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(req, res) {
  const parts = [`${COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (isHttps(req)) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}
