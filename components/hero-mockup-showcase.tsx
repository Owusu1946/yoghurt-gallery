"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type MockupLayer = {
  src: string;
  className: string;
};

type MockupScene = {
  id: string;
  layers: MockupLayer[];
};

const scenes: MockupScene[] = [
  {
    id: "scene-a",
    layers: [
      {
        src: "/mockups/2.png",
        className:
          "absolute left-[2%] top-[10%] z-0 h-[72%] w-[48%] -rotate-6",
      },
      {
        src: "/mockups/3.png",
        className:
          "absolute left-1/2 top-[2%] z-10 h-[88%] w-[58%] -translate-x-1/2",
      },
      {
        src: "/mockups/5.png",
        className:
          "absolute right-[0%] top-[14%] z-[5] h-[70%] w-[46%] rotate-5",
      },
    ],
  },
  {
    id: "scene-b",
    layers: [
      {
        src: "/mockups/1.png",
        className:
          "absolute left-[4%] top-[12%] z-[5] h-[68%] w-[44%] -rotate-3",
      },
      {
        src: "/mockups/4.png",
        className:
          "absolute left-1/2 top-[4%] z-10 h-[86%] w-[56%] -translate-x-1/2",
      },
      {
        src: "/mockups/7.png",
        className:
          "absolute right-[2%] top-[16%] z-0 h-[68%] w-[44%] rotate-6",
      },
    ],
  },
  {
    id: "scene-c",
    layers: [
      {
        src: "/mockups/6.png",
        className:
          "absolute left-[0%] top-[18%] z-0 h-[66%] w-[46%] -rotate-5",
      },
      {
        src: "/mockups/5.png",
        className:
          "absolute left-1/2 top-[0%] z-10 h-[90%] w-[60%] -translate-x-1/2",
      },
      {
        src: "/mockups/1.png",
        className:
          "absolute right-[4%] top-[10%] z-[5] h-[72%] w-[48%] rotate-4",
      },
    ],
  },
];

const INTERVAL_MS = 5200;
const FADE_MS = 1400;

export function HeroMockupShowcase() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(index);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % scenes.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none lg:aspect-auto lg:h-[min(58vh,560px)] lg:max-h-[560px]"
        aria-hidden
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-1/2 top-[48%] h-[76%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.1]" />
          <div className="absolute right-[-2%] top-[8%] h-28 w-40 rotate-[10deg] rounded-[1.75rem] bg-brand/[0.07]" />
          <div className="absolute bottom-[6%] left-[6%] h-16 w-16 rotate-45 bg-brand/[0.06]" />
        </div>

        {scenes.map((scene, sceneIndex) => {
          const isActive = sceneIndex === active;

          return (
            <div
              key={scene.id}
              className="absolute inset-0 transition-[opacity,transform] ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scale(1)" : "scale(0.985)",
                transitionDuration: `${FADE_MS}ms`,
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 20 : 0,
              }}
            >
              {scene.layers.map((layer, layerIndex) => (
                <div
                  key={`${scene.id}-${layerIndex}`}
                  className={layer.className}
                >
                  <Image
                    src={layer.src}
                    alt=""
                    fill
                    priority={sceneIndex === 0}
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-contain object-center"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div
        className="mt-6 flex items-center gap-3"
        role="tablist"
        aria-label="Featured looks"
      >
        {scenes.map((scene, index) => {
          const isActive = index === active;

          return (
            <button
              key={scene.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show look ${index + 1}`}
              onClick={() => goTo(index)}
              className="group flex h-6 items-center px-0.5"
            >
              <span
                className="block h-px bg-brand transition-all duration-500 ease-out"
                style={{ width: isActive ? 40 : 20, opacity: isActive ? 1 : 0.28 }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
