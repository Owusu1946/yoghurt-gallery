import { slugify } from "@/lib/slugify";

export type ProductCategory =
  | "tees-plain"
  | "tees-designed"
  | "jerseys"
  | "polo-long-sleeves";

export const PRODUCT_SIZES = ["S", "M", "L", "2XL", "3XL", "4XL"] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  image: string;
  imageBack?: string;
  priceGhs: number;
  category: ProductCategory;
  description: string;
  details: string[];
  colors?: ProductColor[];
  /** When set, product sells out at 0. Omit for unlimited stock. */
  stock?: number;
};

export function isProductSoldOut(product: Product): boolean {
  return product.stock !== undefined && product.stock <= 0;
}

export function getProductStock(product: Product): number | null {
  return product.stock !== undefined ? product.stock : null;
}

const plainTeeColors: ProductColor[] = [
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "black", name: "Black", hex: "#1A1A1A" },
  { id: "grey", name: "Grey", hex: "#9CA3AF" },
  { id: "navy", name: "Navy", hex: "#1E3A5F" },
  { id: "sand", name: "Sand", hex: "#D4C4A8" },
  { id: "rust", name: "Rust", hex: "#8B3A1F" },
];

function baseDetails(category: ProductCategory): string[] {
  switch (category) {
    case "tees-plain":
      return [
        "Premium cotton jersey",
        "Ribbed crew neckline",
        "Relaxed, everyday fit",
        "Made to order in Accra",
      ];
    case "tees-designed":
      return [
        "High-quality print on premium cotton",
        "Vibrant, long-lasting graphic",
        "Comfortable casual fit",
        "Wash inside out for best results",
      ];
    case "jerseys":
      return [
        "Lightweight sport-inspired fabric",
        "Breathable for everyday wear",
        "Relaxed athletic fit",
        "Custom team orders available",
      ];
    case "polo-long-sleeves":
      return [
        "Soft cotton blend",
        "Classic polo collar",
        "Long sleeve, smart casual",
        "Ideal for uniforms and events",
      ];
  }
}

function baseDescription(category: ProductCategory, name: string): string {
  switch (category) {
    case "tees-plain":
      return "A clean essential — premium plain cotton tee, ready for everyday wear or your own custom print.";
    case "tees-designed":
      return `${name} — original Yoghurt graphic tee. Express your style with a bold, high-quality print.`;
    case "jerseys":
      return `${name} — sport-inspired jersey cut for comfort and stand-out street style.`;
    case "polo-long-sleeves":
      return `${name} — long-sleeve polo with a polished look for casual and uniform orders.`;
  }
}

function teeImage(filename: string): string {
  return `/shop/tees/${encodeURIComponent(filename)}`;
}

function nameFromFilename(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

const designedTeeFiles = [
  "Age Is No Escuse.jpg",
  "Alright!.jpg",
  "Blood Thirst.jpg",
  "Don Toliver.jpg",
  "Silent But.jpg",
] as const;

export const plainTees: Product[] = [
  {
    slug: "plain-tee",
    name: "Plain Tee",
    image: "/shop/tees/Plain.jpg",
    priceGhs: 85,
    category: "tees-plain",
    description: baseDescription("tees-plain", "Plain Tee"),
    details: baseDetails("tees-plain"),
    colors: plainTeeColors,
  },
];

export const designedTees: Product[] = designedTeeFiles.map((file) => {
  const name = nameFromFilename(file);
  return {
    slug: slugify(name),
    name,
    image: teeImage(file),
    priceGhs: 120,
    category: "tees-designed" as const,
    description: baseDescription("tees-designed", name),
    details: baseDetails("tees-designed"),
  };
});

export const jerseys: Product[] = [
  {
    slug: "jersey-classic",
    name: "Classic Jersey",
    image: "/mockups/7.png",
    priceGhs: 150,
    category: "jerseys",
    description: baseDescription("jerseys", "Classic Jersey"),
    details: baseDetails("jerseys"),
  },
  {
    slug: "jersey-street",
    name: "Street Jersey",
    image: "/mockups/4.png",
    priceGhs: 150,
    category: "jerseys",
    description: baseDescription("jerseys", "Street Jersey"),
    details: baseDetails("jerseys"),
  },
  {
    slug: "jersey-bold",
    name: "Bold Graphic Jersey",
    image: "/mockups/2.png",
    priceGhs: 165,
    category: "jerseys",
    description: baseDescription("jerseys", "Bold Graphic Jersey"),
    details: baseDetails("jerseys"),
  },
];

export const poloLongSleeves: Product[] = [
  {
    slug: "polo-long-sleeve",
    name: "Polo Long Sleeve",
    image: "/mockups/6.png",
    priceGhs: 135,
    category: "polo-long-sleeves",
    description: baseDescription("polo-long-sleeves", "Polo Long Sleeve"),
    details: baseDetails("polo-long-sleeves"),
  },
  {
    slug: "polo-long-sleeve-alt",
    name: "Polo Long Sleeve — Alt",
    image: "/mockups/5.png",
    priceGhs: 135,
    category: "polo-long-sleeves",
    description: baseDescription("polo-long-sleeves", "Polo Long Sleeve — Alt"),
    details: baseDetails("polo-long-sleeves"),
  },
];

export const allProducts: Product[] = [
  ...plainTees,
  ...designedTees,
  ...jerseys,
  ...poloLongSleeves,
];

export function getProductsByCategory(
  category: ProductCategory,
): Product[] {
  return allProducts.filter((product) => product.category === category);
}

export const categoryMeta: Record<
  ProductCategory,
  { title: string; description: string; collectionSlug: string }
> = {
  "tees-plain": {
    title: "Plain Tees",
    description: "Clean essentials — premium cotton, no print.",
    collectionSlug: "plain-tees",
  },
  "tees-designed": {
    title: "Designed Tees",
    description: "Graphic tees named by the art — personality in every piece.",
    collectionSlug: "graphic-tees",
  },
  jerseys: {
    title: "Jerseys",
    description: "Sport-inspired styles — more colourways coming soon.",
    collectionSlug: "jerseys",
  },
  "polo-long-sleeves": {
    title: "Polo Long Sleeves",
    description: "Smart casual long-sleeve polos.",
    collectionSlug: "polo-long-sleeves",
  },
};

const collectionSlugToCategory: Record<string, ProductCategory> = {
  "plain-tees": "tees-plain",
  "graphic-tees": "tees-designed",
  jerseys: "jerseys",
  "polo-long-sleeves": "polo-long-sleeves",
};

export function getCategoryFromCollectionSlug(
  slug: string,
): ProductCategory | undefined {
  return collectionSlugToCategory[slug];
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

export function hasColorOptions(product: Product): boolean {
  return Boolean(product.colors && product.colors.length > 0);
}
