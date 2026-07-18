"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { hero } from "@/lib/content";

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = mediaRef.current;
    if (!node) return;
    const id = window.setTimeout(() => node.classList.add("is-in"), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] pt-28 md:pt-32">
      <div className="container">
        <h1 className="hero-title display text-[clamp(3.6rem,12vw,9rem)]">
          <span>{hero.title}</span>
        </h1>
        <p className="mt-5 max-w-xl font-[family-name:var(--font-body)] text-[clamp(1.35rem,2.4vw,1.85rem)] italic text-[var(--ink-soft)] md:mt-7">
          {hero.caption}
        </p>
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mt-10">
          <p className="max-w-md body-copy">{hero.dek}</p>
          <a
            href="#work"
            className="overline inline-flex w-fit items-center gap-2 border border-[var(--ink)] px-4 py-3 text-[0.7rem] transition hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            Recent projects
          </a>
        </div>
      </div>

      <div
        ref={mediaRef}
        className="hero-media media-frame mt-10 h-[42vh] min-h-[260px] w-full md:mt-12 md:h-[52vh]"
      >
        <Image
          src="/media/hero-wide.jpg"
          alt="Blank Verse Films on set"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
