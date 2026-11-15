import { toLocalISO, addDays } from "./dates.js";

// Turns a measured value into "normal" | "attention" | "critical".
// The high critical cutoff is inclusive (>=): sourced wording for it is typically
// "X or more" (e.g. fever at 38°C or more), unlike the low cutoff, which sourced
// wording phrases as "below X" (exclusive).
export function getStatus(value, ind) {
  if (value === null || value === undefined || Number.isNaN(value)) return "unknown";
  if (value < ind.criticalLow || value >= ind.criticalHigh) return "critical";
  if (value < ind.normalLow || value > ind.normalHigh) return "attention";
  return "normal";
}

// Status is never shown by color alone: each one also has an icon and a label.
export const STATUS_META = {
  normal: { label: "Normal", icon: "✔" },
  attention: { label: "Attention", icon: "!" },
  critical: { label: "Contact flight surgeon", icon: "⚠" },
  unknown: { label: "No data", icon: "–" },
};

// 14 days of plausible demo readings so charts are never empty.
// Deterministic (no randomness) so the demo looks the same every time.
export function makeDemoEntries(indicators, days = 14) {
  const base = { heartRate: 72, systolic: 112, temperature: 36.7, glucose: 88, sleep: 7.2, mood: 4, exercise: 70 };
  const drift = { heartRate: 0.9, systolic: 0.8, temperature: 0.03, glucose: 0.6, sleep: -0.12, mood: -0.12, exercise: 0 };
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const values = {};
    indicators.forEach((ind) => {
      const wobble = Math.sin(i * 1.7 + ind.label.length) * ind.step * 3;
      const v = base[ind.id] + drift[ind.id] * i + wobble;
      values[ind.id] = Math.round(v / ind.step) * ind.step;
    });
    return { date: toLocalISO(d), values };
  });
}

function buildDays(valuesFn, days = 14) {
  const today = toLocalISO();
  return Array.from({ length: days }, (_, i) => ({
    date: addDays(today, i - (days - 1)),
    values: valuesFn(i),
  }));
}

// Deterministic 1-click demo scenarios for judging and the 30s demo video.
// Each builds 14 days of entries (today = day index 13) for all 7 indicators.
export const SCENARIO_IDS = ["normalOrbit", "marsTransitFatigue", "postEvaImmuneStrain"];

export const DEMO_SCENARIOS = {
  normalOrbit: {
    label: "Normal Orbit",
    description: "Every indicator steady within its normal range.",
    build: () => buildDays((i) => ({
      heartRate: 68 + (i % 3),
      systolic: 110 + (i % 4),
      temperature: 36.6 + (i % 2) * 0.1,
      glucose: 85 + (i % 3) * 3,
      sleep: 7.5 + (i % 3) * 0.5,
      mood: 4 + (i % 2),
      exercise: 60 + (i % 3) * 10,
    })),
  },
  marsTransitFatigue: {
    label: "Mars Transit Fatigue",
    description: "Sleep and mood sliding down while heart rate creeps up. Triggers the Behavioral & Fatigue Strain alert.",
    build: () => buildDays((i) => ({
      heartRate: Math.round(68 + i * 2.0),
      systolic: 112 + Math.floor(i / 4),
      temperature: 36.7 + (i % 2) * 0.1,
      glucose: 90 + (i % 3) * 2,
      sleep: Math.round((8.0 - 0.2 * i) / 0.5) * 0.5,
      mood: Math.max(1, 5 - Math.floor(i / 3)),
      exercise: 50 + (i % 3) * 10,
    })),
  },
  postEvaImmuneStrain: {
    label: "Post-EVA & Immune Strain",
    description: "Rising temperature and heart rate with exercise skipped for recovery. Triggers the Immune Watch and Deconditioning Risk alerts.",
    build: () => buildDays((i) => ({
      heartRate: Math.round(72 + i * 2.5),
      systolic: 112 + (i % 3),
      temperature: Math.round((36.7 + i * 0.07) / 0.1) * 0.1,
      glucose: 92 + (i % 3) * 2,
      sleep: 7.0,
      mood: 4,
      exercise: i < 11 ? 70 + (i % 3) * 10 : 10,
    })),
  },
};