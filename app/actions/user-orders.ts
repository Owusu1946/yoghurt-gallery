"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getUserOrdersFromDb(userId: string) {
  try {
    const rows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    return rows;
  } catch (error) {
    console.error("Failed to fetch user orders from DB:", error);
    return [];
  }
}

export async function getUserOrderFromDb(userId: string, orderId: string) {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));
      
    const order = rows[0] || null;
    if (order && order.userId === userId) {
      return order;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch user order ${orderId} from DB:`, error);
    return null;
  }
}
