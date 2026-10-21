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
    id: 'atalaya',
    ticket: '013',
    tier: 'featured',
    year: 2026,
    language: 'TypeScript · Canvas 2D',
    categories: ['frontend', 'creative'],
    repo: repoUrl('atalaya'),
    demo: pagesUrl('atalaya'),
    demoLabelKey: 'linkLive',
    image: 'assets/projects/atalaya.webp',
    title: { es: 'Atalaya — observatorio anual de disponibilidad', en: 'Atalaya — annual availability observatory' },
    kicker: {
      es: 'React + Canvas 2D · un año, torre a torre',
      en: 'React + Canvas 2D · a year, tower by tower',
    },
    summary: {
      es: 'Un observatorio anual para Centinela que convierte 365 días de monitorización en un skyline isométrico. La altura mide el p95, el color el estado del servicio y los faros coral marcan incidencias; calendario, inspector y línea del año permiten pasar del año completo al detalle de un día sin perder contexto. Demo determinista, bilingüe, con temas claro/oscuro y accesibilidad AA.',
      en: 'An annual observatory for Centinela that turns 365 days of monitoring into an isometric skyline. Height encodes p95 latency, colour encodes aggregate service state and coral beacons mark incidents; calendar, inspector and year rail move from the full year to a single day without losing context. A deterministic bilingual demo with light/dark themes and AA accessibility.',
    },
    highlights: {
      es: [
        'Renderer isométrico propio sobre Canvas 2D: 365 torres en una cuadrícula 31 × 12, escala robusta de p95, orden de pintado por profundidad y hit testing por tapa y caras',
        'Tres formas de recorrer el mismo año —skyline, calendario con roving tabindex y rail nativo— con reproducción, inspector e incidencias en UTC',
        '39 pruebas Vitest, snapshot determinista verificable por hash y Lighthouse 1,00 en accesibilidad, buenas prácticas y SEO en tres estados',
      ],
      en: [
        'A custom Canvas 2D isometric renderer: 365 towers on a 31 × 12 grid, a robust p95 scale, depth-sorted painting and top/face hit testing',
        'Three ways through the same year — skyline, roving-tabindex calendar and native range rail — with playback, inspector and incidents in UTC',
        '39 Vitest tests, a deterministic hash-verifiable snapshot and Lighthouse 1.00 for accessibility, best practices and SEO across three states',
      ],
    },
    stack: ['React 19', 'TypeScript', 'Vite', 'Canvas 2D', 'CSS', 'Vitest', 'GitHub Pages'],
  },
  {
    id: 'modulo-ms01',
    ticket: '012',
    tier: 'featured',
    year: 2026,
    language: 'TypeScript',
    categories: ['creative', 'frontend'],
    repo: repoUrl('modulo-ms01'),
    demo: pagesUrl('modulo-ms01'),
    demoLabelKey: 'linkLive',
    image: 'assets/projects/modulo.webp',
    title: { es: 'MÓDULO MS-01 — Sintetizador polifónico', en: 'MÓDULO MS-01 — Polyphonic synthesizer' },
    kicker: {
      es: 'React + Web Audio API · sintetizador de bolsillo',
      en: 'React + Web Audio API · pocket synthesizer',
    },
    summary: {
      es: 'Un sintetizador polifónico de ocho voces que vive en el navegador y se presenta como un módulo de hardware de sobremesa. Dos osciladores, filtro, envolvente ADSR, delay, presets, teclado, demo, grabación y MIDI; todo el sonido se genera en tiempo real, sin samples ni backend.',
      en: 'An eight-voice polyphonic synthesizer that lives in the browser and presents itself as a desktop hardware module. Two oscillators, filter, ADSR envelope, delay, presets, keyboard, demo, recording and MIDI; all sound is generated in real time, with no samples or backend.',
    },
    highlights: {
      es: [
        'Motor propio sobre Web Audio API: 8 voces con robo de la nota más antigua, dos osciladores, filtro biquad, ADSR, delay, compresor y analizador',
        'Interfaz 2.5D en React con perillas accesibles por teclado, dos octavas, seis presets, demo integrada y grabación de la salida master',
        'Patches compartibles comprimidos en la URL, MIDI opcional y 10 pruebas Vitest sobre el motor y el modelo de parámetros',
      ],
      en: [
        'A custom Web Audio API engine: 8 voices with oldest-note stealing, two oscillators, biquad filter, ADSR, delay, compressor and analyser',
        'A 2.5D interface in React with keyboard-accessible knobs, two octaves, six presets, a built-in demo and master output recording',
        'Shareable patches compressed into the URL, optional MIDI and 10 Vitest tests covering the engine and parameter model',
      ],
    },
    stack: ['React 19', 'TypeScript', 'Vite', 'Zustand', 'Web Audio API', 'CSS', 'Vitest', 'GitHub Pages'],
  },
  {
    id: 'centinela',
    ticket: '011',
    tier: 'featured',
    year: 2026,
    language: 'TypeScript · SQL',
    categories: ['backend', 'frontend', 'api'],
    repo: repoUrl('centinela'),
    demo: 'https://centinela-lake.vercel.app/status/demo',
    demoLabelKey: 'linkLive',
    image: 'assets/projects/centinela.webp',
    title: { es: 'Centinela — monitorización de uptime', en: 'Centinela — uptime monitoring' },
    kicker: {
      es: 'Fastify + PostgreSQL · status page pública',
      en: 'Fastify + PostgreSQL · public status page',
    },
    summary: {
      es: 'Plataforma de monitorización auto-alojada que vigila todos mis proyectos desplegados: checks HTTP y TCP, histórico contable, incidencias con línea de tiempo, caducidad de certificados SSL y latidos de entrada. Incluye panel de operador, status page pública con avisos en vivo, insignias SVG para los READMEs y un servidor MCP para preguntar el estado desde un asistente.',
      en: 'A self-hosted monitoring platform watching over every project I deploy: HTTP and TCP checks, accountable history, incidents with a timeline, SSL certificate expiry and inbound heartbeats. It includes an operator panel, a public status page with live updates, SVG badges for READMEs and an MCP server so an assistant can query the status.',
    },
    highlights: {
      es: [
        'Motor de checks con la guarda SSRF pegada al socket y cola de trabajo con SKIP LOCKED: varias instancias se reparten los checks sin pisarse',
        'Avisos en vivo con LISTEN/NOTIFY y SSE, status page pública, insignias SVG y widget embebible servidos desde un solo origen',
        '191 pruebas de API y MCP más 4 de extremo a extremo con servidor víctima sobre PostgreSQL real, y una semilla reproducible con 90 días de histórico',
      ],
      en: [
        'Check engine with the SSRF guard pinned to the socket and a SKIP LOCKED work queue: several instances share the checks without stepping on each other',
        'Live updates over LISTEN/NOTIFY and SSE, a public status page, SVG badges and an embeddable widget — all served from a single origin',
        '191 API and MCP tests plus 4 end-to-end ones with a victim server against a real PostgreSQL, and a reproducible seed with 90 days of history',
      ],
    },
    stack: ['TypeScript', 'Fastify', 'PostgreSQL', 'Drizzle', 'React 19', 'Tailwind CSS v4', 'SSE', 'Playwright', 'MCP', 'Docker'],
  },
  {
    id: 'dinodle',
    ticket: '010',
    tier: 'featured',
    year: 2026,
    language: 'TypeScript · SQL',
    categories: ['frontend', 'backend', 'game'],
    repo: repoUrl('dinodle'),
    demo: 'https://dinodle.vercel.app/',
    image: 'assets/projects/dinodle.webp',
    title: { es: 'Dinodle — el dinosaurio del día', en: 'Dinodle — the daily dinosaur' },
    kicker: { es: 'React + Supabase · sprites procedurales', en: 'React + Supabase · procedural sprites' },
    summary: {
      es: 'Un dinosaurio secreto cada día: búscalo por nombre, compara cinco pistas por intento y añádelo a tu DinoDex. Detrás del juego hay un estudio procedural que dibuja el sprite de pixel art de los 288 dinosaurios — seis animaciones cada uno — y una galería pública para explorarlos, animarlos y descargarlos.',
      en: 'A secret dinosaur every day: search for it by name, compare five clues per guess and add it to your DinoDex. Behind the game sits a procedural studio that draws a pixel-art sprite for each of the 288 dinosaurs — six animations each — plus a public gallery to browse, animate and download them.',
    },
    highlights: {
      es: [
        'Estudio de sprites determinista en Node: 288 dinosaurios con seis animaciones, encoder GIF89a propio sin dependencias y verificación automática de márgenes y determinismo',
        'El dinosaurio del día nunca llega al navegador: las pistas se calculan en Edge Functions con la service role y el cliente solo ve políticas de lectura',
        'Juego completo con intentos ilimitados, rachas, DinoDex, perfil con calendario y estadísticas, y galería pública en /sprites',
      ],
      en: [
        'A deterministic sprite studio in Node: 288 dinosaurs with six animations, a hand-rolled dependency-free GIF89a encoder and automated margin and determinism checks',
        'The daily dinosaur never reaches the browser: clues are computed in Edge Functions with the service role, while the client only sees read-only policies',
        'A complete game with unlimited guesses, streaks, a DinoDex, a profile with calendar and stats, and a public gallery at /sprites',
      ],
    },
    stack: ['React 19', 'TypeScript', 'Vite', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Vitest'],
  },
  {
    id: 'mesa2',
    ticket: '008',
    tier: 'featured',
    year: 2026,
    language: 'Java · TypeScript',
    categories: ['backend', 'frontend'],
    repo: repoUrl('mesa2'),
    demo: 'https://mesa2.onrender.com',
    demoLabelKey: 'linkLive',
    image: 'assets/projects/mesa2.webp',
    title: { es: 'Mesa 2.0 — Portal de soporte IT', en: 'Mesa 2.0 — IT support portal' },
    kicker: { es: 'Spring Boot + React 19 · autoservicio y helpdesk', en: 'Spring Boot + React 19 · self-service & helpdesk' },
    summary: {
      es: 'Portal de autoservicio y mesa de ayuda completo: centro de conocimiento con feedback, tickets con SLA, bandeja técnica con notas internas, panel de indicadores y administración de la base de conocimiento — React 19 delante y Spring Boot + PostgreSQL detrás.',
      en: 'A complete self-service portal and helpdesk: a knowledge centre with feedback, SLA-driven tickets, a support desk with internal notes, a KPI dashboard and knowledge-base administration — React 19 in front, Spring Boot + PostgreSQL behind.',
    },
    highlights: {
      es: [
        'API REST con Spring Boot y PostgreSQL: JWT en cookie httpOnly, permisos en la capa de servicio y errores RFC 7807 en un único formato',
        '66 pruebas (35 de API + 31 de SPA) sobre las mismas migraciones Flyway que usa producción',
        'SPA en React 19 + TypeScript con accesibilidad AA, tema claro/oscuro y despliegue en un solo contenedor',
      ],
      en: [
        'REST API on Spring Boot and PostgreSQL: JWT in an httpOnly cookie, service-layer permissions and RFC 7807 errors everywhere',
        '66 tests (35 API + 31 SPA) running against the same Flyway migrations production uses',
        'React 19 + TypeScript SPA with AA accessibility, light/dark theme and a single-container deployment',
      ],
    },
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Flyway', 'React 19', 'TypeScript', 'TanStack Query', 'Docker'],
  },
  {
    id: 'volta-x1',
    ticket: '009',
    tier: 'featured',
    year: 2026,
    language: 'TypeScript',
    categories: ['creative', 'frontend'],
    repo: repoUrl('volta-x1'),
    demo: pagesUrl('volta-x1'),
    image: 'assets/projects/volta.webp',
    demoLabelKey: 'linkLive',
    title: { es: 'VOLTA X1 — Landing 3D interactiva', en: 'VOLTA X1 — Interactive 3D landing' },
    kicker: { es: 'React + three.js · despiece 3D guiado por scroll', en: 'React + three.js · scroll-driven 3D teardown' },
    summary: {
      es: 'Landing de producto para un ratón gaming ficticio: el ratón se renderiza en 3D y se descompone en seis capas al hacer scroll, con hotspots anclados a cada pieza que abren su ficha técnica. Incluye rotación 360°, intro cinematográfica y tres acentos neón que tiñen escena e interfaz.',
      en: 'A product landing page for a fictional gaming mouse: the mouse is rendered in 3D and comes apart into six layers as you scroll, with hotspots anchored to each part that open its spec sheet. It includes 360° rotation, a cinematic intro and three neon accents that tint both scene and interface.',
    },
    highlights: {
      es: [
        'Despiece de seis capas controlado por scroll, slider o botones, con ensamblaje inverso al continuar',
        'Geometría 100 % procedural en React Three Fiber — sin modelos externos — con hotspots anclados a cada pieza',
        'Estado por frame fuera de React, canvas único bajo el DOM y reduced-motion respetado para mantener los 60 FPS',
      ],
      en: [
        'Six-layer teardown driven by scroll, slider or buttons, with reverse assembly as you continue',
        '100% procedural geometry in React Three Fiber — no external models — with hotspots anchored to each part',
        'Per-frame state kept out of React, a single canvas under the DOM layer and reduced-motion support to hold 60 FPS',
      ],
    },
    stack: ['React 19', 'TypeScript', 'three.js', 'React Three Fiber', 'GSAP', 'Framer Motion', 'Tailwind CSS v4', 'Vite', 'Zustand'],
  },
  {
    id: 'ticketing',
    ticket: '004',
    tier: 'featured',
    year: 2026,
    language: 'SQL · Java',
    categories: ['backend'],
    repo: repoUrl('ticketing'),
    demo: pagesUrl('ticketing'),
    image: 'assets/projects/ticketing.webp',
    demoLabelKey: 'linkLive',
    title: { es: 'Helpdesk RoyalTown — Sistema de tickets', en: 'RoyalTown Helpdesk — Ticketing system' },
    kicker: { es: 'MySQL + Java/JDBC · máquina de estados', en: 'MySQL + Java/JDBC · state machine' },
    summary: {
      es: 'Sistema de tickets completo: esquema MySQL con ciclo de vida trazable, capa de servicios en Java con JDBC y transacciones, CLI de demostración por roles y 21 pruebas JUnit que corren sobre el mismo script.',
      en: 'Complete ticketing system: a traceable MySQL schema, a Java service layer over JDBC with real transactions, a role-based demo CLI and 21 JUnit tests running against the same script.',
    },
    highlights: {
      es: [
        '11 tablas, 4 vistas de KPI y una matriz de transiciones validada en base de datos',
        'Capa de servicios Java con permisos, SLA y auditoría campo a campo en Historial_Ticket',
        '21 pruebas JUnit sobre H2 en modo MySQL y CLI demo con usuarios de prueba',
      ],
      en: [
        '11 tables, 4 KPI views and a transition matrix enforced at the database level',
        'Java service layer with permissions, SLAs and field-level auditing in Historial_Ticket',
        '21 JUnit tests on H2 in MySQL mode and a demo CLI with seeded users',
      ],
    },
    stack: ['MySQL', 'Java 21', 'JDBC', 'Maven', 'JUnit', 'bcrypt'],
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
    image: 'assets/projects/gamestash.webp',
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
    image: 'assets/projects/cinematch.webp',
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
    image: 'assets/projects/huapi.webp',
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
    image: 'assets/projects/asteroides.webp',
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
    image: 'assets/projects/webanimada.webp',
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
    image: 'assets/projects/temaui.webp',
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

/* Headline numbers count the whole catalogue (all repos on GitHub), while the
   grid and the filter chips count only the projects with a visible card. */
export const getTotalRepoCount = () => projects.length;
export const getTotalDemoCount = () => projects.filter((p) => Boolean(p.demo)).length;

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
