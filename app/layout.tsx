import type { Metadata } from "next";
import { Inter, Stack_Sans_Text } from "next/font/google";
import Spotlight from "./components/effects/Spotlight";
import "./globals.css";

// Roles tipográficos: Inter para cuerpo/UI y Stack Sans Text para títulos
// (sustituye a Stack Sans Notch: misma familia, más fácil de leer).
// Titan One y Another Shabby no se cargan como webfonts: viven convertidas
// a paths dentro de los futuros SVG de títulos de proyecto.
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const stackSansText = Stack_Sans_Text({
  variable: "--font-heading",
  subsets: ["latin"],
  // Next aún no tiene métricas de esta familia para generar el fallback
  // ajustado automático; se declara explícito para evitar el warning de build.
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Javier — Desarrollador Web full-stack | @Pokymon.dev",
  description:
    "Portafolio de Javier (@Pokymon.dev), desarrollador web full-stack: proyectos con casos de estudio, habilidades técnicas y contacto directo.",
};

// Aplica el tema guardado antes de hidratar, para evitar un flash del tema
// incorrecto (FOUC) mientras React arranca. Se renderiza como <script> plano
// (no next/script): next/script con strategy="beforeInteractive" encola la
// ejecución vía self.__next_s hasta que el runtime de Next carga sus propios
// chunks async, y para entonces el navegador ya pintó con el tema claro por
// defecto. Un <script> nativo, en cambio, corre en cuanto el parser lo
// encuentra — antes de pintar cualquier contenido posterior del body.
const THEME_INIT_SCRIPT = `
  try {
    var theme = window.localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${stackSansText.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <Spotlight />
        {children}
      </body>
    </html>
  );
}
