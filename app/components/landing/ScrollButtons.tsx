"use client";

import { useScrollButtons } from "../../hooks/useScrollButtons";
import styles from "./landing.module.css";

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

// Dos variantes, misma lógica (useScrollButtons) y mismo diseño base:
// - "flotante" (default): fijo en la esquina, SOLO ≥1600px (ver .botonesScroll).
// - "compacto": embebido inline en Sociales, tamaño reducido, visible
//   exactamente en el rango contrario (< 1600px, ver .botonesScrollCompacto)
//   — así nunca se solapa con la variante flotante.
export default function ScrollButtons({
  variante = "flotante",
}: {
  variante?: "flotante" | "compacto";
}) {
  const { mostrarArriba, mostrarAbajo, irArriba, irAbajo } = useScrollButtons();

  const contenedor =
    variante === "compacto" ? styles.botonesScrollCompacto : styles.botonesScroll;
  const tamano = variante === "compacto" ? styles.botonScrollCompacto : "";

  return (
    <div className={contenedor}>
      <button
        type="button"
        className={`${styles.botonScroll} ${tamano} ${
          mostrarArriba ? "" : styles.botonScrollOculto
        }`}
        onClick={irArriba}
        aria-label="Subir al inicio de la página"
        aria-hidden={!mostrarArriba}
        tabIndex={mostrarArriba ? 0 : -1}
      >
        <IconoFlechaArriba />
      </button>
      <button
        type="button"
        className={`${styles.botonScroll} ${tamano} ${
          mostrarAbajo ? "" : styles.botonScrollOculto
        }`}
        onClick={irAbajo}
        aria-label="Bajar al final de la página"
        aria-hidden={!mostrarAbajo}
        tabIndex={mostrarAbajo ? 0 : -1}
      >
        <IconoFlechaAbajo />
      </button>
    </div>
  );
}