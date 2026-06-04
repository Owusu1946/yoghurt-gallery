import { ShopCatalog } from "@/components/shop/shop-catalog";
import { ShopPageHeader } from "@/components/shop/shop-page-header";
import { getCategoryFromCollectionSlug } from "@/data/products";
import type { ShopFilterId } from "@/data/shop-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | Yoghurt Clothing Gallery",
  description:
    "Plain and designed graphic tees, jerseys, and polo long sleeves — priced in Ghana cedis.",
};

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ShopPage({ searchParams }: PageProps) {
  const { category: categorySlug } = await searchParams;
  const productCategory = categorySlug
    ? getCategoryFromCollectionSlug(categorySlug)
    : undefined;

  const initialFilter: ShopFilterId = productCategory ?? "all";

  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <ShopPageHeader />
      <ShopCatalog initialFilter={initialFilter} />
    </div>
  );
}
