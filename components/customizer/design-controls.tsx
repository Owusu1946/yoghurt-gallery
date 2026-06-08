"use client";

import { ImageUploadZone } from "@/components/upload/image-upload-zone";
import type { CustomTeeSide } from "@/data/customizer";
import { PlacementControls } from "./placement-controls";

type DesignUploadProps = {
  side: CustomTeeSide;
  designUrl: string | null;
  error: string | null;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
};

export function DesignUpload({
  side,
  designUrl,
  error,
  onUploaded,
  onError,
}: DesignUploadProps) {
  return (
    <div>
      <ImageUploadZone
        endpoint="customDesign"
        label={`${side} image`}
        hint="PNG recommended · 50MB max"
        compact
        value={designUrl ?? ""}
        onChange={onUploaded}
        onError={onError}
      />
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-700">{error}</p>
      ) : null}
    </div>
  );
}

export { PlacementControls };
