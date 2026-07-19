import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import {
  AboutSection,
  ApproachSection,
  CreditsSection,
  MandateSection,
  NextProject,
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

        <VideoBlock
          src="/video/clip-a.mp4"
          poster="/media/production-wide.jpg"
          autoPlay
        />

        <MandateSection />

        <DualVisual left="/media/night-still.jpg" right="/media/still-a.jpg" rounded />

        <FullVisual src="/media/baat-baaki.png" rounded />

        <DualVideo
          left={{ src: "/video/clip-b.mp4", poster: "/media/night-still.jpg" }}
          right={{ src: "/video/clip-a.mp4", poster: "/media/hero-wide.jpg" }}
        />

        <FullVisual src="/media/whiskey-sour.jpg" />

        <ApproachSection />

        <section id="showreel" className="bg-[var(--color-film)] py-4 text-white md:py-8">
          <VideoBlock src="/video/showreel.mp4" poster="/media/production-wide.jpg" />
          <div className="container pb-10">
            <p className="text-medium opacity-70">Showreel</p>
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
