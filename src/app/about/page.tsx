import Link from "next/link";
import { asset, people, site, studioCopy } from "@/lib/content";
import { ScrollBody } from "@/components/BodyClass";

export default function AboutPage() {
  return (
    <>
      <ScrollBody />
      <main className="simple-page">
        <Link className="back" href="/">
          ← Desktop
        </Link>
        <p className="lede" style={{ marginTop: "1.5rem" }}>
          {site.tagline}
        </p>
        <h1>{site.name}</h1>
        <p className="lede">{site.honesty}</p>
        {studioCopy.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        {people.map((person) => (
          <section key={person.id} style={{ marginTop: "2.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cover" src={asset(person.image)} alt={person.name} />
            <h2 style={{ margin: "0.5rem 0 0.2rem", fontSize: "1.4rem" }}>
              {person.name}
            </h2>
            <p className="lede">
              {person.role} · {person.place}
            </p>
            {person.bio.map((b) => (
              <p key={b.slice(0, 20)}>{b}</p>
            ))}
          </section>
        ))}
        <p style={{ marginTop: "2rem" }}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </main>
    </>
  );
}
