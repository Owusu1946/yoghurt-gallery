"use client";

import { ImageUploadZone } from "@/components/upload/image-upload-zone";

type ProductImagesUploadProps = {
  front: string;
  back: string;
  onFrontChange: (value: string) => void;
  onBackChange: (value: string) => void;
};

export function ProductImagesUpload({
  front,
  back,
  onFrontChange,
  onBackChange,
}: ProductImagesUploadProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ImageUploadZone
        endpoint="catalogImage"
        label="Front"
        value={front}
        onChange={onFrontChange}
      />
      <ImageUploadZone
        endpoint="catalogImage"
        label="Back"
        value={back}
        onChange={onBackChange}
        optional
      />
    </div>
  );
}
