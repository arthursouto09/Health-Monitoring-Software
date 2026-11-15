import { INDICATORS } from "../src/data/indicators.js";
import { checkValue } from "../src/logic/validate.js";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Accepts { date: "YYYY-MM-DD", values: { <indicator id>: number } }.
// Each value goes through the same rule as the check-in form (src/logic/validate.js).
export function validateEntry(body) {
  const { date, values } = body ?? {};
  if (typeof date !== "string" || !DATE.test(date) || Number.isNaN(Date.parse(date))) return { error: "Invalid date" };
  if (!values || typeof values !== "object" || Array.isArray(values)) return { error: "Missing values" };
  const clean = {};
  for (const [id, v] of Object.entries(values)) {
    const ind = INDICATORS.find((i) => i.id === id);
    if (!ind) return { error: `Unknown indicator: ${id}` };
    if (typeof v !== "number") return { error: `${ind.label}: value must be a number` };
    const { value, error } = checkValue(ind, v);
    if (error) return { error };
    clean[id] = value;
  }
  if (!Object.keys(clean).length) return { error: "Missing values" };
  return { entry: { date, values: clean } };
}
