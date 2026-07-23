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
  /** Usuarios activos por mes; hoy hardcodeado, más adelante vía fetch a métricas reales */
  usuariosMensuales?: number;
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

  "He trabajado en varios entornos desde startups hasta empresas consolidadas con complejas necesidades de automatización, " +
  "algunos productos en los que he estado presente desde desarrollo hasta mantenimiento han sido Coragem y Bartolome " +
  "Actualmente trabajo como freelancer dispuesto a asumir nuevos desafios y siempre con ganas de poner en practica mi conocimiento.",

  "En mi tiempo libre disfruto de salir a caminar con mi mascota y disfrutar de la naturaleza, me gusta viajar a lugares tranquilos, " +
  "pasar tiempo de calidad con mi pareja y siempre estoy interesado en aprender como implementar tecnologías modernas."
];

export const EXPERIENCIAS: readonly Experiencia[] = [
  {
    rol: "Desarrollador Full Stack",
    empresa: "Bartolome Parrila",
    periodo: "2024 — 2025",
    descripcion:
      "Diseño y desarrollo de una plataforma tipo SaaS para la gestión operativa de un restaurante, donde se centralizan procesos " +
      "principales como: gestión de comandas, control de inventario, definición de horarios y liquidación de turnadores.",
    enlace: "https://bartolome.space/",
    tecnologias: ["Ember.js", "Fastify", "PostgreSQL", "Apache", "Socket.io"],
  },
  {
    rol: "Ingeniero de Software",
    empresa: "Coragem Bisuteria",
    periodo: "2025 — 2026",
    descripcion:
      "Desarrollo de una aplicación web responsiva para gestionar catalogo e inventario de una tienda de bisuteria, con galeria propia que soporta " +
      "formatos modernos optimizados como HEIC/HEIF y WebP a través del consumo de la API de Cloudinary.",
    enlace: "https://coragem.shop/",
    tecnologias: ["Next.js", "TypeScript", "Fastify", "Cloudinary", "PostgreSQL", "Prisma", "Nginx", "Neon", "Vercel", "Cloudflare", "AWS"],
  },
] as const;

// Explicación breve de cada tecnología usada en EXPERIENCIAS/PROYECTOS: el
// visitante del portafolio no siempre sabe qué es "Fastify" o "Prisma". Se
// muestra como tooltip sobre el chip (componente Tecnologia.tsx).
export const DESCRIPCIONES_TECNOLOGIAS: Readonly<Record<string, string>> = {
  "Next.js":
    "Framework de React para construir sitios web rápidos, con buen SEO y renderizado optimizado.",
  React: "Librería de JavaScript para construir interfaces de usuario interactivas.",
  "React.js": "Librería de JavaScript para construir interfaces de usuario interactivas.",
  TauriV2:
    "Framework para construir aplicaciones de escritorio ligeras con un frontend web y un núcleo en Rust, en vez de empaquetar un navegador completo.",
  Rust:
    "Lenguaje de programación de bajo nivel enfocado en rendimiento y seguridad de memoria, usado aquí para el núcleo de la aplicación de escritorio.",
  "Xterm.js":
    "Librería que renderiza una terminal interactiva completa dentro de una interfaz web, usada por ejemplo para exponer una consola SSH en vivo.",
  "Ember.js":
    "Framework de JavaScript para aplicaciones web ambiciosas, con convenciones y estructura definidas desde el inicio.",
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
  Apache:
    "Servidor web muy usado en internet; en proyectos de desarrollo suele emplearse como proxy inverso, de forma similar a Nginx.",
  Cloudinary:
    "Servicio en la nube para alojar, optimizar y transformar imágenes y videos automáticamente.",
  "Web Components":
    "Estándar web para crear componentes de interfaz reutilizables sin depender de un framework.",
  Neon:
    "Servicio de base de datos PostgreSQL en la nube (con capa gratuita) que escala automáticamente sin necesidad de administrar un servidor propio.",
  Vercel:
    "Plataforma en la nube para desplegar sitios web, con builds automáticos e infraestructura distribuida globalmente.",
  Cloudflare:
    "Red global que acelera la entrega del sitio y lo protege de ataques, además de gestionar el DNS del dominio.",
  AWS:
    "Amazon Web Services: conjunto de servicios de computación en la nube usados para alojar y escalar aplicaciones.",
  "AWS EC2":
    "Servicio de Amazon Web Services que provee servidores virtuales en la nube para alojar aplicaciones.",
  "Oracle Cloud":
    "Plataforma de computación en la nube de Oracle, usada para alojar servidores y servicios backend.",
} as const;

export const PROYECTOS: readonly Proyecto[] = [
  {
    slug: "deploy-monitor",
    titulo: "DeployMonitor",
    descripcion:
      "Aplicación de escritorio para monitoreo de instancias a través de conexion SSH con claves privadas .pem, " +
      "cuenta con una terminal interactiva propia, permite conexión y monitoreo, ademas de contar con un gestor de scripts " +
      "para crear, modificar y ejecutar archivos sobre las instancias, se creo para facilitar la ejecución y monitoreo desde un entorno local" +
      ".",
    enlace: "https://github.com/PokyDev/DeployMonitor",
    etiquetaEnlace: "Revisar proyecto",
    estrellas: 1,
    miniatura: "/photos/deploy-monitor.png",
    tecnologias: ["TauriV2", "React.js", "TypeScript", "Rust", "Xterm.js"],
  },
  {
    slug: "coragem-bisuteria",
    titulo: "Coragem | Sitio Oficial",
    descripcion:
      "Aplicación web responsiva para gestionar el catalogo de la tienda, permite busqueda filtrada por categorias y directamente por nombre de producto, " +
      "tiene funciones de administrador para gestión profunda con galeria interna que soporta formatos modernos HEIC/HEIF. Ademas, cuenta con un sistema para gestión " +
      "de inventario. Fue una solución directa a la falta de un catalogo web que permitiera mostrar los productos de forma profesional e intuitiva.",
    enlace: "https://coragem.shop/",
    etiquetaEnlace: "Revisar proyecto",
    usuariosMensuales: 680,
    miniatura: "/photos/CoragemShop.png",
    tecnologias: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "Neon", "Cloudinary", "AWS EC2", "Nginx", "Vercel", "Cloudflare"],
  },
  {
    slug: "pokydev-portfolio",
    titulo: "Portafolio Web | @Pokymon.dev",
    descripcion:
      "Portafolio web personal para exponer y gestionar proyectos, ademas dispone un panel CRM interno donde se pueden visualizar entregables, " +
      "cronograma, historias de usuario, contratos, licencias y persiste un agente accesible a través de chat conectado a un sistemas de tickets que " +
      "le permiten al usuario contactarse con el desarrollador para iniciar proyectos.",
    enlace: "https://github.com/PokyDev/portfolio-web",
    etiquetaEnlace: "Revisar Proyecto",
    estrellas: 1,
    miniatura: "/photos/pokydev-portfolio.png",
    tecnologias: ["Next.js", "Node.js", "TypeScript", "Neon", "PostgreSQL", "Vercel", "Oracle Cloud", "Nginx"],
  },
  {
    slug: "bartolome-parrilla",
    titulo: "Bartolome Parrila Site",
    descripcion:
      "Sitio oficial del restaurante Bartolome Parrilla, es una aplicación web de tipo SaaS, permite navegar a través de una interfaz para gestionar: " +
      "comandas, inventario y liquidación de turnadores cada fin de semana, tiene un sistema automatizado que filtra comandas para separarlas en pedidos para cocina y pedidos " +
      "para parrilla, el sistema esta pulido para mantener el inventario ordenado y evitar descuadre con la materia prima.",
    enlace: "https://github.com/PokyDev",
    etiquetaEnlace: "Revisar Proyecto",
    tecnologias: ["Ember.js", "Javascript", "Node.js", "Fastify", "Typescript", "Apache", "Socket.io"],
  },
] as const;

