// One validation rule for a reading, shared by the check-in form and the server.
// Rejects values outside the plausible input range of the indicator (almost
// certainly typos), values with more precision than the indicator accepts,
// and anything that is not a plain decimal number (e.g. "1e2").

const PLAIN_NUMBER = /^-?\d+([.,]\d+)?$/;

const decimals = (step) => (String(step).split(".")[1] ?? "").length;

export function rangeText(ind) {
  const unit = ind.unit.startsWith("/") ? "" : ` ${ind.unit}`; // "1 to 5", not "1 to 5 /5"
  return `${ind.input.min} to ${ind.input.max}${unit}`;
}

// Returns { value } or { error }. Accepts a number or the raw text typed in the form.
export function checkValue(ind, raw) {
  let value = raw;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!PLAIN_NUMBER.test(text)) return { error: `${ind.label}: enter a plain number (${rangeText(ind)}).` };
    value = Number(text.replace(",", "."));
  }
  if (typeof value !== "number" || !Number.isFinite(value)) return { error: `${ind.label}: enter a number.` };
  if (value < ind.input.min || value > ind.input.max) {
    return { error: `${ind.label} must be from ${rangeText(ind)}. A value outside this range is not realistic; check for a typo.` };
  }
  // Must be a multiple of the step (tolerance for floating point).
  const steps = (value - ind.input.min) / ind.step;
  if (Math.abs(steps - Math.round(steps)) > 1e-6) {
    const d = decimals(ind.step);
    const hint = d === 0 ? "whole numbers" : `steps of ${ind.step} ${ind.unit}`;
    return { error: `${ind.label}: use ${hint}.` };
  }
  return { value: Number(value.toFixed(decimals(ind.step))) };
}
