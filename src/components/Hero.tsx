"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { hero } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Hero() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => visualRef.current?.classList.add("is-in"), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="top" className="pt-24 md:pt-28">
      <div className="container">
        <div className="grid-4">
          <p className="text-medium">{hero.eyebrow}</p>
          <ul className="text-medium md:col-span-2">
            {hero.categories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 md:mt-16">
          <h1 className="heading-huge">{hero.title}</h1>
        </div>

        <div className="grid-4 mt-6 md:mt-8">
          <p className="text-medium">{hero.year}</p>
          <p className="text-medium whitespace-pre-line md:col-span-2">{hero.meta}</p>
        </div>
      </div>

      <div className="container mt-8 md:mt-12">
        <div ref={visualRef} className="hero-visual media aspect-[16/10] w-full">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <Reveal>
          <p className="text-medium mt-4 max-w-xl italic">{hero.caption}</p>
        </Reveal>
      </div>

      <Reveal className="container mt-14 md:mt-24">
        <p className="text-medium max-w-3xl md:max-w-4xl">{hero.pitch}</p>
      </Reveal>
    </section>
  );
}
