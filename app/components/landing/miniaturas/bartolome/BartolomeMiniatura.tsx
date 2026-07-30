import { Dancing_Script, Bebas_Neue } from "next/font/google";
import styles from "./bartolomeMiniatura.module.css";
import animacion from "./bartolomeAnimacion.module.css";

// Imagotipo: ícono llama+B (public/icons/bartolome/bartolome_icono.png,
// recortado del panel original del cliente para eliminar el margen
// transparente) a la izquierda + bloque de texto a la derecha
// ("Bartolome" / separador / "Preply"). Fondo blanco fijo, no sigue el
// theme del portafolio (mismo criterio que las demás miniaturas-componente).
//
// Dos webfonts propias de este imagotipo (no las globales de layout.tsx,
// que son solo Inter/Stack Sans Text): Dancing Script para "Bartolome"
// (cursiva, weight 700 -- la única variante estática de esta familia con
// trazo suficiente para leerse nítido al tamaño de miniatura) y Bebas Neue
// para "Preply" (solo trae weight 400, pero es una display condensada que
// ya se lee "bold" por diseño). Se cargan vía next/font/google igual que
// las fuentes de layout.tsx (mismo mecanismo, con className/variable
// aplicado local a este componente en vez de global).
const dancingScript = Dancing_Script({
  variable: "--font-bartolome-titulo",
  subsets: ["latin"],
  weight: "700",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bartolome-subtitulo",
  subsets: ["latin"],
  weight: "400",
});

// Dos capas superpuestas (.estadoReposo / .estadoHover) en vez de una sola:
// al soltar el hover no tiene sentido "desarmar" la coreografía de tecleo
// en reversa (ícono volviendo a deslizar, texto "borrándose" letra por
// letra) — en cambio, toda la capa de hover se apaga con un fundido de
// opacity rápido mientras la capa de reposo (el ícono solo, centrado)
// reaparece. Ver bartolomeAnimacion.module.css para el fundido y la
// coreografía interna de .estadoHover.
export default function BartolomeMiniatura() {
  return (
    <div className={`${styles.miniatura} ${dancingScript.variable} ${bebasNeue.variable}`}>
      <div className={`${styles.contenido} ${animacion.contenido}`}>
        <div className={`${styles.estadoReposo} ${animacion.estadoReposo}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- logo local
              estático, no requiere las optimizaciones de next/image aquí. */}
          <img
            src="/icons/bartolome/bartolome_icono.png"
            alt="Bartolome — Parrilla, chelas y café"
            className={styles.iconoReposo}
          />
        </div>
        <div className={`${styles.estadoHover} ${animacion.estadoHover}`}>
          <div className={styles.imagotipo}>
            {/* eslint-disable-next-line @next/next/no-img-element -- logo local
                estático, no requiere las optimizaciones de next/image aquí. */}
            <img
              src="/icons/bartolome/bartolome_icono.png"
              alt="Bartolome — Parrilla, chelas y café"
              className={styles.icono}
            />
            <div className={`${styles.textoWrapper} ${animacion.textoWrapper}`}>
              <div className={styles.bloqueTextos}>
                <p className={`${styles.textoPrimario} ${animacion.textoPrimario}`}>
                  <span className={styles.letraB}>B</span>artolome
                </p>
                <div className={`${styles.separador} ${animacion.separador}`} aria-hidden="true">
                  <span className={`${styles.separadorLinea} ${animacion.separadorLinea}`} />
                  <span className={`${styles.separadorX} ${animacion.separadorX}`}>x</span>
                  <span className={`${styles.separadorLinea} ${animacion.separadorLinea}`} />
                </div>
                <p className={`${styles.textoSecundario} ${animacion.textoSecundario}`}>
                  Prepl<span className={styles.letraY}>y</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
