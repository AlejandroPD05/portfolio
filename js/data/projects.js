/**
 * Every public project, in one place.
 *
 * `tier: 'featured'` renders a full technical card (used by the projects grid);
 * `tier: 'archive'` renders a compact row in the "more projects" list.
 *
 * To add a project: copy an entry, point `repo` at the GitHub repository name
 * and fill in the copy. To hide one without deleting it, set `hidden: true`.
 *
 * Sources of truth for the metadata: github.com/AlejandroPD05 repositories and
 * their live GitHub Pages / Vercel deployments.
 */

import { localized } from '../i18n/i18n.js';

export const GITHUB_USER = 'AlejandroPD05';
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;

const repoUrl = (name) => `https://github.com/${GITHUB_USER}/${name}`;
const pagesUrl = (name) => `https://${GITHUB_USER.toLowerCase()}.github.io/${name}/`;

/**
 * Filter categories. `order` drives the chip order in the filter bar.
 */
export const categories = [
  { id: 'frontend', labelKey: 'catFrontend', order: 1 },
  { id: 'backend', labelKey: 'catBackend', order: 2 },
  { id: 'api', labelKey: 'catApi', order: 3 },
  { id: 'game', labelKey: 'catGame', order: 4 },
  { id: 'creative', labelKey: 'catCreative', order: 5 },
  { id: 'tool', labelKey: 'catTool', order: 6 },
];

export const projects = [
  /* --------------------------------------------------------------------- */
  /* Featured                                                              */
  /* --------------------------------------------------------------------- */
  {
    id: 'ticketing',
    ticket: '004',
    tier: 'featured',
    year: 2026,
    language: 'SQL · Java',
    categories: ['backend'],
    repo: repoUrl('ticketing'),
    demo: pagesUrl('ticketing'),
    demoLabelKey: 'linkSchema',
    title: { es: 'Simulador de Ticketing', en: 'Ticketing simulator' },
    kicker: { es: 'Helpdesk · modelo de datos', en: 'Helpdesk · data model' },
    summary: {
      es: 'Réplica funcional de un sistema de helpdesk: usuarios con rol de empleado o técnico, categorías de incidencia, tickets con prioridad y estado, e hilos de comentarios por ticket.',
      en: 'A working replica of a helpdesk system: users with an employee or technician role, incident categories, tickets with priority and status, and comment threads per ticket.',
    },
    highlights: {
      es: [
        'Esquema relacional completo: usuarios, roles, categorías, prioridades, estados y comentarios',
        'Ciclo de vida del ticket trazable de principio a fin, con historial de cambios',
        'Diseñado para escalar a una aplicación Java con JDBC y capa de servicios',
      ],
      en: [
        'Complete relational schema: users, roles, categories, priorities, statuses and comments',
        'Ticket lifecycle traceable end to end, with a change history',
        'Designed to scale into a Java application with JDBC and a service layer',
      ],
    },
    stack: ['SQL', 'Java', 'Modelo relacional', 'Diagrama entidad-relación', 'Helpdesk'],
  },
  {
    id: 'gamestash',
    ticket: '006',
    tier: 'featured',
    year: 2026,
    language: 'JavaScript',
    categories: ['api', 'frontend'],
    repo: repoUrl('GameStash'),
    demo: 'https://gamestash.vercel.app/',
    title: { es: 'GameStash — Hub de videojuegos', en: 'GameStash — game hub' },
    kicker: { es: 'SPA · consumo de API REST', en: 'SPA · REST API consumer' },
    summary: {
      es: 'Aplicación de una sola página para explorar videojuegos consumiendo la API de RAWG, con buscador en tiempo real, filtros, paginación y enrutado dinámico escrito a mano.',
      en: 'A single page application for exploring video games through the RAWG API, with live search, filters, pagination and hand-written dynamic routing.',
    },
    highlights: {
      es: [
        'Buscador en tiempo real, filtros por género y paginación sobre la API de RAWG',
        'Enrutado dinámico propio, sin frameworks: vistas por hash y estado en la URL',
        'API key protegida con variables de entorno de Vite en lugar de escribirla en el código',
      ],
      en: [
        'Live search, genre filters and pagination over the RAWG API',
        'Hand-written dynamic routing with no framework: hash views and state in the URL',
        'API key protected through Vite environment variables instead of being hard-coded',
      ],
    },
    stack: ['JavaScript ES6+', 'Vite', 'RAWG REST API', 'SPA Router', 'fetch / async-await'],
  },
  {
    id: 'cinematch',
    ticket: '007',
    tier: 'featured',
    year: 2026,
    language: 'JavaScript',
    categories: ['api', 'frontend'],
    repo: repoUrl('cinematch'),
    demo: 'https://cinematch-lemon.vercel.app/',
    title: { es: 'Cinematch — registro de películas', en: 'Cinematch — film tracker' },
    kicker: { es: 'React · Google Sheets como base de datos', en: 'React · Google Sheets as a database' },
    summary: {
      es: 'Aplicación con estética de plataforma de streaming para llevar el registro de las películas vistas en pareja. Los datos se leen de una hoja de Google Sheets que actúa como base de datos ligera y editable.',
      en: 'An app with a streaming-platform look that keeps track of the films watched as a couple. The data is read from a Google Sheets spreadsheet that acts as a lightweight, editable database.',
    },
    highlights: {
      es: [
        'Google Sheets como backend: los datos se editan sin tocar código ni volver a desplegar',
        'Interfaz construida con componentes React y Tailwind CSS',
        'Build de Vite desplegado en Vercel con actualización continua',
      ],
      en: [
        'Google Sheets as the backend: data is edited without touching code or redeploying',
        'Interface built with React components and Tailwind CSS',
        'Vite build deployed on Vercel with continuous deployment',
      ],
    },
    stack: ['React', 'Vite', 'Tailwind CSS', 'Google Sheets', 'Vercel'],
  },
  {
    id: 'huapi',
    ticket: '002',
    tier: 'featured',
    year: 2026,
    language: 'HTML · CSS',
    categories: ['frontend'],
    repo: repoUrl('huapi'),
    demo: pagesUrl('huapi'),
    title: { es: 'Carta Digital — Huapi', en: 'Digital menu — Huapi' },
    kicker: { es: 'Frontend · mobile first', en: 'Frontend · mobile first' },
    summary: {
      es: 'Menú digital responsivo para un negocio de comida local, con navegación por categorías y una interfaz pensada primero para móvil.',
      en: 'A responsive digital menu for a local food business, with category navigation and a mobile-first interface.',
    },
    highlights: {
      es: [
        'Navegación por categorías sin recargar la página',
        'Maquetación mobile first: se usa desde el móvil, en la mesa del local',
        'Cero dependencias: HTML, CSS y JavaScript sin frameworks',
      ],
      en: [
        'Category navigation without reloading the page',
        'Mobile-first layout: it is used from a phone, at the table',
        'Zero dependencies: HTML, CSS and JavaScript with no frameworks',
      ],
    },
    stack: ['HTML', 'CSS', 'JavaScript', 'Mobile first', 'Diseño responsivo'],
  },
  {
    id: 'asteroides',
    ticket: '001',
    tier: 'featured',
    year: 2026,
    language: 'HTML · Canvas',
    categories: ['game'],
    repo: repoUrl('JuegoNaves'),
    demo: pagesUrl('JuegoNaves'),
    title: { es: 'Juego de asteroides', en: 'Asteroids game' },
    kicker: { es: 'Canvas · bucle de juego', en: 'Canvas · game loop' },
    summary: {
      es: 'Clon del clásico arcade construido en Canvas y JavaScript puro: física de movimiento, colisiones, disparo y oleadas de dificultad creciente.',
      en: 'A clone of the classic arcade game built with Canvas and vanilla JavaScript: movement physics, collisions, shooting and increasingly difficult waves.',
    },
    highlights: {
      es: [
        'Bucle de juego con requestAnimationFrame, delta time y física vectorial',
        'Detección de colisiones y sistema de disparo sin librerías externas',
        'Oleadas que aumentan la dificultad y el marcador como estado del juego',
      ],
      en: [
        'Game loop with requestAnimationFrame, delta time and vector physics',
        'Collision detection and a shooting system with no external libraries',
        'Waves that ramp up difficulty, with the score as game state',
      ],
    },
    stack: ['Canvas API', 'JavaScript', 'requestAnimationFrame', 'Colisiones', 'Manejo de input'],
  },
  {
    id: 'web-animada',
    ticket: '003',
    tier: 'featured',
    year: 2026,
    language: 'CSS',
    categories: ['creative', 'frontend'],
    repo: repoUrl('web-animada'),
    demo: pagesUrl('web-animada'),
    title: { es: 'Web animada', en: 'Animated web page' },
    kicker: { es: 'CSS · animación al hacer scroll', en: 'CSS · scroll animation' },
    summary: {
      es: 'Landing page construida como línea de tiempo, con animaciones CSS encadenadas y revelado de contenido al hacer scroll.',
      en: 'A landing page built as a timeline, with chained CSS animations and scroll-triggered content reveals.',
    },
    highlights: {
      es: [
        'Secuencias de animación CSS encadenadas con delays y easing propios',
        'IntersectionObserver para revelar el contenido justo cuando entra en pantalla',
        'Estructura narrativa por etapas en lugar de secciones sueltas',
      ],
      en: [
        'Chained CSS animation sequences with custom delays and easing',
        'IntersectionObserver to reveal content exactly when it enters the viewport',
        'A staged narrative structure instead of unrelated sections',
      ],
    },
    stack: ['CSS Keyframes', 'IntersectionObserver', 'Diseño responsivo', 'Storytelling visual'],
  },
  {
    id: 'temaui',
    ticket: '005',
    tier: 'featured',
    year: 2026,
    language: 'CSS',
    categories: ['frontend', 'creative'],
    repo: repoUrl('temaUI'),
    demo: pagesUrl('temaUI'),
    title: { es: 'Script de UI — StreamBox', en: 'UI theme script — StreamBox' },
    kicker: { es: 'Theming en runtime · inyección CSS', en: 'Runtime theming · CSS injection' },
    summary: {
      es: 'Interfaz de un reproductor de vídeo a la que un script inyecta un tema visual completo en verde oscuro y negro, sin tocar el HTML base.',
      en: 'A video player interface where a script injects a complete dark green and black theme, without touching the original HTML.',
    },
    highlights: {
      es: [
        'Un script inyecta el tema completo en runtime, sin editar el marcado original',
        'Variables CSS y selectores reescritos para no depender de la hoja de estilos previa',
        'Reproductor de vídeo real como caso de uso del reestilizado',
      ],
      en: [
        'A script injects the whole theme at runtime, without editing the original markup',
        'CSS variables and rewritten selectors so it does not depend on the previous stylesheet',
        'A real video player as the use case for the restyle',
      ],
    },
    stack: ['CSS Injection', 'DOM', 'Variables CSS', 'Theming'],
  },

  /* --------------------------------------------------------------------- */
  /* Archive — creative pieces, games and tools, all with public code.     */
  /*                                                                        */
  /* Only TekBowFix is published in this section right now: the entries     */
  /* below are kept with `hidden: true` so the copy is not lost — delete    */
  /* that single line to bring one back.                                    */
  /* --------------------------------------------------------------------- */
  {
    id: 'huapi-web',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'CSS',
    categories: ['frontend'],
    repo: repoUrl('huapi-web'),
    demo: pagesUrl('huapi-web'),
    name: { es: 'Carta Digital Huapi (versión MIT)', en: 'Huapi digital menu (MIT release)' },
    tag: {
      es: 'Versión anterior del menú, publicada con licencia MIT',
      en: 'Earlier menu release, published under the MIT licence',
    },
  },
  {
    id: 'ramo-3d',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'JavaScript',
    categories: ['creative'],
    repo: repoUrl('3d'),
    demo: pagesUrl('3d'),
    name: { es: 'Ramo 3D', en: '3D bouquet' },
    tag: { es: 'Escena 3D interactiva en el navegador', en: 'Interactive 3D scene in the browser' },
  },
  {
    id: 'baraja',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML · CSS',
    categories: ['creative'],
    repo: repoUrl('Baraja_Cartas_ADMV'),
    demo: pagesUrl('Baraja_Cartas_ADMV'),
    name: { es: 'Baraja de cartas interactiva', en: 'Interactive card deck' },
    tag: { es: 'Edición especial con volteo de cartas', en: 'Special edition with card flipping' },
  },
  {
    id: 'plataformas',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML · Canvas',
    categories: ['game', 'creative'],
    repo: repoUrl('JuegoPlataformas'),
    demo: pagesUrl('JuegoPlataformas'),
    name: { es: 'Juego de plataformas', en: 'Platformer game' },
    tag: {
      es: 'Movimiento lateral, salto y colisiones',
      en: 'Side-scrolling movement, jumping and collisions',
    },
  },
  {
    id: 'mapa-estelar',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML',
    categories: ['creative', 'frontend'],
    repo: repoUrl('MapaEstelar'),
    demo: pagesUrl('MapaEstelar'),
    name: { es: 'Mapa estelar', en: 'Star map' },
    tag: { es: 'Cielo nocturno con astronomía real', en: 'Night sky with real astronomy' },
  },
  {
    id: 'mesario',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'JavaScript',
    categories: ['creative'],
    repo: repoUrl('Mesario6'),
    demo: pagesUrl('Mesario6'),
    name: { es: 'Página personal interactiva', en: 'Interactive personal page' },
    tag: { es: 'Contenido por secciones con animaciones', en: 'Sectioned content with animations' },
  },
  {
    id: 'nuestra-historia',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML',
    categories: ['creative'],
    repo: repoUrl('NuestraHistoria'),
    demo: pagesUrl('NuestraHistoria'),
    name: { es: 'Nuestra historia', en: 'Our story' },
    tag: { es: 'Línea de tiempo con scroll narrativo', en: 'Timeline with narrative scrolling' },
  },
  {
    id: 'ramo-para-ti',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'JavaScript',
    categories: ['creative'],
    repo: repoUrl('ramo-para-ti'),
    demo: pagesUrl('ramo-para-ti'),
    name: { es: 'Ramo virtual', en: 'Virtual bouquet' },
    tag: { es: 'Interacción con animación por capas', en: 'Layered animation interaction' },
  },
  {
    id: 'sant-jordi-minimalista',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML',
    categories: ['creative', 'frontend'],
    repo: repoUrl('sant-jordi-minimalista'),
    demo: pagesUrl('sant-jordi-minimalista'),
    name: { es: 'Sant Jordi · minimalista', en: 'Sant Jordi · minimal' },
    tag: { es: 'Landing de temporada con diseño sobrio', en: 'Seasonal landing page with a restrained design' },
  },
  {
    id: 'sant-jordi-rosa',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML',
    categories: ['creative'],
    repo: repoUrl('sant-jordiv2'),
    demo: pagesUrl('sant-jordiv2'),
    name: { es: 'Sant Jordi · rosa mágica', en: 'Sant Jordi · magic rose' },
    tag: { es: 'Versión alternativa con pieza interactiva', en: 'Alternative version with an interactive piece' },
  },
  {
    id: 'portal-candado',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML',
    categories: ['tool'],
    repo: repoUrl('web-candado'),
    demo: pagesUrl('web-candado'),
    name: { es: 'Portal con acceso restringido', en: 'Restricted access portal' },
    tag: {
      es: 'Pantalla de acceso que muestra el contenido solo con la clave correcta',
      en: 'Access screen that reveals the content only with the right key',
    },
  },
  {
    id: 'universo',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'HTML',
    categories: ['creative'],
    repo: repoUrl('web-nasa-Alba'),
    demo: pagesUrl('web-nasa-Alba'),
    name: { es: 'Nuestro universo', en: 'Our universe' },
    tag: { es: 'Web temática espacial con material de la NASA', en: 'Space-themed page with NASA material' },
  },
  {
    id: 'poema-web',
    tier: 'archive',
    hidden: true,
    year: 2026,
    language: 'CSS',
    categories: ['creative'],
    repo: repoUrl('web-poema'),
    demo: pagesUrl('web-poema'),
    name: { es: 'Poema web', en: 'Web poem' },
    tag: { es: 'Texto maquetado y animado enteramente con CSS', en: 'Text laid out and animated entirely in CSS' },
  },
  {
    id: 'tekbowfix',
    tier: 'archive',
    year: 2026,
    language: 'C++',
    categories: ['tool'],
    repo: repoUrl('TekBowFix'),
    name: { es: 'TekBowFix', en: 'TekBowFix' },
    tag: { es: 'Utilidad de escritorio escrita en C++', en: 'Desktop utility written in C++' },
  },
];

/* ------------------------------------------------------------------------ */
/* Query helpers — pure functions over the dataset, used by the UI layer.    */
/* ------------------------------------------------------------------------ */

const isVisible = (project) => !project.hidden;
const isFeatured = (project) => project.tier === 'featured';

export const getVisibleProjects = () => projects.filter(isVisible);
export const getFeaturedProjects = () => getVisibleProjects().filter(isFeatured);
export const getProjectCount = () => getVisibleProjects().length;
export const getLiveDemoCount = () => getVisibleProjects().filter((p) => Boolean(p.demo)).length;

/** Category ids mapped to how many projects use them. */
export function getCategoryCounts() {
  const counts = new Map();

  getVisibleProjects().forEach((project) => {
    project.categories.forEach((categoryId) => {
      counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
    });
  });

  return counts;
}

function searchableText(project, lang) {
  return [
    localized(project.title ?? project.name, lang),
    localized(project.summary ?? project.tag, lang),
    localized(project.kicker, lang),
    project.language,
    ...(project.stack ?? []),
    ...project.categories,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Filter the catalogue. `category` is a category id or 'all'; `query` is free
 * text matched against names, descriptions, technologies and categories.
 */
export function filterProjects({ category = 'all', query = '' }, lang) {
  const needle = query.trim().toLowerCase();

  return getVisibleProjects().filter((project) => {
    const matchesCategory = category === 'all' || project.categories.includes(category);
    if (!matchesCategory) return false;

    if (!needle) return true;
    return searchableText(project, lang).includes(needle);
  });
}
