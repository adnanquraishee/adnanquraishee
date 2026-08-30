"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { simplex3d, curl3d } from "@/lib/glsl";
import { useScene } from "@/lib/store";

const COUNT =
  typeof window !== "undefined" && window.innerWidth < 768 ? 1600 : 4200;

const vertex = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uScroll;
uniform float uVelocity;
uniform vec2 uPointer;
uniform float uPixelRatio;

attribute float aScale;
attribute float aSpeed;
attribute vec3 aSeed;

varying float vAlpha;
varying float vDepth;

${simplex3d}
${curl3d}

void main() {
  vec3 pos = position;

  // Fluid drift: advect each point along the curl field over time.
  float t = uTime * 0.045 * aSpeed;
  vec3 flow = curlNoise(pos * 0.16 + aSeed + vec3(0.0, 0.0, t));
  pos += flow * 1.5;

  // Parallax against scroll — far points move less.
  float depth = (pos.z + 8.0) / 16.0;
  pos.y += uScroll * (0.15 + depth * 0.5);

  // Pointer repulsion in screen-ish space.
  vec2 toPointer = pos.xy - uPointer * 6.0;
  float d = length(toPointer);
  pos.xy += normalize(toPointer + 0.0001) * smoothstep(3.2, 0.0, d) * 0.9;

  // Wrap vertically so the field never runs out.
  pos.y = mod(pos.y + 9.0, 18.0) - 9.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);

  // Scroll velocity stretches points into short streaks.
  float streak = 1.0 + min(abs(uVelocity) * 0.02, 2.5);

  gl_Position = projectionMatrix * mv;
  gl_PointSize = aScale * uPixelRatio * streak * (14.0 / -mv.z);

  vDepth = depth;
  vAlpha = uIntro * (0.25 + depth * 0.75);
}
`;

const fragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vAlpha;
varying float vDepth;

void main() {
  // Soft round sprite, no texture needed.
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float mask = smoothstep(0.5, 0.06, d);
  if (mask < 0.01) discard;

  vec3 col = mix(uColorB, uColorA, vDepth);
  gl_FragColor = vec4(col, mask * vAlpha * 0.85);
}
`;

export default function Particles() {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      scales[i] = 0.6 + Math.random() * 2.4;
      speeds[i] = 0.5 + Math.random() * 1.6;

      seeds[i * 3 + 0] = Math.random() * 10;
      seeds[i * 3 + 1] = Math.random() * 10;
      seeds[i * 3 + 2] = Math.random() * 10;
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color("#8fb4ff") },
      uColorB: { value: new THREE.Color("#1b2b4d") },
    }),
    []
  );

  useFrame((state, delta) => {
    const { pointer, intro, scrollY, scrollVelocity, accent } =
      useScene.getState();
    const u = uniforms;

    u.uTime.value += delta;
    u.uIntro.value += (intro - u.uIntro.value) * 0.04;
    u.uScroll.value = scrollY * 0.0012;
    u.uVelocity.value += (scrollVelocity - u.uVelocity.value) * 0.1;
    u.uPointer.value.x += (pointer.x - u.uPointer.value.x) * 0.04;
    u.uPointer.value.y += (pointer.y - u.uPointer.value.y) * 0.04;
    u.uPixelRatio.value = Math.min(state.viewport.dpr, 2);

    (u.uColorA.value as THREE.Color).lerp(
      new THREE.Color(accent[0]).lerp(new THREE.Color("#ffffff"), 0.45),
      0.03
    );
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
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
