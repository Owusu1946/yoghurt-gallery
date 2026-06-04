import type { StoredOrder } from "@/lib/orders";
import { ORDERS_STORAGE_KEY, readStorage, writeStorage } from "@/lib/storage";

type OrdersRegistry = {
  version: 1;
  byUser: Record<string, StoredOrder[]>;
};

const REGISTRY_VERSION = 1;

function emptyRegistry(): OrdersRegistry {
  return { version: REGISTRY_VERSION, byUser: {} };
}

function readRegistry(): OrdersRegistry {
  const raw = readStorage<OrdersRegistry | null>(ORDERS_STORAGE_KEY, null);
  if (!raw || raw.version !== REGISTRY_VERSION) {
    return emptyRegistry();
  }
  return raw;
}

function writeRegistry(registry: OrdersRegistry): void {
  writeStorage(ORDERS_STORAGE_KEY, registry);
}

export function saveUserOrder(order: StoredOrder): void {
  const registry = readRegistry();
  const existing = registry.byUser[order.userId] ?? [];
  const withoutDuplicate = existing.filter((o) => o.id !== order.id);

  registry.byUser[order.userId] = [order, ...withoutDuplicate].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  writeRegistry(registry);
}

export function getUserOrders(userId: string): StoredOrder[] {
  const registry = readRegistry();
  return registry.byUser[userId] ?? [];
}

export function getUserOrder(
  userId: string,
  orderId: string,
): StoredOrder | null {
  return getUserOrders(userId).find((order) => order.id === orderId) ?? null;
}

export function attachUserIdToOrder(
  order: StoredOrder | (StoredOrder & { userId?: string }),
  userId: string,
): StoredOrder {
  return { ...order, userId };
}
