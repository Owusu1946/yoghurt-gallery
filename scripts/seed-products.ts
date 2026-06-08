/**
 * Seed all existing static products to the PostgreSQL database.
 * Usage: bun scripts/seed-products.ts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { products } from "../db/schema";
import * as dotenv from "dotenv";

// Import the static products from the old file
import { allProducts } from "../data/products";

dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL or DIRECT_URL is required in .env");
  process.exit(1);
}

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(client);

async function main() {
  console.log(`\n🔧 Seeding ${allProducts.length} products to the database...`);

  for (const p of allProducts) {
    console.log(`   Upserting: ${p.name} (${p.slug})`);

    await db
      .insert(products)
      .values({
        id: crypto.randomUUID(),
        slug: p.slug,
        name: p.name,
        image: p.image,
        imageBack: p.imageBack,
        priceGhs: p.priceGhs,
        category: p.category,
        description: p.description,
        details: p.details,
        colors: p.colors || [],
        stock: p.stock,
        isHidden: false,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: p.name,
          image: p.image,
          imageBack: p.imageBack,
          priceGhs: p.priceGhs,
          category: p.category,
          description: p.description,
          details: p.details,
          colors: p.colors || [],
          stock: p.stock,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`\n✅ Successfully seeded products to database.\n`);
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
