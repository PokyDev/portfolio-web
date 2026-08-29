"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import IconoTarjetaClickeable from "./IconoTarjetaClickeable";

import BartolomeMiniatura from "../miniaturas/bartolome/BartolomeMiniatura";
import CoragemMiniatura from "../miniaturas/coragem/CoragemMiniatura";
import DeployMonitorMiniatura from "../miniaturas/deploy-monitor/DeployMonitorMiniatura";
import PortfolioMiniatura from "../miniaturas/portfolio/PortfolioMiniatura";

import DeployMonitorReproductor from "@/app/components/landing/miniaturas/deploy-monitor/DeployMonitorReproductor";

import Tecnologia from "./Tecnologia";
import type { Proyecto } from "../data";
import styles from "../landing.module.css";

function IconoPlayGrande() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export default function TarjetaProyecto({ proyecto }: { proyecto: Proyecto }) {
  // Toda tarjeta es clickeable: interna (caso de estudio, interfaz 2) o
  // externa (repo/página). Las externas abren en pestaña nueva.
  const externo = proyecto.enlace.startsWith("http");

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

  return (
    <a
      ref={tarjetaRef}
      href={proyecto.enlace}
      onClick={alClickearTarjeta}
      className={styles.tarjetaEnlace}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {proyecto.slug === "deploy-monitor" ? (
        <div
          ref={miniaturaRef}
          className={`${styles.proyectoMiniatura}${reproductorAbierto ? ` ${styles.proyectoMiniaturaExpandida}` : ""
            }`}
        >
          {reproductorAbierto ? (
            <DeployMonitorReproductor onCerrar={alCerrarReproductor} />
          ) : (
            <>
              <DeployMonitorMiniatura />
              <button
                type="button"
                className={styles.overlayReproductor}
                aria-label="Reproducir animación"
                disabled={enTransicion}
                onClick={alAbrirReproductor}
              >
                <span className={styles.overlayReproductorIcono}>
                  <IconoPlayGrande />
                </span>
              </button>
            </>
          )}
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
