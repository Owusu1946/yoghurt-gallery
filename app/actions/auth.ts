"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { type AuthUser } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function syncUserToDb(user: AuthUser) {
  try {
    const inserted = await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        fullName: user.fullName || "",
        phone: user.phone || "",
        // createdAt defaults to now() in schema
      })
      .onConflictDoNothing({ target: users.id }) // Do nothing if user already exists
      .returning({ id: users.id });

    if (inserted.length > 0) {
      console.log(`User ${user.id} synced to Drizzle DB successfully.`);
      revalidateTag("admin-customers", {});
    }
  } catch (error) {
    console.error("Failed to sync user to DB:", error);
    // Don't throw error to avoid breaking the auth flow if DB is not configured yet
  }
}
