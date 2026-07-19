"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { nextProject, site } from "@/lib/content";
import { Reveal } from "./Reveal";

export function NextProject() {
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bar = barRef.current;
    if (!section || !bar) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height + window.innerHeight * 0.3;
      const passed = window.innerHeight - rect.top;
      const progress = Math.min(Math.max(passed / total, 0), 1);
      bar.style.transform = `scaleX(${progress})`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="mt-8 md:mt-16">
      <div className="container">
        <div className="section-rule mb-6 grid-12 items-center md:mb-10">
          <h2 className="overline-title span-full md:col-span-3">{nextProject.eyebrow}</h2>
          <div className="col-start-5 span-full flex items-center gap-4">
            <span className="text-medium">Scroll Down↓</span>
            <span ref={barRef} className="next-progress" aria-hidden />
          </div>
        </div>
      </div>

      <Reveal className="container">
        <a href={nextProject.href} className="block group">
          <h3 className="heading-huge">{nextProject.title}</h3>
          <div className="grid-4 mt-6">
            <p className="text-medium">{nextProject.year}</p>
            <p className="text-medium whitespace-pre-line md:col-span-2">{nextProject.meta}</p>
          </div>
          <div className="media media-zoom mt-8 aspect-[16/10]">
            <Image
              src={nextProject.image}
              alt={nextProject.title}
              fill
              sizes="100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </a>
      </Reveal>

      <footer className="container mt-16 flex flex-col gap-2 border-t border-[var(--color-line)] py-8 text-sm text-[var(--color-muted)] md:flex-row md:justify-between">
        <p>
          {site.year} {site.name}
        </p>
        <p>{site.tagline}</p>
      </footer>
    </section>
  );
}
