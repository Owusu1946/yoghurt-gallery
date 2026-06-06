import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group?: string;
};

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    description: "Store snapshot and quick stats",
    icon: LayoutDashboard,
    group: "Main",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    description: "Track and update customer orders",
    icon: ShoppingBag,
    group: "Main",
  },
  {
    href: "/admin/products",
    label: "Products",
    description: "Manage catalog and pricing",
    icon: Package,
    group: "Catalog",
  },
  {
    href: "/admin/customers",
    label: "Customers",
    description: "Registered accounts on this device",
    icon: Users,
    group: "People",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Customizer pricing and store options",
    icon: Settings,
    group: "Store",
  },
];

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isAdminPublicPath(pathname: string): boolean {
  return pathname === "/admin/sign-in";
}
