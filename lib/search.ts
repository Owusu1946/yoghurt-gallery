import { mainNavLinks, shopLinks } from "@/data/navigation";
import { categoryMeta, type Product } from "@/data/products";
import { shopFilters } from "@/data/shop-filters";

export type SearchLinkResult = {
  type: "link";
  title: string;
  description: string;
  href: string;
};

export type SearchResult = {
  products: Product[];
  links: SearchLinkResult[];
};

const navigationalLinks: SearchLinkResult[] = [
  ...mainNavLinks.map((link) => ({
    type: "link" as const,
    title: link.label,
    description: "Browse this section",
    href: link.href,
  })),
  ...shopLinks.map((link) => ({
    type: "link" as const,
    title: link.label,
    description: "Shop collection",
    href: link.href,
  })),
  {
    type: "link",
    title: "Customize your tee",
    description: "Upload art and preview before you order",
    href: "/customize",
  },
  {
    type: "link",
    title: "Contact",
    description: "Get in touch with our team",
    href: "/contact",
  },
];

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query);
}

export function searchCatalog(
  query: string,
  catalog: Product[] = [],
): SearchResult {
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    return { products: [], links: [] };
  }

  const products = catalog.filter((product) => {
    const categoryLabel = categoryMeta[product.category].title;
    return (
      matchesQuery(product.name, q) ||
      matchesQuery(product.description, q) ||
      matchesQuery(product.slug, q) ||
      matchesQuery(categoryLabel, q) ||
      product.details.some((detail) => matchesQuery(detail, q))
    );
  });

  const links = navigationalLinks.filter(
    (link) =>
      matchesQuery(link.title, q) || matchesQuery(link.description, q),
  );

  shopFilters.forEach((filter) => {
    if (filter.id !== "all" && matchesQuery(filter.label, q)) {
      const href = `/shop?category=${categoryMeta[filter.id].collectionSlug}`;
      if (!links.some((l) => l.href === href)) {
        links.push({
          type: "link",
          title: filter.label,
          description: filter.description ?? "Shop collection",
          href,
        });
      }
    }
  });

  return { products, links };
}

export const popularSearches = [
  { label: "Graphic tees", href: "/shop?category=graphic-tees" },
  { label: "Plain tees", href: "/shop?category=plain-tees" },
  { label: "Customize", href: "/customize" },
  { label: "Jerseys", href: "/shop?category=jerseys" },
] as const;
