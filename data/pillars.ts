export type Pillar = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
};

export const pillars: Pillar[] = [
  {
    id: "fashion",
    title: "Fashion Brand",
    description:
      "Stylish, high-quality graphic tees and fashionable tops made to express personality, culture, and creativity — for everyday comfort or a bold statement.",
    href: "/fashion",
    cta: "Explore fashion",
    image: "/mockups/2.png",
  },
  {
    id: "printing",
    title: "Printing Services",
    description:
      "Professional printing for churches, schools, political groups, brands, and institutions — custom designs to bulk orders, delivered with clarity and care.",
    href: "/printing",
    cta: "Get a quote",
    image: "/mockups/4.png",
  },
];
