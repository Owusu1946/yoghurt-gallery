import { cn } from "@/lib/cn";

type NavBadgeProps = {
  count: number;
  className?: string;
};

export function NavBadge({ count, className }: NavBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
