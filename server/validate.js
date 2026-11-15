import { INDICATORS } from "../src/data/indicators.js";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Accepts { date: "YYYY-MM-DD", values: { <indicator id>: number } }.
// Every value must be a known indicator and inside its input limits.
export function validateEntry(body) {
  const { date, values } = body ?? {};
  if (typeof date !== "string" || !DATE.test(date) || Number.isNaN(Date.parse(date))) return { error: "Invalid date" };
  if (!values || typeof values !== "object" || Array.isArray(values)) return { error: "Missing values" };
  const clean = {};
  for (const [id, v] of Object.entries(values)) {
    const ind = INDICATORS.find((i) => i.id === id);
    if (!ind) return { error: `Unknown indicator: ${id}` };
    if (typeof v !== "number" || !Number.isFinite(v) || v < ind.input.min || v > ind.input.max) {
      return { error: `${ind.label} must be between ${ind.input.min} and ${ind.input.max} ${ind.unit}` };
    }
    clean[id] = v;
  }
  if (!Object.keys(clean).length) return { error: "Missing values" };
  return { entry: { date, values: clean } };
}
