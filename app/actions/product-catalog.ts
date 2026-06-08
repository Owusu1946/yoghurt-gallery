"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Product } from "@/data/products";
import { revalidateTag, unstable_cache } from "next/cache";

export async function upsertProductInDb(product: Product) {
  try {
    await db
      .insert(products)
      .values({
        id: crypto.randomUUID(),
        slug: product.slug,
        name: product.name,
        image: product.image,
        imageBack: product.imageBack,
        priceGhs: product.priceGhs,
        category: product.category,
        description: product.description,
        details: product.details,
        colors: product.colors || [],
        stock: product.stock,
        isHidden: false,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: product.name,
          image: product.image,
          imageBack: product.imageBack,
          priceGhs: product.priceGhs,
          category: product.category,
          description: product.description,
          details: product.details,
          colors: product.colors || [],
          stock: product.stock,
          updatedAt: new Date(),
        },
      });
    revalidateTag("products-catalog", {});
  } catch (error) {
    console.error("Failed to upsert product in DB:", error);
  }
}

export async function setProductHiddenStatusInDb(slug: string, isHidden: boolean) {
  try {
    await db
      .update(products)
      .set({ isHidden, updatedAt: new Date() })
      .where(eq(products.slug, slug));
    revalidateTag("products-catalog", {});
  } catch (error) {
    console.error("Failed to update product hidden status in DB:", error);
  }
}

export const getAllProductsFromDb = unstable_cache(
  async (): Promise<(Product & { isHidden: boolean })[]> => {
    try {
      const rows = await db.select().from(products);
      return rows.map((row) => ({
        slug: row.slug,
        name: row.name,
        image: row.image,
        imageBack: row.imageBack ?? undefined,
        priceGhs: row.priceGhs,
        category: row.category as any, // Cast to ProductCategory
        description: row.description,
        details: row.details,
        colors: row.colors ?? undefined,
        stock: row.stock ?? undefined,
        isHidden: row.isHidden,
      }));
    } catch (error) {
      console.error("Failed to fetch products from DB:", error);
      return [];
    }
  },
  ["all-products-query"],
  { tags: ["products-catalog"], revalidate: 3600 }
);
