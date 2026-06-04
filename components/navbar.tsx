import { mainNavLinks } from "@/data/navigation";
import Link from "next/link";
import { NavbarActions } from "./navbar-actions";
import { NavbarMobile } from "./navbar-mobile";

const navLinks = mainNavLinks;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand/15 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Utility row */}
        <div className="relative flex h-14 items-center justify-between lg:h-16">
          <div className="flex w-24 items-center lg:w-40">
            <NavbarMobile />
          </div>

          <Link
            href="/"
            className="group absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center"
          >
            <span className="font-display text-lg font-normal uppercase tracking-[0.32em] text-brand sm:text-xl lg:text-2xl">
              Yoghurt
            </span>
            <span className="mt-1 text-[9px] font-normal uppercase tracking-[0.42em] text-brand/70 sm:text-[10px]">
              Clothing Gallery
            </span>
          </Link>

          <NavbarActions />
        </div>

        {/* Desktop navigation */}
        <nav
          className="hidden border-t border-brand/10 lg:block"
          aria-label="Main"
        >
          <ul className="flex items-center justify-center gap-12 py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] font-normal uppercase tracking-[0.28em] text-brand transition-opacity hover:opacity-60"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
