import Image from "next/image";
import { Bagel_Fat_One } from "next/font/google";
import styles from "./coragemMiniatura.module.css";

// Fuente exclusiva de esta miniatura (no es la tipografía del portafolio):
// replica el wordmark real de Coragem, que usa Bagel Fat One vía Google
// Fonts. Bagel Fat One solo existe en peso 400.
const bagelFatOne = Bagel_Fat_One({
  variable: "--font-title-coragem",
  subsets: ["latin"],
  weight: ["400"],
  fallback: ["system-ui", "sans-serif"],
});

// Réplica a escala reducida del imagotipo de Coragem (tema oscuro fijo, no
// sigue el theme claro/oscuro del portafolio): fondo plano #0f1a2a (tema
// oscuro real de la landing de Coragem, ver tokens.css de ese proyecto) +
// ícono con glow teal/pink de marca + wordmark en Bagel Fat One.
export default function CoragemMiniatura() {
  return (
    <div className={`${styles.miniatura} ${bagelFatOne.variable}`}>
      <div className={styles.contenido}>
        <Image
          src="/miniature-icons/coragem_icon.png"
          alt=""
          aria-hidden="true"
          width={368}
          height={591}
          className={styles.icono}
        />
        <p className={styles.wordmark}>
          CORA
          <span className={styles.letraG}>G</span>
          <span className={styles.letraE}>E</span>
          <span className={styles.letraM}>M</span>
          <span className={styles.copyright} aria-hidden="true">©</span>
        </p>
      </div>
    </div>
  );
}
