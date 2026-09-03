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

// Claqueta rediseñada como dos piezas reales: cuerpo (caja + hueco +
// triángulo play) fijo, y tapa (barra con 4 muescas) como pieza aparte
// que rota sobre su bisagra real: la esquina superior-izquierda de la
// caja (12,40) en el viewBox 0-100. La tapa está dibujada en su
// posición CERRADA (alineada con el borde de la caja) — el estado de
// reposo "abierta" lo aplica el rotate(-25deg) inicial del keyframe en
// .claquetaTapa, no la geometría del path.
function IconoClaqueta() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      {/* Cuerpo: marco de la caja (evenodd deja el hueco central
          transparente, se ve el fondo detrás) + triángulo de play sólido. */}
      <path
        fillRule="evenodd"
        d="M18,40 H82 A6,6 0 0 1 88,46 V82 A6,6 0 0 1 82,88 H18 A6,6 0 0 1 12,82 V46 A6,6 0 0 1 18,40 Z
           M22,47 H78 A3,3 0 0 1 81,50 V78 A3,3 0 0 1 78,81 H22 A3,3 0 0 1 19,78 V50 A3,3 0 0 1 22,47 Z"
      />
      <path d="M44,54 L44,76 L66,65 Z" />

      {/* Tapa: gira sobre la bisagra (12,40), definida en .claquetaTapa */}
      <g className={styles.claquetaTapa}>
        <path
          fillRule="evenodd"
          d="M15,28 H85 A3,3 0 0 1 88,31 V37 A3,3 0 0 1 85,40 H15 A3,3 0 0 1 12,37 V31 A3,3 0 0 1 15,28 Z
             M21.5,40 L26.5,40 L31.5,28 L26.5,28 Z
             M37.5,40 L42.5,40 L47.5,28 L42.5,28 Z
             M53.5,40 L58.5,40 L63.5,28 L58.5,28 Z
             M69.5,40 L74.5,40 L79.5,28 L74.5,28 Z"
        />
      </g>
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
      </div>
    </div>
  );
}