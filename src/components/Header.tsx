"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "bg-[var(--paper)]/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between py-4 md:py-5">
        <a href="#top" className="display text-[0.95rem] tracking-[-0.02em] md:text-[1.05rem]">
          {site.name}
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav-link overline text-[0.72rem]">
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="overline rounded-sm bg-[var(--ink)] px-3 py-2 text-[0.68rem] text-[var(--paper)] transition hover:bg-[var(--accent)]"
          >
            Let&apos;s talk
          </a>
        </nav>

        <button
          type="button"
          className="overline md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden ${open ? "block" : "hidden"} border-t border-[var(--line)] bg-[var(--paper)]`}
      >
        <nav className="container flex flex-col gap-5 py-8" aria-label="Mobile">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="display text-3xl"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="overline mt-2 text-[var(--accent)]"
            onClick={() => setOpen(false)}
          >
            {site.email}
          </a>
        </nav>
      </div>
    </header>
  );
}
