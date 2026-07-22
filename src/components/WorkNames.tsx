"use client";

import Link from "next/link";
import { type Project } from "@/lib/content";

type Props = {
  project: Project | null;
  visible?: boolean;
};

export function WorkNames({ project, visible = true }: Props) {
  if (!project) return null;
  return (
    <Link
      href={`/work/${project.slug}/`}
      className={`work-names${visible ? " is-visible" : ""}`}
      style={{ color: "#8c8080" }}
    >
      <div className="work-names__title">{project.label}</div>
      <div className="work-names__bar" aria-hidden>
        <svg viewBox="0 0 120 6" preserveAspectRatio="none">
          <path
            d="M0 3 H120"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
      <p className="work-names__type">{project.type}</p>
    </Link>
  );
}
