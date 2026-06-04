"use client";

import { mainNavLinks } from "@/data/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { navIconProps } from "./nav-icon";

export function NavbarMobile() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu {...navIconProps} />
      </button>

      <div
        className={`fixed inset-0 z-50 bg-white transition-opacity duration-200 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="relative flex h-[4.5rem] items-center justify-center border-b border-brand/15 px-6">
          <button
            type="button"
            className="absolute left-6 flex h-10 w-10 items-center justify-center text-brand transition-opacity hover:opacity-60"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X {...navIconProps} />
          </button>
          <Link href="/" onClick={() => setOpen(false)} aria-label="Home">
            <Logo className="h-12 w-12" />
          </Link>
        </div>

        <nav className="flex flex-col px-6 py-10">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-brand/10 py-5 text-[11px] font-normal uppercase tracking-[0.28em] text-brand transition-opacity hover:opacity-60"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
