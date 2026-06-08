"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getAllOrdersFromDb = unstable_cache(
  async () => {
    try {
      const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
      return rows;
    } catch (error) {
      console.error("Failed to fetch orders from DB:", error);
      return [];
    }
  },
  ["all-orders-query"],
  { tags: ["admin-orders"], revalidate: 3600 }
);

export async function getOrderFromDb(id: string) {
  try {
    const rows = await db.select().from(orders).where(eq(orders.id, id));
    return rows[0] || null;
  } catch (error) {
    console.error(`Failed to fetch order ${id} from DB:`, error);
    return null;
  }
}

export async function updateOrderStatusInDb(orderId: string, status: string) {
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    return { ok: true };
  } catch (error) {
    console.error(`Failed to update order ${orderId} status:`, error);
    return { ok: false };
  }
}
