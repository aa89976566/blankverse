"use client";

import Image from "next/image";
import { gallery } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Gallery() {
  return (
    <Reveal className="my-10 md:my-16">
      <div className="container mb-4 flex items-end justify-between">
        <p className="overline-title">Image</p>
        <p className="text-sm text-[var(--color-muted)]">Scroll</p>
      </div>
      <div className="container">
        <div className="gallery-track">
          {gallery.map((src) => (
            <figure key={src} className="gallery-slide">
              <div className="media">
                <Image src={src} alt="" fill sizes="80vw" className="object-cover" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
