"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { asset, type Project } from "@/lib/content";

type Props = {
  projects: Project[];
};

export function PosterCarousel({ projects }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const vx = useRef(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, t: 0 });
  const loopWidth = useRef(1);
  const raf = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const looped = useMemo(() => [...projects, ...projects, ...projects], [projects]);

  useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!track || !wrap) return;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      if (!first) return;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap || "0") || 0;
      loopWidth.current = (first.offsetWidth + gap) * projects.length;
      // start centered on middle copy
      x.current = -loopWidth.current;
      track.style.transform = `translate3d(${x.current}px,0,0)`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

    const tick = () => {
      if (!dragging.current) {
        x.current += vx.current;
        vx.current *= 0.94;
        if (Math.abs(vx.current) < 0.02) vx.current = 0;
      }

      const w = loopWidth.current;
      if (w > 1) {
        if (x.current > 0) x.current -= w;
        if (x.current < -w * 2) x.current += w;
      }

      track.style.transform = `translate3d(${x.current}px,0,0)`;

      // perspective warp based on distance from center
      const center = wrap.getBoundingClientRect().left + wrap.clientWidth / 2;
      Array.from(track.children).forEach((node, i) => {
        const el = node as HTMLElement;
        const rect = el.getBoundingClientRect();
        const mid = rect.left + rect.width / 2;
        const d = (mid - center) / wrap.clientWidth;
        const z = -Math.abs(d) * 140;
        const rot = d * -18;
        const scale = 1 - Math.min(Math.abs(d) * 0.18, 0.22);
        const skew = d * 4;
        el.style.transform = `translateZ(${z}px) rotateY(${rot}deg) skewY(${skew * 0.15}deg) scale(${scale})`;
        el.style.zIndex = String(100 - Math.round(Math.abs(d) * 100));
        if (Math.abs(d) < 0.12) {
          const next = i % projects.length;
          if (activeRef.current !== next) {
            activeRef.current = next;
            setActive(next);
          }
        }
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [projects.length]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onDown = (clientX: number) => {
      dragging.current = true;
      setIsDragging(true);
      last.current = { x: clientX, t: performance.now() };
      vx.current = 0;
    };

    const onMove = (clientX: number) => {
      if (!dragging.current) return;
      const now = performance.now();
      const dx = clientX - last.current.x;
      const dt = Math.max(now - last.current.t, 1);
      x.current += dx;
      vx.current = (dx / dt) * 16;
      last.current = { x: clientX, t: now };
    };

    const onUp = () => {
      dragging.current = false;
      setIsDragging(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a")) return;
      wrap.setPointerCapture(e.pointerId);
      onDown(e.clientX);
    };
    const onPointerMove = (e: PointerEvent) => onMove(e.clientX);
    const onPointerUp = () => onUp();
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      vx.current += -delta * 0.08;
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointercancel", onPointerUp);
    wrap.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
      wrap.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`carousel${isDragging ? " is-dragging" : ""}`}
      style={{ perspective: "1200px" }}
      aria-label="Project posters"
    >
      <div ref={trackRef} className="carousel__track">
        {looped.map((project, index) => (
          <article
            key={`${project.slug}-${index}`}
            className={`poster${index % projects.length === active ? " is-active" : ""}`}
            style={{ "--wash": project.wash } as CSSProperties}
          >
            <div className="poster__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="poster__media"
                src={asset(project.poster)}
                alt={project.title}
                draggable={false}
              />
              <div className="poster__wash" />
            </div>
            <div className="poster__meta">
              <div className="poster__title">{project.label}</div>
              <div className="poster__sub">
                {project.year} · {project.format.split("·")[0].trim()}
              </div>
            </div>
            <Link
              className="poster__hit"
              href={`/work/${project.slug}`}
              aria-label={`Open ${project.title}`}
              onClick={(e) => {
                if (Math.abs(vx.current) > 0.8 || isDragging) e.preventDefault();
              }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
