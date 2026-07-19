"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
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
    <>
      <header className={`c-header ${solid || open ? "is-solid" : ""}`}>
        <div className="c-header_inner">
          <a href="#top">{site.name}</a>
          <nav className="c-header_nav" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.href} className="c-header_link" href={item.href}>
                {item.label}
              </a>
            ))}
            <a className="c-header_cta" href={`mailto:${site.email}`}>
              Let&apos;s talk
            </a>
          </nav>
          <button
            type="button"
            className="c-header_menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <div className={`c-mobile ${open ? "is-open" : ""}`}>
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a href={`mailto:${site.email}`} onClick={() => setOpen(false)}>
          Let&apos;s talk
        </a>
      </div>
    </>
  );
}
