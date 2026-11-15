import { handler, send } from "../server/http.js";
import { sessionUser } from "../server/session.js";
import { demoEnabled, DEMO_USERNAME, DEMO_PASSWORD } from "../server/store.js";

// GET /api/me -> the signed-in user, or 401 with the demo account hint.
export default handler({
  async GET(req, res) {
    const user = sessionUser(req);
    if (user) return send(res, 200, { user: { username: user.username, name: user.name } });
    send(res, 401, { error: "Not signed in", demo: demoEnabled() ? { username: DEMO_USERNAME, password: DEMO_PASSWORD } : null });
  },
});
