"use server";

import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export type AdminLoginResult = {
  success: boolean;
  admin?: { id: string; email: string; name: string };
  error?: string;
};

export async function loginAdmin(
  email: string,
  password: string,
): Promise<AdminLoginResult> {
  try {
    const normalized = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, normalized))
      .limit(1);

    if (!admin) {
      return { success: false, error: "Invalid credentials." };
    }

    if (admin.passwordHash !== passwordHash) {
      return { success: false, error: "Invalid credentials." };
    }

    return {
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    };
  } catch (error) {
    console.error("Admin login failed:", error);
    return { success: false, error: "Something went wrong." };
  }
}
