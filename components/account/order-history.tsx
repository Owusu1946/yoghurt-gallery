"use client";

import { OrderCard } from "@/components/account/order-card";
import { getUserOrdersFromDb } from "@/app/actions/user-orders";
import type { StoredOrder } from "@/lib/orders";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";

type OrderHistoryProps = {
  userId: string;
};

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      const dbOrders = await getUserOrdersFromDb(userId);
      setOrders(dbOrders);
      setReady(true);
    }
    
    loadData();

    // Supabase Realtime Subscription for user's orders
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(`user-orders-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `user_id=eq.${userId}` },
        (payload) => {
          loadData();
        }
      )
      .subscribe();

    window.addEventListener("yoghurt-admin-order-status", loadData);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("yoghurt-admin-order-status", loadData);
    };
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
              order={order as StoredOrder}
              status={order.status}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
