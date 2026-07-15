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

// Guion fijo del chat demo de la sección Contacto (maqueta de diseño de la
// futura interfaz "Tickets", ver frontend_development.md §6). Solo los
// mensajes del bot van hardcodeados: cada índice se envía en respuesta al
// N-ésimo mensaje del visitante (el índice 0 se envía solo, al montar).
export interface MensajeBotDemo {
  texto: string;
}

export const BOT_DEMO = {
  nombre: "Bot de Pokymon.dev",
  iniciales: "PB",
  estado: "En línea · vista previa",
} as const;

export const GUION_CHAT_DEMO: readonly MensajeBotDemo[] = [
  {
    texto:
      "¡Hola! Soy el bot de Pokymon.dev. Contame en una frase qué necesitás para tu proyecto.",
  },
  {
    texto:
      "Genial, ¿cuál es tu presupuesto estimado y el plazo con el que contás?",
  },
  {
    texto:
      "Con esa información ya podría abrir un ticket priorizado automáticamente. Ese flujo con IA real llega con el sistema de tickets — por ahora esto es una vista previa del diseño. ¡Gracias por probarlo!",
  },
] as const;

export const IDENTIDAD = {
  nombre: "Javier Socha",
  alias: "@Pokymon.dev",
  habilidad: "Ingeniero en Desarrollo de Sistemas Informáticos",
  tagline: "Construyo soluciones inspiradas en ofrecer la mejor experiencia de usuario posible.",
  email: "andressocha.correo@gmail.com",
} as const;

// Ids estables: los consumen las <section> de Landing y el scrollspy del aside.
export const SECCIONES: readonly Seccion[] = [
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "experiencia", label: "Experiencia" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
] as const;

// Referencia estable a nivel de módulo para los dos consumidores del
// scrollspy (Aside en desktop, NavMovil en móvil): si se derivara en cada
// render, el efecto del scrollspy se reinstalaría en cada actualización.
export const IDS_SECCIONES: readonly string[] = SECCIONES.map(
  (seccion) => seccion.id,
);

export const REDES: readonly RedSocial[] = [
  { nombre: "GitHub", url: "https://github.com/PokyDev" },
  { nombre: "LinkedIn", url: "https://www.linkedin.com/in/pokymon-dev" },
  { nombre: "YouTube", url: "https://www.youtube.com/@pokymon-dev" },
  { nombre: "Instagram", url: "https://www.instagram.com/pokymon.dev" },
  // Placeholder: reemplazar por el número real (formato internacional sin "+").
  { nombre: "WhatsApp", url: "https://wa.me/000000000000" },
  { nombre: "npm", url: "https://www.npmjs.com/~pokymon-dev" },
] as const;

export interface EnlaceDestacado {
  /** Debe coincidir EXACTO con la subcadena que aparece dentro de SOBRE_MI */
  texto: string;
  url: string;
}

export const ENLACES_DESTACADOS: readonly EnlaceDestacado[] = [
  { texto: "Coragem", url: "https://coragem.shop" },
  { texto: "Bartolome", url: "https://bartolome.space" },
] as const;

export const SOBRE_MI = [
  "¡Hola! Soy Javier y me gusta solucionar problemas. " +
  "Soy un Ingeniero en Desarrollo de Sistemas Informáticos con interes en " +
  "la creación de soluciones digitales que puedan impulsar negocios, me enfoco en constuir automatizaciones " +
  "que de verdad puedan aportar utilidad real, me siento orgulloso de crear productos solidos, seguros y confiables y  " +
  "disfruto de trabajar con la misma dedicación en el diseño e ingenieria de mis proyectos, combinando excelente UI/UX " +
  "con buena arquitectura, codigo limpio y escalable.",

  "He trabajado en varios entornos desde startups hasta empresas consolidades con complejas necesidades de automatización, " +
  "algunos productos en los que he estado presente desde desarrollo hasta mantenimiento han sido Coragem y Bartolome " +
  "Actualmente trabajo como freelancer dispuesto a asumir nuevos desafios y siempre con ganas de poner en practica mi conocimiento.",

  "En mi tiempo libre disfruto de salir a caminar con mi mascota y disfrutar de la naturaleza, me gusta viajar a lugares tranquilos, " +
  "pasar tiempo de calidad con mi pareja y siempre estoy interesado en aprender como implementar tecnologías modernas."
];

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

// Explicación breve de cada tecnología usada en EXPERIENCIAS/PROYECTOS: el
// visitante del portafolio no siempre sabe qué es "Fastify" o "Prisma". Se
// muestra como tooltip sobre el chip (componente Tecnologia.tsx).
export const DESCRIPCIONES_TECNOLOGIAS: Readonly<Record<string, string>> = {
  "Next.js":
    "Framework de React para construir sitios web rápidos, con buen SEO y renderizado optimizado.",
  React: "Librería de JavaScript para construir interfaces de usuario interactivas.",
  TypeScript:
    "JavaScript con tipado estático: ayuda a prevenir errores antes de que lleguen a producción.",
  "Tailwind CSS":
    "Sistema de estilos que permite diseñar interfaces de forma rápida y consistente.",
  Fastify:
    "Framework de Node.js para el servidor: procesa la lógica de negocio y las peticiones del sitio.",
  "Node.js":
    "Entorno que permite ejecutar JavaScript fuera del navegador, típicamente en el servidor.",
  "Socket.io":
    "Tecnología de comunicación en tiempo real, usada por ejemplo en chats en vivo.",
  PostgreSQL:
    "Base de datos relacional donde se guarda la información de forma segura y organizada.",
  Prisma:
    "Herramienta (ORM) que conecta el código de la aplicación con la base de datos.",
  Nginx:
    "Servidor que enruta el tráfico web y protege los servicios internos del sitio.",
  "Web Components":
    "Estándar web para crear componentes de interfaz reutilizables sin depender de un framework.",
} as const;

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

