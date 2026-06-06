export type HeroSlide = {
  id: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  headline: string;
  subline: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export const heroSlides: HeroSlide[] = [
  {
    id: "street-style",
    image:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
    imageAlt: "Young man in casual streetwear",
    eyebrow: "Dansoman · Greater Accra",
    headline: "Clothing that stands out",
    subline:
      "Bold graphic tees and everyday pieces crafted with quality you can count on.",
    cta: { label: "Shop collection", href: "/shop" },
    secondaryCta: { label: "Printing services", href: "/printing" },
  },
  {
    id: "graphic-tees",
    image:
      "https://images.pexels.com/photos/6311652/pexels-photo-6311652.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
    imageAlt: "Person wearing a graphic hoodie on the street",
    eyebrow: "Fashion brand",
    headline: "Wear your personality",
    subline:
      "Original prints and statement designs built for Accra streets and beyond.",
    cta: { label: "Graphic tees", href: "/shop?category=graphic-tees" },
    secondaryCta: { label: "View lookbook", href: "/fashion" },
  },
  {
    id: "custom-tee",
    image:
      "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
    imageAlt: "Fashion portrait in urban setting",
    eyebrow: "Customizer studio",
    headline: "Your design, your tee",
    subline:
      "Upload front and back artwork, pick your fit, and add a one-of-one piece to your bag.",
    cta: { label: "Start customizing", href: "/customize" },
    secondaryCta: { label: "Plain tees", href: "/shop?category=plain-tees" },
  },
  {
    id: "printing",
    image:
      "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
    imageAlt: "Sewing machine in a textile workshop",
    eyebrow: "Print production",
    headline: "Print for your brand",
    subline:
      "Bulk runs for teams, churches, schools, and events — professional quality, reliable delivery.",
    cta: { label: "Printing services", href: "/printing" },
    secondaryCta: { label: "Get in touch", href: "/contact" },
  },
];

export const HERO_SLIDE_DURATION_MS = 6800;
