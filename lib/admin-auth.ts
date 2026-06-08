import { ADMIN_SESSION_KEY, readStorage, removeStorage, writeStorage } from "@/lib/storage";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  signedInAt: string;
};

export function saveAdminSession(session: AdminSession): void {
  writeStorage(ADMIN_SESSION_KEY, session);
}

export function getAdminSession(): AdminSession | null {
  return readStorage<AdminSession | null>(ADMIN_SESSION_KEY, null);
}

export function signOutAdmin(): void {
  removeStorage(ADMIN_SESSION_KEY);
}
