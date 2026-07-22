import { Header } from "@/components/Header";
import { WorkBodyClass } from "@/components/BodyClass";
import {
  archiveStills,
  asset,
  people,
  site,
  studioCopy,
} from "@/lib/content";

export default function AboutPage() {
  return (
    <>
      <WorkBodyClass className="is-about" />
      <Header aboutHref="/" label="Works" />
      <main className="about-page">
        <section className="about-hero">
          <div className="eyebrow">Studio · UK & India</div>
          <h1>{site.name}</h1>
          <p>
            {site.intro}. {site.tagline}. {site.honesty}.
          </p>
        </section>

        <section className="about-scenes" aria-label="Studio stills">
          {[
            "/media/filmmaker-portrait.jpg",
            "/media/therapist-crew.jpg",
            "/media/baat-baaki.png",
            "/media/whiskey-sour.jpg",
            "/media/set-alley.jpg",
            "/media/hero-wide.jpg",
          ].map((src) => (
            <figure className="about-scene" key={src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(src)} alt="" />
            </figure>
          ))}
        </section>

        <section className="about-copy">
          {studioCopy.map((p) => (
            <p key={p.slice(0, 28)}>{p}</p>
          ))}
          <div className="work-links">
            <a className="pill pill--fill" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a
              className="pill"
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="pill"
              href={site.youtube}
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
          </div>
        </section>

        <section className="people-row">
          {people.map((person) => (
            <article
              key={person.id}
              className="person-card"
              style={{ ["--tint" as string]: person.color }}
            >
              <div className="person-card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(person.image)} alt={person.name} />
              </div>
              <div>
                <div className="eyebrow">{person.place}</div>
                <h2>{person.name}</h2>
                <p className="role">{person.role}</p>
                {person.bio.map((p) => (
                  <p key={p.slice(0, 36)}>{p}</p>
                ))}
                <div className="work-links">
                  {person.socials.map((s) => (
                    <a
                      key={s.href}
                      className="pill"
                      href={s.href}
                      target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="about-copy">
          <h2
            style={{
              margin: "0 0 1rem",
              fontSize: "2.8rem",
              letterSpacing: "-0.05rem",
            }}
          >
            Still archive
          </h2>
          <p>Everything gathered from the studio site, posters, stills and public cuts.</p>
        </section>
        <div className="archive-grid">
          {archiveStills.map((src) => (
            <figure key={src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(src)} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      </main>
    </>
  );
}
