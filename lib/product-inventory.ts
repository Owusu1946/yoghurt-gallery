import type { CartLine } from "@/context/cart-context";
import { getCatalogProductBySlug, saveAdminProduct } from "@/lib/product-catalog";
import type { Product } from "@/data/products";

function lineDemand(lines: CartLine[]): Map<string, number> {
  const demand = new Map<string, number>();
  for (const line of lines) {
    if (line.customTee || line.productSlug === "custom-tee") continue;
    demand.set(
      line.productSlug,
      (demand.get(line.productSlug) ?? 0) + line.quantity,
    );
  }
  return demand;
}

export function getMaxPurchaseQuantity(product: Product): number {
  if (product.stock === undefined) return 99;
  return Math.max(0, product.stock);
}

export function validateCartStock(lines: CartLine[]): string | null {
  const demand = lineDemand(lines);

  for (const [slug, qty] of demand) {
    const product = getCatalogProductBySlug(slug);
    if (!product || product.stock === undefined) continue;
    if (product.stock < qty) {
      return product.stock <= 0
        ? `${product.name} is sold out.`
        : `Only ${product.stock} left for ${product.name}.`;
    }
  }

  return null;
}

export function fulfillOrderStock(lines: CartLine[]): void {
  const demand = lineDemand(lines);

  for (const [slug, qty] of demand) {
    const product = getCatalogProductBySlug(slug);
    if (!product || product.stock === undefined) continue;
    saveAdminProduct({
      ...product,
      stock: Math.max(0, product.stock - qty),
    });
  }
}
