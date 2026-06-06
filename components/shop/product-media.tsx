"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { useState } from "react";

type ProductMediaProps = {
  front: string;
  back?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  contain?: boolean;
  className?: string;
  /** Card grid: hover flip only, no tap (keeps link navigation). */
  hoverFlipOnly?: boolean;
};

function MediaImage({
  src,
  alt,
  sizes,
  priority,
  contain,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  contain?: boolean;
}) {
  const imageClass = cn(
    "object-center",
    contain ? "object-contain p-4 sm:p-6" : "object-cover",
  );

  if (src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn("absolute inset-0 h-full w-full", imageClass)} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={imageClass}
    />
  );
}

export function ProductMedia({
  front,
  back,
  alt,
  sizes,
  priority,
  contain,
  className,
  hoverFlipOnly = false,
}: ProductMediaProps) {
  const [showBack, setShowBack] = useState(false);
  const hasBack = Boolean(back);

  if (!hasBack) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-brand/[0.03]", className)}>
        <MediaImage
          src={front}
          alt={alt}
          sizes={sizes}
          priority={priority}
          contain={contain}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/media relative h-full w-full overflow-hidden bg-brand/[0.03] [perspective:1000px]",
        className,
      )}
      onClick={hoverFlipOnly ? undefined : () => setShowBack((v) => !v)}
      role={hoverFlipOnly ? undefined : "button"}
      tabIndex={hoverFlipOnly ? undefined : 0}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
          !hoverFlipOnly && showBack && "[transform:rotateY(180deg)]",
          "lg:group-hover/media:[transform:rotateY(180deg)]",
        )}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <MediaImage src={front} alt={alt} sizes={sizes} priority={priority} contain={contain} />
        </div>
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <MediaImage src={back!} alt={`${alt} back`} sizes={sizes} contain={contain} />
        </div>
      </div>
      {!hoverFlipOnly ? (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand/55 lg:hidden">
          {showBack ? "Front" : "Back"}
        </span>
      ) : null}
      <span className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand/55 lg:block lg:opacity-0 lg:transition-opacity lg:group-hover/media:opacity-100">
        Back
      </span>
    </div>
  );
}
