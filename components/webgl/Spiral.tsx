"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { simplex3d } from "@/lib/glsl";
import { useScene } from "@/lib/store";
import { totalTurn } from "@/lib/spiral";
import { projects } from "@/content/projects";

const COUNT =
  typeof window !== "undefined" && window.innerWidth < 768 ? 6000 : 14000;
const TURNS = 9;
const TAU = Math.PI * 2;

const vertex = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uPixelRatio;
uniform float uVelocity;
uniform vec2 uPointer;

/** Position along the spiral, 0 → 1. */
attribute float aT;
/** Per-point offset from the spine, so the ribbon has thickness. */
attribute vec3 aJitter;
attribute float aSize;

varying float vT;
varying float vFade;

${simplex3d}

void main() {
  float t = aT;

  // Spindle profile: wide at the waist, tapering to both poles.
  float radius = 1.25 * pow(sin(3.14159265 * t), 0.72);

  // Rotation, plus a slow travelling wave that runs the length of the coil.
  float angle = t * ${TURNS.toFixed(1)} * 6.2831853 + uTime * 0.42;
  angle += sin(t * 9.0 - uTime * 1.1) * 0.14;

  radius *= 1.0 + sin(t * 14.0 - uTime * 1.7) * 0.045;

  vec3 pos = vec3(
    cos(angle) * radius,
    (t - 0.5) * 3.15,
    sin(angle) * radius
  );

  // Organic wobble so it never reads as a perfect mathematical coil.
  float n = snoise(vec3(pos.xz * 0.7, uTime * 0.12 + t * 2.0));
  pos += aJitter * (0.055 + n * 0.05);
  pos.y += n * 0.06;

  // Scroll energy stretches the coil along its axis.
  pos.y *= 1.0 + min(abs(uVelocity) * 0.0025, 0.35);

  // Pointer tilts the whole form.
  float tx = uPointer.y * 0.35;
  float ty = uPointer.x * 0.5;
  mat3 rx = mat3(1.0, 0.0, 0.0, 0.0, cos(tx), -sin(tx), 0.0, sin(tx), cos(tx));
  mat3 ry = mat3(cos(ty), 0.0, sin(ty), 0.0, 1.0, 0.0, -sin(ty), 0.0, cos(ty));
  pos = ry * rx * pos;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (26.0 / -mv.z);

  vT = t;
  // Points at the back of the coil dim, which is what reads as depth.
  // mv.z is view space, so it sits around -camera distance, not around 0.
  vFade = uIntro * mix(0.30, 1.0, smoothstep(-12.0, -8.0, mv.z));
}
`;

const fragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vT;
varying float vFade;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float mask = smoothstep(0.5, 0.0, d);
  if (mask < 0.01) discard;

  // Colour runs along the coil, brightest at the waist.
  vec3 col = mix(uColorB, uColorA, smoothstep(0.0, 1.0, vT));
  col = mix(col, vec3(1.0), pow(sin(3.14159265 * vT), 3.0) * 0.45);

  gl_FragColor = vec4(col, mask * vFade * 0.62);
}
`;

/**
 * The hero form: a rotating spiral coil built from points.
 *
 * Drawn as a single Points draw call — 14k points with all the motion in the
 * vertex shader, so nothing is recomputed on the CPU per frame.
 */
export default function Spiral() {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const ts = new Float32Array(COUNT);
    const jitter = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);
      ts[i] = t;

      // Real positions are computed in the shader; this only needs to be a
      // stable, non-degenerate seed for frustum bounds.
      const angle = t * TURNS * TAU;
      const radius = 1.25 * Math.pow(Math.sin(Math.PI * t), 0.72);
      positions[i * 3 + 0] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (t - 0.5) * 3.15;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Gaussian-ish offset gives the ribbon a soft, dense core.
      const g1 = (Math.random() + Math.random() + Math.random() - 1.5) * 1.4;
      const g2 = (Math.random() + Math.random() + Math.random() - 1.5) * 1.4;
      const g3 = (Math.random() + Math.random() + Math.random() - 1.5) * 1.4;
      jitter[i * 3 + 0] = g1;
      jitter[i * 3 + 1] = g2;
      jitter[i * 3 + 2] = g3;

      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aT", new THREE.BufferAttribute(ts, 1));
    g.setAttribute("aJitter", new THREE.BufferAttribute(jitter, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uPixelRatio: { value: 1 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uColorA: { value: new THREE.Color("#2f6fe4") },
      uColorB: { value: new THREE.Color("#0a1733") },
    }),
    []
  );

  useFrame((state, delta) => {
    const { pointer, intro, accent, scrollVelocity, workProgress } =
      useScene.getState();
    const u = uniforms;

    u.uTime.value += delta;
    // The coil steps back tonally while the projects are on screen.
    const target = intro * (1 - workProgress * 0.2);
    u.uIntro.value += (target - u.uIntro.value) * 0.04;
    u.uVelocity.value += (scrollVelocity - u.uVelocity.value) * 0.08;
    u.uPointer.value.x += (pointer.x - u.uPointer.value.x) * 0.04;
    u.uPointer.value.y += (pointer.y - u.uPointer.value.y) * 0.04;
    u.uPixelRatio.value = Math.min(state.viewport.dpr, 2);

    (u.uColorA.value as THREE.Color).lerp(new THREE.Color(accent[0]), 0.04);
    (u.uColorB.value as THREE.Color).lerp(new THREE.Color(accent[1]), 0.04);

    if (points.current) {
      points.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.16) * 0.12;

      // Placement is responsive: offset beside the headline on wide screens,
      // centred behind it on narrow ones where there is no room to the side.
      const aspect = state.viewport.width / state.viewport.height;
      const wide = aspect > 1.15;

      // Once the project section takes over, the coil slides to the centre and
      // opens out — the cards orbit the same axis, so it reads as one object.
      // It also grows well past the cards and pushes back, so it frames them
      // instead of sitting behind the title competing with the type.
      const centring = THREE.MathUtils.smoothstep(workProgress, 0.0, 0.12);
      const targetX = (wide ? state.viewport.width * 0.26 : 0) * (1 - centring);
      const targetScale = (wide ? 1.35 : 0.95) * (1 + centring * 0.9);
      const targetZ = 0.2 - centring * 1.8;

      points.current.position.z +=
        (targetZ - points.current.position.z) * 0.06;

      points.current.position.x += (targetX - points.current.position.x) * 0.08;
      const s = points.current.scale.x;
      points.current.scale.setScalar(s + (targetScale - s) * 0.08);

      // Turn the coil in step with the projects riding it, using the same
      // shared geometry so the two layers cannot drift apart.
      const target = -workProgress * totalTurn(projects.length);
      points.current.rotation.y +=
        (target - points.current.rotation.y) * 0.09;
    }
  });

  return (
    <points
      ref={points}
      geometry={geometry}
      scale={1.2}
      position={[0, 0.15, 0.2]}
      frustumCulled={false}
    >
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
