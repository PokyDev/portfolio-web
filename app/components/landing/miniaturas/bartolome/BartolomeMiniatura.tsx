import styles from "./bartolomeMiniatura.module.css";

// Miniatura minimalista: fondo blanco fijo + wordmark SVG propio
// (public/icons/bartolome/@titulo-bartolome.svg, ya trae sus colores
// finales — gradientes de llama/carbón) centrado, sin ícono adicional.
export default function BartolomeMiniatura() {
  return (
    <div className={styles.miniatura}>
      <div className={styles.contenido}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG local
            estático: next/image no optimiza SVG sin dangerouslyAllowSVG en
            next.config.ts, fuera de alcance para esta miniatura. */}
        <img
          src="/icons/bartolome/@titulo-bartolome.svg"
          alt="Bartolome — Parrilla, chelas y café"
          className={styles.wordmark}
        />
      </div>
    </div>
  );
}
