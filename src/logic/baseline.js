// Personal baseline: how this astronaut's own recent readings usually look.
// Population ranges (indicators.js) say whether a value is healthy in general;
// the baseline says whether it is unusual *for this person*.
//
// Design choices of this app (validate with medical professionals):
// - window: readings from the 14 days before the reading being checked
// - at least 5 readings are needed before a baseline is shown
// - "unusual" = more than 2 standard deviations away from the personal mean

export const BASELINE = { windowDays: 14, minReadings: 5, sdLimit: 2 };

export function personalBaseline(entries, ind, beforeDate) {
  const values = entries
    .filter((e) => e.date < beforeDate)
    .slice(-BASELINE.windowDays)
    .map((e) => e.values[ind.id])
    .filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (values.length < BASELINE.minReadings) return null;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / (values.length - 1);
  // Floor the spread at one input step, so very stable data does not flag tiny changes.
  const sd = Math.max(Math.sqrt(variance), ind.step);
  return { mean, sd, n: values.length };
}

// Returns null when there is no baseline or no value to compare.
export function compareToBaseline(value, baseline) {
  if (!baseline || typeof value !== "number" || Number.isNaN(value)) return null;
  const diff = value - baseline.mean;
  return { diff, z: diff / baseline.sd, unusual: Math.abs(diff) > BASELINE.sdLimit * baseline.sd };
}

// Rounds to the indicator's precision for display.
export function fmt(value, ind) {
  const decimals = ind.step < 1 ? String(ind.step).split(".")[1].length : 0;
  return value.toFixed(decimals);
}
