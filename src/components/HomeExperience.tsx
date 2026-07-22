"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { asset, type Project } from "@/lib/content";
import { LoaderScreen } from "@/components/LoaderScreen";
import { WorkNames } from "@/components/WorkNames";
import { Header } from "@/components/Header";

type Props = {
  projects: Project[];
};

const POSTER_H = 0.63;
const POSTER_ASPECT = 440 / 593;
const GAP = 1.35;

const VERT = /* glsl */ `
precision highp float;
uniform float uVelocityAbs;
uniform float uIndex;
uniform float uTime;
uniform float uBump;
varying vec2 vUv;

float cmap(float v, float i0, float i1, float o0, float o1) {
  return o0 + (o1 - o0) * clamp((v - i0) / (i1 - i0), 0.0, 1.0);
}
float parabola(float x) {
  return 4.0 * x * (1.0 - x);
}

void main() {
  vUv = uv;
  vec4 clipPosition = modelViewMatrix * vec4(position, 1.0);
  vec3 ndc = clipPosition.xyz / clipPosition.w;

  vec3 newPos = position;
  newPos.z += parabola(cmap(ndc.x, -1.0, 1.0, 0.0, 1.0)) * 0.4 * uBump;
  newPos.z += max(abs(uVelocityAbs) * -0.7, -0.1) * uBump;
  newPos.z -= sin(uv.y * 10.0 + uIndex + uTime * 0.4) * 0.012 * uBump;
  newPos.y -= cos(uv.x * 10.0 + uIndex + 100.0) * 0.004 * uBump;
  newPos.z -= cos(uv.x * 0.4 + uv.y * 3.14159 * 2.0 + uIndex * 0.05) * 0.04 * uBump;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform sampler2D uNormal;
uniform float uIndex;
uniform float uAlpha;
varying vec2 vUv;

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
  vec3 res = 1.0 - (1.0 - base) * (1.0 - blend);
  return mix(base, res, opacity);
}
float cmap(float v, float i0, float i1, float o0, float o1) {
  return o0 + (o1 - o0) * clamp((v - i0) / (i1 - i0), 0.0, 1.0);
}

void main() {
  float a = uIndex * 1.5707963;
  vec2 c = vUv - 0.5;
  vec2 nUV = vec2(c.x * cos(a) - c.y * sin(a), c.x * sin(a) + c.y * cos(a)) + 0.5;
  vec3 normalTexel = texture2D(uNormal, nUV).rgb;

  vec2 warped = vUv - normalTexel.g * 0.01;
  vec4 texel = texture2D(uMap, warped);
  texel.rgb = blendScreen(texel.rgb, normalTexel.rgb, 0.22);
  texel.rgb -= cmap(normalTexel.g, 0.0, 0.1, 0.05, 0.0);

  gl_FragColor = vec4(texel.rgb, texel.a * uAlpha);
}
`;

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
    if (!mount || projects.length === 0) return;

    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      mat: THREE.ShaderMaterial;
      index: number;
    };
    const cards: Card[] = [];
    const n = projects.length;
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
      bump: 0,
      targetBump: 0,
    };

    const makeSize = () => {
      const h = window.innerHeight * POSTER_H;
      const vFov = (camera.fov * Math.PI) / 180;
      const worldH = 2 * Math.tan(vFov / 2) * camera.position.z;
      state.posterH = (h / window.innerHeight) * worldH;
      state.posterW = state.posterH * POSTER_ASPECT;
      state.step = state.posterW * GAP;
      state.loopW = state.step * n;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    makeSize();

    const geo = new THREE.PlaneGeometry(1, 1, 48, 48);
    let normalTex: THREE.Texture | null = null;
    let loadedCount = 0;
    const total = projects.length + 1;

    const bumpProgress = () => {
      loadedCount += 1;
      setProgress(loadedCount / total);
      if (loadedCount >= total) {
        window.setTimeout(() => {
          if (disposed) return;
          readyRef.current = true;
          state.targetBump = 1;
          setReady(true);
        }, 320);
      }
    };

    loader.load(
      asset("/textures/paper-normals.jpg"),
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.NoColorSpace;
        normalTex = tex;
        cards.forEach((c) => {
          c.mat.uniforms.uNormal.value = tex;
        });
        bumpProgress();
      },
      undefined,
      () => bumpProgress(),
    );

    for (let c = 0; c < copies; c++) {
      projects.forEach((project, i) => {
        const mat = new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          uniforms: {
            uMap: { value: null },
            uNormal: { value: normalTex },
            uVelocityAbs: { value: 0 },
            uIndex: { value: i },
            uTime: { value: 0 },
            uBump: { value: 0 },
            uAlpha: { value: 0 },
          },
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData.slug = project.slug;
        mesh.userData.projectIndex = i;
        mesh.position.x = (c * n + i) * state.step;
        group.add(mesh);
        cards.push({ mesh, mat, index: i });

        const countLoad = c === 0;
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
            cards.forEach((card) => {
              if (card.index === i) {
                card.mat.uniforms.uMap.value = tex;
                card.mat.uniforms.uAlpha.value = 1;
              }
            });
            if (countLoad) bumpProgress();
          },
          undefined,
          () => {
            if (countLoad) bumpProgress();
          },
        );
      });
    }

    state.x = -state.loopW;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const layout = (time: number) => {
      const w = state.loopW;
      if (w > 0) {
        while (state.x > 0) state.x -= w;
        while (state.x < -w * 2) state.x += w;
      }
      group.position.x = state.x;
      state.bump += (state.targetBump - state.bump) * 0.08;

      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card) => {
        const mesh = card.mesh;
        const worldX = mesh.position.x + state.x;
        const d = worldX / (state.step || 1);
        const z = -Math.abs(d) * 0.85;
        const rotY = -d * 0.28;
        const scale = 1 - Math.min(Math.abs(d) * 0.05, 0.1);
        mesh.position.z = z;
        mesh.rotation.y = rotY;
        mesh.scale.set(state.posterW * scale, state.posterH * scale, 1);

        card.mat.uniforms.uVelocityAbs.value = state.vx;
        card.mat.uniforms.uTime.value = time * 0.001;
        card.mat.uniforms.uBump.value = state.bump;

        const dist = Math.abs(worldX);
        if (dist < bestDist) {
          bestDist = dist;
          best = card.index;
        }
      });
      onActiveChange(best);
    };

    const onResize = () => {
      makeSize();
      cards.forEach((card, idx) => {
        card.mesh.position.x = idx * state.step;
      });
      state.loopW = state.step * n;
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
        (2 * Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z) /
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
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(
          cards.map((c) => c.mesh),
          false,
        );
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
        (2 * Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z) /
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
    const tick = (t: number) => {
      if (!state.dragging && !reduced && readyRef.current) {
        state.x += state.vx * 0.016;
        state.vx *= 0.935;
        if (Math.abs(state.vx) < 0.0004) state.vx = 0;
      }
      layout(t);
      renderer.render(scene, camera);
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
      cards.forEach((c) => {
        const map = c.mat.uniforms.uMap.value as THREE.Texture | null;
        map?.dispose();
        c.mat.dispose();
      });
      normalTex?.dispose();
      geo.dispose();
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
        aria-label="Project carousel"
      />
      <WorkNames project={projects[active] ?? null} visible={ready} />
      <LoaderScreen poster={loaderPoster} progress={progress} done={ready} />
    </main>
  );
}
