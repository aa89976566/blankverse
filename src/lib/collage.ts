import type { Project } from "@/lib/content";

/** A single collage cutout inside a poster scene (Justine-style layered composition). */
export type CollageLayer = {
  kind: "bg" | "polaroid" | "shape" | "label" | "tape" | "stamp";
  /** image path for polaroid / bg image */
  src?: string;
  /** 0..1 within poster frame; origin top-left of poster */
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number; // radians
  z?: number;
  color?: string;
  text?: string;
  /** parallax multiplier vs drag velocity */
  drift?: number;
};

export type CollageRecipe = {
  bg: string;
  accent: string;
  layers: CollageLayer[];
};

/** Build scrapbook/collage recipes from project media — layered cutouts, not one warped photo. */
export function recipeFor(project: Project): CollageRecipe {
  const g = project.gallery;
  const a = g[0] || project.poster;
  const b = g[1] || project.cover || a;
  const c = g[2] || a;
  const d = g[3] || b;

  const base: CollageRecipe = {
    bg: project.color,
    accent: project.transitionColor,
    layers: [],
  };

  // Shared collage grammar: paper bg → accent shape → stacked polaroids → stamp/label → tape
  base.layers = [
    { kind: "bg", x: 0, y: 0, w: 1, h: 1, z: 0, color: project.color },
    {
      kind: "shape",
      x: 0.55,
      y: 0.08,
      w: 0.5,
      h: 0.38,
      rot: 0.15,
      z: 0.01,
      color: project.transitionColor,
      drift: 0.35,
    },
    {
      kind: "polaroid",
      src: a,
      x: 0.08,
      y: 0.1,
      w: 0.62,
      h: 0.52,
      rot: -0.08,
      z: 0.02,
      drift: 0.55,
    },
    {
      kind: "polaroid",
      src: b,
      x: 0.38,
      y: 0.36,
      w: 0.52,
      h: 0.42,
      rot: 0.12,
      z: 0.03,
      drift: 0.85,
    },
    {
      kind: "polaroid",
      src: c,
      x: 0.05,
      y: 0.52,
      w: 0.42,
      h: 0.36,
      rot: -0.18,
      z: 0.04,
      drift: 1.1,
    },
    {
      kind: "tape",
      x: 0.28,
      y: 0.32,
      w: 0.28,
      h: 0.045,
      rot: -0.35,
      z: 0.05,
      color: "rgba(255,240,200,0.55)",
      drift: 0.2,
    },
    {
      kind: "stamp",
      x: 0.62,
      y: 0.72,
      w: 0.3,
      h: 0.14,
      rot: 0.2,
      z: 0.055,
      color: project.transitionColor,
      text: project.year,
      drift: 0.4,
    },
    {
      kind: "label",
      x: 0.1,
      y: 0.82,
      w: 0.55,
      h: 0.12,
      z: 0.06,
      color: "#252422",
      text: project.label,
      drift: 0.25,
    },
  ];

  // Project-specific accents using 4th still when available
  if (d && d !== a) {
    base.layers.splice(4, 0, {
      kind: "polaroid",
      src: d,
      x: 0.58,
      y: 0.05,
      w: 0.34,
      h: 0.28,
      rot: 0.22,
      z: 0.025,
      drift: 0.7,
    });
  }

  return base;
}
