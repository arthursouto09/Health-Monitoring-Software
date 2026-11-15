import { NASA_HAZARDS, INDICATOR_NASA_META } from "../data/hazards.js";

// Discreet NASA HRP hazard + countermeasure line for one indicator.
export default function HazardTag({ indicatorId }) {
  const meta = INDICATOR_NASA_META[indicatorId];
  if (!meta) return null;
  const hazards = meta.hazardIds.map((id) => NASA_HAZARDS[id]).filter(Boolean);

  return (
    <p className="hazard-tag">
      <span className="hazard-tag__category">{meta.riskCategory}</span>
      {hazards.map((h) => (
        <a key={h.id} className="hazard-tag__hazard" href={h.url} target="_blank" rel="noreferrer">{h.name}</a>
      ))}
      <span className="hazard-tag__countermeasure">Countermeasure: {meta.countermeasure}</span>
    </p>
  );
}
