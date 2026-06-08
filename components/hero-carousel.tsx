"use client";

import { HERO_SLIDE_DURATION_MS, heroSlides } from "@/data/hero-slides";
import { cn } from "@/lib/cn";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HeroRecentPurchases } from "./hero-recent-purchases";

const slideCount = heroSlides.length;

export function HeroCarousel() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.88, 1, 0.88]);

  const goTo = useCallback((index: number) => {
    setActive((index + slideCount) % slideCount);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = window.setTimeout(next, HERO_SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduceMotion, next]);

  const slide = heroSlides[active];

  return (
    <section
      className="relative isolate min-h-[min(88svh,880px)] w-full overflow-hidden bg-white"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="absolute inset-0" aria-hidden>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: reduceMotion ? 0.01 : 1.1,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          >
            <motion.div
              className="absolute inset-[-4%]"
              initial={{ scale: reduceMotion ? 1 : 1.04 }}
              animate={{ scale: reduceMotion ? 1 : 1.1 }}
              transition={{
                scale: {
                  duration: reduceMotion ? 0.01 : HERO_SLIDE_DURATION_MS / 1000,
                  ease: "linear",
                },
              }}
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={active === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/10" />
        <div className="absolute inset-0 bg-brand/[0.04]" />
      </div>

      <motion.div
        className="relative z-10 flex min-h-[min(88svh,880px)] flex-col"
        style={{ opacity: dragOpacity }}
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -72) next();
          else if (info.offset.x > 72) prev();
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-28 pt-24 sm:px-6 sm:pb-32 lg:justify-center lg:pb-24 lg:pt-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="max-w-2xl"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -18 }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand/55">
                {slide.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-[2.65rem] font-semibold leading-[1.05] text-brand [text-shadow:0_1px_28px_rgba(255,255,255,0.9)] sm:text-6xl lg:text-[4.25rem]">
                {slide.headline}
              </h1>
              <p className="mt-5 max-w-lg text-base font-medium leading-relaxed text-brand/72 sm:text-lg">
                {slide.subline}
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href={slide.cta.href}
                  className="inline-flex min-w-[200px] items-center justify-center border border-brand bg-brand px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90"
                >
                  {slide.cta.label}
                </Link>
                {slide.secondaryCta ? (
                  <Link
                    href={slide.secondaryCta.href}
                    className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/75 transition-opacity hover:text-brand"
                  >
                    {slide.secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-20 px-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6">
            <div
              className="flex items-center gap-3"
              role="tablist"
              aria-label="Hero slides"
            >
              {heroSlides.map((item, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${index + 1}: ${item.headline}`}
                    onClick={() => goTo(index)}
                    className="group relative flex h-8 items-center"
                  >
                    <span
                      className={cn(
                        "block h-px bg-brand/20 transition-all duration-500 ease-out",
                        isActive ? "w-12" : "w-6 group-hover:w-8 group-hover:bg-brand/35",
                      )}
                    />
                    {isActive && !reduceMotion ? (
                      <motion.span
                        key={`progress-${active}`}
                        className="absolute left-0 top-1/2 h-px origin-left -translate-y-1/2 bg-brand"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused ? undefined : 1 }}
                        style={{ width: 48 }}
                        transition={{
                          duration: HERO_SLIDE_DURATION_MS / 1000,
                          ease: "linear",
                        }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center border border-brand/20 text-brand/70 transition-colors hover:border-brand/40 hover:text-brand"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center border border-brand/20 text-brand/70 transition-colors hover:border-brand/40 hover:text-brand"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <HeroRecentPurchases />

      <div className="pointer-events-none absolute bottom-3 right-4 z-20 text-[10px] text-brand/30 sm:right-6">
        Photos · Pexels
      </div>
    </section>
  );
}
