"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { hero, site } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => visualRef.current?.classList.add("is-in"), 60);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="top" className="pt-24 md:pt-28">
      <div className="container">
        <div className="grid-4">
          <p className="text-medium">{hero.eyebrow}</p>
          <ul className="text-medium flex flex-wrap gap-x-4 md:col-span-2">
            {hero.categories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="grid-4 mt-[clamp(3rem,8vw,7rem)] items-end gap-y-6">
          <div className="span-full md:col-span-4 lg:[grid-column:1/span_4]">
            <h1 className="heading-huge">{hero.title}</h1>
          </div>
        </div>

        <div className="grid-4 mt-6 md:mt-8">
          <p className="text-medium">{hero.year}</p>
          <p className="text-medium whitespace-pre-line md:col-span-2">{hero.meta}</p>
        </div>
      </div>

      <div className="container mt-8 md:mt-10">
        <div ref={visualRef} className="hero-visual media media-zoom aspect-[16/10] w-full">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <p className="text-medium mt-4 max-w-2xl">{hero.caption}</p>
      </div>

      <Reveal className="container mt-[clamp(3rem,8vw,7rem)]">
        <div className="pitch">
          <div className="pitch-head text-medium">
            <span>Website</span>
            <a href={site.url} target="_blank" rel="noreferrer" className="nav-link">
              blankversefilms.com
            </a>
          </div>
          <p className="text-medium mt-6 max-w-4xl">{hero.pitch}</p>
        </div>
      </Reveal>
    </section>
  );
}
