"use client";

import { useEffect, useState } from "react";

const UMBRAL_BORDE_PX = 24;

export type PosicionScroll = "arriba" | "abajo" | "medio";

// Posición de scroll para ScrollButtons: tres estados sin solape — "arriba"
// (ofrece bajar), "abajo" (ofrece subir) y "medio" (ningún botón, para no
// mostrar una acción que no aplica). rAF throttlea el listener de scroll
// para no recalcular en cada evento.
export function useScrollPosition(): { posicion: PosicionScroll } {
  const [posicion, setPosicion] = useState<PosicionScroll>("arriba");

  useEffect(() => {
    let frameId: number | null = null;

    const medir = () => {
      frameId = null;
      const { scrollY, innerHeight } = window;
      const alturaTotal = document.documentElement.scrollHeight;

      if (scrollY <= UMBRAL_BORDE_PX) {
        setPosicion("arriba");
      } else if (scrollY + innerHeight >= alturaTotal - UMBRAL_BORDE_PX) {
        setPosicion("abajo");
      } else {
        setPosicion("medio");
      }
    };

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return { posicion };
}
