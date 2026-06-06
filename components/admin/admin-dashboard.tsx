"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { getOrderStats, getAllOrders } from "@/lib/admin-orders";
import { getAllCustomers } from "@/lib/admin-users";
import { getCatalogProducts } from "@/lib/product-catalog";
import { formatGhs } from "@/lib/format-ghs";
import { orderStatusLabels } from "@/data/order-status";
import { Package, Palette, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [stats, setStats] = useState(() => ({
    ...getOrderStats(),
    products: getCatalogProducts().length,
    customers: getAllCustomers().length,
    recentOrders: getAllOrders().slice(0, 5),
  }));

  useEffect(() => {
    function refresh() {
      setStats({
        ...getOrderStats(),
        products: getCatalogProducts().length,
        customers: getAllCustomers().length,
        recentOrders: getAllOrders().slice(0, 5),
      });
    }

    refresh();
    window.addEventListener("yoghurt-admin-order-status", refresh);
    window.addEventListener("yoghurt-catalog-updated", refresh);
    return () => {
      window.removeEventListener("yoghurt-admin-order-status", refresh);
      window.removeEventListener("yoghurt-catalog-updated", refresh);
    };
  }, []);

  return (
    <AdminShell>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Orders"
          value={String(stats.totalOrders)}
          hint={`${stats.pending} still in progress`}
          icon={ShoppingBag}
        />
        <AdminStatCard
          label="Revenue"
          value={formatGhs(stats.revenue)}
          hint="Subtotal from placed orders"
          icon={Package}
        />
        <AdminStatCard
          label="Products"
          value={String(stats.products)}
          hint="Live catalog items"
          icon={Package}
        />
        <AdminStatCard
          label="Customers"
          value={String(stats.customers)}
          hint={`${stats.customLines} custom tee lines`}
          icon={Users}
        />
      </div>

      <section className="mt-8 border border-brand/10">
        <div className="flex justify-end border-b border-brand/10 px-4 py-3 sm:px-5">
          <Link
            href="/admin/orders"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/55 hover:text-brand"
          >
            All orders →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="px-4 py-10 text-sm text-brand/55 sm:px-5">
            No orders yet. Place a test order from checkout while signed in.
          </p>
        ) : (
          <ul className="divide-y divide-brand/10">
            {stats.recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${encodeURIComponent(order.id)}`}
                  className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-brand/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand">
                      {order.customerName}
                    </p>
                    <p className="mt-1 text-xs text-brand/50">
                      {order.id} · {order.lines.length} item
                      {order.lines.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/55">
                      {orderStatusLabels[order.status]}
                    </span>
                    <span className="text-sm font-semibold text-brand">
                      {formatGhs(order.subtotal)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 border border-brand/10 p-4 transition-colors hover:border-brand/25 hover:bg-brand/[0.02] sm:p-5"
        >
          <Palette className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-brand">Add a product</span>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 border border-brand/10 p-4 transition-colors hover:border-brand/25 hover:bg-brand/[0.02] sm:p-5"
        >
          <Package className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-brand">Store settings</span>
        </Link>
      </section>
    </AdminShell>
  );
}
