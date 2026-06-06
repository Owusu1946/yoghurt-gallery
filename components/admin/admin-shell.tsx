"use client";

import { adminNavItems } from "@/data/admin-nav";
import { useAdmin } from "@/context/admin-context";
import { AdminSidebarLink } from "@/components/admin/admin-sidebar-link";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

type AdminShellProps = {
  toolbar?: React.ReactNode;
  children: React.ReactNode;
};

const navGroups = ["Main", "Catalog", "People", "Store"] as const;

export function AdminSidebarNav({
  onSignOut,
  onNavigate,
}: {
  onSignOut: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navGroups.map((group, index) => {
        const items = adminNavItems.filter((item) => item.group === group);
        if (items.length === 0) return null;

        return (
          <div key={group} className={index === 0 ? "" : "mt-5"}>
            {group !== "Main" ? (
              <p className="mb-1.5 px-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-brand/40">
                {group}
              </p>
            ) : null}
            {items.map((item) => (
              <AdminSidebarLink
                key={item.href}
                item={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        );
      })}

      <div className="mt-6 space-y-1 border-t border-brand/10 pt-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 py-2 pl-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand transition-opacity hover:opacity-70"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Back to store
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            onSignOut();
          }}
          className="flex w-full items-center gap-2.5 py-2 pl-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/55 transition-colors hover:text-brand"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </>
  );
}

export function AdminShell({ toolbar, children }: AdminShellProps) {
  const { signOut } = useAdmin();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-20 pt-4 sm:px-6 lg:flex-row lg:gap-10 lg:pb-10 lg:pt-5">
        <aside className="hidden w-48 shrink-0 lg:block xl:w-52">
          <div className="sticky top-[var(--admin-nav-height)] max-h-[calc(100vh-var(--admin-nav-height))] overflow-y-auto overscroll-y-contain py-1">
            <nav aria-label="Admin navigation">
              <AdminSidebarNav onSignOut={signOut} />
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {toolbar ? (
            <div className="mb-4 flex justify-end sm:mb-5">{toolbar}</div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
