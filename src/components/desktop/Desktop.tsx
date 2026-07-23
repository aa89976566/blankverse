"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  asset,
  archiveStills,
  people,
  projects,
  site,
  studioCopy,
  type Project,
} from "@/lib/content";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopWindow, useWindowStack } from "./DesktopWindow";
import {
  Dock,
  IconFilm,
  IconInstagram,
  IconMail,
  IconNotes,
  IconPhotos,
  IconTrash,
  IconYouTube,
  type DockItem,
} from "./Dock";
import { BRAND_SPOT, PROJECT_SPOTS } from "./layout";

type PosMap = Record<string, { x: number; y: number }>;

function initialPositions(): PosMap {
  const map: PosMap = { brand: { x: BRAND_SPOT.x, y: BRAND_SPOT.y } };
  projects.forEach((p, i) => {
    const spot = PROJECT_SPOTS[i % PROJECT_SPOTS.length];
    // slight deterministic jitter so icons don't stack when count > spots
    const jitter = (i * 7) % 5;
    map[p.slug] = {
      x: Math.min(90, spot.x + (i >= PROJECT_SPOTS.length ? jitter : 0)),
      y: Math.min(72, spot.y + (i >= PROJECT_SPOTS.length ? jitter * 1.4 : 0)),
    };
  });
  return map;
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <div className="desk-project">
      <div className="desk-project__hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(project.cover)} alt="" />
      </div>
      <div className="desk-project__meta">
        <p className="desk-project__type">
          {project.type} · {project.year}
        </p>
        <h3>{project.title}</h3>
        <p className="desk-project__status">{project.status}</p>
        <p>{project.synopsis}</p>
        {project.details.length ? (
          <ul>
            {project.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ) : null}
        {project.credits.length ? (
          <dl className="desk-credits">
            {project.credits.map((c) => (
              <div key={`${c.role}-${c.name}`}>
                <dt>{c.role}</dt>
                <dd>{c.name}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {project.links?.length ? (
          <div className="desk-project__links">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="desk-project__gallery">
        {(project.video ? [project.cover, ...project.gallery] : project.gallery)
          .slice(0, 6)
          .map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={asset(src)} alt="" />
          ))}
      </div>
      {project.video ? (
        <video
          className="desk-project__video"
          src={asset(project.video)}
          controls
          playsInline
          preload="metadata"
          poster={asset(project.cover)}
        />
      ) : null}
    </div>
  );
}

function AboutBody() {
  return (
    <div className="desk-about">
      <p className="desk-about__tag">{site.tagline}</p>
      <h3>{site.honesty}</h3>
      {studioCopy.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
      <div className="desk-people">
        {people.map((person) => (
          <article key={person.id} className="desk-person">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(person.image)} alt="" />
            <div>
              <h4>{person.name}</h4>
              <p className="desk-person__role">
                {person.role} · {person.place}
              </p>
              {person.bio.slice(0, 2).map((b) => (
                <p key={b.slice(0, 20)}>{b}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="desk-about__contact">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        {" · "}
        <a href={site.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>
    </div>
  );
}

function GalleryBody() {
  return (
    <div className="desk-gallery">
      {archiveStills.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={asset(src)} alt="" />
      ))}
    </div>
  );
}

export function Desktop() {
  const [positions, setPositions] = useState<PosMap>(initialPositions);
  const [clock, setClock] = useState("");
  const { stack, zOf, focus, open, close, closeAll, isOpen } = useWindowStack();

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        d.toLocaleString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const moveIcon = useCallback((id: string, x: number, y: number) => {
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const openProject = useCallback(
    (slug: string) => {
      open(`project:${slug}`);
    },
    [open],
  );

  const dockItems: DockItem[] = useMemo(
    () => [
      {
        id: "about",
        label: "About",
        icon: <IconNotes />,
        onClick: () => open("about"),
      },
      {
        id: "showreel",
        label: "Showreel",
        icon: <IconFilm />,
        onClick: () => openProject("showreel"),
      },
      {
        id: "gallery",
        label: "Stills",
        icon: <IconPhotos />,
        onClick: () => open("gallery"),
      },
      {
        id: "ig",
        label: "Instagram",
        icon: <IconInstagram />,
        href: site.instagram,
      },
      {
        id: "yt",
        label: "YouTube",
        icon: <IconYouTube />,
        href: site.youtube,
      },
      {
        id: "mail",
        label: "Mail",
        icon: <IconMail />,
        href: `mailto:${site.email}`,
      },
      {
        id: "trash",
        label: "Close all",
        icon: <IconTrash />,
        onClick: () => closeAll(),
      },
    ],
    [open, closeAll, openProject],
  );

  const openProjects = stack
    .filter((id) => id.startsWith("project:"))
    .map((id) => id.replace("project:", ""));

  return (
    <main className="desktop">
      <div className="desktop__wallpaper" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/media/filmmaker-portrait.jpg")} alt="" />
      </div>

      <header className="desk-menubar">
        <div className="desk-menubar__left">
          <span className="desk-menubar__brand">{site.name}</span>
          <button type="button" onClick={() => open("about")}>
            About
          </button>
          <button type="button" onClick={() => open("gallery")}>
            Stills
          </button>
        </div>
        <div className="desk-menubar__right">
          <span>{site.bases.join(" · ")}</span>
          <time>{clock}</time>
        </div>
      </header>

      <div className="desktop__icons">
        <DesktopIcon
          id="brand"
          label={site.name}
          tone="folder"
          x={positions.brand?.x ?? BRAND_SPOT.x}
          y={positions.brand?.y ?? BRAND_SPOT.y}
          width={BRAND_SPOT.w}
          onOpen={() => open("about")}
          onMove={moveIcon}
        />
        {projects.map((p, i) => {
          const pos = positions[p.slug] ?? PROJECT_SPOTS[i % PROJECT_SPOTS.length];
          return (
            <DesktopIcon
              key={p.slug}
              id={p.slug}
              label={p.title}
              image={p.cover}
              x={pos.x}
              y={pos.y}
              width={PROJECT_SPOTS[i % PROJECT_SPOTS.length].w ?? 92}
              onOpen={() => openProject(p.slug)}
              onMove={moveIcon}
            />
          );
        })}
      </div>

      {isOpen("about") ? (
        <DesktopWindow
          title={`${site.name} — About`}
          zIndex={zOf("about")}
          initial={{ x: 72, y: 64, w: 560, h: 560 }}
          onFocus={() => focus("about")}
          onClose={() => close("about")}
        >
          <AboutBody />
        </DesktopWindow>
      ) : null}

      {isOpen("gallery") ? (
        <DesktopWindow
          title="Stills"
          zIndex={zOf("gallery")}
          initial={{ x: 120, y: 80, w: 640, h: 520 }}
          onFocus={() => focus("gallery")}
          onClose={() => close("gallery")}
        >
          <GalleryBody />
        </DesktopWindow>
      ) : null}

      {openProjects.map((slug, i) => {
        const project = projects.find((p) => p.slug === slug);
        if (!project) return null;
        const id = `project:${slug}`;
        return (
          <DesktopWindow
            key={id}
            title={project.title}
            zIndex={zOf(id)}
            initial={{
              x: 56 + (i % 4) * 28,
              y: 56 + (i % 4) * 24,
              w: 520,
              h: 560,
            }}
            onFocus={() => focus(id)}
            onClose={() => close(id)}
          >
            <ProjectBody project={project} />
          </DesktopWindow>
        );
      })}

      <Dock items={dockItems} />

      <p className="desk-hint">Drag icons · Click to open</p>
    </main>
  );
}
