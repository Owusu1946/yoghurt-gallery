"use client";

import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { navIconProps } from "@/components/nav-icon";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  ariaLabel: string;
  children: ReactNode;
};

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  ariaLabel,
  children,
}: SheetProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300 lg:bg-black/20",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "absolute flex flex-col bg-white transition-transform duration-300 ease-out",
          "inset-x-0 bottom-0 max-h-[min(92dvh,900px)] rounded-t-2xl shadow-[0_-8px_40px_rgb(0_0_0/0.12)]",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:max-h-none lg:h-full lg:w-full lg:max-w-md lg:rounded-none lg:border-l lg:border-brand/10 lg:shadow-none",
          open
            ? "translate-y-0 lg:translate-x-0 lg:translate-y-0"
            : "translate-y-full lg:translate-y-0 lg:translate-x-full",
        )}
      >
        <div className="flex shrink-0 flex-col items-center pt-3 lg:hidden">
          <span className="h-1 w-10 rounded-full bg-brand/15" aria-hidden />
        </div>

        <header className="flex shrink-0 items-center justify-between border-b border-brand/10 px-5 py-4 lg:px-6 lg:py-5">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
              {title}
            </p>
            {subtitle ? (
              <h2 className="mt-1 truncate font-display text-xl font-semibold text-brand sm:text-2xl">
                {subtitle}
              </h2>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-brand transition-opacity hover:bg-brand/[0.04] hover:opacity-80"
            aria-label="Close"
          >
            <X {...navIconProps} />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </aside>
    </div>
  );
}
