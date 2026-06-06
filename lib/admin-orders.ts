import type { OrderStatus } from "@/data/order-status";
import { orderStatusLabels } from "@/data/order-status";
import { findUserById } from "@/lib/auth";
import { getEffectiveOrderStatus } from "@/lib/admin-order-status";
import type { StoredOrder } from "@/lib/orders";
import { ORDERS_STORAGE_KEY, readStorage } from "@/lib/storage";

type OrdersRegistry = {
  version: 1;
  byUser: Record<string, StoredOrder[]>;
};

export type AdminOrderRow = StoredOrder & {
  customerName: string;
  status: OrderStatus;
  statusLabel: string;
};

function readRegistry(): OrdersRegistry {
  const raw = readStorage<OrdersRegistry | null>(ORDERS_STORAGE_KEY, null);
  if (!raw || raw.version !== 1) return { version: 1, byUser: {} };
  return raw;
}

export function getAllOrders(): AdminOrderRow[] {
  const registry = readRegistry();
  const rows: AdminOrderRow[] = [];

  for (const userId of Object.keys(registry.byUser)) {
    const user = findUserById(userId);
    for (const order of registry.byUser[userId] ?? []) {
      const status = getEffectiveOrderStatus(order.id, order.createdAt);
      rows.push({
        ...order,
        customerName: user?.fullName ?? order.customer.fullName,
        status,
        statusLabel: orderStatusLabels[status],
      });
    }
  }

  return rows.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getAdminOrder(orderId: string): AdminOrderRow | null {
  return getAllOrders().find((order) => order.id === orderId) ?? null;
}

export function getOrderStats() {
  const orders = getAllOrders();
  const revenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const pending = orders.filter((order) => order.status !== "delivered").length;
  const customLines = orders.reduce(
    (sum, order) =>
      sum + order.lines.filter((line) => line.customTee !== undefined).length,
    0,
  );

  return {
    totalOrders: orders.length,
    revenue,
    pending,
    customLines,
  };
}
