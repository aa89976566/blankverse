import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollBody } from "@/components/BodyClass";
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
    <>
      <ScrollBody />
      <main className="simple-page">
        <Link className="back" href="/">
          ← Desktop
        </Link>
        <p className="lede" style={{ marginTop: "1.5rem" }}>
          {project.type} · {project.year}
        </p>
        <h1>{project.title}</h1>
        <p className="lede">{project.status}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cover" src={asset(project.cover)} alt="" />
        <p>{project.synopsis}</p>
        {project.video ? (
          <video
            src={asset(project.video)}
            controls
            playsInline
            preload="metadata"
            poster={asset(project.cover)}
            style={{ width: "100%", margin: "1rem 0", borderRadius: 8 }}
          />
        ) : null}
        {project.gallery.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} className="cover" src={asset(src)} alt="" />
        ))}
        <h2 style={{ fontSize: "1.2rem", marginTop: "2rem" }}>Credits</h2>
        {project.credits.map((c) => (
          <p key={`${c.role}-${c.name}`}>
            <strong>{c.role}</strong> — {c.name}
          </p>
        ))}
        {project.links?.map((l) => (
          <p key={l.href}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          </p>
        ))}
        <p style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href={`/work/${prev.slug}/`}>← {prev.title}</Link>
          <Link href={`/work/${next.slug}/`}>{next.title} →</Link>
        </p>
      </main>
    </>
  );
}
