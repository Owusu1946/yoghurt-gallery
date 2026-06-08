"use server";

import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { unstable_cache, revalidateTag } from "next/cache";

export const getAdminCustomersFromDb = unstable_cache(
  async () => {
    try {
      // Query users and join orders to count them
      const result = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phone: users.phone,
          isBanned: users.isBanned,
          createdAt: users.createdAt,
          orderCount: sql<number>`count(${orders.id})::int`,
        })
        .from(users)
        .leftJoin(orders, eq(users.id, orders.userId))
        .groupBy(users.id)
        .orderBy(desc(users.createdAt));

      return result.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error("Failed to fetch admin customers from DB:", error);
      return [];
    }
  },
  ["admin-customers-query-v2"],
  { tags: ["admin-customers"], revalidate: 3600 }
);

export async function toggleUserBanStatus(userId: string, isBanned: boolean) {
  try {
    await db.update(users).set({ isBanned }).where(eq(users.id, userId));
    revalidateTag("admin-customers", {});
    return { ok: true };
  } catch (error) {
    console.error(`Failed to update user ban status for ${userId}:`, error);
    return { ok: false };
  }
}
