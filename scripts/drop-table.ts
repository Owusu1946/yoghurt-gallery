import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

const sql = postgres(DATABASE_URL!);

async function main() {
  await sql`DROP TABLE IF EXISTS admin_product_registry;`;
  console.log("Dropped table.");
  process.exit(0);
}

main();
