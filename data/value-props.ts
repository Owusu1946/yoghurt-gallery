import type { LucideIcon } from "lucide-react";
import { Clock3, ShieldCheck, Sparkles } from "lucide-react";

export type ValueProp = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const valueProps: ValueProp[] = [
  {
    id: "reliability",
    title: "Reliability",
    description:
      "You can count on us to deliver exactly what you need — clear communication from order to handoff.",
    icon: ShieldCheck,
  },
  {
    id: "timely-delivery",
    title: "Timely Delivery",
    description:
      "We respect your deadlines and work to get every order to you on time, every time.",
    icon: Clock3,
  },
  {
    id: "quality",
    title: "Quality & Durability",
    description:
      "Premium materials and careful finishing — shirts made to last and look great wear after wear.",
    icon: Sparkles,
  },
];
