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
const GAP = 1.38;
const RT_W = 768;
const RT_H = Math.round(RT_W / POSTER_ASPECT);

function makePolaroidTexture(
  photo: THREE.Texture,
  border = 0.06,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = photo.image as HTMLImageElement | ImageBitmap;
  const padX = canvas.width * border;
  const padTop = canvas.height * border;
  const padBot = canvas.height * (border * 2.2);
  const dw = canvas.width - padX * 2;
  const dh = canvas.height - padTop - padBot;
  // cover
  const iw = "width" in img ? Number(img.width) : 512;
  const ih = "height" in img ? Number(img.height) : 640;
  const scale = Math.max(dw / iw, dh / ih);
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  try {
    ctx.drawImage(img as CanvasImageSource, sx, sy, sw, sh, padX, padTop, dw, dh);
  } catch {
    ctx.fillStyle = "#ddd";
    ctx.fillRect(padX, padTop, dw, dh);
  }
  // soft shadow edge
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 2;
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
  ctx.font = "700 96px Inter, Helvetica, Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 24, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
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
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(256, 128, 220, 100, -0.15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = "700 72px Inter, Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeTapeTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // torn edges
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(i * 28, Math.random() > 0.5 ? 0 : 64, 6 + Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

type Piece = {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  baseRot: number;
  drift: number;
};

type CollageCard = {
  group: THREE.Group;
  pieces: Piece[];
  rt: THREE.WebGLRenderTarget;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  index: number;
  slug: string;
};

export function HomeExperience({ projects }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Main carousel scene
    const mainScene = new THREE.Scene();
    const mainCam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    mainCam.position.z = 6;
    const carousel = new THREE.Group();
    mainScene.add(carousel);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

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

    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const cards: CollageCard[] = [];
    const displayMeshes: THREE.Mesh[] = [];
    const copies = 3;

    let loaded = 0;
    // estimate: each project loads its unique gallery images (dedupe later)
    const uniqueSrcs = new Set<string>();
    projects.forEach((p) => {
      recipeFor(p).layers.forEach((l) => {
        if (l.src) uniqueSrcs.add(l.src);
      });
    });
    const total = uniqueSrcs.size || 1;
    const texCache = new Map<string, THREE.Texture>();

    const bump = () => {
      loaded += 1;
      setProgress(Math.min(1, loaded / total));
    };

    const loadTex = (src: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        if (texCache.has(src)) {
          resolve(texCache.get(src)!);
          return;
        }
        loader.load(
          asset(src),
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            texCache.set(src, t);
            bump();
            resolve(t);
          },
          undefined,
          () => {
            bump();
            reject(new Error(src));
          },
        );
      });

    const addLayerMesh = (
      layer: CollageLayer,
      tex: THREE.Texture | null,
      transparent = true,
    ) => {
      const mat = new THREE.MeshBasicMaterial({
        map: tex ?? undefined,
        color: tex ? 0xffffff : new THREE.Color(layer.color || "#ffffff"),
        transparent,
        opacity: layer.kind === "tape" ? 0.75 : 1,
        depthWrite: layer.kind !== "tape",
      });
      const mesh = new THREE.Mesh(planeGeo, mat);
      // poster local space: x right, y up, origin center — convert from top-left 0..1
      const cx = layer.x + layer.w / 2 - 0.5;
      const cy = -(layer.y + layer.h / 2 - 0.5);
      mesh.position.set(cx, cy, layer.z ?? 0);
      mesh.scale.set(layer.w, layer.h, 1);
      mesh.rotation.z = layer.rot ?? 0;
      return mesh;
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
        if (layer.kind === "bg") {
          mesh = addLayerMesh(layer, null, false);
        } else if (layer.kind === "shape") {
          mesh = addLayerMesh(layer, null, false);
        } else if (layer.kind === "polaroid" && layer.src) {
          try {
            const photo = await loadTex(layer.src);
            const polaroid = makePolaroidTexture(photo);
            mesh = addLayerMesh(layer, polaroid, true);
          } catch {
            mesh = addLayerMesh(layer, null, false);
          }
        } else if (layer.kind === "label" && layer.text) {
          const tex = makeLabelTexture(layer.text, layer.color || "#252422");
          mesh = addLayerMesh({ ...layer, w: layer.w, h: layer.h * 0.7 }, tex, true);
        } else if (layer.kind === "stamp" && layer.text) {
          const tex = makeStampTexture(layer.text, layer.color || "#ff6b8a");
          mesh = addLayerMesh(layer, tex, true);
        } else if (layer.kind === "tape") {
          const tex = makeTapeTexture(layer.color || "rgba(255,240,200,0.6)");
          mesh = addLayerMesh(layer, tex, true);
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

      return {
        group,
        pieces,
        rt,
        camera,
        scene,
        index,
        slug: project.slug,
      } satisfies CollageCard;
    };

    const boot = async () => {
      const collages: CollageCard[] = [];
      for (let i = 0; i < projects.length; i++) {
        const card = await buildCollage(projects[i], i);
        if (disposed) return;
        collages.push(card);
        cards.push(card);
        setProgress((i + 1) / projects.length);
      }

      // Display meshes (triple loop for infinite carousel)
      for (let c = 0; c < copies; c++) {
        collages.forEach((card, i) => {
          const mat = new THREE.MeshBasicMaterial({
            map: card.rt.texture,
            transparent: true,
          });
          const mesh = new THREE.Mesh(planeGeo, mat);
          mesh.userData.slug = card.slug;
          mesh.userData.projectIndex = i;
          mesh.position.x = (c * projects.length + i) * state.step;
          carousel.add(mesh);
          displayMeshes.push(mesh);
        });
      }
      state.x = -state.loopW;
      state.loopW = state.step * projects.length;

      readyRef.current = true;
      setReady(true);
      setProgress(1);
    };

    void boot();

    const renderCollages = (vx: number) => {
      cards.forEach((card) => {
        // parallax drift per cutout — collage pieces move independently
        card.pieces.forEach((p) => {
          const driftX = vx * 0.012 * p.drift;
          const driftY = Math.sin(performance.now() * 0.001 + p.drift) * 0.002 * p.drift;
          p.mesh.position.x = p.basePos.x + driftX;
          p.mesh.position.y = p.basePos.y + driftY;
          p.mesh.rotation.z = p.baseRot + vx * 0.004 * p.drift;
        });
        renderer.setRenderTarget(card.rt);
        renderer.clear();
        renderer.render(card.scene, card.camera);
      });
      renderer.setRenderTarget(null);
    };

    const layoutCarousel = () => {
      const w = state.loopW;
      if (w > 0) {
        while (state.x > 0) state.x -= w;
        while (state.x < -w * 2) state.x += w;
      }
      carousel.position.x = state.x;

      let best = 0;
      let bestDist = Infinity;
      displayMeshes.forEach((mesh) => {
        const worldX = mesh.position.x + state.x;
        const d = worldX / (state.step || 1);
        // gentle z arc only — collage itself holds the visual interest
        mesh.position.z = -Math.abs(d) * 0.55;
        mesh.rotation.y = -d * 0.18;
        const scale = 1 - Math.min(Math.abs(d) * 0.045, 0.1);
        mesh.scale.set(state.posterW * scale, state.posterH * scale, 1);
        const dist = Math.abs(worldX);
        if (dist < bestDist) {
          bestDist = dist;
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
      const dt = Math.max(now - state.lastT, 1);
      const worldPerPx =
        (2 * Math.tan(((mainCam.fov / 2) * Math.PI) / 180) * mainCam.position.z) /
        window.innerHeight;
      state.x += dx * worldPerPx;
      state.vx = (dx / dt) * 18;
      state.lastX = e.clientX;
      state.lastT = now;
      if (Math.hypot(e.clientX - state.downX, e.clientY - state.downY) > 8) {
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
        if (hits[0]) {
          router.push(`/work/${hits[0].object.userData.slug}/`);
        }
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
      state.vx += -delta * worldPerPx * 0.4;
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    let raf = 0;
    const tick = () => {
      if (!state.dragging && !reduced && readyRef.current) {
        state.x += state.vx * 0.016;
        state.vx *= 0.935;
        if (Math.abs(state.vx) < 0.0004) state.vx = 0;
      }
      if (cards.length) {
        renderCollages(state.vx);
        layoutCarousel();
      }
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

  const loaderPoster =
    projects.find((p) => p.slug === "baat-baaki")?.poster ||
    projects[0]?.poster ||
    "/media/poster-a.png";

  return (
    <main className="home-stage">
      <Header />
      <div
        ref={mountRef}
        className={`gl-carousel${grabbing ? " is-grabbing" : ""}`}
        aria-label="Collage project carousel"
      />
      <WorkNames project={projects[active] ?? null} visible={ready} />
      <LoaderScreen poster={loaderPoster} progress={progress} done={ready} />
    </main>
  );
}
