"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { asset, type Project } from "@/lib/content";
import { recipeFor, type CollageLayer } from "@/lib/collage";
import { LoaderScreen } from "@/components/LoaderScreen";
import { WorkNames } from "@/components/WorkNames";
import { Header } from "@/components/Header";

type Props = { projects: Project[] };

const POSTER_H = 0.63;
const POSTER_ASPECT = 440 / 593;
const GAP = 1.32;
const RT_W = 640;
const RT_H = Math.round(RT_W / POSTER_ASPECT);

function makePolaroidTexture(photo: THREE.Texture): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = photo.image as CanvasImageSource & { width?: number; height?: number };
  const padX = 28;
  const padTop = 28;
  const padBot = 64;
  const dw = canvas.width - padX * 2;
  const dh = canvas.height - padTop - padBot;
  const iw = Number(img.width) || 512;
  const ih = Number(img.height) || 640;
  const scale = Math.max(dw / iw, dh / ih);
  const sw = dw / scale;
  const sh = dh / scale;
  try {
    ctx.drawImage(
      img,
      (iw - sw) / 2,
      (ih - sh) / 2,
      sw,
      sh,
      padX,
      padTop,
      dw,
      dh,
    );
  } catch {
    ctx.fillStyle = "#ddd";
    ctx.fillRect(padX, padTop, dw, dh);
  }
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeLabelTexture(text: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = "700 92px Inter, Helvetica, Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 20, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeStampTexture(text: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(256, 128, 210, 95, -0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = "700 68px Inter, Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeTapeTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 64);
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.arc(i * 30, Math.random() > 0.5 ? 0 : 64, 5 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

type Piece = {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  baseRot: number;
  drift: number;
};

type CollageCard = {
  pieces: Piece[];
  rt: THREE.WebGLRenderTarget;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  index: number;
  slug: string;
  dirty: boolean;
};

export function HomeExperience({ projects }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0.04);
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
    const cards: CollageCard[] = [];
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
      lastCollageRender: 0,
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
            texCache.set(src, t);
            resolve(t);
          },
          undefined,
          () => reject(new Error(src)),
        );
      });

    const addLayer = (layer: CollageLayer, tex: THREE.Texture | null) => {
      const mat = new THREE.MeshBasicMaterial({
        map: tex ?? undefined,
        color: tex ? 0xffffff : new THREE.Color(layer.color || "#fff"),
        transparent: true,
        opacity: layer.kind === "tape" ? 0.7 : 1,
        depthWrite: layer.kind !== "tape" && layer.kind !== "label",
      });
      const mesh = new THREE.Mesh(planeGeo, mat);
      const cx = layer.x + layer.w / 2 - 0.5;
      const cy = -(layer.y + layer.h / 2 - 0.5);
      mesh.position.set(cx, cy, layer.z ?? 0);
      mesh.scale.set(layer.w, layer.h * (layer.kind === "label" ? 0.65 : 1), 1);
      mesh.rotation.z = layer.rot ?? 0;
      return mesh;
    };

    const bakeCard = (card: CollageCard, vx = 0) => {
      card.pieces.forEach((p) => {
        const driftX = vx * 0.01 * p.drift;
        const driftY =
          Math.sin(performance.now() * 0.0008 + p.drift * 3) * 0.0015 * p.drift;
        p.mesh.position.x = p.basePos.x + driftX;
        p.mesh.position.y = p.basePos.y + driftY;
        p.mesh.rotation.z = p.baseRot + vx * 0.003 * p.drift;
      });
      renderer.setRenderTarget(card.rt);
      renderer.setClearColor(new THREE.Color("#f4f0ed"), 1);
      renderer.clear();
      renderer.render(card.scene, card.camera);
      renderer.setRenderTarget(null);
      card.dirty = false;
    };

    const buildCollage = async (project: Project, index: number) => {
      const recipe = recipeFor(project);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(recipe.bg);
      const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
      camera.position.z = 2;
      const group = new THREE.Group();
      scene.add(group);
      const pieces: Piece[] = [];

      for (const layer of recipe.layers) {
        let mesh: THREE.Mesh | null = null;
        if (layer.kind === "bg" || layer.kind === "shape") {
          mesh = addLayer(layer, null);
        } else if (layer.kind === "polaroid" && layer.src) {
          try {
            const photo = await loadTex(layer.src);
            mesh = addLayer(layer, makePolaroidTexture(photo));
          } catch {
            mesh = addLayer(layer, null);
          }
        } else if (layer.kind === "label" && layer.text) {
          mesh = addLayer(layer, makeLabelTexture(layer.text, layer.color || "#252422"));
        } else if (layer.kind === "stamp" && layer.text) {
          mesh = addLayer(layer, makeStampTexture(layer.text, layer.color || "#ff6b8a"));
        } else if (layer.kind === "tape") {
          mesh = addLayer(layer, makeTapeTexture(layer.color || "rgba(255,240,200,0.55)"));
        }
        if (!mesh) continue;
        group.add(mesh);
        pieces.push({
          mesh,
          basePos: mesh.position.clone(),
          baseRot: mesh.rotation.z,
          drift: layer.drift ?? 0.4,
        });
      }

      const rt = new THREE.WebGLRenderTarget(RT_W, RT_H, {
        colorSpace: THREE.SRGBColorSpace,
      });
      const card: CollageCard = {
        pieces,
        rt,
        camera,
        scene,
        index,
        slug: project.slug,
        dirty: true,
      };
      return card;
    };

    const attachDisplay = (card: CollageCard, slot: number) => {
      const mat = new THREE.MeshBasicMaterial({
        map: card.rt.texture,
        transparent: true,
      });
      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.userData.slug = card.slug;
      mesh.userData.projectIndex = card.index;
      mesh.position.x = slot * state.step;
      mesh.scale.set(state.posterW, state.posterH, 1);
      carousel.add(mesh);
      displayMeshes.push(mesh);
    };

    const boot = async () => {
      // Progressive: first collage ASAP so loader sits on real WebGL poster
      const first = await buildCollage(projects[0], 0);
      if (disposed) return;
      cards.push(first);
      bakeCard(first, 0);
      // 3 copies of first while others load — keep center filled
      for (let c = 0; c < 3; c++) attachDisplay(first, c);
      state.loopW = state.step; // temporary until all loaded
      state.x = 0;
      state.targetX = 0;
      setProgress(0.2);

      for (let i = 1; i < projects.length; i++) {
        const card = await buildCollage(projects[i], i);
        if (disposed) return;
        cards.push(card);
        bakeCard(card, 0);
        setProgress(0.2 + (0.75 * (i + 1)) / projects.length);
      }

      // rebuild carousel with full set × 3
      displayMeshes.splice(0).forEach((m) => {
        carousel.remove(m);
        (m.material as THREE.Material).dispose();
      });
      state.loopW = state.step * projects.length;
      for (let c = 0; c < 3; c++) {
        cards.forEach((card, i) => attachDisplay(card, c * projects.length + i));
      }
      state.x = -state.loopW;
      state.targetX = -state.loopW;

      setProgress(1);
      window.setTimeout(() => {
        if (disposed) return;
        readyRef.current = true;
        setReady(true);
      }, 420);
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
        const d = worldX / (state.step || 1);
        const abs = Math.abs(d);
        mesh.position.z = -abs * 0.45;
        mesh.rotation.y = -d * 0.14;
        const scale = 1 - Math.min(abs * 0.04, 0.09);
        mesh.scale.set(state.posterW * scale, state.posterH * scale, 1);
        if (Math.abs(worldX) < bestDist) {
          bestDist = Math.abs(worldX);
          best = mesh.userData.projectIndex as number;
        }
      });
      onActiveChange(best);
    };

    const maybeParallax = (now: number) => {
      if (!readyRef.current || !cards.length) return;
      const moving = Math.abs(state.vx) > 0.002 || state.dragging;
      if (!moving) return;
      if (now - state.lastCollageRender < 32) return; // ~30fps collage updates
      state.lastCollageRender = now;
      const idx = activeRef.current;
      // only re-bake nearby collages for smoothness
      [idx - 1, idx, idx + 1].forEach((i) => {
        const card = cards[(i + cards.length) % cards.length];
        if (card) bakeCard(card, state.vx);
      });
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onResize = () => {
      makeSize();
      displayMeshes.forEach((mesh, idx) => {
        mesh.position.x = idx * state.step;
      });
      state.loopW = state.step * Math.max(cards.length, 1);
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
      state.vx = worldDx / dt;
      // clamp velocity for smoothness
      state.vx = Math.max(-8, Math.min(8, state.vx));
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
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
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
        state.vx *= Math.pow(0.0015, dt); // frame-rate independent damping
        if (Math.abs(state.vx) < 0.01) state.vx = 0;
      }

      // smooth follow
      const lerp = 1 - Math.pow(0.0002, dt);
      state.x += (state.targetX - state.x) * Math.min(1, lerp * 14);

      if (displayMeshes.length) {
        maybeParallax(now);
        layoutCarousel();
      }
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
      cards.forEach((c) => c.rt.dispose());
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
        aria-label="Collage project carousel"
      />
      <WorkNames project={projects[active] ?? null} visible={ready} />
      <LoaderScreen progress={progress} done={ready} />
    </main>
  );
}
