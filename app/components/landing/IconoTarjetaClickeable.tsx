import styles from "./landing.module.css";

// Marca visual de "esto es clickeable" junto al título de cada tarjeta:
// una flecha diagonal que se mueve y pasa a accent en el hover de la
// tarjeta, mismo trazo (currentColor) y mismo momento que el título.
// Compartido por TarjetaProyecto y las tarjetas de Experiencia (Landing.tsx).
export default function IconoTarjetaClickeable() {
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
