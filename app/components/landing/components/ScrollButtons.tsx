"use client";

import { useScrollButtons } from "@/app/components/landing/hooks/useScrollButtons";
import styles from "../landing.module.css";

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

function IconoFlechaArriba({ tamano = 20 }: { tamano?: number }) {
  return (
    <svg {...ICONO_FLECHA_COMUN} width={tamano} height={tamano}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function IconoFlechaAbajo({ tamano = 20 }: { tamano?: number }) {
  return (
    <svg {...ICONO_FLECHA_COMUN} width={tamano} height={tamano}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

export default function ScrollButtons({
  variante = "flotante",
}: {
  variante?: "flotante" | "compacto";
}) {
  const { mostrarArriba, mostrarAbajo, irArriba, irAbajo } = useScrollButtons();

  const contenedor =
    variante === "compacto" ? styles.botonesScrollCompacto : styles.botonesScroll;
  const tamanoClase = variante === "compacto" ? styles.botonScrollCompacto : "";
  const tamanoIcono = variante === "compacto" ? 16 : 20;

  return (
    <div className={contenedor}>
      <button
        type="button"
        className={`${styles.botonScroll} ${styles.botonScrollArriba} ${tamanoClase} ${mostrarArriba ? "" : styles.botonScrollOculto
          }`}
        onClick={irArriba}
        aria-label="Subir al inicio de la página"
        aria-hidden={!mostrarArriba}
        tabIndex={mostrarArriba ? 0 : -1}
      >
        <IconoFlechaArriba tamano={tamanoIcono} />
      </button>

      <button
        type="button"
        className={`${styles.botonScroll} ${styles.botonScrollAbajo} ${tamanoClase} ${mostrarAbajo ? "" : styles.botonScrollOculto
          }`}
        onClick={irAbajo}
        aria-label="Bajar al final de la página"
        aria-hidden={!mostrarAbajo}
        tabIndex={mostrarAbajo ? 0 : -1}
      >
        <IconoFlechaAbajo tamano={tamanoIcono} />
      </button>
    </div>
  );
}