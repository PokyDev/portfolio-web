"use client";

import styles from "./deployMonitorReproductor.module.css";

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

// Placeholder visual del reproductor (Fase 3 / microfase 1): estructura de
// 3 zonas y controles estáticos. El Lottie real, el play/pausa funcional,
// la barra de progreso con seek, el loop, el fullscreen y el acento de
// color se conectan en las siguientes microfases — ver
// plan-reproductor-deploymonitor.md.
export default function DeployMonitorReproductor({
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
        {/* Reusa el mismo patrón de malla que DeployMonitorMiniatura como
            placeholder mientras se integra el Lottie real en la próxima
            microfase (public/video/deploy_monitor.json) */}
        <div className={styles.mallaPlaceholder} aria-hidden="true" />
      </div>

      <div className={styles.barraInferior}>
        <button type="button" className={styles.botonControl} aria-label="Reproducir">
          <IconoPlayChico />
        </button>
        <span className={styles.tiempo}>0:03</span>
        <div className={styles.progresoTrack} aria-hidden="true">
          <div className={styles.progresoRelleno} style={{ width: "50%" }} />
          <span className={styles.progresoThumb} style={{ left: "50%" }} />
        </div>
        <span className={styles.tiempo}>0:06</span>
        <button type="button" className={styles.botonVelocidad} aria-label="Velocidad de reproducción">
          1x
        </button>
        <button type="button" className={styles.botonControl} aria-label="Activar loop">
          <IconoLoop />
        </button>
        <button type="button" className={styles.botonControl} aria-label="Pantalla completa">
          <IconoFullscreen />
        </button>
        <button type="button" className={styles.botonControl} aria-label="Cambiar acento de color">
          <IconoBotePintura />
        </button>
      </div>
    </div>
  );
}