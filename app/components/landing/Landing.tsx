import Image from "next/image";
import Aside from "./Aside";
import SelloPoky from "./SelloPoky";
import ThemeToggle from "./ThemeToggle";
import {
  EXPERIENCIAS,
  IDENTIDAD,
  PROYECTOS,
  SOBRE_MI,
  type Proyecto,
} from "./data";
import styles from "./landing.module.css";

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
        <h3 className={styles.proyectoTitulo}>{proyecto.titulo}</h3>
        <p className={styles.parrafo}>{proyecto.descripcion}</p>
        <ul className={styles.chips} aria-label="Tecnologías usadas">
          {proyecto.tecnologias.map((tecnologia) => (
            <li key={tecnologia} className={styles.chip}>
              {tecnologia}
            </li>
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
      <ThemeToggle />

      <main className={styles.contenido}>
        <section id="sobre-mi" className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>Sobre mí</h2>
          <p className={`${styles.parrafo} ${styles.parrafoAmplio}`}>
            {SOBRE_MI}
          </p>
        </section>

        <section id="experiencia" className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>Experiencia laboral</h2>
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
                        {experiencia.rol} · {experiencia.empresa}
                      </h3>
                      <p className={styles.parrafo}>{experiencia.descripcion}</p>
                      <ul
                        className={styles.chips}
                        aria-label="Tecnologías usadas"
                      >
                        {experiencia.tecnologias.map((tecnologia) => (
                          <li key={tecnologia} className={styles.chip}>
                            {tecnologia}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        <section id="proyectos" className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>Proyectos</h2>
          <div className={styles.proyectos}>
            {PROYECTOS.map((proyecto) => (
              <TarjetaProyecto key={proyecto.slug} proyecto={proyecto} />
            ))}
          </div>
        </section>

        <section
          id="contacto"
          className={`${styles.seccion} ${styles.seccionCentrada}`}
        >
          <h2 className={styles.tituloSeccion}>Contacto</h2>
          <p className={styles.parrafo}>
            ¿Un proyecto en mente? Escríbeme a{" "}
            <a href={`mailto:${IDENTIDAD.email}`} className={styles.enlace}>
              {IDENTIDAD.email}
            </a>{" "}
            o revisa mi trayectoria completa.
          </p>
          {/* Único CTA de la vista — dupla lavender/indigo invertida por tema */}
          <a href="/cv.pdf" download className={styles.cta}>
            Descargar CV (PDF)
          </a>
        </section>

        <footer className={styles.footer}>
          <SelloPoky />
        </footer>
      </main>
    </div>
  );
}
