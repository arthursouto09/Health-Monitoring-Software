import { useEffect, useState } from "react";
import { api, ApiError } from "./api.js";
import App from "./App.jsx";
import Login from "./components/Login.jsx";

// Decides between the login screen and the dashboard, and loads the readings.
export default function Root() {
  const [state, setState] = useState({ phase: "loading" });

  const loadDashboard = async (user) => {
    try {
      const entries = await api.entries();
      setState({ phase: "ready", user, entries });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return setState({ phase: "login", demo: err.data?.demo });
      setState({ phase: "error", message: err.message, user });
    }
  };

  useEffect(() => {
    api.me()
      .then(({ user }) => loadDashboard(user))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) setState({ phase: "login", demo: err.data?.demo });
        else setState({ phase: "error", message: err.message });
      });
  }, []);

  const logout = async () => {
    try { await api.logout(); } catch { /* the cookie expires anyway */ }
    const demo = await api.me().catch((err) => err.data?.demo);
    setState({ phase: "login", demo });
  };

  if (state.phase === "loading") return <main className="login-page"><p className="loading">Loading…</p></main>;
  if (state.phase === "login") return <Login demo={state.demo} onLogin={loadDashboard} />;
  if (state.phase === "error") {
    return (
      <main className="login-page">
        <section className="panel login">
          <h1>Something went wrong</h1>
          <p className="form-error" role="alert">{state.message}</p>
          <button type="button" onClick={() => window.location.reload()}>Try again</button>
        </section>
      </main>
    );
  }
  return <App user={state.user} initialEntries={state.entries} onLogout={logout} />;
}
