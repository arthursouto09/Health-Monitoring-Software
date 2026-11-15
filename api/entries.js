import { handler, readJson, requireUser, send } from "../server/http.js";
import { getStore } from "../server/store.js";
import { validateEntry } from "../server/validate.js";

// GET /api/entries -> this astronaut's readings, oldest first.
// PUT /api/entries { date, values } -> saves the day's readings (replaces that day).
export default handler({
  async GET(req, res) {
    const user = requireUser(req, res);
    if (!user) return;
    const store = await getStore();
    send(res, 200, { entries: await store.listEntries(user.id) });
  },
  async PUT(req, res) {
    const user = requireUser(req, res);
    if (!user) return;
    const { entry, error } = validateEntry(await readJson(req));
    if (error) return send(res, 400, { error });
    const store = await getStore();
    await store.saveEntry(user.id, entry);
    send(res, 200, { entry });
  },
});
