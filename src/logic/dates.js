// Dates are stored as local "YYYY-MM-DD" strings.
// toISOString() would use UTC and shift late-evening check-ins to the next day.
export function toLocalISO(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  return toLocalISO(new Date(y, m - 1, d + n));
}
