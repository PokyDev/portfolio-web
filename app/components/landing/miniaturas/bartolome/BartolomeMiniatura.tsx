import styles from "./bartolomeMiniatura.module.css";

// Miniatura simplificada. 

export default function BartolomeMiniatura() {
  return (
    <div className={`${styles.miniatura}`}>
      <div className={`${styles.contenido}`}>
        <div className={`${styles.estadoReposo}`}>
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
