// Creates (or updates the password of) a crew account. There is no sign-up in the app.
// Usage: npm run create-user -- <username> "<Full name>" <password>
// Uses DATABASE_URL from the environment or .env.local; without it, writes to the local .data/ file.
import { getStore } from "../server/store.js";
import { hashPassword } from "../server/passwords.js";

const [username, name, password] = process.argv.slice(2);
if (!username || !name || !password) {
  console.error('Usage: npm run create-user -- <username> "<Full name>" <password>');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must have at least 8 characters.");
  process.exit(1);
}
const store = await getStore();
const user = await store.createUser({ username: username.trim().toLowerCase(), name, passwordHash: await hashPassword(password) });
console.log(`Account ready: ${user.username} (${user.name}) in ${process.env.DATABASE_URL ? "Postgres" : "local file .data/db.json"}`);
process.exit(0);
