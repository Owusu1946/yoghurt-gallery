"use client";

import { useAdmin } from "@/context/admin-context";
import { isAdminPublicPath } from "@/data/admin-nav";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { hydrated, isAdmin } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = isAdminPublicPath(pathname);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAdmin && !isPublic) {
      router.replace("/admin/sign-in");
    }
    if (isAdmin && isPublic) {
      router.replace("/admin");
    }
  }, [hydrated, isAdmin, isPublic, router]);

  if (!hydrated) return null;
  if (!isAdmin && !isPublic) return null;
  if (isAdmin && isPublic) return null;

  return <>{children}</>;
}
