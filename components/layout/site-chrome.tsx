"use client";

import { BottomNav } from "@/components/mobile/bottom-nav";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { isAdminPath } from "@/data/admin-nav";
import { usePathname } from "next/navigation";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideStoreChrome = isAdminPath(pathname);

  return (
    <>
      {!hideStoreChrome ? <Navbar /> : null}
      <main className="flex flex-1 flex-col">{children}</main>
      {!hideStoreChrome ? (
        <div className="hidden lg:block">
          <Footer />
        </div>
      ) : null}
      {!hideStoreChrome ? <BottomNav /> : null}
    </>
  );
}
