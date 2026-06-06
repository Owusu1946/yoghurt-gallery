"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAllCustomers } from "@/lib/admin-users";
import { useEffect, useState } from "react";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function AdminCustomersList() {
  const [customers, setCustomers] = useState(() => getAllCustomers());

  useEffect(() => {
    setCustomers(getAllCustomers());
  }, []);

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
                className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div>
                  <p className="text-sm font-semibold text-brand">
                    {customer.fullName}
                  </p>
                  <p className="mt-1 text-xs text-brand/50">
                    {customer.email} · {customer.phone}
                  </p>
                  <p className="mt-1 text-xs text-brand/45">
                    Joined {formatDate(customer.createdAt)}
                  </p>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/55">
                  {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
