export const companyInfo = {
  name: "Yoghurt Clothing Gallery",
  tagline: "Creativity, quality, and reliability.",
  location: {
    area: "Dansoman",
    region: "Greater Accra",
    country: "Ghana",
  },
  contact: {
    phone: "+233 24 000 0000",
    phoneDisplay: "024 000 0000",
    email: "hello@yoghurtgallery.com",
    whatsapp: "233240000000",
  },
  hours: "Mon – Sat · 9:00 AM – 6:00 PM",
  established: 2026,
} as const;

export const aboutContent = {
  headline: "Built in Dansoman for style that stands out",
  intro:
    "Yoghurt Clothing Gallery is a fashion and printing house serving individuals, brands, churches, schools, and institutions across Ghana. We combine bold graphic tees with professional print production — all with the reliability and quality our customers expect.",
  story: [
    "What started as a passion for expressive streetwear grew into a full-service gallery: ready-to-wear graphic and plain tees, custom jersey styles, and long-sleeve polos — plus end-to-end printing for groups and events.",
    "Every order is handled with care — from design placement on a custom tee to bulk runs for your team or organisation. We deliver across Ghana with pay-on-delivery convenience.",
  ],
} as const;

export const fashionContent = {
  eyebrow: "Fashion brand",
  headline: "Wear your personality",
  intro:
    "Our fashion line is built around graphic tees and versatile tops that express culture, creativity, and everyday confidence — made for Accra streets and beyond.",
  highlights: [
    {
      title: "Graphic tees",
      description:
        "Original designs and statement prints on premium cotton — each piece named by the art.",
      href: "/shop?category=graphic-tees",
      cta: "Shop graphic tees",
    },
    {
      title: "Plain essentials",
      description:
        "Clean cotton tees in multiple colours — perfect on their own or for your own custom print.",
      href: "/shop?category=plain-tees",
      cta: "Shop plain tees",
    },
    {
      title: "Jerseys & polos",
      description:
        "Sport-inspired jerseys and smart long-sleeve polos for casual wear and uniform orders.",
      href: "/shop?category=jerseys",
      cta: "View jerseys",
    },
  ],
} as const;

export const printingContent = {
  eyebrow: "Printing services",
  headline: "Professional print, done right",
  intro:
    "From one custom tee to bulk orders for your church, school, campaign, or brand — we handle design, production, and delivery with clarity at every step.",
  services: [
    "Custom tee printing (front & back)",
    "Bulk orders for teams and events",
    "Institutional & church apparel",
    "School and campaign merchandise",
    "Brand merchandise and uniforms",
  ],
  process: [
    "Share your design or brief",
    "We confirm specs, quantity, and timeline",
    "Production at our Accra studio",
    "Delivery nationwide — pay on delivery",
  ],
} as const;
