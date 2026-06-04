export type CollectionItem = {
  slug: string;
  name: string;
  image: string;
  priceGhs: number;
  href: string;
};

export const collections: CollectionItem[] = [
  {
    slug: "graphic-tees",
    name: "Graphic Tees",
    image: "/shop/tees/Don%20Toliver.jpg",
    priceGhs: 120,
    href: "/shop/graphic-tees",
  },
  {
    slug: "plain-tees",
    name: "Plain Tees",
    image: "/shop/tees/Plain.jpg",
    priceGhs: 85,
    href: "/shop/plain-tees",
  },
  {
    slug: "jerseys",
    name: "Jerseys",
    image: "/mockups/7.png",
    priceGhs: 150,
    href: "/shop/jerseys",
  },
  {
    slug: "polo-long-sleeves",
    name: "Polo Long Sleeves",
    image: "/mockups/6.png",
    priceGhs: 135,
    href: "/shop/polo-long-sleeves",
  },
];
