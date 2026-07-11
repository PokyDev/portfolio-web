"use client";

import { useTheme } from "../../hooks/useTheme";
import styles from "./landing.module.css";

// Iconos del toggle de tema: se muestra el tema CONTRARIO al activo (en claro,
// la luna; en oscuro, el sol). Un solo par de SVG basta: con currentColor el
// color lo resuelven los tokens por tema desde el CSS (indigo en claro,
// lavender en oscuro), sin duplicar SVG por tema.
const ICONO_TEMA_COMUN = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconoLuna() {
  return (
    <svg {...ICONO_TEMA_COMUN}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconoSol() {
  return (
    <svg {...ICONO_TEMA_COMUN}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Botón circular flotante, fijo en la esquina inferior izquierda del viewport
// (fuera del container del aside). Sus márgenes viven en el CSS module:
// iguales en left/bottom y, en desktop, a ras con la línea inferior del aside.
export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={styles.toggleTema}
      onClick={toggleTheme}
      aria-label="Cambiar tema"
    >
      <span className={`dark:hidden ${styles.iconoTema}`}>
        <IconoLuna />
      </span>
      <span className={`hidden dark:inline ${styles.iconoTema}`}>
        <IconoSol />
      </span>
    </button>
  );
}
