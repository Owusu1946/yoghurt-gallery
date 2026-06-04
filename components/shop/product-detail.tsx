import type { Product } from "@/data/products";
import { categoryMeta } from "@/data/products";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { ProductPurchaseOptions } from "./product-purchase-options";
import { WishlistButton } from "./wishlist-button";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const isMockup = product.image.startsWith("/mockups");
  const backHref = `/shop?category=${categoryMeta[product.category].collectionSlug}`;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:pb-20 lg:pt-8">
      <Link
        href={backHref}
        className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/60 transition-opacity hover:text-brand"
      >
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-16">
        {/* Details — left on desktop */}
        <div className="order-2 flex flex-col lg:order-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand/50">
            {categoryMeta[product.category].title}
          </p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-semibold text-brand sm:text-4xl">
              {product.name}
            </h1>
            <WishlistButton
              productSlug={product.slug}
              className="shrink-0 lg:hidden"
            />
          </div>
          <p className="mt-3 text-lg font-semibold text-brand">
            {formatGhs(product.priceGhs)}
          </p>
          <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-brand/75">
            {product.description}
          </p>

          <div className="mt-10">
            <ProductPurchaseOptions product={product} />
          </div>

          <div className="mt-12 border-t border-brand/10 pt-8">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
              Product details
            </h2>
            <ul className="mt-4 space-y-2.5">
              {product.details.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-2 text-sm font-medium text-brand/75"
                >
                  <span className="text-brand/35" aria-hidden>
                    —
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Image — right on desktop */}
        <div className="relative order-1 aspect-[3/4] w-full bg-brand/[0.03] lg:order-2 lg:sticky lg:top-28 lg:self-start">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-center",
              isMockup ? "object-contain p-6 lg:p-10" : "object-cover",
            )}
          />
        </div>
      </div>
    </div>
  );
}
