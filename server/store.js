import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { INDICATORS } from "../src/data/indicators.js";
import { makeDemoEntries } from "../src/logic/status.js";
import { hashPassword } from "./passwords.js";

// Two interchangeable stores with the same methods:
// - Postgres when DATABASE_URL is set (production on Vercel, e.g. Neon)
// - a JSON file in .data/ otherwise (local development, zero setup)

export const DEMO_USERNAME = "astronaut";
export const DEMO_PASSWORD = "mars2026";
// The demo account is created automatically on an empty database, with 14 days
// of demo readings, so judges can sign in. Set DEMO_ACCOUNT=off to disable it.
export const demoEnabled = () => process.env.DEMO_ACCOUNT !== "off";

// ---------- Postgres ----------
function postgresStore(connectionString) {
  const pool = new pg.Pool({ connectionString, max: 3 });
  let ready;
  const init = () => (ready ??= pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS entries (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      readings JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, date)
    );`).catch((err) => { ready = undefined; throw err; }));
  const q = async (sql, params) => { await init(); return pool.query(sql, params); };
  const toUser = (r) => r && { id: r.id, username: r.username, name: r.name, passwordHash: r.password_hash };

  return {
    async countUsers() { return Number((await q("SELECT count(*) FROM users")).rows[0].count); },
    async findUser(username) { return toUser((await q("SELECT * FROM users WHERE username = $1", [username])).rows[0]); },
    async createUser({ username, name, passwordHash }) {
      const r = await q(
        `INSERT INTO users (username, name, password_hash) VALUES ($1, $2, $3)
         ON CONFLICT (username) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash RETURNING *`,
        [username, name, passwordHash]);
      return toUser(r.rows[0]);
    },
    async listEntries(userId) {
      const r = await q("SELECT date, readings FROM entries WHERE user_id = $1 ORDER BY date", [userId]);
      return r.rows.map((row) => ({ date: row.date, values: row.readings }));
    },
    async saveEntry(userId, { date, values }) {
      await q(
        `INSERT INTO entries (user_id, date, readings) VALUES ($1, $2, $3)
         ON CONFLICT (user_id, date) DO UPDATE SET readings = EXCLUDED.readings, updated_at = now()`,
        [userId, date, JSON.stringify(values)]);
    },
  };
}

// ---------- JSON file (local development only) ----------
function fileStore(file) {
  const read = () => {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return { nextId: 1, users: [], entries: {} }; }
  };
  const write = (db) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(db, null, 2));
  };
  return {
    async countUsers() { return read().users.length; },
    async findUser(username) { return read().users.find((u) => u.username === username) ?? null; },
    async createUser({ username, name, passwordHash }) {
      const db = read();
      let user = db.users.find((u) => u.username === username);
      if (user) Object.assign(user, { name, passwordHash });
      else { user = { id: db.nextId++, username, name, passwordHash }; db.users.push(user); }
      write(db);
      return user;
    },
    async listEntries(userId) {
      const byDate = read().entries[userId] ?? {};
      return Object.keys(byDate).sort().map((date) => ({ date, values: byDate[date] }));
    },
    async saveEntry(userId, { date, values }) {
      const db = read();
      (db.entries[userId] ??= {})[date] = values;
      write(db);
    },
  };
}

let store;
let seeded;

function createStore() {
  if (process.env.DATABASE_URL) return postgresStore(process.env.DATABASE_URL);
  if (process.env.VERCEL) throw new Error("DATABASE_URL is not set. Connect a Postgres database in Vercel.");
  return fileStore(path.resolve(process.env.LOCAL_DATA_FILE || ".data/db.json"));
}

async function seedDemo(s) {
  if (!demoEnabled() || (await s.countUsers()) > 0) return;
  const user = await s.createUser({ username: DEMO_USERNAME, name: "Demo astronaut", passwordHash: await hashPassword(DEMO_PASSWORD) });
  for (const entry of makeDemoEntries(INDICATORS)) await s.saveEntry(user.id, entry);
}

export async function getStore() {
  store ??= createStore();
  seeded ??= seedDemo(store).catch((err) => { seeded = undefined; throw err; });
  await seeded;
  return store;
}
