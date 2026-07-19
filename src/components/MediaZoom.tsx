"use client";

import { useEffect, useRef } from "react";

/** Subtle scale-on-scroll for media frames, inspired by Locomotive image motion. */
export function useMediaZoom(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = 1 - Math.min(Math.max((rect.top + rect.height) / (vh + rect.height), 0), 1);
      const scale = 1 + progress * 0.06;
      node.style.setProperty("--zoom", String(scale));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
}

export function MediaZoom({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMediaZoom(ref);
  return (
    <div ref={ref} className={`media-zoom ${className}`.trim()}>
      {children}
    </div>
  );
}
