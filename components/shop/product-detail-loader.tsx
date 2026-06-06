"use client";

import { ProductDetail } from "@/components/shop/product-detail";
import type { Product } from "@/data/products";
import { getCatalogProductBySlug, subscribeCatalog } from "@/lib/product-catalog";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProductDetailLoaderProps = {
  slug: string;
  staticProduct: Product | null;
};

export function ProductDetailLoader({
  slug,
  staticProduct,
}: ProductDetailLoaderProps) {
  const [product, setProduct] = useState<Product | null>(
    () => getCatalogProductBySlug(slug) ?? staticProduct,
  );

  useEffect(() => {
    function refresh() {
      setProduct(getCatalogProductBySlug(slug) ?? staticProduct);
    }
    refresh();
    return subscribeCatalog(refresh);
  }, [slug, staticProduct]);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-brand">
          Product not found
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.22em] text-brand"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
