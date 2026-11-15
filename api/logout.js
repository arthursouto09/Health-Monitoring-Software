import { handler, send } from "../server/http.js";
import { clearSessionCookie } from "../server/session.js";

// POST /api/logout -> clears the session cookie.
export default handler({
  async POST(req, res) {
    clearSessionCookie(req, res);
    send(res, 200, { ok: true });
  },
});
