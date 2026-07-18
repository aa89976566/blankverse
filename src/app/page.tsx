import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SectionOverline } from "@/components/SectionOverline";
import { WorkList } from "@/components/WorkList";
import { VisualBreak, DualVisual } from "@/components/VisualBreak";
import { Showreel } from "@/components/Showreel";
import { Studio } from "@/components/Studio";
import { Contact } from "@/components/Contact";
import { about, approach, mandate } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <div className="grain" aria-hidden />
      <Header />
      <main>
        <Hero />

        <SectionOverline id="about" title={about.overline}>
          <div className="body-copy">
            {about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </SectionOverline>

        <VisualBreak src="/media/therapist-crew.jpg" alt="Therapist cast and crew" />

        <WorkList />

        <DualVisual
          left={{ src: "/media/filmmaker-portrait.jpg", alt: "Udbhavi Upadhyay on camera" }}
          right={{ src: "/media/still-a.jpg", alt: "Blank Verse Films production still" }}
        />

        <SectionOverline title={mandate.overline}>
          <p className="body-copy">{mandate.body}</p>
        </SectionOverline>

        <VisualBreak src="/media/night-still.jpg" alt="Cinematic still from recent work" />

        <SectionOverline title={approach.overline}>
          <p className="body-copy">{approach.body}</p>
        </SectionOverline>

        <Showreel />

        <DualVisual
          left={{ src: "/media/baat-baaki.png", alt: "Baat Baaki" }}
          right={{ src: "/media/whiskey-sour.jpg", alt: "Whiskey Sour" }}
        />

        <Studio />
        <Contact />
      </main>
    </>
  );
}
