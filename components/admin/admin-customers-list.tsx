"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminCustomersFromDb, toggleUserBanStatus } from "@/app/actions/admin-users";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import Link from "next/link";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function AdminCustomersList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  async function loadData() {
    const dbCustomers = await getAdminCustomersFromDb();
    setCustomers(dbCustomers);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleToggleBan(userId: string, currentStatus: boolean) {
    // Optimistic update
    setCustomers(prev => 
      prev.map(c => c.id === userId ? { ...c, isBanned: !currentStatus } : c)
    );
    startTransition(async () => {
      await toggleUserBanStatus(userId, !currentStatus);
      await loadData(); // Refresh to ensure sync
    });
  }

  return (
    <AdminShell>
      <div className="border border-brand/10">
        {customers.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-brand/55">
            No registered customers yet.
          </p>
        ) : (
          <ul className="divide-y divide-brand/10">
            {customers.map((customer) => (
              <li
                key={customer.id}
                className={cn(
                  "flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
                  customer.isBanned && "bg-red-50/50"
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-brand flex items-center gap-2">
                    {customer.fullName || "Unnamed Customer"}
                    {customer.isBanned && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        Banned
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-brand/50">
                    {customer.email} {customer.phone ? `· ${customer.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-brand/45">
                    Joined {formatDate(customer.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <Link
                    href={`/admin/orders?userId=${customer.id}`}
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/55 hover:text-brand transition-colors"
                  >
                    {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"} →
                  </Link>
                  <button
                    onClick={() => handleToggleBan(customer.id, customer.isBanned)}
                    disabled={isPending}
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors",
                      customer.isBanned 
                        ? "text-brand/55 hover:text-brand" 
                        : "text-red-500/70 hover:text-red-600"
                    )}
                  >
                    {customer.isBanned ? "Unban" : "Ban"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
