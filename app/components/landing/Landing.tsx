import Image from "next/image";
import Aside from "./Aside";
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
      <h3 className={styles.proyectoTitulo}>{proyecto.titulo}</h3>
      <p className={styles.parrafo}>{proyecto.descripcion}</p>
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
      <ul className={styles.chips} aria-label="Tecnologías usadas">
        {proyecto.tecnologias.map((tecnologia) => (
          <li key={tecnologia} className={styles.chip}>
            {tecnologia}
          </li>
        ))}
      </ul>
      <span className={styles.proyectoEnlace}>
        {proyecto.etiquetaEnlace} →
      </span>
    </a>
  );
}

export default function Landing() {
  return (
    <div className={styles.layout}>
      <Aside />

      <main className={styles.contenido}>
        <section id="sobre-mi" className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>Sobre mí</h2>
          <p className={`${styles.parrafo} ${styles.parrafoAmplio}`}>
            {SOBRE_MI}
          </p>
        </section>

        <section id="experiencia" className={styles.seccion}>
          <h2 className={styles.tituloSeccion}>Experiencia laboral</h2>
          <ol className={styles.listaLimpia}>
            {EXPERIENCIAS.map((experiencia) => (
              <li
                key={`${experiencia.rol}-${experiencia.empresa}`}
                className={styles.experiencia}
              >
                <p className={styles.periodo}>{experiencia.periodo}</p>
                <div className={styles.experienciaDetalle}>
                  <h3 className={styles.subtitulo}>
                    {experiencia.rol} · {experiencia.empresa}
                  </h3>
                  <p className={styles.parrafo}>{experiencia.descripcion}</p>
                  <ul className={styles.chips} aria-label="Tecnologías usadas">
                    {experiencia.tecnologias.map((tecnologia) => (
                      <li key={tecnologia} className={styles.chip}>
                        {tecnologia}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
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
          {/* Único CTA naranja de la vista (regla "menos es más" de la paleta) */}
          <a href="/cv.pdf" download className={styles.cta}>
            Descargar CV (PDF)
          </a>
        </section>

        <footer className={styles.footer}>
          <Image
            src="/icons/@Poky.svg"
            alt="Sello de @Pokymon.dev"
            width={44}
            height={44}
          />
        </footer>
      </main>
    </div>
  );
}
