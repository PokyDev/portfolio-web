"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

// Mapa slug -> clase global (sin hash) que engancha la animación de hover de
// cada miniatura-componente desde fuera del scope de landing.module.css —
// ver deployMonitorAnimacion/coragemAnimacion/portfolioAnimacion/bartolomeAnimacion.
const CLASE_HOVER_MINIATURA: Record<string, string> = {
  "deploy-monitor": "dm-tarjeta-hover",
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
      href={proyecto.enlace}
      className={
        claseHoverMiniatura
          ? `${styles.tarjetaEnlace} ${claseHoverMiniatura}${
              animado ? " animar-forzado" : ""
            }`
          : styles.tarjetaEnlace
      }
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {proyecto.slug === "deploy-monitor" ? (
        // Experimento de diseño (temporal): miniatura como componente en vez
        // de captura .png — ver app/components/landing/miniaturas. Si
        // convence, se generaliza a las demás tarjetas.
        <div className={styles.proyectoMiniatura}>
          <DeployMonitorMiniatura />
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
            className={`${styles.botonAnimarMiniatura}${
              animado ? ` ${styles.botonAnimarMiniaturaActivo}` : ""
            }`}
            onClick={alTocarBoton}
            onKeyDown={alPresionarTeclaBoton}
          >
            {animado ? <IconoPausa /> : <IconoPlay />}
          </span>
        </div>
      )}

      <div className={styles.proyectoCuerpo}>
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
