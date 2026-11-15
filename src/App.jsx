import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea, ResponsiveContainer } from "recharts";
import { INDICATORS } from "./Data/indicators.js";
import { getStatus, STATUS_META, makeDemoEntries } from "./logic/status.js";
import BodyMap from "./components/BodyMap.jsx";


const KEY = "astro-health-entries";

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch { /* storage unavailable: fall back to demo data */ }
  return makeDemoEntries(INDICATORS);
}

function StatusBadge({ status }) {
  const m = STATUS_META[status];
  return <span className={`badge ${status}`}><span aria-hidden="true">{m.icon}</span> {m.label}</span>;
}

function CheckIn({ onSave }) {
  const [form, setForm] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const values = {};
    INDICATORS.forEach((i) => { if (form[i.id] !== undefined && form[i.id] !== "") values[i.id] = Number(form[i.id]); });
    if (!Object.keys(values).length) return;
    onSave({ date: new Date().toISOString().slice(0, 10), values });
    setForm({});
  };
  return (
    <form className="panel checkin" onSubmit={submit}>
      <h2>Daily check-in</h2>
      {INDICATORS.map((i) => (
        <label key={i.id}>
          <span>{i.label} ({i.unit})</span>
          <input type="number" inputMode="decimal" step={i.step} min={i.input.min} max={i.input.max}
            value={form[i.id] ?? ""} onChange={(e) => setForm({ ...form, [i.id]: e.target.value })} />
          <small>{i.howTo}</small>
        </label>
      ))}
      <button type="submit">Save today's readings</button>
    </form>
  );
}

function Card({ ind, value, selected, onSelect }) {
  const status = getStatus(value, ind);
  return (
    <button className={`card ${status} ${selected ? "selected" : ""}`} onClick={onSelect}>
      <span className="icon" aria-hidden="true">{ind.icon}</span>
      <span className="label">{ind.label}</span>
      <span className="value">{value ?? "–"} <small>{ind.unit}</small></span>
      <StatusBadge status={status} />
    </button>
  );
}

export default function App() {
  const [entries, setEntries] = useState(load);
  const [selectedId, setSelectedId] = useState(INDICATORS[0].id);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch { /* ignore */ }
  }, [entries]);

  // One entry per day: saving again today replaces today's readings.
  const save = (entry) =>
    setEntries((prev) => [...prev.filter((e) => e.date !== entry.date), entry].sort((a, b) => a.date.localeCompare(b.date)));

  const latest = entries[entries.length - 1];
  const ind = INDICATORS.find((i) => i.id === selectedId);
  const value = latest.values[ind.id];
  const status = getStatus(value, ind);
  const chartData = entries.map((e) => ({ date: e.date.slice(5), value: e.values[ind.id] }));

  return (
    <main>
      <header>
        <h1>Astronaut Health Monitor</h1>
        <p>Last reading: {latest.date}. Select an indicator to see its trend and what to do.</p>
      </header>

      <section className="cards" aria-label="Current indicators">
        {INDICATORS.map((i) => (
          <Card key={i.id} ind={i} value={latest.values[i.id]} selected={i.id === selectedId} onSelect={() => setSelectedId(i.id)} />
        ))}
      </section>

      <BodyMap values={latest.values} onSelect={setSelectedId} />

      <div className="grid">
        <section className="panel detail">
          <h2>{ind.label} <StatusBadge status={status} /></h2>
          <p className="advice">{ind.advice[status] ?? "Enter a reading to see guidance."}</p>
          <div className="chart">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <ReferenceArea y1={ind.normalLow} y2={ind.normalHigh} fill="var(--normal)" fillOpacity={0.15} />
                <XAxis dataKey="date" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p><strong>Why it matters:</strong> {ind.why}</p>
          <p><strong>Spaceflight hazard:</strong> {ind.hazard}</p>
          <p><strong>Source:</strong> {ind.source}</p>
        </section>
        <CheckIn onSave={save} />
      </div>

      <footer>
        Educational project. Not a medical device. Values are demo references and must be validated by medical professionals.
      </footer>
    </main>
  );
}