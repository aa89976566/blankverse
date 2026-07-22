"use client";

import { useEffect, useState } from "react";

type Props = {
  progress: number; // 0..1 target
  done: boolean;
};

/** Justine-style loader: only a white circle over the live WebGL poster — no second static card. */
export function LoaderScreen({ progress, done }: Props) {
  const [shown, setShown] = useState(0);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setShown((s) => s + (progress - s) * 0.12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  useEffect(() => {
    if (!done) return;
    const t1 = window.setTimeout(() => setOut(true), 80);
    const t2 = window.setTimeout(() => setGone(true), 850);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [done]);

  if (gone) return null;

  const p = Math.max(0, Math.min(1, shown));
  // Justine: solid white disc grows from center; on exit it expands and fades
  const scale = out ? 2.4 : 0.12 + p * 0.88;

  return (
    <div
      className={`loader-veil${out ? " is-out" : ""}`}
      aria-busy={!done}
      aria-label="Loading"
    >
      <div className="loader-veil__stage">
        <div
          className="loader-veil__circle"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        />
      </div>
    </div>
  );
}
