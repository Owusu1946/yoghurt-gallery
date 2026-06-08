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
import { createBrowserClient } from "@supabase/ssr";
import { getAllOrdersFromDb } from "@/app/actions/admin-orders";
import type { OrderCustomer } from "@/lib/orders";
import type { CartLine } from "@/context/cart-context";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pending: 0,
    customLines: 0,
    products: 0,
    customers: 0,
    recentOrders: [] as any[],
  });

  useEffect(() => {
    async function loadData() {
      const orders = await getAllOrdersFromDb();
      
      const revenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
      const pending = orders.filter((order) => order.status !== "delivered").length;
      const customLines = orders.reduce(
        (sum, order) =>
          sum + (order.lines as CartLine[]).filter((line) => line.customTee !== undefined).length,
        0,
      );

      setStats({
        totalOrders: orders.length,
        revenue,
        pending,
        customLines,
        products: getCatalogProducts().length,
        customers: getAllCustomers().length,
        recentOrders: orders.slice(0, 5),
      });
    }

    loadData();

    // Supabase Realtime Subscription
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          loadData(); // Re-fetch on insert to get full updated list
        }
      )
      .subscribe();

    window.addEventListener("yoghurt-admin-order-status", loadData);
    window.addEventListener("yoghurt-catalog-updated", loadData);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("yoghurt-admin-order-status", loadData);
      window.removeEventListener("yoghurt-catalog-updated", loadData);
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
            {stats.recentOrders.map((order) => {
              const customer = order.customer as OrderCustomer;
              const lines = order.lines as CartLine[];
              return (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${encodeURIComponent(order.id)}`}
                  className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-brand/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand">
                      {customer.fullName}
                    </p>
                    <p className="mt-1 text-xs text-brand/50">
                      {order.id} · {lines.length} item
                      {lines.length === 1 ? "" : "s"}
                      {lines.some((line) => line.customTee) ? " · Custom" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/55">
                      {orderStatusLabels[order.status as keyof typeof orderStatusLabels] || order.status}
                    </span>
                    <span className="text-sm font-semibold text-brand">
                      {formatGhs(order.subtotal)}
                    </span>
                  </div>
                </Link>
              </li>
            )})}
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
