"use client";

import { useEffect, useRef } from "react";
import styles from "./spotlight.module.css";

// Efecto Spotlight + Follow (specs/Design/frontend_development.md §5): halo
// radial que sigue al cursor. En oscuro ilumina (screen); en claro tiñe
// (multiply). Los colores/opacidad/tamaño vienen de los tokens --spotlight-*.
const LERP = 0.15; // factor de interpolación por frame: latencia suave sin transition
const EPSILON = 0.5; // px — por debajo de esto el halo ya "llegó" y el loop se detiene

export default function Spotlight() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    // Mismos criterios que el CSS: sin puntero fino o con reduced-motion no
    // hay efecto, así que tampoco se paga el costo de listeners/rAF.
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // El destino lo fija el puntero; la posición actual lo persigue con lerp.
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let rafId: number | null = null;

    const render = () => {
      x += (targetX - x) * LERP;
      y += (targetY - y) * LERP;
      layer.style.setProperty("--x", `${x}px`);
      layer.style.setProperty("--y", `${y}px`);

      if (Math.abs(targetX - x) > EPSILON || Math.abs(targetY - y) > EPSILON) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      layer.classList.add(styles.active);
      if (rafId === null) {
        rafId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={layerRef} className={styles.spotlight} aria-hidden="true" />;
}
