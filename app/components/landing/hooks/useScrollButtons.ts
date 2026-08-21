"use client";

import { useScrollPosition } from "./useScrollPosition";

// Encapsula scroll position + acciones de los botones page-up/page-down.
// Antes vivía inline en ScrollButtons; se extrae para que la variante
// "compacto" (embebida en Sociales) pueda reusar exactamente la misma
// lógica sin reimplementar el matchMedia de reduced-motion ni los
// scrollTo, solo cambia dónde y con qué tamaño se pintan los botones.
export function useScrollButtons() {
  const { posicion } = useScrollPosition();

  const scrollComportamiento = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

  const irArriba = () => {
    window.scrollTo({ top: 0, behavior: scrollComportamiento() });
  };

  const irAbajo = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: scrollComportamiento(),
    });
  };

  return {
    mostrarArriba: posicion === "abajo",
    mostrarAbajo: posicion === "arriba",
    irArriba,
    irAbajo,
  };
}