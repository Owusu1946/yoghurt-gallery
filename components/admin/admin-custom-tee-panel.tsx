"use client";

import { sideHasPrint, type CustomTeeDesign } from "@/data/customizer";
import type { ProductSize } from "@/data/products";
import {
  listCustomTeeAssets,
  renderCustomTeePreview,
} from "@/lib/custom-tee-assets";
import { assetFilename, downloadRemoteAsset } from "@/lib/download-asset";
import { normalizeCustomTeeDesign } from "@/lib/customizer-migrate";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AdminCustomTeePanelProps = {
  lineId: string;
  name: string;
  size: ProductSize;
  quantity: number;
  design: CustomTeeDesign;
};

export function AdminCustomTeePanel({
  lineId,
  name,
  size,
  quantity,
  design,
}: AdminCustomTeePanelProps) {
  const normalized = useMemo(
    () => normalizeCustomTeeDesign(design),
    [design],
  );
  const assets = listCustomTeeAssets(normalized);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSide(side: "front" | "back", setPreview: (url: string | null) => void) {
      try {
        const preview = await renderCustomTeePreview(normalized, side);
        if (!cancelled) {
          setPreview(preview);
        }
      } catch (err) {
        console.error(`Failed to render ${side} preview:`, err);
      }
    }
    void loadSide("front", setFrontPreview);
    void loadSide("back", setBackPreview);
    return () => {
      cancelled = true;
    };
  }, [normalized]);

  async function downloadArtwork(side: "front" | "back") {
    const url = normalized[side].image;
    if (!url) return;
    setDownloading(side);
    try {
      await downloadRemoteAsset(
        url,
        assetFilename(url, `${lineId}-${side}-artwork.png`),
      );
    } finally {
      setDownloading(null);
    }
  }

  function downloadPreview(side: "front" | "back") {
    const previewUrl = side === "front" ? frontPreview : backPreview;
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${lineId}-${side}-preview.png`;
    link.click();
  }

  const frontHasImage = Boolean(normalized.front.image);
  const backHasImage = Boolean(normalized.back.image);

  return (
    <div className="border border-brand/10 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand">{name}</p>
          <p className="mt-1 text-xs text-brand/55">
            Size {size} · Qty {quantity} · {normalized.colorName} tee
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {frontHasImage ? (
            <button
              type="button"
              disabled={downloading === "front"}
              onClick={() => void downloadArtwork("front")}
              className="flex items-center gap-1.5 border border-brand/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand hover:border-brand"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Front artwork
            </button>
          ) : null}
          {frontPreview ? (
            <button
              type="button"
              onClick={() => downloadPreview("front")}
              className="flex items-center gap-1.5 border border-brand/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand hover:border-brand"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Front preview
            </button>
          ) : null}
          {backHasImage ? (
            <button
              type="button"
              disabled={downloading === "back"}
              onClick={() => void downloadArtwork("back")}
              className="flex items-center gap-1.5 border border-brand/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand hover:border-brand"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Back artwork
            </button>
          ) : null}
          {backPreview ? (
            <button
              type="button"
              onClick={() => downloadPreview("back")}
              className="flex items-center gap-1.5 border border-brand/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand hover:border-brand"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Back preview
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/45">
            Front preview
            {!sideHasPrint(normalized.front) ? (
              <span className="ml-1 font-normal normal-case text-brand/35">
                (no design)
              </span>
            ) : null}
          </p>
          <div className="aspect-[4/5] overflow-hidden border border-brand/10 bg-brand/[0.02]">
            {frontPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={frontPreview} alt="" className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-brand/40">
                Rendering…
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/45">
            Back preview
            {!sideHasPrint(normalized.back) ? (
              <span className="ml-1 font-normal normal-case text-brand/35">
                (no design)
              </span>
            ) : null}
          </p>
          <div className="aspect-[4/5] overflow-hidden border border-brand/10 bg-brand/[0.02]">
            {backPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={backPreview} alt="" className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-brand/40">
                Rendering…
              </div>
            )}
          </div>
        </div>
      </div>

      {assets.length > 0 ? (
        <ul className="mt-5 divide-y divide-brand/10 border-t border-brand/10">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {asset.label}
                </p>
                {asset.meta ? (
                  <p className="mt-1 text-xs text-brand/55">{asset.meta}</p>
                ) : null}
              </div>
              {asset.kind === "image" ? (
                <button
                  type="button"
                  onClick={() =>
                    void downloadRemoteAsset(
                      asset.href,
                      assetFilename(asset.href, `${lineId}-${asset.side}.png`),
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/60 hover:text-brand"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Download file
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
