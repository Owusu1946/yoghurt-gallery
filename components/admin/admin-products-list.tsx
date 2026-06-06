"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { categoryMeta, isProductSoldOut } from "@/data/products";
import { formatGhs } from "@/lib/format-ghs";
import {
  getCatalogProducts,
  hideCatalogProduct,
  isAdminAddedProduct,
  isProductHidden,
  subscribeCatalog,
} from "@/lib/product-catalog";
import type { Product } from "@/data/products";
import { toast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    function refresh() {
      setProducts(getCatalogProducts());
    }
    refresh();
    return subscribeCatalog(refresh);
  }, []);

  function handleHide(slug: string, name: string) {
    if (!window.confirm(`Hide "${name}" from the catalog?`)) return;
    hideCatalogProduct(slug);
    toast.success("Product hidden", { description: name });
  }

  return (
    <AdminShell
      toolbar={
        <Link
          href="/admin/products/new"
          className="inline-flex border border-brand bg-brand px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.24em]"
        >
          Add product
        </Link>
      }
    >
      <div className="border border-brand/10">
        {products.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-brand/55">
            No products in catalog.
          </p>
        ) : (
          <ul className="divide-y divide-brand/10">
            {products.map((product) => (
              <li
                key={product.slug}
                className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-brand/10 bg-brand/[0.03]">
                    {product.image.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-brand/50">
                      {categoryMeta[product.category].title} · {product.slug}
                      {isAdminAddedProduct(product.slug) ? " · added" : ""}
                      {isProductHidden(product.slug) ? " · hidden" : ""}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-brand">
                      {formatGhs(product.priceGhs)}
                      {product.stock !== undefined ? (
                        <span
                          className={
                            isProductSoldOut(product)
                              ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-brand/45"
                              : "text-[10px] font-normal text-brand/50"
                          }
                        >
                          · {isProductSoldOut(product) ? "Sold out" : `${product.stock} in stock`}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/shop/product/${product.slug}`}
                    className="border border-brand/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/60 hover:text-brand"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/products/${encodeURIComponent(product.slug)}`}
                    className="border border-brand/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand hover:border-brand"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleHide(product.slug, product.name)}
                    className="border border-brand/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/45 hover:text-red-700"
                  >
                    Hide
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
