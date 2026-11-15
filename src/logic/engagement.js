import { addDays } from "./dates.js";
import { getStatus } from "./status.js";

// Consecutive days with a check-in. If today has no check-in yet, the streak
// still counts up to yesterday, so it is not "lost" before the day is over.
export function checkInStreak(entries, today) {
  const dates = new Set(entries.map((e) => e.date));
  let day = dates.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (dates.has(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

// Readiness score (0-100): design choice of this app, not a clinical score.
// Each indicator with a value scores normal = 100, attention = 50, critical = 0;
// the score is the average. Indicators without a value are left out.
const POINTS = { normal: 100, attention: 50, critical: 0 };

export function readinessScore(values, indicators) {
  const points = indicators
    .map((ind) => POINTS[getStatus(values[ind.id], ind)])
    .filter((p) => p !== undefined);
  if (!points.length) return null;
  return Math.round(points.reduce((a, b) => a + b, 0) / points.length);
}

export function readinessLevel(score) {
  if (score === null) return "unknown";
  if (score >= 85) return "normal";
  if (score >= 60) return "attention";
  return "critical";
}
