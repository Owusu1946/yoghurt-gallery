import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
};

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "border border-brand/10 bg-white p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand/50">
            {label}
          </p>
          <p className="mt-3 font-display text-3xl font-semibold text-brand">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-xs leading-relaxed text-brand/55">{hint}</p>
          ) : null}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-brand/[0.03] text-brand">
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}
