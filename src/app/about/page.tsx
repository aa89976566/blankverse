import { Header } from "@/components/Header";
import {
  archiveStills,
  asset,
  people,
  site,
  studioCopy,
} from "@/lib/content";

export default function AboutPage() {
  return (
    <main className="page">
      <Header aboutHref="/" />
      <div className="page__intro">
        <span className="eyebrow">Studio · UK & India</span>
        <h1>{site.name}</h1>
        <p>
          {site.tagline}. {site.honesty}.
        </p>
      </div>

      <section className="panel">
        {studioCopy.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <div className="links">
          <a className="btn" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a
            className="btn btn--ghost"
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            className="btn btn--ghost"
            href={site.youtube}
            target="_blank"
            rel="noreferrer"
          >
            YouTube
          </a>
        </div>
      </section>

      <section className="people" style={{ marginTop: "2rem" }}>
        {people.map((person) => (
          <article
            key={person.id}
            className="person"
            style={{ ["--accent" as string]: person.accent }}
          >
            <div className="person__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(person.image)} alt={person.name} />
            </div>
            <div>
              <span className="eyebrow">{person.place}</span>
              <h2>{person.name}</h2>
              <p className="person__role">{person.role}</p>
              {person.bio.map((p) => (
                <p key={p.slice(0, 32)} style={{ color: "var(--ink-soft)", lineHeight: 1.65 }}>
                  {p}
                </p>
              ))}
              <div className="links">
                {person.socials.map((s) => (
                  <a
                    key={s.href}
                    className="btn btn--ghost"
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

      <section className="panel" style={{ marginTop: "3rem" }}>
        <h2>Still archive</h2>
        <p>Everything we could gather from the studio site, posters, stills and public cuts.</p>
      </section>
      <div className="archive">
        {archiveStills.map((src) => (
          <figure key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(src)} alt="" loading="lazy" />
          </figure>
        ))}
      </div>

      <p className="footer-note">
        Contact · {site.email} · Bases · {site.bases.join(" · ")}
      </p>
    </main>
  );
}
