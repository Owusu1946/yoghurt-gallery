"use client";

import {
  allProducts,
  categoryMeta,
  getProductsByCategory,
} from "@/data/products";
import {
  getFilterDescription,
  getFilterLabel,
  shopFilters,
  type ShopFilterId,
} from "@/data/shop-filters";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ProductGrid } from "./product-grid";

type ShopCatalogProps = {
  initialFilter?: ShopFilterId;
};

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full border-l-2 py-2.5 pl-4 text-left text-[11px] uppercase tracking-[0.22em] transition-colors",
        active
          ? "border-brand font-semibold text-brand"
          : "border-transparent font-medium text-brand/45 hover:text-brand",
      )}
    >
      {label}
    </button>
  );
}

export function ShopCatalog({ initialFilter = "all" }: ShopCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<ShopFilterId>(initialFilter);

  const products = useMemo(() => {
    if (activeFilter === "all") return allProducts;
    return getProductsByCategory(activeFilter);
  }, [activeFilter]);

  const setFilter = useCallback((id: ShopFilterId) => {
    setActiveFilter(id);
    const url =
      id === "all"
        ? "/shop"
        : `/shop?category=${categoryMeta[id].collectionSlug}`;
    window.history.replaceState(null, "", url);
  }, []);

  const activeLabel = getFilterLabel(activeFilter);
  const activeDescription = getFilterDescription(activeFilter);

  const teesFilters = shopFilters.filter((f) => f.group === "Tees");
  const otherFilters = shopFilters.filter(
    (f) => f.id !== "all" && f.group !== "Tees",
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 lg:flex-row lg:gap-14 lg:pb-20 lg:pt-6">
      {/* Sidebar — desktop */}
      <aside className="hidden shrink-0 lg:block lg:w-52 xl:w-56">
        <nav
          className="sticky top-28"
          aria-label="Shop categories"
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
            Filter
          </p>

          <FilterButton
            label="All"
            active={activeFilter === "all"}
            onClick={() => setFilter("all")}
          />

          <p className="mb-2 mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
            Tees
          </p>
          {teesFilters.map((filter) => (
            <FilterButton
              key={filter.id}
              label={filter.label}
              active={activeFilter === filter.id}
              onClick={() => setFilter(filter.id)}
            />
          ))}

          {otherFilters.map((filter) => (
            <div key={filter.id} className="mt-8">
              <FilterButton
                label={filter.label}
                active={activeFilter === filter.id}
                onClick={() => setFilter(filter.id)}
              />
            </div>
          ))}
        </nav>

        <div className="mt-10 border-t border-brand/10 pt-8">
          <Link
            href="/customize"
            className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-brand transition-opacity hover:opacity-60"
          >
            Customize your tee →
          </Link>
        </div>
      </aside>

      {/* Mobile filters — horizontal */}
      <div className="lg:hidden">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
          Filter
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {shopFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setFilter(filter.id)}
              className={cn(
                "shrink-0 border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors",
                activeFilter === filter.id
                  ? "border-brand bg-brand text-white"
                  : "border-brand/20 text-brand/60 hover:border-brand/40 hover:text-brand",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="min-w-0 flex-1">
        <Link
          href="/customize"
          className="mb-8 flex items-center justify-between border border-brand/15 bg-brand/[0.03] px-5 py-4 transition-opacity hover:opacity-80 lg:hidden"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
            Customize your tee
          </span>
          <span className="text-brand/50">→</span>
        </Link>

        <header className="mb-8 border-b border-brand/10 pb-6 lg:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand/50">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-brand sm:text-3xl">
            {activeLabel}
          </h2>
          {activeDescription ? (
            <p className="mt-3 max-w-lg text-sm font-medium text-brand/70">
              {activeDescription}
            </p>
          ) : null}
        </header>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
