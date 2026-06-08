import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env file manually because drizzle-kit doesn't load Next.js environment variables natively
dotenv.config({ path: ".env" });

const migrationUrl = process.env.DIRECT_URL || process.env.DATABASE_URL!;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
});
