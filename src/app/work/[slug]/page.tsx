import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { asset, getProject, projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];

  return (
    <main className="page" style={{ ["--accent" as string]: project.accent }}>
      <Header />
      <div className="page__intro">
        <span className="eyebrow">
          {project.year} · {project.status}
        </span>
        <h1>{project.title}</h1>
        <p>{project.synopsis}</p>
        <div className="chips">
          <span className="chip">{project.format}</span>
          <span className="chip">{project.status}</span>
        </div>
      </div>

      <section className="h-scroll" aria-label={`${project.title} gallery`}>
        {project.video ? (
          <div className="h-card">
            <video
              src={asset(project.video)}
              controls
              playsInline
              preload="metadata"
              poster={asset(project.cover)}
            />
          </div>
        ) : null}
        {project.gallery.map((src) => (
          <figure className="h-card" key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(src)} alt="" />
          </figure>
        ))}
      </section>

      <section className="panel">
        <h2>Details</h2>
        {project.details.map((line) => (
          <p key={line}>{line}</p>
        ))}

        <dl className="credits">
          {project.credits.map((c) => (
            <div className="credit" key={`${c.role}-${c.name}`}>
              <dt>{c.role}</dt>
              <dd>{c.name}</dd>
            </div>
          ))}
        </dl>

        {project.links?.length ? (
          <div className="links">
            {project.links.map((l) => (
              <a
                key={l.href}
                className="btn"
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
              </a>
            ))}
            {project.externalVideo ? (
              <a
                className="btn btn--ghost"
                href={project.externalVideo}
                target="_blank"
                rel="noreferrer"
              >
                Open film
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="links" style={{ marginTop: "2.5rem" }}>
          <Link className="btn btn--ghost" href={`/work/${prev.slug}`}>
            ← {prev.label}
          </Link>
          <Link className="btn" href={`/work/${next.slug}`}>
            {next.label} →
          </Link>
        </div>
      </section>
    </main>
  );
}
