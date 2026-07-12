"use client";

import { useScrollspy } from "../../hooks/useScrollspy";
import { IDENTIDAD, IDS_SECCIONES, SECCIONES } from "./data";
import Sociales from "./Sociales";
import styles from "./landing.module.css";

export default function Aside() {
  const seccionActiva = useScrollspy(IDS_SECCIONES);

  return (
    <aside className={styles.aside}>
      <div className={styles.identidad}>
        <span className={styles.avatar} aria-hidden="true">
          J
        </span>
        {/* h1 único de la página: al no existir ya la sección de perfil,
            la identidad del aside asume el heading principal. */}
        <h1 className={styles.nombre}>{IDENTIDAD.nombre}</h1>
        <p className={styles.alias}>{IDENTIDAD.alias}</p>
        <p className={styles.habilidad}>{IDENTIDAD.habilidad}</p>
        <p className={styles.tagline}>{IDENTIDAD.tagline}</p>
      </div>

      <nav className={styles.nav} aria-label="Secciones del portafolio">
        <ul className={styles.navLista}>
          {SECCIONES.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`${styles.navLink} ${
                  seccionActiva === id ? styles.navLinkActivo : ""
                }`}
              >
                <span className={styles.navMarcador} aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Sociales className={styles.sociales} />
    </aside>
  );
}
