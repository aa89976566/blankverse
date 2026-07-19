"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/content";

export function ImageBlock({
  src,
  alt = "",
  ratio = "cover",
  rounded = false,
}: {
  src: string;
  alt?: string;
  ratio?: "cover" | "portrait";
  rounded?: boolean;
}) {
  return (
    <div
      className={`c-image -${ratio} ${rounded ? "-rounded" : ""}`.trim()}
    >
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}

export function VideoBlock({
  src,
  poster,
  ratio = "cover",
  rounded = false,
  autoPlay = false,
}: {
  src: string;
  poster: string;
  ratio?: "cover" | "portrait";
  rounded?: boolean;
  autoPlay?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);

  const toggle = async () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      await v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`c-video c-image -${ratio} ${rounded ? "-rounded" : ""}`}>
      <video
        ref={ref}
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
          <button type="button" className="c-video_button" onClick={toggle} aria-label="Play">
            <span className="c-video_chip">Play</span>
          </button>
        ) : (
          <button type="button" className="c-video_chip -corner" onClick={toggle} aria-label="Pause">
            Pause
          </button>
        ))}
    </div>
  );
}

export function AttachmentVisual({
  src,
  rounded = false,
}: {
  src: string;
  rounded?: boolean;
}) {
  return (
    <div className="c-attachment -visual o-container">
      <ImageBlock src={src} rounded={rounded} />
    </div>
  );
}

export function AttachmentDual({
  left,
  right,
  leftVideo,
  rightVideo,
  rounded = false,
}: {
  left: string;
  right: string;
  leftVideo?: { src: string; poster: string };
  rightVideo?: { src: string; poster: string };
  rounded?: boolean;
}) {
  return (
    <div className="c-attachment -dual o-container">
      <div className="o-grid-12">
        <div className="c-col-left">
          {leftVideo ? (
            <VideoBlock
              src={leftVideo.src}
              poster={leftVideo.poster}
              ratio="portrait"
              rounded={rounded}
            />
          ) : (
            <ImageBlock src={left} ratio="portrait" rounded={rounded} />
          )}
        </div>
        <div className="c-col-right">
          {rightVideo ? (
            <VideoBlock
              src={rightVideo.src}
              poster={rightVideo.poster}
              rounded={rounded}
            />
          ) : (
            <ImageBlock src={right} rounded={rounded} />
          )}
        </div>
      </div>
    </div>
  );
}

export function HeroVisual({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = window.setTimeout(() => ref.current?.classList.add("is-in"), 40);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div ref={ref} className="c-hero_visual">
      <ImageBlock src={src} />
    </div>
  );
}
