"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type DockItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
};

type Props = {
  items: DockItem[];
};

export function Dock({ items }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [scales, setScales] = useState<number[]>(() => items.map(() => 1));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-dock-item]"));
      const next = nodes.map((node) => {
        const r = node.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const dist = Math.abs(e.clientX - cx);
        const t = Math.max(0, 1 - dist / 140);
        return 1 + t * t * 0.72;
      });
      setScales(next);
    };
    const onLeave = () => setScales(items.map(() => 1));

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [items]);

  return (
    <nav className="desk-dock" ref={ref} aria-label="Dock">
      <div className="desk-dock__glass">
        {items.map((item, i) => {
          const scale = scales[i] ?? 1;
          const common = {
            className: "desk-dock__btn",
            "data-dock-item": true,
            style: {
              transform: `translateY(${(1 - scale) * 18}px) scale(${scale})`,
            },
            title: item.label,
            "aria-label": item.label,
          } as const;

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                {...common}
              >
                {item.icon}
              </a>
            );
          }

          return (
            <button key={item.id} type="button" onClick={item.onClick} {...common}>
              {item.icon}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* —— Dock glyph set (macOS-adjacent, custom for BVF) —— */

export function IconNotes() {
  return (
    <svg viewBox="0 0 64 64" className="desk-dock__svg" aria-hidden>
      <rect x="8" y="6" width="48" height="52" rx="8" fill="#ffd60a" />
      <rect x="8" y="6" width="48" height="14" fill="#ff9f0a" />
      <rect x="16" y="28" width="32" height="3" rx="1.5" fill="#8a6a00" opacity="0.45" />
      <rect x="16" y="36" width="26" height="3" rx="1.5" fill="#8a6a00" opacity="0.35" />
      <rect x="16" y="44" width="20" height="3" rx="1.5" fill="#8a6a00" opacity="0.25" />
    </svg>
  );
}

export function IconPhotos() {
  return (
    <svg viewBox="0 0 64 64" className="desk-dock__svg" aria-hidden>
      <defs>
        <radialGradient id="ph" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="35%" stopColor="#ffd60a" />
          <stop offset="55%" stopColor="#ff453a" />
          <stop offset="75%" stopColor="#bf5af2" />
          <stop offset="100%" stopColor="#0a84ff" />
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#fff" />
      <circle cx="32" cy="32" r="18" fill="url(#ph)" />
    </svg>
  );
}

export function IconFilm() {
  return (
    <svg viewBox="0 0 64 64" className="desk-dock__svg" aria-hidden>
      <rect x="6" y="10" width="52" height="44" rx="10" fill="#1c1c1e" />
      <rect x="14" y="18" width="36" height="28" rx="4" fill="#3a3a3c" />
      <circle cx="22" cy="32" r="5" fill="#ff453a" />
      <circle cx="42" cy="32" r="5" fill="#0a84ff" />
      <rect x="10" y="14" width="6" height="6" rx="1" fill="#636366" />
      <rect x="10" y="44" width="6" height="6" rx="1" fill="#636366" />
      <rect x="48" y="14" width="6" height="6" rx="1" fill="#636366" />
      <rect x="48" y="44" width="6" height="6" rx="1" fill="#636366" />
    </svg>
  );
}

export function IconInstagram() {
  return (
    <svg viewBox="0 0 64 64" className="desk-dock__svg" aria-hidden>
      <defs>
        <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="50%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#515bd4" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#ig)" />
      <rect x="18" y="18" width="28" height="28" rx="8" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="32" cy="32" r="7" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="42" cy="22" r="2.5" fill="#fff" />
    </svg>
  );
}

export function IconMail() {
  return (
    <svg viewBox="0 0 64 64" className="desk-dock__svg" aria-hidden>
      <rect x="6" y="10" width="52" height="44" rx="10" fill="#0a84ff" />
      <path d="M10 18 L32 34 L54 18" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M10 48 L26 34 M54 48 L38 34" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.55" />
    </svg>
  );
}

export function IconTrash() {
  return (
    <svg viewBox="0 0 64 64" className="desk-dock__svg" aria-hidden>
      <rect x="14" y="18" width="36" height="38" rx="6" fill="#8e8e93" />
      <rect x="10" y="12" width="44" height="8" rx="3" fill="#aeaeb2" />
      <rect x="26" y="6" width="12" height="8" rx="2" fill="#aeaeb2" />
      <rect x="22" y="28" width="4" height="20" rx="2" fill="#636366" />
      <rect x="30" y="28" width="4" height="20" rx="2" fill="#636366" />
      <rect x="38" y="28" width="4" height="20" rx="2" fill="#636366" />
    </svg>
  );
}

export function IconYouTube() {
  return (
    <svg viewBox="0 0 64 64" className="desk-dock__svg" aria-hidden>
      <rect x="4" y="12" width="56" height="40" rx="12" fill="#ff2d55" />
      <path d="M28 24 L44 32 L28 40 Z" fill="#fff" />
    </svg>
  );
}
