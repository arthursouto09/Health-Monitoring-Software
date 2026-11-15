import { useState } from "react";
import { INDICATORS } from "../data/indicators.js";
import { getStatus, STATUS_META } from "../logic/status.js";
import HazardTag from "./HazardTag.jsx";

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
  { id: "bones", name: "Bones and muscles", indicators: ["exercise"],
    does: "Support the body and allow movement.",
    risk: "Without the load of gravity, bones lose density and muscles weaken. Daily resistance exercise is the main countermeasure." },
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
      <svg viewBox="0 0 200 390" role="group" aria-label="Human body, select a part">
        {part(R.bones, <>
          <rect x="30" y="82" width="22" height="118" rx="11" transform="rotate(7 41 82)" />
          <rect x="148" y="82" width="22" height="118" rx="11" transform="rotate(-7 159 82)" />
          <rect x="64" y="212" width="28" height="158" rx="13" />
          <rect x="108" y="212" width="28" height="158" rx="13" />
          <rect x="56" y="368" width="40" height="16" rx="7" />
          <rect x="104" y="368" width="40" height="16" rx="7" />
        </>)}
        {part(R.body, <path d="M70,60 C70,60 58,65 56,88 L52,178 C50,198 60,210 74,214 L126,214 C140,210 150,198 148,178 L144,88 C142,65 130,60 130,60 Z" />)}
        {part(R.brain, <ellipse cx="100" cy="36" rx="25" ry="29" />)}
        {part(R.heart, <path d="M112 100c-10-14-30 0-12 20l12 12 12-12c18-20-2-34-12-20z" />)}
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
              <HazardTag indicatorId={ind.id} />
            </div>
          );
        })}
      </div>
    </section>
  );
}