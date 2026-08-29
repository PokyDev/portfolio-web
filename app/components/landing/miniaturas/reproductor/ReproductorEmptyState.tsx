"use client";

import styles from "./reproductor.module.css";

function IconoFlechaAtras() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function IconoPlayChico() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function IconoLoop() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function IconoFullscreen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function IconoBotePintura() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 11l-8-8-8.5 8.5a2 2 0 0 0 0 2.83l5.67 5.67a2 2 0 0 0 2.83 0L19 11Z" />
      <path d="M5 2l5 5" />
      <path d="M2 22c1.5-2 3.5-2 5 0s3.5 2 5 0" />
    </svg>
  );
}

// Claqueta — único ícono nuevo de esta entrega, distinto del glifo "</>"
// que ya se usa para el empty-state de imagen estática (miniaturaVacia en
// landing.module.css), para no mezclar semánticas ("sin captura" vs.
// "video en preparación").
function IconoClaqueta() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5 20 5l.8 3.9L4 12.4Z" />
      <path d="M4 12h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="m6.5 8 2-3.6M11.5 7l2-3.6M16.5 6l2-3.6" />
    </svg>
  );
}

// Fallback provisional del reproductor genérico: se muestra cuando el
// proyecto todavía no tiene .json de Lottie asociado (Reproductor.tsx
// delega acá si `src` viene undefined). Mantiene el mismo cromo del
// reproductor real (barra superior con botón de volver funcional, barra
// inferior con los mismos controles) para que la transición FLIP entre
// miniatura y reproductor se sienta igual en todos los proyectos, aunque
// acá los controles estén deshabilitados por no haber nada que reproducir.
export default function ReproductorEmptyState({
  onCerrar,
}: {
  onCerrar: (evento: React.SyntheticEvent) => void;
}) {
  return (
    <div className={styles.reproductor}>
      <div className={styles.barraSuperior}>
        <button
          type="button"
          className={styles.botonAtras}
          aria-label="Cerrar reproductor"
          onClick={onCerrar}
        >
          <IconoFlechaAtras />
        </button>
      </div>

      <div className={styles.zonaCentral}>
        <div className={styles.emptyStateContenido}>
          <span className={styles.emptyStateIcono}>
            <IconoClaqueta />
          </span>
          <span className={styles.emptyStateMensaje}>Animación en camino</span>
        </div>
      </div>

      <div className={styles.barraInferior}>
        <button type="button" className={styles.botonControl} aria-label="Reproducir" disabled>
          <IconoPlayChico />
        </button>

        <span className={styles.tiempo}>0:00</span>

        <div
          className={`${styles.progresoTrack} ${styles.progresoTrackDeshabilitada}`}
          role="slider"
          aria-label="Progreso de reproducción"
          aria-disabled="true"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        >
          <div className={styles.progresoRelleno} style={{ width: "0%" }} />
          <span className={styles.progresoThumb} style={{ left: "0%" }} />
        </div>

        <span className={styles.tiempo}>0:00</span>

        <button type="button" className={styles.botonVelocidad} aria-label="Velocidad de reproducción" disabled>
          1x
        </button>
        <button type="button" className={styles.botonControl} aria-label="Activar loop" disabled>
          <IconoLoop />
        </button>
        <button type="button" className={styles.botonControl} aria-label="Pantalla completa" disabled>
          <IconoFullscreen />
        </button>
        <button type="button" className={styles.botonControl} aria-label="Cambiar acento de color" disabled>
          <IconoBotePintura />
        </button>
      </div>
    </div>
  );
}