"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const RECENT_PURCHASES = [
  { name: "Kwame", location: "Accra", item: "a Custom Tee" },
  { name: "Sarah", location: "Tema", item: "a Graphic Tee" },
  { name: "Kofi", location: "Kumasi", item: "a Plain White Tee" },
  { name: "Ama", location: "Accra", item: "a Polo Long Sleeve" },
  { name: "Yaw", location: "Takoradi", item: "a Custom Tee" },
  { name: "Esi", location: "Cape Coast", item: "a Graphic Tee" },
];

export function HeroRecentPurchases() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: number;
    let isMounted = true;

    const runLoop = () => {
      setIsVisible(true);
      
      timeout = window.setTimeout(() => {
        setIsVisible(false);
        
        timeout = window.setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
          if (isMounted) runLoop();
        }, 450); // Instantly follow after the 450ms exit animation
      }, 4000); // Visible for 4 seconds
    };

    // Initial delay before first popup
    timeout = window.setTimeout(runLoop, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const purchase = RECENT_PURCHASES[currentIndex];

  return (
    <div className="pointer-events-none absolute left-1/2 top-28 z-40 -translate-x-1/2 sm:top-32">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-max items-center gap-3 rounded-full border border-white/40 bg-white/80 py-2.5 pl-2.5 pr-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm">
              <ShoppingBag className="h-4 w-4" strokeWidth={2} />
            </div>
            <p className="text-xs font-medium text-brand/90 sm:text-sm">
              <span className="font-bold text-brand">{purchase.name}</span> from {purchase.location} just bought <span className="font-semibold text-brand">{purchase.item}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
