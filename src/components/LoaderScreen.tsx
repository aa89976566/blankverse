"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/content";

type Props = {
  poster: string;
  progress: number; // 0..1
  done: boolean;
};

export function LoaderScreen({ poster, progress, done }: Props) {
  const [hide, setHide] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setHide(true), 120);
    const t2 = window.setTimeout(() => setMounted(false), 900);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [done]);

  if (!mounted) return null;

  const p = Math.max(0, Math.min(1, progress));
  // white circle grows from center — matches Justine's loading mask
  const scale = 0.08 + p * 1.15;

  return (
    <div className={`loader-screen${hide || done ? " is-out" : ""}`} aria-busy={!done}>
      <div className="loader-screen__poster">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(poster)} alt="" draggable={false} />
        <div
          className="loader-screen__circle"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        />
      </div>
    </div>
  );
}
