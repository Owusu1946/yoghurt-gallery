type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="border-b border-brand/10 bg-white px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/50">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-brand sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-brand/70 sm:text-base">
          {description}
        </p>
      </div>
    </header>
  );
}
