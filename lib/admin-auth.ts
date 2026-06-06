import { hashPassword } from "@/lib/auth";
import { ADMIN_SESSION_KEY, readStorage, removeStorage, writeStorage } from "@/lib/storage";

export const ADMIN_EMAIL = "admin@yoghurtgallery.com";
export const ADMIN_DEFAULT_PASSWORD = "yoghurt-admin";

export type AdminSession = {
  email: string;
  signedInAt: string;
};

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const normalized = email.trim().toLowerCase();
  if (normalized !== ADMIN_EMAIL) return null;

  const hash = await hashPassword(password);
  const expected = await hashPassword(ADMIN_DEFAULT_PASSWORD);
  if (hash !== expected) return null;

  const session: AdminSession = {
    email: normalized,
    signedInAt: new Date().toISOString(),
  };
  writeStorage(ADMIN_SESSION_KEY, session);
  return session;
}

export function getAdminSession(): AdminSession | null {
  return readStorage<AdminSession | null>(ADMIN_SESSION_KEY, null);
}

export function signOutAdmin(): void {
  removeStorage(ADMIN_SESSION_KEY);
}
