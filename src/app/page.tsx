"use client";

import { HomeExperience } from "@/components/HomeExperience";
import { projects } from "@/lib/content";

export default function HomePage() {
  return <HomeExperience projects={projects} />;
}
