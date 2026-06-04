import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className, priority = false }: LogoProps) {
  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      <Image
        src="/logo-main.jpg"
        alt="Yoghurt Clothing Gallery"
        fill
        priority={priority}
        sizes="112px"
        className="object-contain object-center"
      />
    </span>
  );
}
