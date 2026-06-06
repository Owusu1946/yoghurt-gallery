import type { AuthUser } from "@/lib/auth";
import { AUTH_USERS_KEY, ORDERS_STORAGE_KEY, readStorage } from "@/lib/storage";

type StoredAuthUser = AuthUser & { passwordHash: string };

type UsersRegistry = {
  version: number;
  byEmail: Record<string, StoredAuthUser>;
  byPhone: Record<string, string>;
};

export type AdminCustomerRow = AuthUser & {
  orderCount: number;
};

function readRegistry(): UsersRegistry {
  const raw = readStorage<UsersRegistry | null>(AUTH_USERS_KEY, null);
  if (!raw || raw.version !== 1) {
    return { version: 1, byEmail: {}, byPhone: {} };
  }
  return raw;
}

export function getAllCustomers(): AdminCustomerRow[] {
  const registry = readRegistry();
  const ordersRaw = readStorage<{ byUser: Record<string, unknown[]> } | null>(
    ORDERS_STORAGE_KEY,
    null,
  );

  return Object.values(registry.byEmail)
    .map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      orderCount: ordersRaw?.byUser[user.id]?.length ?? 0,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
