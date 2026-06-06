import type { OrderStatus } from "@/data/order-status";
import { deriveOrderStatus } from "@/data/order-status";
import { ADMIN_ORDER_STATUS_KEY, readStorage, writeStorage } from "@/lib/storage";

type OrderStatusRegistry = {
  version: 1;
  byOrderId: Record<string, OrderStatus>;
};

const REGISTRY_VERSION = 1;

function emptyRegistry(): OrderStatusRegistry {
  return { version: REGISTRY_VERSION, byOrderId: {} };
}

function readRegistry(): OrderStatusRegistry {
  const raw = readStorage<OrderStatusRegistry | null>(ADMIN_ORDER_STATUS_KEY, null);
  if (!raw || raw.version !== REGISTRY_VERSION) return emptyRegistry();
  return raw;
}

function writeRegistry(registry: OrderStatusRegistry): void {
  writeStorage(ADMIN_ORDER_STATUS_KEY, registry);
}

export function getOrderStatusOverride(orderId: string): OrderStatus | null {
  return readRegistry().byOrderId[orderId] ?? null;
}

export function setOrderStatusOverride(orderId: string, status: OrderStatus): void {
  const registry = readRegistry();
  registry.byOrderId[orderId] = status;
  writeRegistry(registry);
  window.dispatchEvent(new CustomEvent("yoghurt-admin-order-status"));
}

export function clearOrderStatusOverride(orderId: string): void {
  const registry = readRegistry();
  delete registry.byOrderId[orderId];
  writeRegistry(registry);
  window.dispatchEvent(new CustomEvent("yoghurt-admin-order-status"));
}

export function getEffectiveOrderStatus(
  orderId: string,
  createdAt: string,
  now = Date.now(),
): OrderStatus {
  return getOrderStatusOverride(orderId) ?? deriveOrderStatus(createdAt, now);
}
