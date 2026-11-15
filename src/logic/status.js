import { toLocalISO } from "./dates.js";

// Turns a measured value into "normal" | "attention" | "critical".
export function getStatus(value, ind) {
  if (value === null || value === undefined || Number.isNaN(value)) return "unknown";
  if (value < ind.criticalLow || value > ind.criticalHigh) return "critical";
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
  const base = { heartRate: 72, systolic: 112, temperature: 36.7, sleep: 7.2, mood: 4 };
  const drift = { heartRate: 0.9, systolic: 0.8, temperature: 0.03, sleep: -0.12, mood: -0.12 };
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