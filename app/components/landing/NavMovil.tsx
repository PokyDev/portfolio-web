"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollspy } from "../../hooks/useScrollspy";
import { IDENTIDAD, IDS_SECCIONES, SECCIONES } from "./data";
import SelloPoky from "./SelloPoky";
import Sociales from "./Sociales";
import ThemeToggle from "./ThemeToggle";
import styles from "./landing.module.css";

// Navegación móvil (< 1024px) — reemplaza a la antigua fila horizontal de
// secciones con scroll propio, descartada por UX. Tres piezas:
// 1. Barra sticky: sociales a la izquierda | separador | botón hamburguesa.
// 2. Backdrop translúcido que cierra el panel al tocarlo.
// 3. Panel (sidebar) que entra desde la derecha con las secciones como
//    botones (scrollspy) y un footer con el sello @Poky + toggle de tema.
// Backdrop y panel viven SIEMPRE montados: la animación de salida es una
// transición CSS sobre clases de estado, sin coreografía de desmontaje.
export default function NavMovil() {
  const [abierto, setAbierto] = useState(false);
  const seccionActiva = useScrollspy(IDS_SECCIONES);
  const refCerrar = useRef<HTMLButtonElement>(null);
  const refHamburguesa = useRef<HTMLButtonElement>(null);
  // Sección elegida en el panel: el scroll se hace en el cleanup del efecto
  // de abajo, DESPUÉS de desbloquear el body (con overflow: hidden el
  // desplazamiento suave quedaría bloqueado).
  const refSeccionPendiente = useRef<string | null>(null);

  // Con el panel abierto: scroll de la página bloqueado (también el
  // arrastre táctil — `overflow: hidden` en el body no lo frena en iOS/
  // Android, así que se fija el body en su posición actual con
  // `position: fixed` y se restaura el scroll al cerrar), cierre con
  // Escape y foco dentro del panel (al cerrar vuelve a la hamburguesa,
  // sin provocar scroll para no interferir con el desplazamiento suave a
  // una sección).
  useEffect(() => {
    if (!abierto) return;

    const hamburguesa = refHamburguesa.current;
    const scrollY = window.scrollY;
    const estiloPrevio = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflowY: document.body.style.overflowY,
    };
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "hidden";
    refCerrar.current?.focus({ preventScroll: true });

    const alPulsarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alPulsarTecla);

    return () => {
      document.body.style.position = estiloPrevio.position;
      document.body.style.top = estiloPrevio.top;
      document.body.style.width = estiloPrevio.width;
      document.body.style.overflowY = estiloPrevio.overflowY;
      // `position: fixed` congela el scroll visual en scrollY pero
      // window.scrollY pasa a 0 mientras dura — hay que restaurarlo antes
      // de que el navegador salte solo al tope al quitar el fixed.
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", alPulsarTecla);
      hamburguesa?.focus({ preventScroll: true });

      if (refSeccionPendiente.current !== null) {
        document
          .getElementById(refSeccionPendiente.current)
          ?.scrollIntoView({ behavior: "smooth" });
        refSeccionPendiente.current = null;
      }
    };
  }, [abierto]);

  const irASeccion = (id: string) => {
    refSeccionPendiente.current = id;
    setAbierto(false);
  };

  return (
    <>
      <div className={styles.barraMovil}>
        <Sociales className={styles.socialesBarra} />
        <span className={styles.separadorBarra} aria-hidden="true" />
        <button
          ref={refHamburguesa}
          type="button"
          className={`${styles.hamburguesa} ${
            abierto ? styles.hamburguesaAbierta : ""
          }`}
          onClick={() => setAbierto(!abierto)}
          aria-label={
            abierto ? "Cerrar menú de secciones" : "Abrir menú de secciones"
          }
          aria-expanded={abierto}
          aria-controls="panel-secciones"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        className={`${styles.fondoPanel} ${
          abierto ? styles.fondoPanelVisible : ""
        }`}
        onClick={() => setAbierto(false)}
        aria-hidden="true"
      />

      <aside
        id="panel-secciones"
        className={`${styles.panelMovil} ${
          abierto ? styles.panelMovilAbierto : ""
        }`}
        aria-label="Menú de secciones"
        inert={!abierto}
      >
        {/* Cabecera: identidad compacta (como el aside) + X de cierre — la
            hamburguesa de la barra queda bajo el velo con el panel abierto */}
        <div className={styles.panelCabecera}>
          <span className={styles.avatarPanel} aria-hidden="true">
            J
          </span>
          <div className={styles.identidadPanel}>
            <p className={styles.nombrePanel}>{IDENTIDAD.nombre}</p>
            <p className={styles.aliasPanel}>{IDENTIDAD.alias}</p>
          </div>
          <button
            ref={refCerrar}
            type="button"
            className={styles.cerrarPanel}
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú de secciones"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.navPanel} aria-label="Secciones del portafolio">
          <ul className={styles.listaPanel}>
            {SECCIONES.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  className={`${styles.botonSeccion} ${
                    seccionActiva === id ? styles.botonSeccionActivo : ""
                  }`}
                  onClick={() => irASeccion(id)}
                >
                  <span className={styles.navMarcador} aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mismo lenguaje que el footer del contenido: sello @Poky inline
            (espejo de tema vía tokens --sello-*) + toggle en variante panel */}
        <div className={styles.panelFooter}>
          <SelloPoky />
          <ThemeToggle variante="panel" />
        </div>
      </aside>
    </>
  );
}
