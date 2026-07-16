import Image from "next/image";
import Aside from "./Aside";
import ContactoChat from "./ContactoChat";
import NavMovil from "./NavMovil";
import SelloPoky from "./SelloPoky";
import Tecnologia from "./Tecnologia";
import ThemeToggle from "./ThemeToggle";
import {
  ENLACES_DESTACADOS,
  EXPERIENCIAS,
  IDENTIDAD,
  PROYECTOS,
  SOBRE_MI,
  type Proyecto,
} from "./data";
import styles from "./landing.module.css";

// Marca visual de "esto es clickeable" junto al título de cada tarjeta:
// una flecha diagonal que se mueve y pasa a accent en el hover de la
// tarjeta, mismo trazo (currentColor) y mismo momento que el título.
function IconoTarjetaClickeable() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.indicadorEnlace}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

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

function TarjetaProyecto({ proyecto }: { proyecto: Proyecto }) {
  // Toda tarjeta es clickeable: interna (caso de estudio, interfaz 2) o
  // externa (repo/página). Las externas abren en pestaña nueva.
  const externo = proyecto.enlace.startsWith("http");

  return (
    <a
      href={proyecto.enlace}
      className={styles.tarjetaEnlace}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {proyecto.miniatura ? (
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
            <span className={styles.metrica}>⭐ {proyecto.estrellas}</span>
          )}
          {proyecto.descargas !== undefined && (
            <span className={styles.metrica}>
              ⇩ {proyecto.descargas.toLocaleString("es")} descargas
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

export default function Landing() {
  return (
    <div className={styles.layout}>
      <Aside />
      {/* Barra sticky + sidebar de secciones, solo móvil (< 1024px). La barra
          participa del flujo de .layout con `order`, como los bloques del aside */}
      <NavMovil />
      <ThemeToggle />

      <main className={styles.contenido}>
        <section
          id="sobre-mi"
          className={styles.seccion}
          aria-label="Sobre mí"
        >
          <div>
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
              <TarjetaProyecto key={proyecto.slug} proyecto={proyecto} />
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
