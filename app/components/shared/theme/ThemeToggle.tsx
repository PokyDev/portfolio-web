"use client";

import { useTheme } from "@/app/hooks/useTheme";
import styles from "./themeToggle.module.css";

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

function IconoLuna({ tamano = 20 }: { tamano?: number }) {
  return (
    <svg {...ICONO_TEMA_COMUN} width={tamano} height={tamano}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconoSol({ tamano = 20 }: { tamano?: number }) {
  return (
    <svg {...ICONO_TEMA_COMUN} width={tamano} height={tamano}>
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

// Tres variantes:
// - "flotante" (default): fijo en la esquina, SOLO desktop ancho (≥1600px).
// - "panel": sin posicionamiento, para el footer de la sidebar móvil (NavMovil).
// - "compacto": embebida en el container de redes sociales (Sociales.tsx),
//   tamaño reducido para convivir con los íconos de redes — visible
//   exactamente en el rango donde "flotante" no cabe (queda a cargo de
//   quien la consuma decidirlo vía @media).
export default function ThemeToggle({
  variante = "flotante",
}: {
  variante?: "flotante" | "panel" | "compacto";
}) {
  const { toggleTheme } = useTheme();
  const tamanoIcono = variante === "compacto" ? 16 : 20;

  return (
    <button
      type="button"
      className={`${styles.toggleTema} ${
        variante === "flotante" ? styles.toggleFlotante : ""
      } ${variante === "compacto" ? styles.toggleCompacto : ""}`}
      onClick={toggleTheme}
      aria-label="Cambiar tema"
    >
      <span className={`dark:hidden ${styles.iconoTema}`}>
        <IconoLuna tamano={tamanoIcono} />
      </span>
      <span className={`hidden dark:inline ${styles.iconoTema}`}>
        <IconoSol tamano={tamanoIcono} />
      </span>
    </button>
  );
}