import styles from "./bartolomeMiniatura.module.css";

// Miniatura simplificada. 

export default function BartolomeMiniatura() {
  return (
    <div className={`${styles.miniatura}`}>
      <div className={`${styles.contenido}`}>
        <div className={`${styles.estadoReposo}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- logo local
            estático, no requiere las optimizaciones de next/image aquí. */}
          <img
            src="/icons/bartolome/bartolome_icono.png"
            alt="Bartolome — Parrilla, chelas y café"
            className={styles.iconoReposo}
          />
        </div>
      </div>
    </div>
  );
}
