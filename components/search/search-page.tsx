"use client";

import { ProductGrid } from "@/components/shop/product-grid";
import { popularSearches, searchCatalog } from "@/lib/search";
import { cn } from "@/lib/cn";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const updateUrl = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
          scroll: false,
        });
      } else {
        router.replace("/search", { scroll: false });
      }
    },
    [router],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim() !== initialQuery.trim()) {
        updateUrl(query);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, initialQuery, updateUrl]);

  const results = useMemo(() => searchCatalog(query), [query]);
  const hasQuery = query.trim().length >= 2;
  const totalResults = results.products.length + results.links.length;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateUrl(query);
  }

  return (
    <div className="page-shell flex flex-1 flex-col bg-white">
      <div className="sticky top-14 z-20 border-b border-brand/10 bg-white/95 px-4 py-4 backdrop-blur-md sm:px-6 lg:top-[7.25rem]">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
          <label htmlFor="site-search" className="sr-only">
            Search products and pages
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand/40"
              strokeWidth={1.25}
            />
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tees, jerseys, customize…"
              autoComplete="off"
              enterKeyHint="search"
              className="w-full border border-brand/20 bg-white py-3.5 pl-10 pr-10 text-sm text-brand outline-none placeholder:text-brand/35 focus:border-brand"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  updateUrl("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/50 hover:text-brand"
              >
                Clear
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {!hasQuery ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand/50">
              Popular
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {popularSearches.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block border border-brand/20 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand transition-colors hover:border-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-brand/55">
              Type at least 2 characters to search products and pages.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-brand/60">
              {totalResults === 0
                ? `No results for “${query.trim()}”`
                : `${totalResults} ${totalResults === 1 ? "result" : "results"} for “${query.trim()}”`}
            </p>

            {results.links.length > 0 ? (
              <section className="mt-8">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
                  Pages
                </h2>
                <ul className="mt-4 divide-y divide-brand/10 border-t border-brand/10">
                  {results.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex flex-col gap-1 py-4 transition-opacity hover:opacity-70"
                      >
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                          {link.title}
                        </span>
                        <span className="text-sm text-brand/55">
                          {link.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.products.length > 0 ? (
              <section className={cn(results.links.length > 0 && "mt-10")}>
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
                  Products
                </h2>
                <div className="mt-6">
                  <ProductGrid products={results.products} />
                </div>
              </section>
            ) : null}

            {totalResults === 0 ? (
              <div className="mt-10 border border-brand/10 bg-brand/[0.02] p-6 text-center">
                <p className="text-sm text-brand/65">
                  Try a different keyword, or browse the shop.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white"
                >
                  View all products
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
