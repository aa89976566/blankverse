import { Header } from "@/components/Header";
import { PosterCarousel } from "@/components/PosterCarousel";
import { projects, site } from "@/lib/content";

export default function HomePage() {
  return (
    <main className="home">
      <Header />
      <PosterCarousel projects={projects} />
      <div className="home__hint">
        <span>Drag · Scroll · Click a poster</span>
        <span>{site.tagline}</span>
      </div>
    </main>
  );
}
