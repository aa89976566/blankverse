import Image from "next/image";
import { people } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Studio() {
  return (
    <section id="studio" className="container py-16 md:py-24">
      <Reveal>
        <div className="section-rule mb-12 grid gap-6 md:grid-cols-12">
          <h2 className="overline md:col-span-3">Who we are</h2>
          <p className="body-copy md:col-span-7 md:col-start-5">
            Two sisters. One slate. Stories that sit with silence, margins, and the things
            people leave unsaid.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-16 md:gap-24">
        {people.map((person, index) => (
          <Reveal key={person.name} delay={index * 80}>
            <article
              className={`grid items-start gap-8 md:grid-cols-12 md:gap-10 ${
                index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="media-frame relative aspect-[4/5] md:col-span-5">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="overline text-[var(--muted)]">{person.base}</p>
                <h3 className="display mt-3 text-[clamp(2rem,4vw,3.4rem)]">{person.name}</h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{person.role}</p>
                <div className="body-copy mt-8">
                  {person.bio.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
