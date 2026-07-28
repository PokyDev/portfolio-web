import styles from "./bartolomeMiniatura.module.css";
import animacion from "./bartolomeAnimacion.module.css";

// Miniatura minimalista: fondo blanco fijo + panel oficial del cliente
// (public/icons/bartolome/bartolome_panel.png) centrado.
export default function BartolomeMiniatura() {
  return (
    <div className={styles.miniatura}>
      <div className={styles.contenido}>
        {/* eslint-disable-next-line @next/next/no-img-element -- logo local
            estático, no requiere las optimizaciones de next/image aquí. */}
        <img
          src="/icons/bartolome/bartolome_panel.png"
          alt="Bartolome — Parrilla, chelas y café"
          className={`${styles.logo} ${animacion.logo}`}
        />
      </div>
    </div>
  );
}
