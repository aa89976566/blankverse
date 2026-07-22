"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { asset, type Project } from "@/lib/content";

type Props = {
  projects: Project[];
  onActiveChange?: (index: number) => void;
};

const POSTER_H = 0.63; // fraction of viewport height — matches Justine ~63vh
const POSTER_ASPECT = 440 / 593;
const GAP = 1.35; // spacing multiplier in poster widths

export function WebGLCarousel({ projects, onActiveChange }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [grabbing, setGrabbing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || projects.length === 0) return;

    let disposed = false;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 6;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const group = new THREE.Group();
    scene.add(group);

    type Card = {
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      index: number;
      baseX: number;
    };

    const cards: Card[] = [];
    const n = projects.length;
    // triple the list for infinite feel
    const copies = 3;

    const state = {
      x: 0,
      vx: 0,
      dragging: false,
      lastX: 0,
      lastT: 0,
      posterW: 1,
      posterH: 1,
      step: 1,
      loopW: 1,
      downX: 0,
      downY: 0,
      moved: false,
    };

    const makeSize = () => {
      const h = window.innerHeight * POSTER_H;
      const w = h * POSTER_ASPECT;
      // convert px height to world units at z=0 roughly
      const vFov = (camera.fov * Math.PI) / 180;
      const worldH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const worldW = worldH * (window.innerWidth / window.innerHeight);
      state.posterH = (h / window.innerHeight) * worldH;
      state.posterW = state.posterH * POSTER_ASPECT;
      state.step = state.posterW * GAP;
      state.loopW = state.step * n;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      void worldW;
    };

    makeSize();

    const geo = new THREE.PlaneGeometry(1, 1, 32, 32);

    for (let c = 0; c < copies; c++) {
      projects.forEach((project, i) => {
        const mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData.slug = project.slug;
        mesh.userData.projectIndex = i;
        const baseX = (c * n + i) * state.step;
        mesh.position.x = baseX;
        group.add(mesh);
        cards.push({ mesh, mat, index: i, baseX });

        loader.load(
          asset(project.poster),
          (tex) => {
            if (disposed) {
              tex.dispose();
              return;
            }
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            mat.map = tex;
            mat.needsUpdate = true;
            mat.opacity = 1;
          },
          undefined,
          () => {
            mat.color.set(project.color);
            mat.opacity = 1;
          },
        );
      });
    }

    // start centered on middle copy
    state.x = -state.loopW;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const setActive = (i: number) => {
      if (activeRef.current === i) return;
      activeRef.current = i;
      onActiveChange?.(i);
    };

    const layout = () => {
      const w = state.loopW;
      // wrap
      if (w > 0) {
        while (state.x > 0) state.x -= w;
        while (state.x < -w * 2) state.x += w;
      }
      group.position.x = state.x;

      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card) => {
        const mesh = card.mesh;
        const worldX = mesh.position.x + state.x;
        const d = worldX / (state.step || 1);
        // z-distortion like Justine center bend
        const z = -Math.abs(d) * 1.35;
        const rotY = -d * 0.42;
        const rotZ = d * 0.04;
        const scale = 1 - Math.min(Math.abs(d) * 0.06, 0.12);
        mesh.position.z = z;
        mesh.rotation.y = rotY;
        mesh.rotation.z = rotZ;
        mesh.rotation.x = state.vx * 0.002;
        mesh.scale.set(
          state.posterW * scale,
          state.posterH * scale,
          1,
        );
        const dist = Math.abs(worldX);
        if (dist < bestDist) {
          bestDist = dist;
          best = card.index;
        }
      });
      setActive(best);
    };

    const onResize = () => {
      makeSize();
      // recompute base positions
      cards.forEach((card, idx) => {
        card.baseX = idx * state.step;
        card.mesh.position.x = card.baseX;
      });
      state.loopW = state.step * n;
      layout();
    };

    const onPointerDown = (e: PointerEvent) => {
      state.dragging = true;
      state.moved = false;
      state.downX = e.clientX;
      state.downY = e.clientY;
      state.lastX = e.clientX;
      state.lastT = performance.now();
      state.vx = 0;
      setGrabbing(true);
      mount.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const now = performance.now();
      const dx = e.clientX - state.lastX;
      const dt = Math.max(now - state.lastT, 1);
      // convert px to world
      const worldPerPx =
        (2 * Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z) /
        window.innerHeight;
      state.x += dx * worldPerPx;
      state.vx = (dx / dt) * 16;
      state.lastX = e.clientX;
      state.lastT = now;
      if (
        Math.hypot(e.clientX - state.downX, e.clientY - state.downY) > 8
      ) {
        state.moved = true;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!state.dragging) return;
      state.dragging = false;
      setGrabbing(false);
      if (!state.moved) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(
          cards.map((c) => c.mesh),
          false,
        );
        if (hits[0]) {
          const slug = hits[0].object.userData.slug as string;
          router.push(`/work/${slug}/`);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const worldPerPx =
        (2 * Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z) /
        window.innerHeight;
      state.vx += -delta * worldPerPx * 0.35;
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const tick = () => {
      if (!state.dragging && !reduced) {
        state.x += state.vx * 0.016;
        state.vx *= 0.94;
        if (Math.abs(state.vx) < 0.0005) state.vx = 0;
      } else if (!state.dragging && reduced) {
        state.vx = 0;
      }
      layout();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    layout();
    onActiveChange?.(0);
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      cards.forEach((c) => {
        c.mat.map?.dispose();
        c.mat.dispose();
      });
      geo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [projects, onActiveChange, router]);

  return (
    <div
      ref={mountRef}
      className={`gl-carousel${grabbing ? " is-grabbing" : ""}`}
      aria-label="Project carousel"
    />
  );
}
