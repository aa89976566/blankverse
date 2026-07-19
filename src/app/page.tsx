import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { NextProject } from "@/components/NextProject";
import {
  AboutSection,
  ApproachSection,
  CreditsSection,
  MandateSection,
  ProjectsSection,
  StudioSection,
  WebsiteCta,
} from "@/components/Sections";
import { DualVideo, DualVisual, FullVisual, VideoBlock } from "@/components/Visuals";

export default function HomePage() {
  return (
    <>
      <div className="grain" aria-hidden />
      <Header />
      <main>
        <Hero />

        <FullVisual src="/media/therapist-crew.jpg" />

        <AboutSection />

        <ProjectsSection />

        <DualVisual left="/media/filmmaker-portrait.jpg" right="/media/set-alley.jpg" />

        <DualVideo
          left={{ src: "/video/clip-a.mp4", poster: "/media/production-wide.jpg" }}
          right={{ src: "/video/clip-b.mp4", poster: "/media/night-still.jpg" }}
        />

        <FullVisual src="/media/hero-wide.jpg" />

        <MandateSection />

        <DualVisual left="/media/night-still.jpg" right="/media/still-a.jpg" rounded />

        <VideoBlock src="/video/clip-b.mp4" poster="/media/set-alley.jpg" autoPlay />

        <FullVisual src="/media/baat-baaki.png" rounded />

        <DualVisual left="/media/oh-good-grief.jpg" right="/media/whiskey-sour.jpg" />

        <ApproachSection />

        <section id="showreel" className="showreel-band">
          <div className="container mb-6">
            <p className="text-medium opacity-70">Showreel</p>
          </div>
          <VideoBlock src="/video/showreel.mp4" poster="/media/production-wide.jpg" bleed />
          <div className="container mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm opacity-60">Selected cuts from recent productions</p>
            <a
              href="https://www.youtube.com/watch?v=MDB41TwlpUg"
              target="_blank"
              rel="noreferrer"
              className="nav-link text-sm"
            >
              Watch on YouTube →
            </a>
          </div>
        </section>

        <Gallery />

        <StudioSection />

        <WebsiteCta />

        <CreditsSection />

        <NextProject />
      </main>
    </>
  );
}
