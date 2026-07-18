import { credits, site } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="container py-16 md:py-28">
      <Reveal>
        <div className="section-rule grid gap-10 md:grid-cols-12">
          <h2 className="overline md:col-span-3">Work with us</h2>
          <div className="md:col-span-8 md:col-start-5">
            <p className="display text-[clamp(2.4rem,6vw,5rem)] max-w-3xl">
              Bring a script, a half-formed idea, or a festival deadline.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex overline text-[0.8rem] text-[var(--accent)] nav-link"
            >
              {site.email}
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-16 border-t border-[var(--line)] pt-8 md:mt-24">
          <h3 className="overline mb-6">Credits</h3>
          <dl className="grid gap-4">
            {credits.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[8rem_1fr] gap-4 border-b border-[var(--line)] py-3 md:grid-cols-[12rem_1fr]"
              >
                <dt className="text-sm text-[var(--muted)]">{row.label}</dt>
                <dd className="text-sm md:text-base">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      <footer className="mt-16 flex flex-col gap-3 border-t border-[var(--line)] py-8 text-sm text-[var(--muted)] md:mt-20 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p>{site.tagline}</p>
      </footer>
    </section>
  );
}
