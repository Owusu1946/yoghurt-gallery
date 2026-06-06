import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  priority?: boolean;
  /** Use when the logo sits beside visible brand text (e.g. navbar). */
  decorative?: boolean;
};

export function Logo({
  className,
  priority = false,
  decorative = false,
}: LogoProps) {
  return (
    <span
      className={cn("relative shrink-0", className)}
      aria-hidden={decorative ? true : undefined}
    >
      <Image
        src="/logo-main.png"
        alt={decorative ? "" : "Yoghurt Clothing Gallery"}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 48px, 56px"
        className="object-contain object-center"
      />
    </span>
  );
}
