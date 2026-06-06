"use client";

import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminSidebarNav } from "@/components/admin/admin-shell";
import { useAdmin } from "@/context/admin-context";
import { isAdminPublicPath } from "@/data/admin-nav";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminLayoutChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAdmin, hydrated, signOut } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const showAdminNav =
    hydrated && isAdmin && !isAdminPublicPath(pathname);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {showAdminNav ? (
        <AdminNavbar onMenuToggle={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      ) : null}

      {showAdminNav && menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {showAdminNav ? (
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-brand/10 bg-white pt-[var(--admin-nav-height)] transition-transform duration-200 lg:hidden",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!menuOpen}
        >
          <div className="h-full overflow-y-auto overscroll-y-contain px-2 py-4">
            <nav aria-label="Admin navigation">
              <AdminSidebarNav
                onSignOut={signOut}
                onNavigate={() => setMenuOpen(false)}
              />
            </nav>
          </div>
        </aside>
      ) : null}

      {children}
    </div>
  );
}
