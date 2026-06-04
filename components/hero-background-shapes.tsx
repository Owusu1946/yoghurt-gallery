/** Decorative solid shapes — flat brand fills, no gradients or shadows. */
export function HeroBackgroundShapes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Right column — behind mockups */}
      <div className="absolute right-[-6%] top-[6%] hidden h-[min(48vh,440px)] w-[min(48vh,440px)] rounded-full bg-brand/[0.09] lg:block" />
      <div className="absolute right-[10%] top-[22%] hidden h-36 w-52 rotate-12 rounded-[2.5rem] bg-brand/[0.06] lg:block" />
      <div className="absolute bottom-[18%] right-[4%] hidden h-20 w-20 rotate-45 bg-brand/[0.05] lg:block" />

      {/* Mobile / centered mockup area */}
      <div className="absolute left-1/2 top-[38%] h-64 w-64 -translate-x-1/2 rounded-full bg-brand/[0.07] lg:hidden" />
      <div className="absolute right-[8%] top-[42%] h-24 w-32 rotate-[-8deg] rounded-3xl bg-brand/[0.06] lg:hidden" />

      {/* Left column — subtle accents */}
      <div className="absolute left-[-4%] top-[28%] h-28 w-28 rounded-full bg-brand/[0.05] lg:left-[2%]" />
      <div className="absolute bottom-[22%] left-[6%] hidden h-14 w-40 rounded-full bg-brand/[0.055] lg:block" />

      {/* Section-wide soft anchors */}
      <div className="absolute left-[38%] top-[-3%] h-24 w-24 rotate-12 rounded-2xl bg-brand/[0.04] max-lg:hidden" />
      <div className="absolute bottom-[-2%] left-[22%] h-[min(28vh,220px)] w-[min(28vh,220px)] rounded-full bg-brand/[0.045] max-lg:hidden" />
    </div>
  );
}
