import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className, priority = false }: LogoProps) {
  return (
    <Image
      src="/logo-main.jpg"
      alt="Yoghurt Clothing Gallery"
      width={160}
      height={160}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
