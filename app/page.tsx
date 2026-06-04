import { FeaturedCollection } from "@/components/featured-collection";
import { Hero } from "@/components/hero";
import { ServicePillars } from "@/components/service-pillars";
import { ValueProps } from "@/components/value-props";

export default function Home() {
  return (
    <main className="page-shell flex flex-1 flex-col">
      <Hero />
      <FeaturedCollection />
      <ServicePillars />
      <ValueProps />
    </main>
  );
}
