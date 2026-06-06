"use client";

import { cn } from "@/lib/cn";
import type { AdminNavItem } from "@/data/admin-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarLinkProps = {
  item: AdminNavItem;
  onNavigate?: () => void;
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarLink({ item, onNavigate }: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex w-full items-center gap-2.5 border-l-2 py-2 pl-4 pr-2 text-left transition-colors",
        active
          ? "border-brand bg-brand/[0.04] font-semibold text-brand"
          : "border-transparent font-medium text-brand/65 hover:bg-brand/[0.02] hover:text-brand",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.5} />
      <span className="text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
    </Link>
  );
}
