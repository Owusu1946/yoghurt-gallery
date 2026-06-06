"use client";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminLayoutChrome } from "@/components/admin/admin-layout-chrome";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayoutChrome>{children}</AdminLayoutChrome>
    </AdminGuard>
  );
}
