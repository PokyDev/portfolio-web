import Image from "next/image";
import { Noto_Serif } from "next/font/google";
import styles from "./coragemMiniatura.module.css";
import CoragemHojas from "./coragemHojas";

// Fuente exclusiva de esta miniatura (no es la tipografía del portafolio):
// el cliente pidió reemplazar la fuente decorativa anterior (Bagel Fat One)
// por Noto Serif, que es la que usa su marca real. Peso 600: se acerca al
// grosor del wordmark serif de la referencia sin llegar a bold pleno.
const notoSerif = Noto_Serif({
  variable: "--font-title-coragem",
  subsets: ["latin"],
  weight: ["600"],
  fallback: ["Georgia", "serif"],
});

// Réplica a escala reducida del imagotipo de Coragem (tema oscuro fijo, no
// sigue el theme claro/oscuro del portafolio): fondo plano #0f1a2a (tema
// oscuro real de la landing de Coragem) + ícono con glow teal/pink de marca,
// apilado con el wordmark en dos líneas (nombre + "ACCESSORIES"), igual a
// la composición del logo real (ver public/miniature-icons/references).
//
// El diseño base se mantiene siempre visible sin depender del hover (mismo
// principio que DeployMonitor). El hover solo complementa el fondo con
// CoragemHojas — ver ese archivo y coragemAnimacion.module.css.
export default function CoragemMiniatura() {
  return (
    <div className={`${styles.miniatura} ${notoSerif.variable}`}>
      <CoragemHojas />
      <div className={styles.contenido}>
        <Image
          src="/miniature-icons/coragem_icon.png"
          alt=""
          aria-hidden="true"
          width={368}
          height={591}
          className={styles.icono}
        />
        <p className={styles.nombre}>Coragem</p>
        <p className={styles.subtitulo}>ACCESSORIES</p>
      </div>
    </div>
  );
}
