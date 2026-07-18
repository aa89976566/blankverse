"use client";

import { useRef, useState } from "react";
import { site } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="showreel" className="bg-[var(--film)] py-16 text-[var(--paper)] md:py-24">
      <div className="container">
        <Reveal>
          <div className="section-rule mb-8 border-[rgba(247,248,248,0.18)] md:mb-12">
            <div className="grid gap-6 md:grid-cols-12">
              <h2 className="overline md:col-span-3">Showreel</h2>
              <p className="body-copy md:col-span-7 md:col-start-5" style={{ color: "#c8cbcd" }}>
                Selected work from recent productions — festivals, features in post, and
                independent films made between London and India.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="media-frame relative aspect-video bg-black">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              preload="metadata"
              poster="/media/production-wide.jpg"
              onEnded={() => setPlaying(false)}
            >
              <source src="/video/showreel.mp4" type="video/mp4" />
            </video>
            {!playing ? (
              <button
                type="button"
                onClick={toggle}
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
                aria-label="Play showreel"
              >
                <span className="display border border-white/70 px-6 py-3 text-sm tracking-[0.12em] uppercase backdrop-blur-sm md:text-base">
                  Play
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={toggle}
                className="absolute bottom-4 right-4 overline border border-white/50 bg-black/40 px-3 py-2 text-[0.65rem] backdrop-blur-sm"
                aria-label="Pause showreel"
              >
                Pause
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#9aa0a4]">Also on YouTube</p>
            <a
              href={site.youtubeShowreel}
              target="_blank"
              rel="noreferrer"
              className="nav-link overline w-fit text-[0.72rem]"
            >
              Watch on YouTube →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
