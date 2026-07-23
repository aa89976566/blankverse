"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type Props = {
  title: string;
  children: ReactNode;
  zIndex: number;
  initial: { x: number; y: number; w: number; h?: number };
  onFocus: () => void;
  onClose: () => void;
};

export function DesktopWindow({
  title,
  children,
  zIndex,
  initial,
  onFocus,
  onClose,
}: Props) {
  const [pos, setPos] = useState({ x: initial.x, y: initial.y });
  const [size] = useState({ w: initial.w, h: initial.h ?? 520 });
  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(
    null,
  );
  const id = useId();

  const onPointerDown = (e: ReactPointerEvent) => {
    onFocus();
    const target = e.target as HTMLElement;
    if (target.closest("[data-win-close]")) return;
    drag.current = {
      ox: e.clientX,
      oy: e.clientY,
      sx: pos.x,
      sy: pos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.ox;
    const dy = e.clientY - drag.current.oy;
    setPos({
      x: Math.max(8, drag.current.sx + dx),
      y: Math.max(28, drag.current.sy + dy),
    });
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const style: CSSProperties = {
    left: pos.x,
    top: pos.y,
    width: size.w,
    height: size.h,
    zIndex,
  };

  return (
    <section
      className="desk-window"
      style={style}
      role="dialog"
      aria-labelledby={id}
      onPointerDown={() => onFocus()}
    >
      <header
        className="desk-window__chrome"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="desk-window__traffic">
          <button
            type="button"
            className="desk-traffic desk-traffic--close"
            data-win-close
            aria-label="Close"
            onClick={onClose}
          />
          <span className="desk-traffic desk-traffic--min" aria-hidden />
          <span className="desk-traffic desk-traffic--max" aria-hidden />
        </div>
        <h2 id={id} className="desk-window__title">
          {title}
        </h2>
      </header>
      <div className="desk-window__body">{children}</div>
    </section>
  );
}

export function useWindowStack() {
  const [stack, setStack] = useState<string[]>([]);
  const zOf = useCallback(
    (id: string) => {
      const i = stack.indexOf(id);
      return i === -1 ? 40 : 50 + i;
    },
    [stack],
  );
  const focus = useCallback((id: string) => {
    setStack((s) => [...s.filter((x) => x !== id), id]);
  }, []);
  const open = useCallback(
    (id: string) => {
      setStack((s) => (s.includes(id) ? [...s.filter((x) => x !== id), id] : [...s, id]));
    },
    [],
  );
  const close = useCallback((id: string) => {
    setStack((s) => s.filter((x) => x !== id));
  }, []);
  const closeAll = useCallback(() => setStack([]), []);
  const isOpen = useCallback((id: string) => stack.includes(id), [stack]);
  return { stack, zOf, focus, open, close, closeAll, isOpen };
}
