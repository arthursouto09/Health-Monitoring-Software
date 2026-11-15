import { handler, readJson, send } from "../server/http.js";
import { getStore } from "../server/store.js";
import { verifyPassword } from "../server/passwords.js";
import { createToken, setSessionCookie } from "../server/session.js";

// POST /api/login { username, password } -> sets the session cookie.
// There is no sign-up: accounts are created by mission control (npm run create-user).
export default handler({
  async POST(req, res) {
    const { username, password } = await readJson(req);
    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
      return send(res, 400, { error: "Enter your username and password" });
    }
    const store = await getStore();
    const user = await store.findUser(username.trim().toLowerCase());
    const ok = user && (await verifyPassword(password, user.passwordHash));
    if (!ok) return send(res, 401, { error: "Wrong username or password" });
    setSessionCookie(req, res, createToken(user));
    send(res, 200, { user: { username: user.username, name: user.name } });
  },
});
