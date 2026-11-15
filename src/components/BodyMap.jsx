import { useState } from "react";
import { INDICATORS } from "../data/indicators.js";
import { getStatus, STATUS_META } from "../logic/status.js";

const RANK = { unknown: 0, normal: 1, attention: 2, critical: 3 };

// Educational text: validate and cite sources before real use.
const REGIONS = [
  { id: "brain", name: "Brain", indicators: ["mood", "sleep"],
    does: "Controls thinking, mood and the sleep cycle.",
    risk: "Isolation, confinement and a disrupted day-night cycle can affect sleep, mood and performance." },
  { id: "heart", name: "Heart and blood vessels", indicators: ["heartRate", "systolic"],
    does: "Pumps blood to the whole body.",
    risk: "In microgravity, fluids shift toward the head and the heart adapts. Radiation is also a long-term cardiovascular concern." },
  { id: "body", name: "Whole body (immune system and metabolism)", indicators: ["temperature", "glucose"],
    does: "Body temperature reflects infection and immune activity. Blood glucose shows how the body handles energy.",
    risk: "The closed environment and radiation can change immune function. Less physical load can reduce insulin sensitivity." },
  { id: "bones", name: "Bones and muscles", indicators: [],
    does: "Support the body and allow movement.",
    risk: "Without the load of gravity, bones lose density and muscles weaken. Daily exercise is the main countermeasure. This version has no bone indicator yet." },
];
const R = Object.fromEntries(REGIONS.map((r) => [r.id, r]));

export default function BodyMap({ values, onSelect }) {
  const [open, setOpen] = useState("heart");

  const linked = (r) => r.indicators.map((id) => INDICATORS.find((i) => i.id === id));
  const statusOf = (r) =>
    linked(r).reduce((worst, ind) => {
      const s = getStatus(values[ind.id], ind);
      return RANK[s] > RANK[worst] ? s : worst;
    }, "unknown");

  // One clickable, keyboard-accessible body part.
  const part = (r, shape) => (
    <g className={`part ${r.indicators.length ? statusOf(r) : "info"} ${open === r.id ? "open" : ""}`}
      role="button" tabIndex={0} aria-label={`${r.name}: ${STATUS_META[statusOf(r)].label}`}
      onClick={() => setOpen(r.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(r.id)}>
      {shape}
    </g>
  );

  const sel = R[open];

  return (
    <section className="panel bodymap" aria-label="Body map">
      <svg viewBox="0 0 200 380" role="group" aria-label="Human body, select a part">
        {part(R.bones, <>
          <rect x="30" y="85" width="22" height="115" rx="11" />
          <rect x="148" y="85" width="22" height="115" rx="11" />
          <rect x="70" y="215" width="26" height="150" rx="13" />
          <rect x="104" y="215" width="26" height="150" rx="13" />
        </>)}
        {part(R.body, <rect x="60" y="78" width="80" height="140" rx="30" />)}
        {part(R.brain, <circle cx="100" cy="42" r="30" />)}
        {part(R.heart, <path d="M112 108c-10-14-30 0-12 20l12 12 12-12c18-20-2-34-12-20z" />)}
      </svg>

      <div>
        <h2>{sel.name}</h2>
        <p><strong>What it does:</strong> {sel.does}</p>
        <p><strong>Risk in space:</strong> {sel.risk}</p>
        {linked(sel).map((ind) => {
          const s = getStatus(values[ind.id], ind);
          return (
            <div key={ind.id} className="linked">
              <span>{ind.label}: <strong>{values[ind.id] ?? "–"} {ind.unit}</strong></span>
              <span className={`badge ${s}`}><span aria-hidden="true">{STATUS_META[s].icon}</span> {STATUS_META[s].label}</span>
              <button type="button" onClick={() => onSelect(ind.id)}>View trend</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}