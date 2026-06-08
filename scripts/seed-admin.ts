/**
 * Seed / manage admin users in the database.
 *
 * Usage:
 *   bun scripts/seed-admin.ts                                         # creates default admin
 *   bun scripts/seed-admin.ts --email admin@yoghurt.com --password secret123
 *   bun scripts/seed-admin.ts --email admin@yoghurt.com --password secret123 --name "John"
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adminUsers } from "../db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL or DIRECT_URL is required in .env");
  process.exit(1);
}

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(client);

// ── Parse CLI args ──────────────────────────────────────────────────
function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= process.argv.length) return undefined;
  return process.argv[idx + 1];
}

const email = (getArg("email") || "admin@yoghurtgallery.com").trim().toLowerCase();
const password = getArg("password") || "yoghurt-admin";
const name = getArg("name") || "Admin";

// ── Hash (same SHA-256 approach used in lib/auth.ts) ────────────────
async function hashPassword(pwd: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔧 Seeding admin user…`);
  console.log(`   Email:    ${email}`);
  console.log(`   Name:     ${name}`);
  console.log(`   Password: ${"*".repeat(password.length)}\n`);

  const passwordHash = await hashPassword(password);

  await db
    .insert(adminUsers)
    .values({
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name,
    })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: { passwordHash, name },
    });

  console.log(`✅ Admin user "${email}" is ready.\n`);
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
