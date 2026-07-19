"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
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
    <header className={`site-header ${solid || open ? "is-solid" : ""}`}>
      <div className="container flex items-center justify-between py-4 md:py-5">
        <a href="#top" className="text-[0.95rem] tracking-[-0.02em]">
          {site.name}
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`} className="nav-link">
            Let&apos;s talk
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/15 bg-white text-black md:hidden">
          <nav className="container flex flex-col gap-5 py-8">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="heading-huge !text-[2.4rem]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a href={`mailto:${site.email}`} onClick={() => setOpen(false)}>
              {site.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
