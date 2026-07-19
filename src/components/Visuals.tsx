"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { asset } from "@/lib/content";
import { Reveal } from "./Reveal";

type FullVisualProps = {
  src: string;
  alt?: string;
  rounded?: boolean;
  className?: string;
};

export function FullVisual({
  src,
  alt = "",
  rounded = false,
  className = "",
}: FullVisualProps) {
  return (
    <Reveal className={`container my-8 md:my-14 ${className}`.trim()}>
      <div className={`media aspect-[16/10] ${rounded ? "rounded" : ""}`}>
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
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
        <div className={`media dual-left aspect-[3/4] ${rounded ? "rounded" : ""}`}>
          <Image src={left} alt="" fill sizes="40vw" className="object-cover" />
        </div>
        <div className={`media dual-right aspect-[16/11] ${rounded ? "rounded" : ""}`}>
          <Image src={right} alt="" fill sizes="60vw" className="object-cover" />
        </div>
      </div>
    </Reveal>
  );
}

export function VideoBlock({
  src,
  poster,
  aspect = "video",
  autoPlay = false,
}: {
  src: string;
  poster: string;
  aspect?: "video" | "portrait";
  autoPlay?: boolean;
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
    <Reveal className="container my-8 md:my-14">
      <div
        className={`media relative ${
          aspect === "portrait" ? "mx-auto aspect-[3/4] max-w-xl" : "aspect-video"
        }`}
      >
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
              className="absolute inset-0 flex items-center justify-center bg-black/25"
              aria-label="Play video"
            >
              <span className="play-chip text-white">Play</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggle}
              className="absolute bottom-4 right-4 play-chip bg-black/35 text-white"
              aria-label="Pause video"
            >
              Pause
            </button>
          ))}
      </div>
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
        <VideoThumb className="dual-left" {...left} />
        <VideoThumb className="dual-right" {...right} />
      </div>
    </Reveal>
  );
}

function VideoThumb({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

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
    <div className={`media relative aspect-[4/5] md:aspect-[16/11] ${className || ""}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        playsInline
        preload="metadata"
        poster={asset(poster)}
        onEnded={() => setPlaying(false)}
      >
        <source src={asset(src)} type="video/mp4" />
      </video>
      {!playing ? (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          aria-label="Play video"
        >
          <span className="play-chip text-white">Play</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-3 right-3 play-chip bg-black/35 text-white"
          aria-label="Pause video"
        >
          Pause
        </button>
      )}
    </div>
  );
}
