import { useState } from "react";
import { api } from "../api.js";

// Sign-in only: there is no sign-up. Crew accounts are created by mission control.
export default function Login({ demo, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { user } = await api.login(username, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const fillDemo = () => { setUsername(demo.username); setPassword(demo.password); };

  return (
    <main className="login-page">
      <form className="panel login" onSubmit={submit} aria-labelledby="login-title">
        <svg className="login-mark" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="9" fill="var(--accent)" />
          <ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="var(--muted)" strokeWidth="2" transform="rotate(-20 24 24)" />
        </svg>
        <h1 id="login-title">Astronaut Health Monitor</h1>
        <p className="login-sub">Sign in with the crew account provided by mission control.</p>

        <label>
          <span>Username</span>
          <input autoComplete="username" autoCapitalize="none" spellCheck="false" required
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>

        {demo && (
          <p className="login-demo">
            Demo account: <strong>{demo.username}</strong> / <strong>{demo.password}</strong>{" "}
            <button type="button" onClick={fillDemo}>Fill in</button>
          </p>
        )}
        <p className="login-note">Educational project. Not a medical device.</p>
      </form>
    </main>
  );
}
