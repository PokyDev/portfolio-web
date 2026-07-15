"use client";

import { useId } from "react";
import { DESCRIPCIONES_TECNOLOGIAS } from "./data";
import styles from "./landing.module.css";

// Chip de tecnología con tooltip explicativo: el visitante del portafolio no
// siempre sabe qué es "Fastify" o "Prisma". El chip vive dentro de tarjetas
// clickeables (TarjetaProyecto / experienciaTarjeta), así que su click debe
// frenar la propagación para no disparar la navegación de la tarjeta.
export default function Tecnologia({ nombre }: { nombre: string }) {
  const id = useId();
  const descripcion = DESCRIPCIONES_TECNOLOGIAS[nombre];

  return (
    <li className={styles.chipContenedor}>
      <span
        className={styles.chip}
        tabIndex={descripcion ? 0 : undefined}
        aria-describedby={descripcion ? id : undefined}
        onClick={
          descripcion
            ? (evento) => {
                evento.preventDefault();
                evento.stopPropagation();
              }
            : undefined
        }
      >
        {nombre}
      </span>
      {descripcion && (
        <span id={id} role="tooltip" className={styles.chipTooltip}>
          {descripcion}
        </span>
      )}
    </li>
  );
}
