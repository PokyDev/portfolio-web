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

  // Velo sólido (mismo fondo que el reproductor) que cubre el contenedor
  // durante el cierre, para que el swap Reproductor -> miniatura real y
  // el achique del FLIP no se vean como contenido saltando de golpe a
  // tamaño expandido. Ver detalle de las 3 fases en cerrarConAnimacion().
  const [veloVisible, setVeloVisible] = useState(false);

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

  // FLIP del cuerpo de texto — solo mobile (ver useLayoutEffect dedicado
  // más abajo). En desktop el texto se oculta con opacity (.proyectoCuerpo*
  // en landing.module.css); en mobile, a esa resolución, no hace falta
  // ocultarlo — alcanza con que acompañe el achique de la miniatura en vez
  // de quedar en su posición final (chica) desde el primer frame del
  // cierre, mientras la miniatura todavía se ve grande por el transform.
  // rectCuerpoPrevioRef solo se setea en las rutas de CIERRE (nunca al
  // abrir): abrir ya se ve bien tal cual está (reveal por altura, sin
  // overlap), así que no se toca.
  const cuerpoRef = useRef<HTMLDivElement>(null);
  const rectCuerpoPrevioRef = useRef<DOMRect | null>(null);

  // Snapshot continuo del rect/alto MIENTRAS el reproductor está abierto.
  // Necesario porque, cuando esta tarjeta se cierra por la apertura de
  // OTRA (ver efecto más abajo), para el momento en que React vuelve a
  // renderizar "abierto" ya es false y el DOM ya colapsó — no hay forma
  // de leer ahí el rect "grande". Se va guardando de antemano, en cada
  // commit mientras sigue abierta, para tener siempre uno reciente a mano.
  const rectAbiertoRef = useRef<DOMRect | null>(null);
  const alturaAbiertaRef = useRef<number | null>(null);
  // Mismo snapshot continuo, pero del cuerpo de texto — alimenta
  // rectCuerpoPrevioRef en el cierre externo (ver efecto de abajo).
  const rectCuerpoAbiertoRef = useRef<DOMRect | null>(null);
  const llegoAEstarAbiertaRef = useRef(false);

  // Breakpoint mobile del reproductor (coincide con el "@media (max-width:
  // 639px)" de .proyectoMiniatura.proyectoMiniaturaExpandida en
  // landing.module.css). El FLIP del cuerpo solo corre por debajo de este
  // ancho — en desktop el texto ya se maneja con opacity + position:
  // absolute (.proyectoCuerpoOculto), y mezclar ambos mecanismos ahí
  // rompería ese enfoque que ya funciona.
  const ANCHO_MAXIMO_MOBILE_PX = 639;
  function esMobile() {
    return typeof window !== "undefined" && window.innerWidth <= ANCHO_MAXIMO_MOBILE_PX;
  }

  const DURACION_FADE_TEXTO_MS = 220;
  const DURACION_ESCALA_MS = 400;
  // Duración del fade de entrada/salida del velo de cierre — debe
  // coincidir con la transición de opacity de .veloCierre en
  // landing.module.css (los setTimeout de abajo dependen de este valor
  // para encadenar la siguiente fase justo cuando termina la anterior).
  const DURACION_VELO_MS = 200;

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
  // Cierre en 3 fases (ver .veloCierre en landing.module.css para el
  // porqué del velo):
  //   1. Velo: fade-in de un rectángulo sólido (mismo --color-bg del
  //      reproductor) que lo cubre por completo. El reproductor sigue
  //      montado y visible por debajo hasta que el velo llega a opaco.
  //   2. Swap + resize: recién con el velo opaco se llama a onCerrar()
  //      (la miniatura real reemplaza al reproductor, pero queda oculta
  //      bajo el velo) y arranca el FLIP de achique (los dos
  //      useLayoutEffect de más abajo). El texto empieza a reaparecer en
  //      paralelo a este mismo achique, no después.
  //   3. Reveal: cuando el achique termina, el velo se disuelve y
  //      descubre la miniatura ya en su tamaño final.
  function cerrarConAnimacion() {
    if (!abierto || enTransicion) return;

    cierrePorEstaTarjetaRef.current = true;
    setEnTransicion(true);
    setVeloVisible(true); // Fase 1

    window.setTimeout(() => {
      alturaPreviaRef.current = tarjetaRef.current?.getBoundingClientRect().height ?? null;
      rectPrevioRef.current = miniaturaRef.current?.getBoundingClientRect() ?? null;
      if (esMobile()) {
        rectCuerpoPrevioRef.current = cuerpoRef.current?.getBoundingClientRect() ?? null;
      }
      onCerrar(); // Fase 2: miniatura vuelve a angosta (FLIP), oculta bajo el velo

      window.setTimeout(() => {
        setVeloVisible(false); // Fase 3: velo y texto aparecen juntos en opacidad
        setTextoOculto(false);
        setEnTransicion(false);
      }, DURACION_ESCALA_MS);
    }, DURACION_VELO_MS);
  }

  function alCerrarReproductor(evento: React.SyntheticEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    cerrarConAnimacion();
  }

  // El listener de click-afuera vive dentro de un efecto que solo se
  // vuelve a suscribir cuando cambia "abierto" (ver más abajo). Como
  // "cerrarConAnimacion" es una función nueva en cada render (cierra
  // sobre "enTransicion" del momento), si el efecto la referenciara
  // directamente quedaría atada para siempre al valor de "enTransicion"
  // que había EN EL RENDER EN QUE SE ABRIÓ — que es `true` (recién se
  // llamó a setEnTransicion(true) para arrancar la apertura). Esa es la
  // razón real por la que el cierre por click-afuera no estaba
  // funcionando: `cerrarConAnimacion()` hacía siempre `return` de
  // inmediato por ese `enTransicion` obsoleto atrapado en el closure,
  // sin importar que en la práctica ya no hubiera ninguna transición en
  // curso. Este ref siempre apunta a la versión más reciente.
  const cerrarConAnimacionRef = useRef(cerrarConAnimacion);
  useEffect(() => {
    cerrarConAnimacionRef.current = cerrarConAnimacion;
  });

  function alClickearTarjeta(evento: React.MouseEvent) {
    if (tieneReproductor && (abierto || textoOculto)) {
      evento.preventDefault();
    }
  }

  // Actualiza el snapshot en cada commit mientras sigue abierta. Se apoya
  // en el orden de los layout effects: como se declara ANTES que los dos
  // que aplican el FLIP (más abajo), en el commit en el que recién se abre
  // corre antes de que esos le apliquen cualquier transform/height inline,
  // así que siempre lee el tamaño "real" ya expandido, nunca uno a medio
  // animar.
  useLayoutEffect(() => {
    if (!abierto) return;
    llegoAEstarAbiertaRef.current = true;
    rectAbiertoRef.current = miniaturaRef.current?.getBoundingClientRect() ?? null;
    alturaAbiertaRef.current = tarjetaRef.current?.getBoundingClientRect().height ?? null;
    rectCuerpoAbiertoRef.current = cuerpoRef.current?.getBoundingClientRect() ?? null;
  });

  // Si "abierto" pasa a false SIN que haya sido esta tarjeta la que llamó
  // a cerrarConAnimacion() (cierrePorEstaTarjetaRef en false), es porque
  // se abrió OTRO reproductor y Landing.tsx cambió el slug activo. Antes
  // esto simplemente reseteaba todo de golpe (de ahí lo abrupto); ahora
  // reusamos el último rect/alto conocidos (capturados por el efecto de
  // arriba mientras seguía abierta) para alimentar el MISMO FLIP en
  // reversa que dispara un cierre manual — los dos efectos de más abajo,
  // que leen rectPrevioRef/alturaPreviaRef, se encargan de animarlo.
  // Por eso debe ser useLayoutEffect y debe declararse ANTES que esos dos:
  // los layout effects de un mismo commit corren en orden de declaración,
  // así que este alcanza a dejar los rects listos antes de que se lean.
  useLayoutEffect(() => {
    if (abierto) return;
    if (cierrePorEstaTarjetaRef.current) {
      cierrePorEstaTarjetaRef.current = false;
      return;
    }
    if (!llegoAEstarAbiertaRef.current) return; // nunca se abrió (mount inicial) — nada que revertir

    rectPrevioRef.current = rectAbiertoRef.current;
    alturaPreviaRef.current = alturaAbiertaRef.current;
    if (esMobile()) {
      rectCuerpoPrevioRef.current = rectCuerpoAbiertoRef.current;
    }
    setEnTransicion(true);
    // Acá el swap Reproductor -> miniatura ya ocurrió (React ya renderizó
    // "abierto" en false antes de que este efecto pudiera reaccionar), así
    // que no hay margen para el fade-in de Fase 1 de cerrarConAnimacion():
    // el velo tiene que aparecer opaco ya. Como esto corre en un
    // useLayoutEffect, React aplica el estado y repinta antes de que el
    // navegador muestre el frame — no se alcanza a ver la miniatura real
    // a tamaño expandido ni un parpadeo del velo apareciendo.
    setVeloVisible(true);

    window.setTimeout(() => {
      setVeloVisible(false); // Fase 3: mismo reveal que el cierre manual + texto
      setTextoOculto(false);
      setEnTransicion(false);
    }, DURACION_ESCALA_MS);
  }, [abierto]);

  // Mejora de UX opcional: click en cualquier lugar fuera del reproductor
  // (sin contar sus propios controles, incluido el botón de cerrar) lo
  // cierra. Capture phase porque los controles internos (play, loop,
  // fullscreen, cerrar) hacen stopPropagation() en bubble — así este
  // listener en document siempre se entera primero.
  useEffect(() => {
    if (!abierto) return;

    function alClickearFuera(evento: MouseEvent) { // antes: PointerEvent
      const nodo = miniaturaRef.current;
      if (nodo && evento.target instanceof Node && !nodo.contains(evento.target)) {
        cerrarConAnimacionRef.current();
      }
    }

    document.addEventListener("click", alClickearFuera, true); // antes: "pointerdown"
    return () => document.removeEventListener("click", alClickearFuera, true);
  }, [abierto]); // ya no hace falta el eslint-disable de exhaustive-deps

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

  // FLIP del cuerpo de texto en mobile — mismo patrón que el de la
  // miniatura de arriba, pero solo traslación en Y (una sola columna, no
  // hay cambio de ancho). rectCuerpoPrevioRef solo llega con datos en las
  // rutas de cierre (manual o externo); en la apertura queda null y este
  // efecto no hace nada, dejando ese caso tal cual está.
  useLayoutEffect(() => {
    const nodo = cuerpoRef.current;
    const rectPrevio = rectCuerpoPrevioRef.current;
    rectCuerpoPrevioRef.current = null;
    if (!nodo || !rectPrevio) return;

    const rectNuevo = nodo.getBoundingClientRect();
    const trasladoY = rectPrevio.top - rectNuevo.top;

    nodo.style.transition = "none";
    nodo.style.transform = `translateY(${trasladoY}px)`;

    // Fuerza reflow para que el navegador registre el estado inicial antes de animar
    nodo.getBoundingClientRect();

    requestAnimationFrame(() => {
      nodo.style.transition = `transform ${DURACION_ESCALA_MS}ms var(--ease-standard)`;
      nodo.style.transform = "translateY(0)";
    });

    function alTerminar(evento: TransitionEvent) {
      if (evento.propertyName !== "transform" || !nodo) return;
      nodo.style.transition = "";
      nodo.style.transform = "";
      nodo.removeEventListener("transitionend", alTerminar);
    }

    nodo.addEventListener("transitionend", alTerminar);

    return () => {
      nodo.removeEventListener("transitionend", alTerminar);
    };
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
          <div
            className={`${styles.veloCierre}${veloVisible ? ` ${styles.veloCierreVisible}` : ""}`}
            aria-hidden="true"
          />
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
        ref={cuerpoRef}
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