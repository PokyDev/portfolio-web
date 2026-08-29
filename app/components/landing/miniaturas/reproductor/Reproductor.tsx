"use client";

import { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";
import ReproductorEmptyState from "./ReproductorEmptyState";
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

function IconoPausaChica() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
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

function IconoSalirFullscreen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M21 16h-3a2 2 0 0 0-2 2v3M3 16h3a2 2 0 0 1 2 2v3" />
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

// lib.dom no declara los prefijos vendor de Safari (nunca implementó
// la Fullscreen API sin prefijo para elementos arbitrarios hasta iOS
// 16.4). Se acotan al mínimo necesario acá.
interface ElementoConFullscreenVendor extends HTMLDivElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}
interface DocumentoConFullscreenVendor extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

function formatearTiempo(segundos: number) {
  const total = Number.isFinite(segundos) ? Math.max(0, Math.round(segundos)) : 0;
  const minutos = Math.floor(total / 60);
  const restante = total % 60;
  return `${minutos}:${restante.toString().padStart(2, "0")}`;
}

// Fuente de verdad legible para el estado inicial del loop. El toggle en
// pantalla sigue siendo booleano (useState) — esta constante solo decide
// con qué arranca. Cambiar a "OFF" para revertir el default sin tocar
// el resto del componente.
type EstadoOnOff = "ON" | "OFF";
const LOOP_POR_DEFECTO: EstadoOnOff = "ON";

// Progresión fija de velocidades — ciclar entre estos tres valores en
// orden. Si más adelante se quiere otro tope o más pasos, esta es la
// única línea que cambia.
const VELOCIDADES = [1, 2, 4] as const;
type Velocidad = (typeof VELOCIDADES)[number];

export default function Reproductor({
  src,
  onCerrar,
}: {
  src?: string;
  onCerrar: (evento: React.SyntheticEvent) => void;
}) {
  // Instancia del player, guardada por fuera de React state porque sus
  // métodos (play/pause/setFrame) son imperativos — solo el progreso
  // derivado (frame/duración) vive en estado para re-renderizar la UI.
  const dotLottieRef = useRef<DotLottie | null>(null);
  const reproductorRef = useRef<HTMLDivElement>(null);

  const frameObjetivoRef = useRef<number | null>(null);
  const rafPendienteRef = useRef<number | null>(null);

  const [reproduciendo, setReproduciendo] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  const [loopActivo, setLoopActivo] = useState(LOOP_POR_DEFECTO === "ON");

  const [velocidad, setVelocidad] = useState<Velocidad>(1);

  const [frameActual, setFrameActual] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [duracion, setDuracion] = useState(0);

  const progreso = totalFrames > 0 ? frameActual / totalFrames : 0;
  const tiempoActual = duracion * progreso;

  // El FLIP de TarjetaProyecto anima un `transform` sobre un ancestro
  // (miniaturaRef) mientras este componente ya está montado y cargando el
  // Lottie. Si la carga termina en pleno transform, dotlottie-web mide el
  // canvas con getBoundingClientRect() ya escalado y calcula mal su
  // resolución interna — y como ResizeObserver no reacciona a cambios de
  // transform (solo a cambios de layout), queda pegado en baja resolución
  // para siempre. Forzamos un resize() apenas termina esa transición para
  // corregirlo. Escuchamos en `document` porque transitionend burbujea y
  // el transform lo aplica un ancestro fuera de este componente; resize()
  // es un no-op seguro si el Lottie todavía no cargó o si ya estaba bien.
  useEffect(() => {
    function alTerminarTransicion(evento: TransitionEvent) {
      if (evento.propertyName !== "transform") return;
      dotLottieRef.current?.resize();
    }
    document.addEventListener("transitionend", alTerminarTransicion);
    return () => document.removeEventListener("transitionend", alTerminarTransicion);
  }, []);

  // El botón no es la única forma de salir de fullscreen (Esc, gesto del
  // sistema, F11). Sin este listener el ícono quedaría desincronizado del
  // estado real del navegador.
  useEffect(() => {
    function alCambiarFullscreen() {
      const doc = document as DocumentoConFullscreenVendor;
      const elementoActivo = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setPantallaCompleta(elementoActivo === reproductorRef.current);
    }
    document.addEventListener("fullscreenchange", alCambiarFullscreen);
    document.addEventListener("webkitfullscreenchange", alCambiarFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", alCambiarFullscreen);
      document.removeEventListener("webkitfullscreenchange", alCambiarFullscreen);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (rafPendienteRef.current !== null) {
        cancelAnimationFrame(rafPendienteRef.current);
      }
    };
  }, []);

  function alObtenerInstancia(instancia: DotLottie | null) {
    dotLottieRef.current = instancia;
    if (!instancia) return;

    instancia.addEventListener("load", () => {
      setTotalFrames(instancia.totalFrames);
      setDuracion(instancia.duration); // duration viene en milisegundos
    });
    instancia.addEventListener("play", () => setReproduciendo(true));
    instancia.addEventListener("pause", () => setReproduciendo(false));
    instancia.addEventListener("stop", () => setReproduciendo(false));
    instancia.addEventListener("complete", () => setReproduciendo(false));
    instancia.addEventListener("frame", (evento) => {
      setFrameActual(evento.currentFrame);
    });
  }

  function alTogglePlay(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    const dotLottie = dotLottieRef.current;
    if (!dotLottie) return;
    if (dotLottie.isPlaying) {
      dotLottie.pause();
    } else {
      dotLottie.play();
    }
  }

  function alToggleLoop(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    setLoopActivo((valorPrevio) => !valorPrevio);
  }

  function alCambiarVelocidad(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    setVelocidad((actual) => {
      const indiceActual = VELOCIDADES.indexOf(actual);
      const siguienteIndice = (indiceActual + 1) % VELOCIDADES.length;
      return VELOCIDADES[siguienteIndice];
    });
  }

  function alToggleFullscreen(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();

    const nodo = reproductorRef.current as ElementoConFullscreenVendor | null;
    const doc = document as DocumentoConFullscreenVendor;
    if (!nodo) return;

    const yaEnFullscreen = Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);

    if (!yaEnFullscreen) {
      if (nodo.requestFullscreen) {
        nodo.requestFullscreen().catch(() => { });
      } else if (nodo.webkitRequestFullscreen) {
        nodo.webkitRequestFullscreen();
      }
    } else if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => { });
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
  }

  function alCerrarReproductor(evento: React.SyntheticEvent) {
    const doc = document as DocumentoConFullscreenVendor;
    if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
      const salir = doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.();
      Promise.resolve(salir).catch(() => { });
    }
    onCerrar(evento);
  }

  // Con loop activo el ciclo de dibujo del canvas ya no se detiene nunca
  // (antes, con loop=false, la animación terminaba y el render se paraba
  // solo). Arrastrar la barra ahora compite por el hilo principal con ese
  // loop continuo — cada pointermove sin agrupar forzaba un render()+draw()
  // síncrono adicional. Se agrupa el seek real (caro) a un máximo de uno
  // por frame de pantalla (rAF); el feedback visual de la barra (barato,
  // solo React state) se sigue actualizando a la resolución completa del
  // puntero.
  function buscarEnPosicion(clientX: number, track: HTMLDivElement) {
    const dotLottie = dotLottieRef.current;
    if (!dotLottie || totalFrames === 0) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const frame = ratio * totalFrames;

    setFrameActual(frame); // feedback inmediato en la barra, no toca el canvas

    frameObjetivoRef.current = frame;
    if (rafPendienteRef.current !== null) return; // ya hay un seek agendado
    rafPendienteRef.current = requestAnimationFrame(() => {
      rafPendienteRef.current = null;
      if (frameObjetivoRef.current !== null) {
        dotLottie.setFrame(frameObjetivoRef.current);
      }
    });
  }

  function alPresionarProgreso(evento: React.PointerEvent<HTMLDivElement>) {
    evento.preventDefault();
    evento.stopPropagation();
    evento.currentTarget.setPointerCapture(evento.pointerId);
    buscarEnPosicion(evento.clientX, evento.currentTarget);
  }

  function alArrastrarProgreso(evento: React.PointerEvent<HTMLDivElement>) {
    if (evento.buttons !== 1) return; // solo mientras se mantiene presionado
    evento.stopPropagation();
    buscarEnPosicion(evento.clientX, evento.currentTarget);
  }

  if (!src) {
    return <ReproductorEmptyState onCerrar={onCerrar} />;
  }

  return (
    <div className={styles.reproductor} ref={reproductorRef}>
      <div className={styles.barraSuperior}>
        <button
          type="button"
          className={styles.botonAtras}
          aria-label="Cerrar reproductor"
          onClick={alCerrarReproductor}
        >
          <IconoFlechaAtras />
        </button>
      </div>

      <div className={styles.zonaCentral}>
        <DotLottieReact
          src={src}
          autoplay
          loop={loopActivo}
          speed={velocidad}
          className={styles.lienzo}
          renderConfig={{
            autoResize: true,
            devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
            quality: 100,
          }}
          dotLottieRefCallback={alObtenerInstancia}
        />
      </div>

      <div className={styles.barraInferior}>
        <button
          type="button"
          className={styles.botonControl}
          aria-label={reproduciendo ? "Pausar" : "Reproducir"}
          onClick={alTogglePlay}
        >
          {reproduciendo ? <IconoPausaChica /> : <IconoPlayChico />}
        </button>

        <span className={styles.tiempo}>{formatearTiempo(tiempoActual)}</span>

        <div
          className={styles.progresoTrack}
          role="slider"
          aria-label="Progreso de reproducción"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progreso * 100)}
          onPointerDown={alPresionarProgreso}
          onPointerMove={alArrastrarProgreso}
        >
          <div className={styles.progresoRelleno} style={{ width: `${progreso * 100}%` }} />
          <span className={styles.progresoThumb} style={{ left: `${progreso * 100}%` }} />
        </div>

        <span className={styles.tiempo}>{formatearTiempo(duracion)}</span>

        <button
          type="button"
          className={styles.botonVelocidad}
          aria-label={`Velocidad de reproducción: ${velocidad}x. Tocar para cambiar`}
          onClick={alCambiarVelocidad}
        >
          {velocidad}x
        </button>
        <button
          type="button"
          className={
            loopActivo
              ? `${styles.botonControl} ${styles.botonControlActivo}`
              : styles.botonControl
          }
          aria-label={loopActivo ? "Desactivar loop" : "Activar loop"}
          aria-pressed={loopActivo}
          onClick={alToggleLoop}
        >
          <IconoLoop />
        </button>
        <button
          type="button"
          className={styles.botonControl}
          aria-label={pantallaCompleta ? "Salir de pantalla completa" : "Pantalla completa"}
          onClick={alToggleFullscreen}
        >
          {pantallaCompleta ? <IconoSalirFullscreen /> : <IconoFullscreen />}
        </button>
        <button type="button" className={styles.botonControl} aria-label="Cambiar acento de color" disabled>
          <IconoBotePintura />
        </button>
      </div>
    </div>
  );
}