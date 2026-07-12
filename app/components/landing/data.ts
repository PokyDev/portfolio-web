// Contenido hardcodeado de la landing — fase de diseño UI/UX
// (specs/Design/landing_page.md §4). Los textos y cifras son datos de
// muestra para validar el diseño; el contenido definitivo llegará después.

export interface Seccion {
  id: string;
  label: string;
}

export interface Proyecto {
  slug: string;
  titulo: string;
  descripcion: string;
  /** Destino de la tarjeta: ruta interna (caso de estudio) o URL externa (repo/página) */
  enlace: string;
  /** Texto del enlace, p. ej. "Ver caso de estudio", "Ver repositorio" */
  etiquetaEnlace: string;
  estrellas?: number;
  descargas?: number;
  /** Miniatura de la tarjeta: captura en /public/photos (opcional) */
  miniatura?: string;
  tecnologias: string[];
}

export interface Experiencia {
  rol: string;
  empresa: string;
  periodo: string;
  descripcion: string;
  /** Destino de la tarjeta clickeable: URL de la empresa/perfil (muestra en esta fase) */
  enlace: string;
  tecnologias: string[];
}

export interface RedSocial {
  nombre: string;
  url: string;
}

export const IDENTIDAD = {
  nombre: "Javier",
  alias: "@Pokymon.dev",
  habilidad: "Desarrollador Web full-stack",
  tagline: "Construyo plataformas web completas, del diseño al despliegue.",
  email: "contacto@pokymon.dev",
} as const;

// Ids estables: los consumen las <section> de Landing y el scrollspy del aside.
export const SECCIONES: readonly Seccion[] = [
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "experiencia", label: "Experiencia" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
] as const;

export const REDES: readonly RedSocial[] = [
  { nombre: "GitHub", url: "https://github.com/PokyDev" },
  { nombre: "LinkedIn", url: "https://www.linkedin.com/in/pokymon-dev" },
  { nombre: "YouTube", url: "https://www.youtube.com/@pokymon-dev" },
  { nombre: "Instagram", url: "https://www.instagram.com/pokymon.dev" },
  // Placeholder: reemplazar por el número real (formato internacional sin "+").
  { nombre: "WhatsApp", url: "https://wa.me/000000000000" },
  { nombre: "npm", url: "https://www.npmjs.com/~pokymon-dev" },
] as const;

export const SOBRE_MI =
  "Soy Javier, desarrollador web full-stack y estudiante de Ingeniería en Sistemas. Me gusta entender el problema antes de escribir la primera línea: hablar con quien lo sufre, acotarlo y resolverlo sin adornos. Trabajo con especificaciones claras, iteraciones cortas y la manía de dejar todo documentado.";

export const EXPERIENCIAS: readonly Experiencia[] = [
  {
    rol: "Desarrollador web freelance",
    empresa: "Independiente",
    periodo: "2024 — presente",
    descripcion:
      "Sitios y sistemas a medida para clientes locales, de la propuesta al despliegue, con gestión directa del cliente: requerimientos, cronograma y entregables.",
    enlace: "https://www.linkedin.com/in/pokymon-dev",
    tecnologias: ["Next.js", "Fastify", "PostgreSQL", "Nginx"],
  },
  {
    rol: "Desarrollador frontend (práctica)",
    empresa: "Estudio de software regional",
    periodo: "2023 — 2024",
    descripcion:
      "Componentes UI reutilizables para un panel administrativo en producción; reduje el tiempo de carga inicial en un 35 % optimizando bundles.",
    enlace: "https://estudio-regional.example.com",
    tecnologias: ["React", "TypeScript", "Tailwind CSS"],
  },
] as const;

export const PROYECTOS: readonly Proyecto[] = [
  {
    slug: "plataforma-portafolio",
    titulo: "Pokymon.dev",
    descripcion:
      "Esta plataforma: sitio público con casos de estudio y tickets de pre-venta, más un portal de cliente con chat en vivo, cronograma y entregables.",
    enlace: "/proyectos/plataforma-portafolio",
    etiquetaEnlace: "Ver caso de estudio",
    estrellas: 24,
    miniatura: "/photos/Portfolio.png",
    tecnologias: ["Next.js", "Fastify", "Socket.io", "PostgreSQL", "Nginx"],
  },
  {
    slug: "gestor-inventario",
    titulo: "StockDex",
    descripcion:
      "Inventario y facturación para un comercio local que llevaba todo en papel: control de stock en tiempo real y cierres de caja automáticos.",
    enlace: "/proyectos/gestor-inventario",
    etiquetaEnlace: "Ver caso de estudio",
    descargas: 1200,
    miniatura: "/photos/CoragemShop.png",
    tecnologias: ["React", "Node.js", "Prisma", "PostgreSQL"],
  },
  {
    slug: "cli-scaffolder",
    titulo: "poky-cli",
    descripcion:
      "CLI que genera proyectos web con la estructura y convenciones que uso en cada encargo.",
    enlace: "https://github.com/PokyDev/poky-cli",
    etiquetaEnlace: "Ver repositorio",
    estrellas: 8,
    miniatura: "/photos/DeployMonitor.png",
    tecnologias: ["Node.js", "TypeScript"],
  },
  {
    slug: "widget-clima",
    titulo: "Clima embebible",
    descripcion:
      "Widget de clima sin dependencias para incrustar en cualquier sitio con una etiqueta script.",
    enlace: "https://codepen.io/pokymon-dev/pen/clima-embebible",
    etiquetaEnlace: "Visitar página",
    tecnologias: ["TypeScript", "Web Components"],
  },
] as const;

