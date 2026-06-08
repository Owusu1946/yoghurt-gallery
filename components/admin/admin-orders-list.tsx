"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAllOrdersFromDb } from "@/app/actions/admin-orders";
import { createBrowserClient } from "@supabase/ssr";
import { orderStatusLabels } from "@/data/order-status";
import type { OrderCustomer } from "@/lib/orders";
import type { CartLine } from "@/context/cart-context";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const filters = ["all", "active", "delivered"] as const;
type OrderFilter = (typeof filters)[number];

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminOrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const filterUserId = searchParams.get("userId");

  useEffect(() => {
    async function loadData() {
      const dbOrders = await getAllOrdersFromDb();
      setOrders(dbOrders);
    }
    
    loadData();

    // Supabase Realtime Subscription
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel("admin-orders-list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
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
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (filterUserId && order.userId !== filterUserId) return false;
      if (filter === "active" && order.status === "delivered") return false;
      if (filter === "delivered" && order.status !== "delivered") return false;
      if (!q) return true;
      const customer = order.customer as OrderCustomer;
      return (
        order.id.toLowerCase().includes(q) ||
        customer.fullName.toLowerCase().includes(q) ||
        customer.phone.includes(q) ||
        customer.email.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query, filterUserId]);

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {filters.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors",
                filter === id
                  ? "border-brand bg-brand text-white"
                  : "border-brand/20 text-brand/55 hover:border-brand/40",
              )}
            >
              {id}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders…"
          className="w-full border border-brand/20 bg-white px-3 py-2.5 text-sm text-brand outline-none focus:border-brand sm:max-w-xs"
        />
      </div>

      <div className="mt-6 border border-brand/10">
        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-brand/55">
            No orders match your filters.
          </p>
        ) : (
          <ul className="divide-y divide-brand/10">
            {filtered.map((order) => {
              const customer = order.customer as OrderCustomer;
              const lines = order.lines as CartLine[];
              return (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${encodeURIComponent(order.id)}`}
                  className="block px-4 py-4 transition-colors hover:bg-brand/[0.02] sm:px-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand">
                        {customer.fullName}
                      </p>
                      <p className="mt-1 text-xs text-brand/50">
                        {formatOrderDate(order.createdAt)} · {order.id}
                        {lines.some((line) => line.customTee) ? " · Custom" : ""}
                      </p>
                      <p className="mt-2 text-xs text-brand/60">
                        {customer.phone} · {customer.deliverySummary}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/55">
                        {orderStatusLabels[order.status as keyof typeof orderStatusLabels] || order.status}
                      </span>
                      <span className="text-sm font-semibold text-brand">
                        {formatGhs(order.subtotal)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            )})}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
