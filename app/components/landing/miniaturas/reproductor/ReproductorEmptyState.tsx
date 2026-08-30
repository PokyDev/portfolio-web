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

// Versión sólida (fill), no outline — coherente con el estilo "flat
// vector" de los íconos de repo. La tapa queda como 4 bloques rellenos
// con gaps entre ellos (simulan los segmentos blanco/negro de una
// claqueta real) agrupados en .claquetaTapa, que sigue siendo la parte
// que rota. El cuerpo es un <rect> con esquinas redondas + el play como
// triángulo sólido, igual que el resto de los controles del reproductor.
function IconoClaqueta() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="10.5" width="18" height="9.8" rx="2.2" />
      <g className={styles.claquetaTapa}>
        <path d="M2.4 8.9 8.1 7.5l2.9 3.7-5.7 1.4a1 1 0 0 1-1.2-.73l-.5-1.94a1 1 0 0 1 .73-1.21Z" />
        <path d="m9.9 7.2 5.7-1.4 2.9 3.7-5.7 1.4Z" />
        <path d="m17.4 5.4 3.9-.96a1 1 0 0 1 1.21.73l.5 1.94a1 1 0 0 1-.73 1.21l-2.97.74Z" />
      </g>
      <path
        d="M10.2 13v4.8a.6.6 0 0 0 .93.5l3.9-2.4a.6.6 0 0 0 0-1l-3.9-2.4a.6.6 0 0 0-.93.5Z"
        fill="var(--color-bg-elevated)"
      />
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

          <div className={styles.emptyStatePuntos} aria-hidden="true">
            <span className={`${styles.punto} ${styles.punto1}`} />
            <span className={`${styles.punto} ${styles.punto2}`} />
            <span className={`${styles.punto} ${styles.punto3}`} />
            <span className={`${styles.punto} ${styles.punto4}`} />
            <span className={`${styles.punto} ${styles.punto5}`} />
          </div>

          <div className={styles.emptyStateTexto}>
            <span className={styles.emptyStateEyebrow}>En producción</span>
            <span className={styles.emptyStateMensaje}>Animación sin diseñar</span>
          </div>
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