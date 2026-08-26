"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import IconoTarjetaClickeable from "./IconoTarjetaClickeable";
import BartolomeMiniatura from "../miniaturas/bartolome/BartolomeMiniatura";
import CoragemMiniatura from "../miniaturas/coragem/CoragemMiniatura";
import DeployMonitorMiniatura from "../miniaturas/deploy-monitor/DeployMonitorMiniatura";
import PortfolioMiniatura from "../miniaturas/portfolio/PortfolioMiniatura";
import Tecnologia from "./Tecnologia";
import type { Proyecto } from "../data";
import styles from "../landing.module.css";

function IconoPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function IconoPausa() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function IconoPlayGrande() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// Mapa slug -> clase global (sin hash) que engancha la animación de hover de
// cada miniatura-componente desde fuera del scope de landing.module.css —
// ver deployMonitorAnimacion/coragemAnimacion/portfolioAnimacion/bartolomeAnimacion.
const CLASE_HOVER_MINIATURA: Record<string, string> = {
  "coragem-bisuteria": "coragem-tarjeta-hover",
  "pokydev-portfolio": "portfolio-tarjeta-hover",
  "bartolome-parrilla": "bartolome-tarjeta-hover",
};

export default function TarjetaProyecto({ proyecto }: { proyecto: Proyecto }) {
  // Toda tarjeta es clickeable: interna (caso de estudio, interfaz 2) o
  // externa (repo/página). Las externas abren en pestaña nueva.
  const externo = proyecto.enlace.startsWith("http");

  const claseHoverMiniatura = CLASE_HOVER_MINIATURA[proyecto.slug];

  // Táctil (sin :hover real): el botón de abajo hace de sustituto del hover
  // para las 4 miniaturas-componente animadas — ver esas mismas hojas de
  // animación, que además de `:hover` ahora reaccionan a `.animar-forzado`.
  const [animado, setAnimado] = useState(false);
  const botonRef = useRef<HTMLSpanElement>(null);

  const [reproductorAbierto, setReproductorAbierto] = useState(false);
  const [textoOculto, setTextoOculto] = useState(false);
  const [enTransicion, setEnTransicion] = useState(false);

  const miniaturaRef = useRef<HTMLDivElement>(null);
  const rectPrevioRef = useRef<DOMRect | null>(null);

  const tarjetaRef = useRef<HTMLAnchorElement>(null);
  const alturaPreviaRef = useRef<number | null>(null);

  const DURACION_FADE_TEXTO_MS = 220;
  const DURACION_ESCALA_MS = 400;

  function alAbrirReproductor(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    if (reproductorAbierto || enTransicion) return;

    setEnTransicion(true);
    setTextoOculto(true); // Fase A: fade, el texto sigue en el flujo

    window.setTimeout(() => {
      alturaPreviaRef.current = tarjetaRef.current?.getBoundingClientRect().height ?? null;
      rectPrevioRef.current = miniaturaRef.current?.getBoundingClientRect() ?? null;
      setReproductorAbierto(true);

      window.setTimeout(() => {
        setEnTransicion(false);
      }, DURACION_ESCALA_MS);
    }, DURACION_FADE_TEXTO_MS);
  }


  function alCerrarReproductor(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    if (!reproductorAbierto || enTransicion) return;

    setEnTransicion(true);
    alturaPreviaRef.current = tarjetaRef.current?.getBoundingClientRect().height ?? null;
    rectPrevioRef.current = miniaturaRef.current?.getBoundingClientRect() ?? null;
    setReproductorAbierto(false); // Fase B inversa: miniatura vuelve a angosta (FLIP)

    window.setTimeout(() => {
      setTextoOculto(false); // Fase A inversa: recién ahora reaparece el texto
      setEnTransicion(false);
    }, DURACION_ESCALA_MS);
  }

  function alClickearTarjeta(evento: React.MouseEvent) {
    if (proyecto.slug === "deploy-monitor" && (reproductorAbierto || textoOculto)) {
      evento.preventDefault();
    }
  }

  useEffect(() => {
    if (!animado) return;

    // "él" en el pedido original es el botón, no la tarjeta entera: cualquier
    // TAP fuera del botón deselecciona (incluido un tap en otra parte de la
    // misma tarjeta, que de paso navega — el <a> ya lo maneja solo). Un
    // drag/scroll que arranca fuera del botón NO debe deseleccionar: se mide
    // la distancia entre pointerdown y pointerup, y si se movió más que el
    // umbral, se ignora por ser gesto de scroll, no un tap real.
    const UMBRAL_ARRASTRE_PX = 10;
    let inicioToque: { x: number; y: number } | null = null;

    function alIniciarToque(evento: PointerEvent) {
      inicioToque = { x: evento.clientX, y: evento.clientY };
    }

    function alSoltarToque(evento: PointerEvent) {
      const inicio = inicioToque;
      inicioToque = null;
      if (!inicio) return;

      const distancia = Math.hypot(
        evento.clientX - inicio.x,
        evento.clientY - inicio.y,
      );
      if (distancia > UMBRAL_ARRASTRE_PX) return;

      if (!botonRef.current?.contains(evento.target as Node)) {
        setAnimado(false);
      }
    }

    document.addEventListener("pointerdown", alIniciarToque);
    document.addEventListener("pointerup", alSoltarToque);
    return () => {
      document.removeEventListener("pointerdown", alIniciarToque);
      document.removeEventListener("pointerup", alSoltarToque);
    };
  }, [animado]);

  useLayoutEffect(() => {
    const nodo = miniaturaRef.current;
    const rectPrevio = rectPrevioRef.current;
    if (!nodo || !rectPrevio) return;

    const rectNuevo = nodo.getBoundingClientRect();
    const escalaX = rectPrevio.width / rectNuevo.width;
    const escalaY = rectPrevio.height / rectNuevo.height;
    const trasladoX = rectPrevio.left - rectNuevo.left;
    const trasladoY = rectPrevio.top - rectNuevo.top;

    nodo.style.transformOrigin = "top left";
    nodo.style.transition = "none";
    nodo.style.transform = `translate(${trasladoX}px, ${trasladoY}px) scale(${escalaX}, ${escalaY})`;

    // Fuerza reflow para que el navegador registre el estado inicial antes de animar
    nodo.getBoundingClientRect();

    requestAnimationFrame(() => {
      nodo.style.transition = `transform ${DURACION_ESCALA_MS}ms var(--ease-standard)`;
      nodo.style.transform = "translate(0, 0) scale(1, 1)";
    });

    rectPrevioRef.current = null;
  }, [reproductorAbierto]);

  useLayoutEffect(() => {
    const tarjeta = tarjetaRef.current;
    const alturaPrevia = alturaPreviaRef.current;
    if (!tarjeta || alturaPrevia == null) return;

    const alturaNueva = tarjeta.getBoundingClientRect().height;

    tarjeta.style.overflow = "hidden";
    tarjeta.style.transition = "none";
    tarjeta.style.height = `${alturaPrevia}px`;

    tarjeta.getBoundingClientRect();

    requestAnimationFrame(() => {
      tarjeta.style.transition = `height ${DURACION_ESCALA_MS}ms var(--ease-standard)`;
      tarjeta.style.height = `${alturaNueva}px`;
    });

    alturaPreviaRef.current = null;

    function alTerminar(evento: TransitionEvent) {
      if (evento.propertyName !== "height") return;

      const nodo = tarjetaRef.current;
      if (!nodo) return;

      nodo.style.transition = "";
      nodo.style.height = "";
      nodo.style.overflow = "";
      nodo.removeEventListener("transitionend", alTerminar);
    }

    tarjeta.addEventListener("transitionend", alTerminar);

    return () => {
      tarjeta.removeEventListener("transitionend", alTerminar);
    };
  }, [reproductorAbierto]);

  function alTocarBoton(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    setAnimado((valorPrevio) => !valorPrevio);
  }

  function alPresionarTeclaBoton(evento: React.KeyboardEvent) {
    if (evento.key === "Enter" || evento.key === " ") {
      alTocarBoton(evento);
    }
  }

  return (
    <a
      ref={tarjetaRef}
      href={proyecto.enlace}
      onClick={alClickearTarjeta}
      className={
        claseHoverMiniatura
          ? `${styles.tarjetaEnlace} ${claseHoverMiniatura}${animado ? " animar-forzado" : ""
          }`
          : styles.tarjetaEnlace
      }
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {proyecto.slug === "deploy-monitor" ? (
        <div
          ref={miniaturaRef}
          className={`${styles.proyectoMiniatura}${reproductorAbierto ? ` ${styles.proyectoMiniaturaExpandida}` : ""
            }`}
        >
          <DeployMonitorMiniatura />
          <button
            type="button"
            className={`${styles.overlayReproductor}${reproductorAbierto ? ` ${styles.overlayReproductorActivo}` : ""
              }`}
            aria-label={reproductorAbierto ? "Cerrar reproductor" : "Reproducir animación"}
            disabled={enTransicion}
            onClick={reproductorAbierto ? alCerrarReproductor : alAbrirReproductor}
          >
            <span className={styles.overlayReproductorIcono}>
              {reproductorAbierto ? <IconoCerrar /> : <IconoPlayGrande />}
            </span>
          </button>
        </div>
      ) : proyecto.slug === "coragem-bisuteria" ? (
        <div className={styles.proyectoMiniatura}>
          <CoragemMiniatura />
        </div>
      ) : proyecto.slug === "pokydev-portfolio" ? (
        <div className={styles.proyectoMiniatura}>
          <PortfolioMiniatura />
        </div>
      ) : proyecto.slug === "bartolome-parrilla" ? (
        <div className={styles.proyectoMiniatura}>
          <BartolomeMiniatura />
        </div>
      ) : proyecto.miniatura ? (
        <div className={styles.proyectoMiniatura}>
          <Image
            src={proyecto.miniatura}
            alt={`Captura de ${proyecto.titulo}`}
            width={480}
            height={300}
            className={styles.miniaturaImagen}
          />
        </div>
      ) : (
        // Empty-state decorativo: conserva el ritmo visual de la columna
        // de miniaturas cuando el proyecto aún no tiene captura.
        <div
          className={`${styles.proyectoMiniatura} ${styles.miniaturaVacia}`}
          aria-hidden="true"
        >
          {"</>"}
        </div>
      )}

      {claseHoverMiniatura && (
        // Solo en táctil (sin :hover real) — sustituto del hover de la
        // miniatura de arriba: ver CLASE_HOVER_MINIATURA y .animar-forzado
        // en las hojas de animación de cada miniatura-componente.
        <div className={styles.filaAnimarMiniatura}>
          <span
            ref={botonRef}
            role="button"
            tabIndex={0}
            aria-pressed={animado}
            aria-label={
              animado
                ? "Pausar animación de la miniatura"
                : "Reproducir animación de la miniatura"
            }
            className={`${styles.botonAnimarMiniatura}${animado ? ` ${styles.botonAnimarMiniaturaActivo}` : ""
              }`}
            onClick={alTocarBoton}
            onKeyDown={alPresionarTeclaBoton}
          >
            {animado ? <IconoPausa /> : <IconoPlay />}
          </span>
        </div>
      )}

      <div
        className={`${styles.proyectoCuerpo}${proyecto.slug === "deploy-monitor" && textoOculto ? ` ${styles.proyectoCuerpoDesvanecido}` : ""
          }${proyecto.slug === "deploy-monitor" && reproductorAbierto ? ` ${styles.proyectoCuerpoOculto}` : ""
          }`}
      >
        <h3 className={styles.proyectoTitulo}>
          {proyecto.titulo}
          <IconoTarjetaClickeable />
        </h3>
        <p className={styles.parrafo}>{proyecto.descripcion}</p>
        <span className={styles.etiquetaTecnologias} aria-hidden="true">
          Tecnologías
        </span>
        <ul className={styles.chips} aria-label="Tecnologías usadas">
          {proyecto.tecnologias.map((tecnologia) => (
            <Tecnologia key={tecnologia} nombre={tecnologia} />
          ))}
        </ul>
        <div className={styles.proyectoMeta}>
          {proyecto.estrellas !== undefined && (
            <span className={styles.metrica}>
              <span className={styles.metricaIcono} aria-hidden="true">⭐</span>
              {proyecto.estrellas} estrella/s
            </span>
          )}
          {proyecto.descargas !== undefined && (
            <span className={styles.metrica}>
              <span className={styles.metricaIcono} aria-hidden="true">⇩</span>
              {proyecto.descargas.toLocaleString("es")} descargas
            </span>
          )}
          {proyecto.usuariosMensuales !== undefined && (
            <span className={styles.metrica}>
              <span className={styles.metricaIcono} aria-hidden="true">👥</span>
              {proyecto.usuariosMensuales.toLocaleString("es")} usuarios/mes
            </span>
          )}
        </div>
        <span className={styles.proyectoEnlace}>
          {proyecto.etiquetaEnlace} →
        </span>
      </div>
    </a>
  );
}
