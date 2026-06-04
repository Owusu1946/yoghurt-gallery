import type { Product } from "@/data/products";
import { formatGhs } from "@/lib/format-ghs";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "./wishlist-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const isMockup = product.image.startsWith("/mockups");

  return (
    <div className="group relative">
      <WishlistButton
        productSlug={product.slug}
        className="absolute right-2 top-2 z-10 bg-white/90"
      />
      <Link href={`/shop/product/${product.slug}`} className="block">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand/[0.03]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]",
            isMockup ? "object-contain p-4" : "object-cover",
          )}
        />
      </div>
      <div className="mt-5 border-t border-brand/10 pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-brand">
          {formatGhs(product.priceGhs)}
        </p>
      </div>
    </Link>
    </div>
  );
}
