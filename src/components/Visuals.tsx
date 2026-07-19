"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/content";
import { Reveal } from "./Reveal";

function ZoomFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const mid = rect.top + rect.height / 2;
      const dist = Math.abs(mid - vh / 2) / vh;
      const scale = 1.08 - Math.min(dist, 1) * 0.08;
      node.style.setProperty("--zoom", String(scale));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className={`media media-zoom ${className}`.trim()}>
      {children}
    </div>
  );
}

export function FullVisual({
  src,
  alt = "",
  rounded = false,
  bleed = false,
}: {
  src: string;
  alt?: string;
  rounded?: boolean;
  bleed?: boolean;
}) {
  return (
    <Reveal className={`${bleed ? "my-8 md:my-14" : "container my-8 md:my-14"}`}>
      <div className={bleed ? "" : undefined}>
        <ZoomFrame className={`aspect-[16/10] ${rounded ? "rounded" : ""} ${bleed ? "w-full" : ""}`}>
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
        </ZoomFrame>
      </div>
    </Reveal>
  );
}

export function DualVisual({
  left,
  right,
  rounded = false,
}: {
  left: string;
  right: string;
  rounded?: boolean;
}) {
  return (
    <Reveal className="container my-8 md:my-14">
      <div className="grid-12 items-end">
        <ZoomFrame className={`dual-left aspect-[3/4] ${rounded ? "rounded" : ""}`}>
          <Image src={left} alt="" fill sizes="40vw" className="object-cover" />
        </ZoomFrame>
        <ZoomFrame className={`dual-right aspect-[16/11] ${rounded ? "rounded" : ""}`}>
          <Image src={right} alt="" fill sizes="60vw" className="object-cover" />
        </ZoomFrame>
      </div>
    </Reveal>
  );
}

function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  className = "",
}: {
  src: string;
  poster: string;
  autoPlay?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);

  const toggle = async () => {
    const video = ref.current;
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
    <ZoomFrame className={`relative ${className}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        playsInline
        muted={autoPlay}
        loop={autoPlay}
        autoPlay={autoPlay}
        preload="metadata"
        poster={asset(poster)}
        onEnded={() => setPlaying(false)}
      >
        <source src={asset(src)} type="video/mp4" />
      </video>
      {!autoPlay &&
        (!playing ? (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/25"
            aria-label="Play video"
          >
            <span className="play-chip text-white">Play</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className="absolute bottom-4 right-4 z-10 play-chip bg-black/35 text-white"
            aria-label="Pause video"
          >
            Pause
          </button>
        ))}
    </ZoomFrame>
  );
}

export function VideoBlock({
  src,
  poster,
  autoPlay = false,
  bleed = false,
}: {
  src: string;
  poster: string;
  autoPlay?: boolean;
  bleed?: boolean;
}) {
  return (
    <Reveal className={bleed ? "my-0" : "container my-8 md:my-14"}>
      <VideoPlayer
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className={bleed ? "aspect-[16/9] w-full md:aspect-[21/9]" : "aspect-video"}
      />
    </Reveal>
  );
}

export function DualVideo({
  left,
  right,
}: {
  left: { src: string; poster: string };
  right: { src: string; poster: string };
}) {
  return (
    <Reveal className="container my-8 md:my-14">
      <div className="grid-12 items-stretch">
        <div className="dual-left">
          <VideoPlayer {...left} className="aspect-[4/5] md:aspect-[16/11]" />
        </div>
        <div className="dual-right">
          <VideoPlayer {...right} className="aspect-[4/5] md:aspect-[16/11]" />
        </div>
      </div>
    </Reveal>
  );
}
