"use client";

import { useState } from "react";

import Aside from "./components/Aside";
import ContactoChat from "./components/ContactoChat";
import IconoTarjetaClickeable from "./components/IconoTarjetaClickeable";
import NavMovil from "./components/NavMovil";
import ScrollButtons from "./components/ScrollButtons";
import SelloPoky from "./components/SelloPoky";
import Tecnologia from "./components/Tecnologia";
import TarjetaProyecto from "./components/TarjetaProyecto";
import ThemeToggle from "@/app/components/shared/theme/ThemeToggle";

import {
  ENLACES_DESTACADOS,
  EXPERIENCIAS,
  IDENTIDAD,
  PROYECTOS,
  SOBRE_MI,
} from "./data";
import styles from "./landing.module.css";

// Resalta los términos de ENLACES_DESTACADOS dentro de un párrafo de SOBRE_MI
// como enlaces externos (target="_blank"), preservando el resto del texto.
function resaltarEnlaces(texto: string) {
  const patron = new RegExp(
    `(${ENLACES_DESTACADOS.map((e) => e.texto).join("|")})`,
  );
  return texto.split(patron).map((fragmento, index) => {
    const enlace = ENLACES_DESTACADOS.find((e) => e.texto === fragmento);
    return enlace ? (
      <a
        key={index}
        href={enlace.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.terminoDestacado}
      >
        {fragmento}
      </a>
    ) : (
      fragmento
    );
  });
}

export default function Landing() {
  // Único reproductor abierto a la vez en toda la landing — el slug del
  // proyecto activo, o null si ninguno está abierto.
  const [proyectoAbierto, setProyectoAbierto] = useState<string | null>(null);

  return (
    <div className={styles.layout}>
      <Aside />
      {/* Barra sticky + sidebar de secciones, solo móvil (< 1024px). La barra
          participa del flujo de .layout con `order`, como los bloques del aside */}
      <NavMovil />
      <ThemeToggle />
      <ScrollButtons />

      <main className={styles.contenido}>
        <section
          id="sobre-mi"
          className={styles.seccion}
          aria-label="Sobre mí"
        >
          <div className={styles.sobreMi}>
            {SOBRE_MI.map((parrafo, index) => (
              <p
                key={index}
                className={`${styles.parrafo} ${styles.parrafoAmplio}`}
              >
                {resaltarEnlaces(parrafo)}
              </p>
            ))}
          </div>
        </section>

        <section
          id="experiencia"
          className={styles.seccion}
          aria-label="Experiencia laboral"
        >
          <ol className={`${styles.listaLimpia} ${styles.listaExperiencias}`}>
            {EXPERIENCIAS.map((experiencia) => {
              // Mismo criterio que TarjetaProyecto: destinos externos en pestaña nueva.
              const externo = experiencia.enlace.startsWith("http");

              return (
                <li
                  key={`${experiencia.rol}-${experiencia.empresa}`}
                  className={styles.experiencia}
                >
                  <a
                    href={experiencia.enlace}
                    className={styles.experienciaTarjeta}
                    {...(externo && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    <p className={styles.periodo}>{experiencia.periodo}</p>
                    <div className={styles.experienciaDetalle}>
                      <h3 className={styles.subtitulo}>
                        <span className={styles.experienciaRol}>
                          {experiencia.rol}
                        </span>
                        <span className={styles.experienciaEmpresaGrupo}>
                          <span className={styles.experienciaEmpresa}>
                            {experiencia.empresa}
                          </span>
                          <IconoTarjetaClickeable />
                        </span>
                      </h3>
                      <p className={styles.parrafo}>{experiencia.descripcion}</p>
                      <span
                        className={styles.etiquetaTecnologias}
                        aria-hidden="true"
                      >
                        Tecnologías
                      </span>
                      <ul
                        className={styles.chips}
                        aria-label="Tecnologías usadas"
                      >
                        {experiencia.tecnologias.map((tecnologia) => (
                          <Tecnologia key={tecnologia} nombre={tecnologia} />
                        ))}
                      </ul>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        <section
          id="proyectos"
          className={styles.seccion}
          aria-label="Proyectos"
        >
          <div className={styles.proyectos}>
            {PROYECTOS.map((proyecto) => (
              <TarjetaProyecto
                key={proyecto.slug}
                proyecto={proyecto}
                abierto={proyectoAbierto === proyecto.slug}
                onAbrir={() => setProyectoAbierto(proyecto.slug)}
                onCerrar={() => setProyectoAbierto(null)}
              />
            ))}
          </div>
        </section>

        <section id="contacto" className={styles.seccion} aria-label="Contacto">
          <div className={styles.contactoGrid}>
            <div className={`${styles.contactoTexto} ${styles.seccionCentrada}`}>
              <p className={styles.parrafo}>
                ¿Un proyecto en mente? Escríbeme a{" "}
                <a
                  href={`mailto:${IDENTIDAD.email}`}
                  className={styles.enlace}
                >
                  {IDENTIDAD.email}
                </a>{" "}
                o revisa mi trayectoria completa.
              </p>
              {/* Único CTA de la vista — dupla lavender/indigo invertida por tema */}
              <a href="/cv.pdf" download className={styles.cta}>
                Descargar CV (PDF)
              </a>
            </div>

            {/* Vista previa del futuro sistema de tickets con IA (interfaz 3,
                pendiente): guion fijo en el cliente, sin fetch ni sockets.
                Oculto tras un placeholder hasta que se activa. */}
            <ContactoChat />
          </div>
        </section>

        <footer className={styles.footer}>
          <SelloPoky />
        </footer>
      </main>
    </div>
  );
}
