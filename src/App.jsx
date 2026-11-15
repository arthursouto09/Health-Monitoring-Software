import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceLine, ResponsiveContainer } from "recharts";
import { INDICATORS } from "./data/indicators.js";
import { getStatus, STATUS_META, makeDemoEntries } from "./logic/status.js";
import BodyMap from "./components/BodyMap.jsx";
import Reminder from "./components/Reminder.jsx";
import { checkInStreak, readinessScore, readinessLevel } from "./logic/engagement.js";
import { toLocalISO } from "./logic/dates.js";
import { personalBaseline, compareToBaseline, fmt, BASELINE } from "./logic/baseline.js";

const KEY = "astro-health-entries";
const RANK = { unknown: 0, normal: 1, attention: 2, critical: 3 };

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
    onSave({ date: toLocalISO(), values });
    setForm({});
  };
  return (
    <form className="panel checkin" id="checkin" onSubmit={submit}>
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

function Card({ ind, value, unusual, selected, onSelect }) {
  const status = getStatus(value, ind);
  return (
    <button className={`card ${status} ${selected ? "selected" : ""}`} onClick={onSelect}>
      <span className="icon" aria-hidden="true">{ind.icon}</span>
      <span className="label">{ind.label}</span>
      <span className="value">{value ?? "–"} <small>{ind.unit}</small></span>
      <StatusBadge status={status} />
      {unusual && <span className="baseline-flag">↕ Unusual for you</span>}
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
  const today = toLocalISO();
  const ind = INDICATORS.find((i) => i.id === selectedId);
  const value = latest.values[ind.id];
  const status = getStatus(value, ind);
  const chartData = entries.map((e) => ({ date: e.date.slice(5), value: e.values[ind.id] }));

  // Personal baseline for each indicator, from the readings before the latest one.
  const baselines = Object.fromEntries(INDICATORS.map((i) => [i.id, personalBaseline(entries, i, latest.date)]));
  const comparisons = Object.fromEntries(INDICATORS.map((i) => [i.id, compareToBaseline(latest.values[i.id], baselines[i.id])]));
  const baseline = baselines[ind.id];
  const comparison = comparisons[ind.id];
  // Normal by population ranges, but far from this person's usual values.
  const baselineAlerts = INDICATORS.filter((i) => comparisons[i.id]?.unusual && getStatus(latest.values[i.id], i) === "normal");

  // Overall status = the worst status among all indicators.
  const statuses = INDICATORS.map((i) => ({ ind: i, status: getStatus(latest.values[i.id], i) }));
  const alerts = statuses.filter((s) => RANK[s.status] >= RANK.attention).sort((a, b) => RANK[b.status] - RANK[a.status]);
  const overall = statuses.reduce((w, s) => (RANK[s.status] > RANK[w] ? s.status : w), "unknown");

  const streak = checkInStreak(entries, today);
  const readiness = readinessScore(latest.values, INDICATORS);

  return (
    <main className="cockpit">
      <header className="topbar">
        <div>
          <h1>Astronaut Health Monitor</h1>
          <p>Last reading: {latest.date}</p>
        </div>
        <div className="stats" aria-label="Mission stats">
          <div className={`stat ${readinessLevel(readiness)}`} title="Average of indicator statuses: normal 100, attention 50, critical 0. Not a clinical score.">
            <span className="stat-value">{readiness ?? "–"}</span>
            <span className="stat-label">Readiness</span>
          </div>
          <div className="stat" title="Consecutive days with a check-in">
            <span className="stat-value"><span aria-hidden="true">🔥</span> {streak}</span>
            <span className="stat-label">Day streak</span>
          </div>
        </div>
        <div className="overall">
          <StatusBadge status={overall} />
          <span>{alerts.length ? `${alerts.length} indicator(s) need attention` : "All indicators normal"}</span>
        </div>
      </header>

      <Reminder checkedInToday={latest.date === today} today={today} />

      <div className="layout">
        <aside className="col-left">
          <BodyMap values={latest.values} onSelect={setSelectedId} />
        </aside>

        <section className="col-center">
          <div className="cards" aria-label="Current indicators">
            {INDICATORS.map((i) => (
              <Card key={i.id} ind={i} value={latest.values[i.id]} unusual={comparisons[i.id]?.unusual} selected={i.id === selectedId} onSelect={() => setSelectedId(i.id)} />
            ))}
          </div>

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
                  {baseline && <ReferenceLine y={baseline.mean} stroke="var(--muted)" strokeDasharray="5 4" label={{ value: "your baseline", fill: "var(--muted)", fontSize: 11, position: "insideTopLeft" }} />}
                  <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="baseline">
              <strong>Your baseline:</strong>{" "}
              {baseline ? (
                <>
                  {fmt(baseline.mean, ind)} ± {fmt(baseline.sd, ind)} {ind.unit} (last {baseline.n} readings).{" "}
                  {comparison && (
                    <>
                      Latest is {comparison.diff >= 0 ? "+" : "−"}{fmt(Math.abs(comparison.diff), ind)} {ind.unit} from it
                      {comparison.unusual ? <strong className="baseline-flag"> — unusual for you. Measure again and mention it to the flight surgeon if it repeats.</strong> : "."}
                    </>
                  )}
                </>
              ) : (
                `needs at least ${BASELINE.minReadings} earlier readings.`
              )}
            </p>
            <p><strong>Why it matters:</strong> {ind.why}</p>
            <p><strong>Spaceflight hazard:</strong> {ind.hazard}</p>
            <p><strong>Source:</strong> {ind.source}</p>
          </section>
        </section>

        <aside className="col-right">
          <section className="panel alerts">
            <h2>Alerts</h2>
            {alerts.length === 0 ? (
              <p className="empty">No alerts. Keep up your routine.</p>
            ) : (
              <ul>
                {alerts.map(({ ind: a, status: s }) => (
                  <li key={a.id}>
                    <button className={`alert-item ${s}`} onClick={() => setSelectedId(a.id)}>
                      <span>{a.label}: <strong>{latest.values[a.id]} {a.unit}</strong></span>
                      <StatusBadge status={s} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {baselineAlerts.length > 0 && (
              <>
                <h3>Different from your baseline</h3>
                <ul>
                  {baselineAlerts.map((a) => (
                    <li key={a.id}>
                      <button className="alert-item baseline" onClick={() => setSelectedId(a.id)}>
                        <span>{a.label}: <strong>{latest.values[a.id]} {a.unit}</strong></span>
                        <span className="baseline-flag">↕ Unusual for you</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
          <CheckIn onSave={save} />
        </aside>
      </div>

      <footer>
        Educational project. Not a medical device. Values are demo references and must be validated by medical professionals.
      </footer>
    </main>
  );
}