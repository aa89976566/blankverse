"use client";

import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/content";
import { Reveal } from "./Reveal";

export function WorkList() {
  const [active, setActive] = useState(projects[0].id);
  const current = projects.find((p) => p.id === active) ?? projects[0];

  return (
    <section id="work" className="container py-16 md:py-24">
      <Reveal>
        <div className="section-rule mb-10 flex items-end justify-between gap-6">
          <h2 className="overline">Recent projects</h2>
          <p className="max-w-xs text-sm text-[var(--muted)] md:text-right">
            Shorts, a feature in post, and films produced across London and Mumbai.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5" delay={80}>
          <div className="media-frame relative aspect-[4/5] sticky top-24">
            <Image
              key={current.id}
              src={current.image}
              alt={current.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-opacity duration-500"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <ul>
            {projects.map((project, index) => (
              <Reveal key={project.id} as="li" delay={index * 40}>
                <button
                  type="button"
                  className="project-row flex w-full flex-col gap-2 px-1 py-6 text-left md:flex-row md:items-baseline md:justify-between md:gap-8"
                  onMouseEnter={() => setActive(project.id)}
                  onFocus={() => setActive(project.id)}
                  onClick={() => setActive(project.id)}
                >
                  <span className="display text-[clamp(1.8rem,4vw,2.8rem)]">
                    {project.title}
                  </span>
                  <span className="flex min-w-[12rem] flex-col gap-1 md:items-end">
                    <span className="text-sm text-[var(--ink-soft)]">{project.meta}</span>
                    <span className="overline text-[0.65rem] text-[var(--muted)]">
                      {project.status}
                    </span>
                  </span>
                </button>
                {active === project.id && (
                  <p className="body-copy -mt-2 mb-6 max-w-xl px-1 pb-4 text-[1rem]">
                    {project.summary}
                  </p>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
