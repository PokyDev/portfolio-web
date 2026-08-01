"use client";

import { useScrollPosition } from "../../hooks/useScrollPosition";
import styles from "./landing.module.css";

// Mismo criterio que ICONO_TEMA_COMUN en ThemeToggle: currentColor deja el
// color en manos de los tokens del CSS (invertidos por tema, ver .botonScroll).
const ICONO_FLECHA_COMUN = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconoFlechaArriba() {
  return (
    <svg {...ICONO_FLECHA_COMUN}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function IconoFlechaAbajo() {
  return (
    <svg {...ICONO_FLECHA_COMUN}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

// Botón circular fijo (solo desktop, ver .botonesScroll) que alterna entre
// "subir al inicio" y "bajar al final" según la posición de scroll — y no
// muestra ninguno en el medio de la página, donde ninguna de las dos
// acciones es la obviamente útil. Ambos botones quedan siempre montados y
// apilados en el mismo lugar (grid-area 1/1, como .cerrarPanel): el cambio
// es de opacidad + transform, nunca un mount/unmount, para que la
// aparición/desaparición sea un desplazamiento suave y no un salto.
export default function ScrollButtons() {
  const { posicion } = useScrollPosition();

  const irArriba = () => {
    const comportamiento = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior: comportamiento });
  };

  const irAbajo = () => {
    const comportamiento = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: comportamiento,
    });
  };

  return (
    <div className={styles.botonesScroll}>
      <button
        type="button"
        className={`${styles.botonScroll} ${
          posicion === "abajo" ? "" : styles.botonScrollOculto
        }`}
        onClick={irArriba}
        aria-label="Subir al inicio de la página"
        aria-hidden={posicion !== "abajo"}
        tabIndex={posicion === "abajo" ? 0 : -1}
      >
        <IconoFlechaArriba />
      </button>
      <button
        type="button"
        className={`${styles.botonScroll} ${
          posicion === "arriba" ? "" : styles.botonScrollOculto
        }`}
        onClick={irAbajo}
        aria-label="Bajar al final de la página"
        aria-hidden={posicion !== "arriba"}
        tabIndex={posicion === "arriba" ? 0 : -1}
      >
        <IconoFlechaAbajo />
      </button>
    </div>
  );
}
