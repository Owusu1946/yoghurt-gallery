"use client";

import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

export function AppToaster() {
  return (
    <GooeyToaster
      position="top-center"
      theme="light"
      preset="smooth"
      bounce={0.35}
      offset="calc(3.75rem + env(safe-area-inset-top, 0px))"
      gap={12}
      swipeToDismiss
      closeOnEscape
    />
  );
}
