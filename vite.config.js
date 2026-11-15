import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Serves the files in api/ during `npm run dev` and `npm run preview`, the same
// way Vercel serves them in production: /api/<name> -> api/<name>.js.
function localApi() {
  const mount = (server) => {
    server.middlewares.use(async (req, res, next) => {
      const match = req.url.match(/^\/api\/([a-z-]+)\/?(?:\?.*)?$/);
      const file = match && path.resolve("api", `${match[1]}.js`);
      if (!file || !fs.existsSync(file)) return next();
      try {
        const mod = await import(`${pathToFileURL(file).href}?t=${fs.statSync(file).mtimeMs}`);
        await mod.default(req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Server error" }));
      }
    });
  };
  return { name: "local-api", configureServer: mount, configurePreviewServer: mount };
}

export default defineConfig(({ mode }) => {
  // Make DATABASE_URL, SESSION_SECRET etc. from .env / .env.local visible to the API.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return { plugins: [react(), localApi()] };
});
