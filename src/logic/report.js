import { getStatus, STATUS_META } from "./status.js";

// Builds a CSV report of all readings (one row per day and indicator) that the
// astronaut can send to the flight surgeon. Generated in the browser: nothing
// leaves the device until the astronaut shares the file.
export function buildReportCsv(entries, indicators, environmentLabel) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["date", "environment_at_export", "indicator", "value", "unit", "status", "normal_range"];
  const rows = entries.flatMap((e) =>
    indicators
      .filter((ind) => e.values[ind.id] !== undefined)
      .map((ind) => [
        e.date, environmentLabel, ind.label, e.values[ind.id], ind.unit,
        STATUS_META[getStatus(e.values[ind.id], ind)].label, `${ind.normalLow}-${ind.normalHigh}`,
      ])
  );
  return [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}

export function downloadText(filename, text, type = "text/csv") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
