import type { CustomTeeSide } from "@/data/customizer";
import { teeMockupAssets } from "@/data/customizer-mockups";
import Image from "next/image";

type TeeMockupImageProps = {
  view: CustomTeeSide;
  className?: string;
};

export function TeeMockupImage({ view, className }: TeeMockupImageProps) {
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
