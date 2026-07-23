import Image from "next/image";
import { Stack_Sans_Notch } from "next/font/google";
import styles from "./deployMonitorMiniatura.module.css";
import animacion from "./deployMonitorAnimacion.module.css";

// Fuente exclusiva de esta miniatura: reintroduce Stack Sans Notch (el
// portafolio usa Stack Sans Text a nivel global, ver layout.tsx) porque el
// objetivo aquí es replicar la marca exacta de la landing de DeployMonitor,
// no la tipografía del portafolio. Next no tiene métricas de esta familia
// para el fallback automático — mismo gotcha que Stack Sans Text.
const stackSansNotch = Stack_Sans_Notch({
  variable: "--font-title-dm",
  subsets: ["latin"],
  weight: ["700"],
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

// Réplica a escala reducida de la landing de DeployMonitor (tema oscuro fijo,
// no sigue el theme claro/oscuro del portafolio): fondo + malla técnica,
// mascota con glow dorado estático y wordmark en Stack Sans Notch.
export default function DeployMonitorMiniatura() {
  return (
    <div className={`${styles.miniatura} ${stackSansNotch.variable}`}>
      <div className={`${styles.malla} ${animacion.malla}`} aria-hidden="true" />
      <div className={`${styles.contenido} ${animacion.contenido}`}>
        <Image
          src="/miniature-icons/ssh-manager-icon-128x128.png"
          alt=""
          aria-hidden="true"
          width={128}
          height={128}
          className={`${styles.icono} ${animacion.icono}`}
        />
        <p className={styles.wordmark}>
          Deploy<span className={styles.wordmarkAccent}>Monitor</span>
        </p>
      </div>
    </div>
  );
}
