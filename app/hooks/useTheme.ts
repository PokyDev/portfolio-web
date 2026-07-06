"use client";

import { useCallback } from "react";

const STORAGE_KEY = "theme";

// No se guarda el tema en un useState: el estado real vive en el DOM (clase
// "dark" en <html>, aplicada por el script inline de layout.tsx antes de
// hidratar). Derivar un useState de eso obligaría a sincronizarlo en un
// efecto, y ese primer render post-hidratación no coincidiría con el HTML
// del servidor (mismatch). Los consumidores que necesiten reaccionar al
// tema deben hacerlo con el selector CSS `dark:` (ya configurado en
// globals.css), no leyendo un valor de React.
export function useTheme() {
  const toggleTheme = useCallback(() => {
    const applyTheme = () => {
      const isDark = document.documentElement.classList.toggle("dark");
      window.localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    };

    // startViewTransition hace un cross-fade nativo (GPU) entre el estado
    // visual anterior y el nuevo, en vez de que cada color salte de golpe.
    // Sin soporte (Firefox), degrada a un cambio instantáneo sin animación.
    if ("startViewTransition" in document) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  }, []);

  return { toggleTheme };
}
