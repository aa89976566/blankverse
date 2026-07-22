"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { WebGLCarousel } from "@/components/WebGLCarousel";
import { WorkNames } from "@/components/WorkNames";
import { projects } from "@/lib/content";

export default function HomePage() {
  const [active, setActive] = useState(0);
  const onActiveChange = useCallback((i: number) => setActive(i), []);

  return (
    <main className="home-stage">
      <Header />
      <WebGLCarousel projects={projects} onActiveChange={onActiveChange} />
      <WorkNames project={projects[active] ?? null} visible />
    </main>
  );
}
