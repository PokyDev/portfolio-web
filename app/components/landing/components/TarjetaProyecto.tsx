"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

import IconoTarjetaClickeable from "./IconoTarjetaClickeable";

import BartolomeMiniatura from "../miniaturas/bartolome/BartolomeMiniatura";
import CoragemMiniatura from "../miniaturas/coragem/CoragemMiniatura";
import DeployMonitorMiniatura from "../miniaturas/deploy-monitor/DeployMonitorMiniatura";
import PortfolioMiniatura from "../miniaturas/portfolio/PortfolioMiniatura";

import Reproductor from "@/app/components/landing/miniaturas/reproductor/Reproductor";

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

// Los 4 proyectos con miniatura animada propia (imagotipo/marca en vez de
// captura de pantalla) son, hasta ahora, los únicos con reproductor —
// tengan o no ya un .json de Lottie asociado en data.ts (proyecto.animacion).
// Sin entrada acá => tarjeta simple (imagen estática o empty-state), sin
// overlay de play ni reproductor.
const MINIATURAS_CON_REPRODUCTOR: Record<string, ComponentType> = {
  "deploy-monitor": DeployMonitorMiniatura,
  "coragem-bisuteria": CoragemMiniatura,
  "pokydev-portfolio": PortfolioMiniatura,
  "bartolome-parrilla": BartolomeMiniatura,
};

export default function TarjetaProyecto({
  proyecto,
  abierto,
  onAbrir,
  onCerrar,
}: {
  proyecto: Proyecto;
  abierto: boolean;
  onAbrir: () => void;
  onCerrar: () => void;
}) {
  // Toda tarjeta es clickeable: interna (caso de estudio, interfaz 2) o
  // externa (repo/página). Las externas abren en pestaña nueva.
  const externo = proyecto.enlace.startsWith("http");

  const ComponenteMiniatura = MINIATURAS_CON_REPRODUCTOR[proyecto.slug];
  const tieneReproductor = Boolean(ComponenteMiniatura);

  // "abierto" ahora vive en Landing.tsx (un solo slug activo para toda la
  // landing) — evita que se puedan tener dos reproductores abiertos a la
  // vez. Esta tarjeta solo sabe si LE toca estar abierta.
  const [textoOculto, setTextoOculto] = useState(false);
  const [enTransicion, setEnTransicion] = useState(false);

  // true mientras el cierre en curso fue disparado por el propio botón/
  // click-afuera de ESTA tarjeta (con animación FLIP normal). Si "abierto"
  // pasa a false sin que este flag se haya activado, es porque algo cerró
  // este reproductor sin pasar por cerrarConAnimacion() — el efecto de
  // más abajo lo usa como red de seguridad.
  const cierrePorEstaTarjetaRef = useRef(false);

  const miniaturaRef = useRef<HTMLDivElement>(null);
  const rectPrevioRef = useRef<DOMRect | null>(null);

  const tarjetaRef = useRef<HTMLAnchorElement>(null);
  const alturaPreviaRef = useRef<number | null>(null);

  const DURACION_FADE_TEXTO_MS = 220;
  const DURACION_ESCALA_MS = 400;

  // Mientras el reproductor está abierto (o en camino a estarlo) el href
  // de la tarjeta se desactiva: navegar o mostrar el link no tiene sentido
  // viendo el video, y además el navegador muestra el preview nativo del
  // href en la esquina inferior al hacer hover, lo cual estorba encima
  // del reproductor.
  const enlaceDeshabilitado = tieneReproductor && (abierto || textoOculto);

  function alAbrirReproductor(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    if (abierto || enTransicion) return;

    setEnTransicion(true);
    setTextoOculto(true); // Fase A: fade, el texto sigue en el flujo

    window.setTimeout(() => {
      alturaPreviaRef.current = tarjetaRef.current?.getBoundingClientRect().height ?? null;
      rectPrevioRef.current = miniaturaRef.current?.getBoundingClientRect() ?? null;
      onAbrir(); // Fase B: le avisa a Landing.tsx — cierra cualquier otro abierto

      window.setTimeout(() => {
        setEnTransicion(false);
      }, DURACION_ESCALA_MS);
    }, DURACION_FADE_TEXTO_MS);
  }

  // Compartida por el botón de cerrar y por el listener de click-afuera:
  // captura los rects ANTES de avisarle a Landing.tsx que este reproductor
  // se cierra, para que el FLIP de reversa tenga de dónde partir.
  function cerrarConAnimacion() {
    if (!abierto || enTransicion) return;

    cierrePorEstaTarjetaRef.current = true;
    setEnTransicion(true);
    alturaPreviaRef.current = tarjetaRef.current?.getBoundingClientRect().height ?? null;
    rectPrevioRef.current = miniaturaRef.current?.getBoundingClientRect() ?? null;
    onCerrar(); // Fase B inversa: miniatura vuelve a angosta (FLIP)

    window.setTimeout(() => {
      setTextoOculto(false); // Fase A inversa: recién ahora reaparece el texto
      setEnTransicion(false);
    }, DURACION_ESCALA_MS);
  }

  function alCerrarReproductor(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    cerrarConAnimacion();
  }

  function alClickearTarjeta(evento: React.MouseEvent) {
    if (tieneReproductor && (abierto || textoOculto)) {
      evento.preventDefault();
    }
  }

  // Red de seguridad: si "abierto" pasa a false SIN que haya sido esta
  // tarjeta la que llamó a onCerrar() (por ejemplo, se abrió otro
  // reproductor sin pasar por el click-afuera de abajo), no hay rects
  // capturados para animar un FLIP en reversa correcto — en vez de dejar
  // la miniatura en un estado visual intermedio, se resetea directo.
  useEffect(() => {
    if (abierto) return;
    if (cierrePorEstaTarjetaRef.current) {
      cierrePorEstaTarjetaRef.current = false;
      return;
    }
    setTextoOculto(false);
    setEnTransicion(false);
  }, [abierto]);

  // Mejora de UX opcional: click en cualquier lugar fuera del reproductor
  // (sin contar sus propios controles, incluido el botón de cerrar) lo
  // cierra. Capture phase porque los controles internos (play, loop,
  // fullscreen, cerrar) hacen stopPropagation() en bubble — así este
  // listener en document siempre se entera primero.
  useEffect(() => {
    if (!abierto) return;

    function alClickearFuera(evento: PointerEvent) {
      const nodo = miniaturaRef.current;
      if (nodo && evento.target instanceof Node && !nodo.contains(evento.target)) {
        cerrarConAnimacion();
      }
    }

    document.addEventListener("pointerdown", alClickearFuera, true);
    return () => document.removeEventListener("pointerdown", alClickearFuera, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

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
  }, [abierto]);

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
  }, [abierto]);

  return (
    <a
      ref={tarjetaRef}
      href={enlaceDeshabilitado ? undefined : proyecto.enlace}
      onClick={alClickearTarjeta}
      className={styles.tarjetaEnlace}
      {...(externo && !enlaceDeshabilitado && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {ComponenteMiniatura ? (
        <div
          ref={miniaturaRef}
          className={`${styles.proyectoMiniatura}${abierto ? ` ${styles.proyectoMiniaturaExpandida}` : ""
            }`}
        >
          {abierto ? (
            <Reproductor src={proyecto.animacion} onCerrar={alCerrarReproductor} />
          ) : (
            <>
              <ComponenteMiniatura />
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
        className={`${styles.proyectoCuerpo}${tieneReproductor && textoOculto ? ` ${styles.proyectoCuerpoDesvanecido}` : ""
          }${tieneReproductor && abierto ? ` ${styles.proyectoCuerpoOculto}` : ""
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