import { useEffect, useRef, useState } from "react";
import { INDICATORS } from "../data/indicators.js";
import { getStatus } from "../logic/status.js";
import { toLocalISO } from "../logic/dates.js";
import { personalBaseline, compareToBaseline } from "../logic/baseline.js";
import StatusBadge from "./StatusBadge.jsx";

// Daily check-in in two steps: fill in the values, then review and confirm.
// The review catches typos before they become false alerts and warns that
// saving again on the same day replaces the readings already saved today.
export default function CheckIn({ entries, onSave }) {
  const [form, setForm] = useState({});
  const [review, setReview] = useState(null); // { date, values } while reviewing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const reviewHeading = useRef(null);

  useEffect(() => { if (review) reviewHeading.current?.focus(); }, [review]);

  const submit = (e) => {
    e.preventDefault();
    const values = {};
    INDICATORS.forEach((i) => { if (form[i.id] !== undefined && form[i.id] !== "") values[i.id] = Number(form[i.id]); });
    if (!Object.keys(values).length) { setError("Fill in at least one indicator."); return; }
    setError("");
    setReview({ date: toLocalISO(), values });
  };

  const confirm = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(review);
      setForm({});
      setReview(null);
    } catch (err) {
      setError(err.message || "Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (review) {
    const existing = entries.find((e) => e.date === review.date);
    const cleared = existing ? INDICATORS.filter((i) => existing.values[i.id] !== undefined && review.values[i.id] === undefined) : [];
    const filled = INDICATORS.filter((i) => review.values[i.id] !== undefined);
    const hasCritical = filled.some((i) => getStatus(review.values[i.id], i) === "critical");

    return (
      <section className="panel checkin review" id="checkin" aria-labelledby="review-title">
        <h2 id="review-title" tabIndex={-1} ref={reviewHeading}>Review before saving</h2>
        <p className="hint">Check each value. If something is wrong, go back and correct it.</p>
        <ul className="review-list">
          {filled.map((i) => {
            const v = review.values[i.id];
            const status = getStatus(v, i);
            const unusual = compareToBaseline(v, personalBaseline(entries, i, review.date))?.unusual;
            return (
              <li key={i.id} className={`review-item ${status}`}>
                <span className="review-label">{i.label}</span>
                <strong>{v} {i.unit}</strong>
                <StatusBadge status={status} />
                {unusual && <span className="baseline-flag">↕ Unusual for you</span>}
                {status === "critical" && <small>{i.advice.critical}</small>}
              </li>
            );
          })}
        </ul>
        {hasCritical && (
          <p className="warning" role="alert">At least one value is critical. Measure again to rule out a mistake before you confirm.</p>
        )}
        {existing && (
          <p className="warning">
            This replaces the readings already saved today.
            {cleared.length > 0 && <> These will be cleared: <strong>{cleared.map((i) => i.label).join(", ")}</strong>.</>}
          </p>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="review-actions">
          <button type="button" className="secondary" onClick={() => setReview(null)} disabled={saving}>Correct</button>
          <button type="button" className="primary" onClick={confirm} disabled={saving}>{saving ? "Saving…" : "Confirm and save"}</button>
        </div>
      </section>
    );
  }

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
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit">Review today's readings</button>
    </form>
  );
}
