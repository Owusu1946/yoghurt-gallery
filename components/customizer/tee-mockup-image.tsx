"use client";

import type { CustomTeeSide } from "@/data/customizer";
import { teeMockupAssets } from "@/data/customizer-mockups";
import Image from "next/image";
import { useState } from "react";

type TeeMockupImageProps = {
  view: CustomTeeSide;
  className?: string;
};

export function TeeMockupImage({ view, className }: TeeMockupImageProps) {
  const [backFallback, setBackFallback] = useState(false);

  if (view === "front") {
    return (
      <div className={className}>
        <Image
          src={teeMockupAssets.front}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-contain object-center"
        />
      </div>
    );
  }

  if (!backFallback) {
    return (
      <div className={className}>
        <Image
          src={teeMockupAssets.back}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-contain object-center"
          onError={() => setBackFallback(true)}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={teeMockupAssets.frontBackCombined}
        alt=""
        className="absolute top-1/2 right-[4%] h-[94%] w-auto max-w-none -translate-y-1/2 object-contain"
      />
    </div>
  );
}
