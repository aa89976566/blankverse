"use client";

import { useEffect, type CSSProperties } from "react";

export function WorkBodyClass({
  className,
  style,
}: {
  className: string;
  style?: CSSProperties;
}) {
  useEffect(() => {
    const prev = document.body.className;
    document.body.classList.add(...className.split(" ").filter(Boolean));
    const prevStyle = document.body.getAttribute("style");
    if (style) {
      Object.assign(document.body.style, style as Record<string, string>);
    }
    return () => {
      document.body.className = prev;
      if (prevStyle == null) document.body.removeAttribute("style");
      else document.body.setAttribute("style", prevStyle);
    };
  }, [className, style]);
  return null;
}

export function ScrollBody() {
  useEffect(() => {
    document.body.classList.add("is-scroll");
    return () => document.body.classList.remove("is-scroll");
  }, []);
  return null;
}
