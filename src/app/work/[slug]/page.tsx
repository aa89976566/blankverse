import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Header } from "@/components/Header";
import { asset, getProject, projects } from "@/lib/content";
import { WorkBodyClass } from "@/components/BodyClass";

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
    <>
      <WorkBodyClass
        className="is-work"
        style={
          {
            ["--scroll"]: project.scrollbarColor,
          } as CSSProperties
        }
      />
      <Header />
      <main
        className="work-page"
        style={{ ["--scroll" as string]: project.scrollbarColor }}
      >
        <section
          className="work-panel work-panel--intro"
          style={{
            background: project.introBg || project.color,
            color: project.introText || "#8c8080",
          }}
        >
          <span
            className="eyebrow"
            style={{
              background: project.typeBg || project.transitionColor,
              color: project.typeText || "#fff",
            }}
          >
            {project.type}
          </span>
          <h1 style={{ color: "#252422" }}>{project.title}</h1>
          <p>{project.synopsis}</p>
        </section>

        {project.video ? (
          <section className="work-panel work-panel--media">
            <div className="frame">
              <video
                src={asset(project.video)}
                controls
                playsInline
                preload="metadata"
                poster={asset(project.cover)}
              />
            </div>
          </section>
        ) : null}

        {project.gallery.map((src) => (
          <section className="work-panel work-panel--media" key={src}>
            <div className="frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(src)} alt="" />
            </div>
          </section>
        ))}

        <section
          className="work-panel work-panel--text"
          style={{ background: project.transitionColor, color: "#fff" }}
        >
          <h2 style={{ color: "#fff" }}>Details</h2>
          {project.details.map((d) => (
            <p key={d} style={{ color: "rgba(255,255,255,0.9)" }}>
              {d}
            </p>
          ))}
          <p style={{ color: "rgba(255,255,255,0.9)" }}>
            {project.year} · {project.status}
          </p>
        </section>

        <section className="work-panel work-panel--credits">
          <h2
            style={{
              margin: "0 0 1.4rem",
              fontSize: "2.4rem",
              letterSpacing: "-0.04rem",
            }}
          >
            Credits
          </h2>
          <dl>
            {project.credits.map((c) => (
              <div className="credit-row" key={`${c.role}-${c.name}`}>
                <dt>{c.role}</dt>
                <dd>{c.name}</dd>
              </div>
            ))}
          </dl>
          {project.links?.length ? (
            <div className="work-links">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  className="pill pill--fill"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </section>

        <section className="work-panel work-panel--nav">
          <Link className="pill" href={`/work/${prev.slug}/`}>
            ← {prev.label}
          </Link>
          <Link className="pill pill--fill" href={`/work/${next.slug}/`}>
            {next.label} →
          </Link>
          <Link className="pill" href="/">
            Back home
          </Link>
        </section>
      </main>
    </>
  );
}
