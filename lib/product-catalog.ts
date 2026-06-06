import {
  allProducts,
  type Product,
  type ProductCategory,
} from "@/data/products";
import { ADMIN_PRODUCTS_KEY, readStorage, writeStorage } from "@/lib/storage";

export type ProductPatch = Partial<Omit<Product, "slug">> & { slug: string };

type ProductCatalogRegistry = {
  version: 1;
  added: Product[];
  updated: Record<string, ProductPatch>;
  hidden: string[];
};

const REGISTRY_VERSION = 1;
const CATALOG_EVENT = "yoghurt-catalog-updated";

function emptyRegistry(): ProductCatalogRegistry {
  return { version: REGISTRY_VERSION, added: [], updated: {}, hidden: [] };
}

function readRegistry(): ProductCatalogRegistry {
  const raw = readStorage<ProductCatalogRegistry | null>(ADMIN_PRODUCTS_KEY, null);
  if (!raw || raw.version !== REGISTRY_VERSION) return emptyRegistry();
  return raw;
}

function writeRegistry(registry: ProductCatalogRegistry): void {
  writeStorage(ADMIN_PRODUCTS_KEY, registry);
  window.dispatchEvent(new CustomEvent(CATALOG_EVENT));
}

function applyPatch(product: Product, patch: ProductPatch): Product {
  const { slug: _slug, ...rest } = patch;
  return { ...product, ...rest };
}

export function getCatalogProducts(): Product[] {
  const registry = readRegistry();
  const hidden = new Set(registry.hidden);

  const merged = allProducts
    .filter((product) => !hidden.has(product.slug))
    .map((product) => {
      const patch = registry.updated[product.slug];
      return patch ? applyPatch(product, patch) : product;
    });

  const existingSlugs = new Set(merged.map((product) => product.slug));
  for (const product of registry.added) {
    if (!hidden.has(product.slug) && !existingSlugs.has(product.slug)) {
      merged.push(product);
      existingSlugs.add(product.slug);
    }
  }

  return merged;
}

export function getCatalogProductBySlug(slug: string): Product | undefined {
  return getCatalogProducts().find((product) => product.slug === slug);
}

export function getCatalogProductsByCategory(category: ProductCategory): Product[] {
  return getCatalogProducts().filter((product) => product.category === category);
}

export function isAdminAddedProduct(slug: string): boolean {
  return readRegistry().added.some((product) => product.slug === slug);
}

export function isProductHidden(slug: string): boolean {
  return readRegistry().hidden.includes(slug);
}

export function saveAdminProduct(product: Product): void {
  const registry = readRegistry();
  const staticIndex = allProducts.findIndex((item) => item.slug === product.slug);
  const addedIndex = registry.added.findIndex((item) => item.slug === product.slug);

  if (staticIndex >= 0) {
    registry.updated[product.slug] = product;
    if (addedIndex >= 0) registry.added.splice(addedIndex, 1);
  } else if (addedIndex >= 0) {
    registry.added[addedIndex] = product;
  } else {
    registry.added.push(product);
  }

  writeRegistry(registry);
}

export function hideCatalogProduct(slug: string): void {
  const registry = readRegistry();
  if (!registry.hidden.includes(slug)) {
    registry.hidden.push(slug);
  }
  registry.added = registry.added.filter((product) => product.slug !== slug);
  delete registry.updated[slug];
  writeRegistry(registry);
}

export function restoreCatalogProduct(slug: string): void {
  const registry = readRegistry();
  registry.hidden = registry.hidden.filter((id) => id !== slug);
  writeRegistry(registry);
}

export function getCatalogRegistry(): ProductCatalogRegistry {
  return readRegistry();
}

export function subscribeCatalog(listener: () => void): () => void {
  const handler = () => listener();
  window.addEventListener(CATALOG_EVENT, handler);
  return () => window.removeEventListener(CATALOG_EVENT, handler);
}
