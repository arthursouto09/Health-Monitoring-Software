import { useEffect, useRef, useState } from "react";
import { INDICATORS } from "../data/indicators.js";
import { getStatus } from "../logic/status.js";
import { toLocalISO } from "../logic/dates.js";
import { personalBaseline, compareToBaseline } from "../logic/baseline.js";
import { checkValue, rangeText } from "../logic/validate.js";
import StatusBadge from "./StatusBadge.jsx";

// Daily check-in in two steps: fill in the values, then review and confirm.
// - Each value is checked against a realistic range before the review opens.
// - Fields left blank keep the value already saved today, so the astronaut can
//   add one measurement at a time.
// - While reviewing, the dashboard shows the values as a preview (onPreview).
export default function CheckIn({ entries, onSave, onPreview }) {
  const [form, setForm] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [review, setReview] = useState(null); // { date, values, typed } while reviewing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const reviewHeading = useRef(null);

  const today = toLocalISO();
  const savedToday = entries.find((e) => e.date === today);

  useEffect(() => { if (review) reviewHeading.current?.focus({ preventScroll: true }); }, [review]);
  // Lets the dashboard show the values under review before they are saved.
  useEffect(() => { onPreview?.(review && { date: review.date, values: review.values }); }, [review, onPreview]);

  const change = (id, text) => {
    setForm({ ...form, [id]: text });
    if (fieldErrors[id]) setFieldErrors({ ...fieldErrors, [id]: undefined });
  };

  const submit = (e) => {
    e.preventDefault();
    const typed = {};
    const errors = {};
    INDICATORS.forEach((i) => {
      const text = (form[i.id] ?? "").trim();
      if (!text) return;
      const { value, error: err } = checkValue(i, text);
      if (err) errors[i.id] = err;
      else typed[i.id] = value;
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length) { setError("Some values are not realistic. Check the highlighted fields."); return; }
    if (!Object.keys(typed).length) { setError("Fill in at least one indicator."); return; }
    setError("");
    // Blank fields keep what was already saved today.
    setReview({ date: today, values: { ...savedToday?.values, ...typed }, typed });
  };

  const confirm = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave({ date: review.date, values: review.values });
      setForm({});
      setReview(null);
    } catch (err) {
      setError(err.message || "Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (review) {
    const shown = INDICATORS.filter((i) => review.values[i.id] !== undefined);
    const kept = shown.filter((i) => review.typed[i.id] === undefined);
    const hasCritical = shown.some((i) => review.typed[i.id] !== undefined && getStatus(review.values[i.id], i) === "critical");

    return (
      <section className="panel checkin review" id="checkin" aria-labelledby="review-title">
        <h2 id="review-title" tabIndex={-1} ref={reviewHeading}>Review before saving</h2>
        <p className="hint">The dashboard now shows these values as a preview. Check each one; if something is wrong, go back and correct it.</p>
        <ul className="review-list">
          {shown.map((i) => {
            const v = review.values[i.id];
            const isNew = review.typed[i.id] !== undefined;
            const status = getStatus(v, i);
            const unusual = isNew && compareToBaseline(v, personalBaseline(entries, i, review.date))?.unusual;
            return (
              <li key={i.id} className={`review-item ${status} ${isNew ? "" : "kept"}`}>
                <span className="review-label">{i.label} · {isNew ? "new" : "saved earlier today"}</span>
                <strong>{v} {i.unit}</strong>
                <StatusBadge status={status} />
                {unusual && <span className="baseline-flag">↕ Unusual for you</span>}
                {isNew && status === "critical" && <small>{i.advice.critical}</small>}
              </li>
            );
          })}
        </ul>
        {hasCritical && (
          <p className="warning" role="alert">At least one value is critical. Measure again to rule out a mistake before you confirm.</p>
        )}
        {kept.length > 0 && (
          <p className="hint">Fields you left blank keep the value saved earlier today.</p>
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
    <form className="panel checkin" id="checkin" onSubmit={submit} noValidate>
      <h2>Daily check-in</h2>
      {savedToday && <p className="hint">You already saved readings today. Fill in only what you want to add or change; blank fields keep the saved value.</p>}
      {INDICATORS.map((i) => {
        const saved = savedToday?.values[i.id];
        const err = fieldErrors[i.id];
        return (
          <label key={i.id} className={err ? "invalid" : ""}>
            <span>{i.label} ({i.unit})</span>
            <input type="text" inputMode="decimal" autoComplete="off"
              placeholder={saved !== undefined ? `Saved today: ${saved}` : ""}
              aria-invalid={Boolean(err)} aria-describedby={`${i.id}-help`}
              value={form[i.id] ?? ""} onChange={(e) => change(i.id, e.target.value)} />
            {err && <span className="field-error" role="alert">{err}</span>}
            <small id={`${i.id}-help`}>{i.howTo} Accepted: {rangeText(i)}.</small>
          </label>
        );
      })}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit">Review today's readings</button>
    </form>
  );
}
