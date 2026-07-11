"use client";

import { useScrollspy } from "../../hooks/useScrollspy";
import { IDENTIDAD, REDES, SECCIONES } from "./data";
import styles from "./landing.module.css";

// Referencia estable a nivel de módulo: si se creara en cada render, el
// efecto del scrollspy se reinstalaría en cada actualización de estado.
const IDS_SECCIONES = SECCIONES.map((seccion) => seccion.id);

// Iconos stroke (estilo Feather) con currentColor: heredan el color del
// enlace y el patrón de hover sin assets externos.
function IconoRed({ nombre }: { nombre: string }) {
  const comun = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (nombre) {
    case "GitHub":
      return (
        <svg {...comun}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 3v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...comun}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v1.57A6 6 0 0 1 16 8z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...comun}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...comun}>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      );
    case "CodePen":
      return (
        <svg {...comun}>
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="22" x2="12" y2="15.5" />
          <polyline points="22 8.5 12 15.5 2 8.5" />
          <polyline points="2 15.5 12 8.5 22 15.5" />
          <line x1="12" y1="2" x2="12" y2="8.5" />
        </svg>
      );
    default:
      return null;
  }
}

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

      <div className={styles.sociales}>
        {REDES.map(({ nombre, url }) => (
          <a
            key={nombre}
            href={url}
            className={styles.social}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nombre}
            title={nombre}
          >
            <IconoRed nombre={nombre} />
          </a>
        ))}
      </div>
    </aside>
  );
}
