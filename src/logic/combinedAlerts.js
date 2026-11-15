import { personalBaseline } from "./baseline.js";

// Looks for combinations of stressors that are each individually mild but, together,
// point at a known spaceflight risk pattern. Wherever possible, a condition is tied to
// either (a) a z-score against this person's own baseline (see logic/baseline.js: mean
// and standard deviation from their last 14 readings) instead of an arbitrary
// percentage, or (b) the indicator's own sourced normal range from data/indicators.js,
// instead of a second, separately invented number. The few remaining fixed numbers (the
// 6.5h sleep floor, the mood scale) are an explicit design choice of this app for a
// 1-day snapshot, not a cited clinical rule — validate before real use.
function zScore(value, baseline) {
  return baseline ? (value - baseline.mean) / baseline.sd : null;
}

export function getCombinedAlerts(entries, indicators) {
  const latest = entries[entries.length - 1];
  if (!latest) return [];
  const beforeDate = latest.date;
  const v = latest.values;
  const find = (id) => indicators.find((i) => i.id === id);
  const num = (x) => (typeof x === "number" && !Number.isNaN(x) ? x : null);
  const alerts = [];

  const sleepInd = find("sleep");
  const moodInd = find("mood");
  const hrInd = find("heartRate");
  const tempInd = find("temperature");
  const exerciseInd = find("exercise");

  // 1. Behavioral & Fatigue Strain: sleep statistically low for this person (z <= -1
  // against their own baseline), or below a fixed floor when there isn't yet enough
  // history for one, alongside a low mood or a heart rate statistically high (z >= 1).
  if (sleepInd && (moodInd || hrInd)) {
    const sleepValue = num(v.sleep);
    const sleepZ = sleepValue !== null ? zScore(sleepValue, personalBaseline(entries, sleepInd, beforeDate)) : null;
    const sleepLow = sleepValue !== null && ((sleepZ !== null && sleepZ <= -1) || sleepValue < 6.5);

    const moodValue = moodInd ? num(v.mood) : null;
    const moodLow = moodValue !== null && moodValue <= 3;

    const hrValue = hrInd ? num(v.heartRate) : null;
    const hrZ = hrValue !== null ? zScore(hrValue, personalBaseline(entries, hrInd, beforeDate)) : null;
    const hrUp = hrZ !== null && hrZ >= 1;

    if (sleepLow && (moodLow || hrUp)) {
      alerts.push({
        id: "fatigue-strain",
        message: "Combined fatigue pattern: reduced sleep alongside mood/cardiovascular strain.",
        action: "Prioritize sleep schedule recovery, reduce non-critical workload, and schedule a crew/ground check-in.",
        indicatorIds: ["sleep", ...(moodLow ? ["mood"] : []), ...(hrUp ? ["heartRate"] : [])],
      });
    }
  }

  // 2. Closed-Env Immune Watch: temperature or heart rate already outside their own
  // sourced normal range (data/indicators.js), happening together.
  if (tempInd && (sleepInd || hrInd)) {
    const tempValue = num(v.temperature);
    const tempHigh = tempValue !== null && tempValue > tempInd.normalHigh;

    const sleepValue = sleepInd ? num(v.sleep) : null;
    const sleepLow = sleepValue !== null && sleepValue < 6.5;

    const hrValue = hrInd ? num(v.heartRate) : null;
    const hrHigh = hrValue !== null && hrInd && hrValue > hrInd.normalHigh;

    if (tempHigh && (sleepLow || hrHigh)) {
      alerts.push({
        id: "immune-watch",
        message: "Possible immune/infection stress in a closed habitat.",
        action: "Monitor temperature every 4 hours, hydrate, limit close crew contact, and prepare a flight surgeon packet.",
        indicatorIds: ["temperature", ...(sleepLow ? ["sleep"] : []), ...(hrHigh ? ["heartRate"] : [])],
      });
    }
  }

  // 3. Musculoskeletal Deconditioning Risk: average exercise minutes over the last 3
  // recorded days below the indicator's own daily target (data/indicators.js).
  if (exerciseInd && entries.length >= 3) {
    const recent = entries.slice(-3).map((e) => num(e.values.exercise)).filter((x) => x !== null);
    if (recent.length > 0) {
      const avg = recent.reduce((sum, x) => sum + x, 0) / recent.length;
      if (avg < exerciseInd.normalLow) {
        alerts.push({
          id: "deconditioning-risk",
          message: "Bone & muscle countermeasure deficit over the last 3 days.",
          action: "Schedule a resistance exercise session (ARED protocol equivalent) to protect bone density.",
          indicatorIds: ["exercise"],
        });
      }
    }
  }

  return alerts;
}
