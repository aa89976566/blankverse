"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import {
  AttachmentDual,
  AttachmentVisual,
  HeroVisual,
  ImageBlock,
  VideoBlock,
} from "@/components/Media";
import {
  about,
  approach,
  credits,
  gallery,
  hero,
  mandate,
  next,
  people,
  site,
  work,
} from "@/lib/content";

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="c-section o-container">
      <Reveal>
        <div className="c-section_overline o-grid-12">
          <h2 className="c-section_title">{title}</h2>
          <div className="c-section_main o-text-medium c-section_body">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

function NextProject() {
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bar = barRef.current;
    if (!section || !bar) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(rect.height, 1);
      const progress = Math.min(
        Math.max((window.innerHeight - rect.top) / (total + window.innerHeight * 0.35), 0),
        1,
      );
      bar.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="c-next">
      <div className="o-container">
        <div className="c-section_overline o-grid-12">
          <h2 className="c-section_title">Next Project</h2>
          <div className="c-section_main o-text-medium">
            Scroll Down↓
            <span ref={barRef} className="c-next_progress" aria-hidden />
          </div>
        </div>

        <a href="#work" className="c-next_title">
          <h3 className="c-heading-huge">{next.title}</h3>
          <div className="o-grid-4 c-hero_meta" style={{ marginTop: "1rem" }}>
            <p className="o-text-medium">{next.year}</p>
            <p className="o-text-medium">
              {next.metaLine1}
              <br />
              {next.metaLine2}
            </p>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <ImageBlock src={next.image} />
          </div>
        </a>

        <footer className="c-footer">
          <span>
            {hero.year} {site.name}
          </span>
          <span>{hero.caption}</span>
        </footer>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="top">
        {/* HERO — mirrors c-work-single-hero */}
        <section className="c-hero">
          <div className="o-container">
            <div className="o-grid-4 c-hero_top">
              <p className="o-text-medium">{hero.type}</p>
              <ul className="o-text-medium" style={{ gridColumn: "span 2" }}>
                {hero.categories.map((c) => (
                  <li key={c} style={{ display: "inline", marginRight: "1rem" }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="c-hero_title-wrap">
              <h1 className="c-heading-huge">{hero.title}</h1>
            </div>

            <div className="o-grid-4 c-hero_meta">
              <p className="o-text-medium">{hero.year}</p>
              <p className="o-text-medium">
                {hero.metaLine1}
                <br />
                {hero.metaLine2}
              </p>
            </div>

            <HeroVisual src={hero.image} />
            <p className="o-text-medium c-hero_caption">{hero.caption}</p>

            <Reveal className="c-pitch">
              <div className="c-pitch_head o-text-medium">
                <span>Website</span>
                <a href={site.url} target="_blank" rel="noreferrer">
                  blankversefilms.com
                </a>
              </div>
              <p className="o-text-medium c-pitch_content">{hero.pitch}</p>
            </Reveal>
          </div>
        </section>

        <Reveal>
          <AttachmentVisual src="/media/therapist-crew.jpg" />
        </Reveal>

        <Section id="about" title="About">
          {about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Section>

        <Section id="work" title={`Selected work (${work.length})`}>
          <div>
            {work.map((item) => (
              <div key={item.title} className="c-list_row">
                <div>{item.title}</div>
                <div>{item.detail}</div>
              </div>
            ))}
          </div>
        </Section>

        <Reveal>
          <AttachmentDual
            left="/media/filmmaker-portrait.jpg"
            right="/media/set-alley.jpg"
          />
        </Reveal>

        <Reveal>
          <AttachmentDual
            left="/media/production-wide.jpg"
            right="/media/night-still.jpg"
            leftVideo={{ src: "/video/clip-a.mp4", poster: "/media/production-wide.jpg" }}
            rightVideo={{ src: "/video/clip-b.mp4", poster: "/media/night-still.jpg" }}
          />
        </Reveal>

        <Reveal>
          <AttachmentVisual src="/media/hero-wide.jpg" />
        </Reveal>

        <Section title="Mandate">
          <p>{mandate}</p>
        </Section>

        <Reveal>
          <AttachmentDual
            left="/media/night-still.jpg"
            right="/media/still-a.jpg"
            rounded
          />
        </Reveal>

        <Reveal>
          <div className="c-attachment -visual o-container">
            <VideoBlock
              src="/video/clip-b.mp4"
              poster="/media/set-alley.jpg"
              autoPlay
              rounded
            />
          </div>
        </Reveal>

        <Reveal>
          <AttachmentVisual src="/media/baat-baaki.png" rounded />
        </Reveal>

        <Reveal>
          <AttachmentDual left="/media/oh-good-grief.jpg" right="/media/whiskey-sour.jpg" />
        </Reveal>

        <Section title="Approach">
          <p>{approach}</p>
        </Section>

        <section id="showreel" className="c-showreel">
          <div className="o-container" style={{ marginBottom: "1rem" }}>
            <p className="o-text-medium">Showreel</p>
          </div>
          <div className="o-container">
            <VideoBlock src="/video/showreel.mp4" poster="/media/production-wide.jpg" />
          </div>
          <div
            className="o-container"
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span className="o-text-medium" style={{ opacity: 0.65 }}>
              Selected cuts from recent productions
            </span>
            <a href={site.youtube} target="_blank" rel="noreferrer" className="o-text-medium">
              Watch on YouTube →
            </a>
          </div>
        </section>

        <Reveal>
          <div className="c-gallery o-container">
            <div className="c-gallery_track">
              {gallery.map((src) => (
                <figure key={src} className="c-gallery_slide">
                  <ImageBlock src={src} />
                </figure>
              ))}
            </div>
            <div className="c-gallery_footer o-text-medium">
              <span>Image</span>
              <span>Scroll →</span>
            </div>
          </div>
        </Reveal>

        <section id="studio" className="c-section o-container">
          <Reveal>
            <div className="c-section_overline o-grid-12">
              <h2 className="c-section_title">Who we are</h2>
              <div className="c-section_main o-text-medium">
                Two sisters. One slate. Stories that sit with silence, margins, and the things
                people leave unsaid.
              </div>
            </div>
          </Reveal>

          {people.map((person, i) => (
            <Reveal key={person.name} delay={i * 80}>
              <article className={`c-person ${i % 2 ? "-flip" : ""}`}>
                <div className="c-person_media">
                  <div className="c-image -portrait">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="c-person_copy">
                  <p className="o-text-medium" style={{ opacity: 0.55 }}>
                    {person.place}
                  </p>
                  <h3
                    className="c-heading-huge"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", marginTop: "0.4rem" }}
                  >
                    {person.name}
                  </h3>
                  <p className="o-text-medium" style={{ marginTop: "0.4rem" }}>
                    {person.role}
                  </p>
                  <div className="o-text-medium c-section_body" style={{ marginTop: "1.5rem" }}>
                    {person.bio.map((p) => (
                      <p key={p.slice(0, 20)}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </section>

        <section id="contact" className="o-container">
          <Reveal>
            <div className="c-website-cta">
              <span className="o-text-medium">{hero.year}</span>
              <p className="c-website-cta_content">
                Visit <a href={site.url}>blankversefilms.com</a>
              </p>
              <p className="o-text-medium" style={{ marginTop: "1rem" }}>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
          </Reveal>
        </section>

        <Section title="Credits">
          <div>
            {credits.map((row) => (
              <div key={row.label} className="c-credits_row">
                <div>{row.label}</div>
                <div>{row.value}</div>
              </div>
            ))}
          </div>
        </Section>

        <NextProject />
      </main>
    </>
  );
}
