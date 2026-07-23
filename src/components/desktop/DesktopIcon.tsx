"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { asset } from "@/lib/content";

type Props = {
  id: string;
  label: string;
  image?: string;
  tone?: "folder" | "file";
  x: number;
  y: number;
  width?: number;
  onOpen: () => void;
  onMove: (id: string, x: number, y: number) => void;
};

export function DesktopIcon({
  id,
  label,
  image,
  tone = "file",
  x,
  y,
  width = 92,
  onOpen,
  onMove,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const moved = useRef(false);
  const origin = useRef<{ px: number; py: number; x: number; y: number } | null>(
    null,
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    moved.current = false;
    origin.current = { px: e.clientX, py: e.clientY, x, y };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!origin.current) return;
    const dx = e.clientX - origin.current.px;
    const dy = e.clientY - origin.current.py;
    if (Math.hypot(dx, dy) > 4) moved.current = true;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const nx = ((origin.current.x / 100) * vw + dx) / vw * 100;
    const ny = ((origin.current.y / 100) * vh + dy) / vh * 100;
    onMove(id, Math.min(92, Math.max(2, nx)), Math.min(78, Math.max(4, ny)));
  };

  const onPointerUp = () => {
    const wasDrag = moved.current;
    origin.current = null;
    setDragging(false);
    if (!wasDrag) onOpen();
  };

  return (
    <button
      type="button"
      className={`desk-icon${dragging ? " is-dragging" : ""}${tone === "folder" ? " is-folder" : ""}`}
      style={{ left: `${x}%`, top: `${y}%`, width }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label={label}
    >
      <span className="desk-icon__thumb">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(image)} alt="" draggable={false} />
        ) : (
          <span className="desk-icon__folder" aria-hidden />
        )}
      </span>
      <span className="desk-icon__label">{label}</span>
    </button>
  );
}
