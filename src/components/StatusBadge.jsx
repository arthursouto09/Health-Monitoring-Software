import { STATUS_META } from "../logic/status.js";

// Status is never shown by color alone: icon + text + color.
export default function StatusBadge({ status }) {
  const m = STATUS_META[status];
  return <span className={`badge ${status}`}><span aria-hidden="true">{m.icon}</span> {m.label}</span>;
}
