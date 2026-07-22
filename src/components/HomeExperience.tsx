"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { asset, type Project } from "@/lib/content";
import { WorkNames } from "@/components/WorkNames";
import { Header } from "@/components/Header";

type Props = { projects: Project[] };

const POSTER_H = 0.63;
const POSTER_ASPECT = 440 / 593;
const GAP = 1.32;

export function HomeExperience({ projects }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  const activeRef = useRef(0);
  const readyRef = useRef(false);

  const onActiveChange = useCallback((i: number) => {
    if (activeRef.current === i) return;
    activeRef.current = i;
    setActive(i);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !projects.length) return;
    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0xf4f0ed, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const mainScene = new THREE.Scene();
    const mainCam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    mainCam.position.z = 6;
    const carousel = new THREE.Group();
    mainScene.add(carousel);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const texCache = new Map<string, THREE.Texture>();
    const displayMeshes: THREE.Mesh[] = [];

    const state = {
      x: 0,
      targetX: 0,
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
      const vFov = (mainCam.fov * Math.PI) / 180;
      const worldH = 2 * Math.tan(vFov / 2) * mainCam.position.z;
      state.posterH = (h / window.innerHeight) * worldH;
      state.posterW = state.posterH * POSTER_ASPECT;
      state.step = state.posterW * GAP;
      state.loopW = state.step * projects.length;
      mainCam.aspect = window.innerWidth / window.innerHeight;
      mainCam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    makeSize();

    const loadTex = (src: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        const hit = texCache.get(src);
        if (hit) {
          resolve(hit);
          return;
        }
        loader.load(
          asset(src),
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
            texCache.set(src, t);
            resolve(t);
          },
          undefined,
          () => reject(new Error(src)),
        );
      });

    const attachDisplay = (tex: THREE.Texture, project: Project, slot: number) => {
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.userData.slug = project.slug;
      mesh.userData.projectIndex = projects.findIndex((p) => p.slug === project.slug);
      mesh.position.x = slot * state.step;
      mesh.position.z = 0;
      mesh.rotation.y = 0;
      mesh.scale.set(state.posterW, state.posterH, 1);
      carousel.add(mesh);
      displayMeshes.push(mesh);
    };

    const boot = async () => {
      const textures = await Promise.all(
        projects.map(async (project) => {
          try {
            return await loadTex(project.cover || project.poster);
          } catch {
            const blank = new THREE.DataTexture(new Uint8Array([244, 240, 237, 255]), 1, 1);
            blank.needsUpdate = true;
            return blank;
          }
        }),
      );
      if (disposed) return;

      state.loopW = state.step * projects.length;
      for (let c = 0; c < 3; c++) {
        projects.forEach((project, i) => {
          attachDisplay(textures[i], project, c * projects.length + i);
        });
      }
      state.x = -state.loopW;
      state.targetX = -state.loopW;

      readyRef.current = true;
      setReady(true);
    };

    void boot();

    const wrapX = () => {
      const w = state.loopW;
      if (w <= 0) return;
      while (state.targetX > 0) state.targetX -= w;
      while (state.targetX < -w * 2) state.targetX += w;
      while (state.x > 0) state.x -= w;
      while (state.x < -w * 2) state.x += w;
    };

    const layoutCarousel = () => {
      wrapX();
      carousel.position.x = state.x;
      let best = 0;
      let bestDist = Infinity;
      displayMeshes.forEach((mesh) => {
        const worldX = mesh.position.x + state.x;
        // Flat covers — no twist, no depth bend
        mesh.position.z = 0;
        mesh.rotation.y = 0;
        mesh.scale.set(state.posterW, state.posterH, 1);
        if (Math.abs(worldX) < bestDist) {
          bestDist = Math.abs(worldX);
          best = mesh.userData.projectIndex as number;
        }
      });
      onActiveChange(best);
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onResize = () => {
      makeSize();
      displayMeshes.forEach((mesh, idx) => {
        mesh.position.x = idx * state.step;
        mesh.scale.set(state.posterW, state.posterH, 1);
      });
      state.loopW = state.step * projects.length;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!readyRef.current) return;
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
      const dt = Math.max((now - state.lastT) / 1000, 0.001);
      const worldPerPx =
        (2 * Math.tan(((mainCam.fov / 2) * Math.PI) / 180) * mainCam.position.z) /
        window.innerHeight;
      const worldDx = dx * worldPerPx;
      state.targetX += worldDx;
      state.x += worldDx;
      state.vx = Math.max(-8, Math.min(8, worldDx / dt));
      state.lastX = e.clientX;
      state.lastT = now;
      if (Math.hypot(e.clientX - state.downX, e.clientY - state.downY) > 6) {
        state.moved = true;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!state.dragging) return;
      state.dragging = false;
      setGrabbing(false);
      if (!state.moved && readyRef.current) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, mainCam);
        const hits = raycaster.intersectObjects(displayMeshes, false);
        if (hits[0]) router.push(`/work/${hits[0].object.userData.slug}/`);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!readyRef.current) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const worldPerPx =
        (2 * Math.tan(((mainCam.fov / 2) * Math.PI) / 180) * mainCam.position.z) /
        window.innerHeight;
      state.vx += (-delta * worldPerPx) / 0.016;
      state.vx = Math.max(-8, Math.min(8, state.vx));
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.033);
      prev = now;

      if (!state.dragging && !reduced && readyRef.current) {
        state.targetX += state.vx * dt;
        state.vx *= Math.pow(0.0015, dt);
        if (Math.abs(state.vx) < 0.01) state.vx = 0;
      }

      const lerp = 1 - Math.pow(0.0002, dt);
      state.x += (state.targetX - state.x) * Math.min(1, lerp * 14);

      if (displayMeshes.length) layoutCarousel();
      renderer.setClearColor(0xf4f0ed, 0);
      renderer.render(mainScene, mainCam);
      raf = requestAnimationFrame(tick);
    };
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
      displayMeshes.forEach((m) => {
        (m.material as THREE.Material).dispose();
      });
      texCache.forEach((t) => t.dispose());
      planeGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [projects, router, onActiveChange]);

  return (
    <main className="home-stage">
      <Header />
      <div
        ref={mountRef}
        className={`gl-carousel${grabbing ? " is-grabbing" : ""}${ready ? " is-ready" : ""}`}
        aria-label="Project carousel"
      />
      <WorkNames project={projects[active] ?? null} visible={ready} />
    </main>
  );
}
