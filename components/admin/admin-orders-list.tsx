"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAllOrders, type AdminOrderRow } from "@/lib/admin-orders";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const filters = ["all", "active", "delivered"] as const;
type OrderFilter = (typeof filters)[number];

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminOrdersList() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    function refresh() {
      setOrders(getAllOrders());
    }
    refresh();
    window.addEventListener("yoghurt-admin-order-status", refresh);
    return () => window.removeEventListener("yoghurt-admin-order-status", refresh);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter === "active" && order.status === "delivered") return false;
      if (filter === "delivered" && order.status !== "delivered") return false;
      if (!q) return true;
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.customer.email.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query]);

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
            {filtered.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${encodeURIComponent(order.id)}`}
                  className="block px-4 py-4 transition-colors hover:bg-brand/[0.02] sm:px-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-xs text-brand/50">
                        {formatOrderDate(order.createdAt)} · {order.id}
                      </p>
                      <p className="mt-2 text-xs text-brand/60">
                        {order.customer.phone} · {order.customer.deliverySummary}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/55">
                        {order.statusLabel}
                      </span>
                      <span className="text-sm font-semibold text-brand">
                        {formatGhs(order.subtotal)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
