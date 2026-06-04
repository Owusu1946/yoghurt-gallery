import type { ProductCategory } from "./products";
import { categoryMeta } from "./products";

export type ShopFilterId = ProductCategory | "all";

export type ShopFilter = {
  id: ShopFilterId;
  label: string;
  description?: string;
  group?: string;
};

export const shopFilters: ShopFilter[] = [
  {
    id: "all",
    label: "All",
    description: "Everything in the collection.",
  },
  {
    id: "tees-plain",
    label: "Plain Tees",
    description: categoryMeta["tees-plain"].description,
    group: "Tees",
  },
  {
    id: "tees-designed",
    label: "Designed Tees",
    description: categoryMeta["tees-designed"].description,
    group: "Tees",
  },
  {
    id: "jerseys",
    label: "Jerseys",
    description: categoryMeta.jerseys.description,
    group: "Jerseys",
  },
  {
    id: "polo-long-sleeves",
    label: "Polo Long Sleeves",
    description: categoryMeta["polo-long-sleeves"].description,
    group: "Polos",
  },
];

export function getFilterLabel(id: ShopFilterId): string {
  return shopFilters.find((f) => f.id === id)?.label ?? "Shop";
}

export function getFilterDescription(id: ShopFilterId): string | undefined {
  return shopFilters.find((f) => f.id === id)?.description;
}
