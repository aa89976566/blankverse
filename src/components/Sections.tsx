import Image from "next/image";
import {
  about,
  approach,
  credits,
  mandate,
  people,
  projects,
  site,
} from "@/lib/content";
import { Reveal } from "./Reveal";

export function AboutSection() {
  return (
    <section id="about" className="section-block container">
      <Reveal>
        <div className="section-rule grid-12">
          <h2 className="overline-title span-full md:col-span-3">{about.title}</h2>
          <div className="text-body col-start-5 span-full">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 28)}>{p}</p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="work" className="section-block container">
      <Reveal>
        <div className="section-rule grid-12 mb-8">
          <h2 className="overline-title span-full md:col-span-3">
            Selected work ({projects.length})
          </h2>
          <div className="col-start-5 span-full">
            {projects.map((project) => (
              <div key={project.title} className="list-row">
                <strong className="text-medium font-medium">{project.title}</strong>
                <span className="text-medium text-[var(--color-muted)]">{project.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function TextSection({
  id,
  title,
  body,
}: {
  id?: string;
  title: string;
  body: string;
}) {
  return (
    <section id={id} className="section-block container">
      <Reveal>
        <div className="section-rule grid-12">
          <h2 className="overline-title span-full md:col-span-3">{title}</h2>
          <p className="text-body col-start-5 span-full">{body}</p>
        </div>
      </Reveal>
    </section>
  );
}

export function MandateSection() {
  return <TextSection title={mandate.title} body={mandate.body} />;
}

export function ApproachSection() {
  return <TextSection title={approach.title} body={approach.body} />;
}

export function StudioSection() {
  return (
    <section id="studio" className="section-block container">
      <Reveal>
        <div className="section-rule grid-12 mb-12">
          <h2 className="overline-title span-full md:col-span-3">Who we are</h2>
          <p className="text-body col-start-5 span-full">
            Two sisters. One slate. Stories that sit with silence, margins, and the things
            people leave unsaid.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-16 md:gap-24">
        {people.map((person, index) => (
          <Reveal key={person.name} delay={index * 60}>
            <article className="grid-12 items-start">
              <div
                className={`media aspect-[4/5] span-full md:col-span-5 ${
                  index % 2 === 1 ? "md:col-start-8" : ""
                }`}
              >
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
              <div
                className={`span-full mt-6 md:col-span-6 md:mt-0 ${
                  index % 2 === 1 ? "md:col-start-1 md:row-start-1" : "md:col-start-7"
                }`}
              >
                <p className="text-sm text-[var(--color-muted)]">{person.base}</p>
                <h3 className="heading-huge !text-[clamp(2rem,4vw,3.4rem)] mt-2">
                  {person.name}
                </h3>
                <p className="mt-2 text-medium">{person.role}</p>
                <div className="text-body mt-8">
                  {person.bio.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
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

export function WebsiteCta() {
  return (
    <section id="contact" className="section-block">
      <Reveal className="container">
        <div className="website-cta">
          <span className="text-medium">{site.year}</span>
          <p className="cta-visit mt-4 md:mt-6">
            Visit{" "}
            <a href={site.url} target="_blank" rel="noreferrer" className="nav-link">
              blankversefilms.com
            </a>
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block text-medium nav-link text-[var(--color-muted)]"
          >
            {site.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function CreditsSection() {
  return (
    <section className="section-block container">
      <Reveal>
        <div className="section-rule grid-12">
          <h2 className="overline-title span-full md:col-span-3">Credits</h2>
          <div className="col-start-5 span-full">
            {credits.map((row) => (
              <div key={row.label} className="list-row">
                <span className="text-[var(--color-muted)]">{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
