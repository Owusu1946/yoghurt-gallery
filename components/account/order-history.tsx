"use client";

import { OrderCard } from "@/components/account/order-card";
import { deriveOrderStatus } from "@/data/order-status";
import { getUserOrders } from "@/lib/order-history";
import type { StoredOrder } from "@/lib/orders";
import Link from "next/link";
import { useEffect, useState } from "react";

type OrderHistoryProps = {
  userId: string;
};

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(getUserOrders(userId));
    setReady(true);
  }, [userId]);

  if (!ready) {
    return null;
  }

  if (orders.length === 0) {
    return (
      <div className="mt-10 border-t border-brand/10 pt-8">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          Your orders
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-brand/60">
          No orders yet. When you place an order, it will show up here so you
          can track delivery.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.22em] text-brand underline-offset-2 hover:underline"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 border-t border-brand/10 pt-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          Your orders
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/45">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <OrderCard
              order={order}
              status={deriveOrderStatus(order.createdAt)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
