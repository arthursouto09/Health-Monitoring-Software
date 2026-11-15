import { useEffect, useState } from "react";

const NOTIFIED_KEY = "astro-health-last-notified";
const CHECK_EVERY_MS = 30 * 60 * 1000; // re-check every 30 minutes while the app is open

const canNotify = () => typeof window !== "undefined" && "Notification" in window;

// Shows a banner when today's check-in is missing and, if the astronaut allows it,
// a browser notification (at most once per day, only while the app is open).
export default function Reminder({ checkedInToday, today }) {
  const [permission, setPermission] = useState(canNotify() ? Notification.permission : "unsupported");

  useEffect(() => {
    if (checkedInToday || permission !== "granted") return;
    const notify = () => {
      try {
        if (localStorage.getItem(NOTIFIED_KEY) === today) return;
        new Notification("Astronaut Health Monitor", { body: "Time for your daily health check-in." });
        localStorage.setItem(NOTIFIED_KEY, today);
      } catch { /* notifications or storage unavailable */ }
    };
    notify();
    const timer = setInterval(notify, CHECK_EVERY_MS);
    return () => clearInterval(timer);
  }, [checkedInToday, permission, today]);

  const enable = async () => {
    try { setPermission(await Notification.requestPermission()); } catch { /* ignore */ }
  };

  if (checkedInToday) return null;

  return (
    <div className="reminder" role="status">
      <span><span aria-hidden="true">⏰</span> You have not done today's check-in yet.</span>
      <div className="reminder-actions">
        <a href="#checkin">Go to check-in</a>
        {permission === "default" && <button type="button" onClick={enable}>Enable reminders</button>}
      </div>
    </div>
  );
}
