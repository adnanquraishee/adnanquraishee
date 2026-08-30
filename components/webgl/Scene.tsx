"use client";

import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import Spiral from "./Spiral";
import Particles from "./Particles";
import { useScene } from "@/lib/store";

/**
 * Fixed full-viewport WebGL layer sitting behind the DOM.
 *
 * The DOM keeps every piece of text and every link — this draws the spiral
 * coil and the ambient field beneath them. If WebGL is unavailable the layer
 * simply never mounts and the page keeps its CSS surfaces.
 */
export default function Scene({ withHero = false }: { withHero?: boolean }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Post-processing is the expensive part of this scene. Phones get the
    // geometry and the shaders, but not the full composer chain.
    setLowPower(
      window.innerWidth < 768 ||
        (navigator.hardwareConcurrency ?? 8) <= 4
    );

    // Probe for a usable WebGL context before mounting the canvas.
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setOk(Boolean(gl));
    } catch {
      setOk(false);
    }
  }, []);

  useEffect(() => {
    if (ok) document.documentElement.classList.add("webgl");
    return () => document.documentElement.classList.remove("webgl");
  }, [ok]);

  if (!ok) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={lowPower ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 45, position: [0, 0, 10], near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#050505"), 0);
        }}
      >
        <Suspense fallback={null}>
          <Particles />
          {withHero ? <Spiral /> : null}

          {!reduced && !lowPower ? (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.32}
                luminanceThreshold={0.52}
                luminanceSmoothing={0.5}
                mipmapBlur
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={new THREE.Vector2(0.0006, 0.0008)}
                radialModulation={false}
                modulationOffset={0}
              />
              <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
              <Vignette eskil={false} offset={0.22} darkness={0.75} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
