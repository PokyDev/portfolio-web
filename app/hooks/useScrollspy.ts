"use client";

import { useEffect, useState } from "react";

// Scrollspy para la navegación del aside (specs/Design/landing_page.md §3):
// observa las <section id=…> y devuelve el id de la que ocupa la franja
// central del viewport. El rootMargin recorta el viewport a esa franja para
// que solo una sección cuente como "visible" a la vez.
export function useScrollspy(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
