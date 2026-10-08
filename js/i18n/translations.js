/**
 * UI copy for the whole site, Spanish (Spain) first with an English mirror.
 *
 * Keys are flat and grouped by section. Project copy lives with the project
 * data in `js/data/projects.js`; only interface strings belong here.
 */

export const translations = {
  /* --- Document ---------------------------------------------------------- */
  metaTitle: {
    es: 'Alejandro Prieto Díez — Soporte IT y Desarrollo Web',
    en: 'Alejandro Prieto Díez — IT Support & Web Development',
  },
  metaDescription: {
    es: 'Portfolio de Alejandro Prieto Díez: técnico de soporte IT N1 y desarrollador web. Proyectos de frontend, APIs, juegos y backend con demo en vivo y código abierto.',
    en: 'Portfolio of Alejandro Prieto Díez: L1 IT support technician and web developer. Frontend, API, game and backend projects with live demos and open source code.',
  },

  /* --- Navigation & header ---------------------------------------------- */
  navHome: { es: 'Inicio', en: 'Home' },
  navAbout: { es: 'Sobre mí', en: 'About' },
  navProjects: { es: 'Proyectos', en: 'Projects' },
  navStack: { es: 'Tecnologías', en: 'Tech stack' },
  navContact: { es: 'Contacto', en: 'Contact' },
  toggleLangLabel: { es: 'View page in English', en: 'Ver página en español' },
  toggleThemeToDay: { es: 'Cambiar a modo día', en: 'Switch to day mode' },
  toggleThemeToNight: { es: 'Cambiar a modo noche', en: 'Switch to night mode' },
  openMenu: { es: 'Abrir menú', en: 'Open menu' },
  closeMenu: { es: 'Cerrar menú', en: 'Close menu' },
  skipToContent: { es: 'Saltar al contenido', en: 'Skip to content' },

  /* --- Boot intro --------------------------------------------------------- */
  introSkip: { es: 'pulsa cualquier tecla para saltar', en: 'press any key to skip' },
  introBoot1: { es: '> iniciando alejandro.dev', en: '> boot alejandro.dev' },
  introBoot2: { es: '> montando /sobre-mi', en: '> mount /sobre-mi' },
  introBoot3: { es: '> montando /proyectos', en: '> mount /proyectos' },
  introBoot4: { es: '> montando /tecnologias', en: '> mount /tecnologias' },
  introBoot5: { es: '> resolviendo /contacto', en: '> resolve /contacto' },
  introBoot6: { es: '> listo_', en: '> ready_' },

  /* --- Hero -------------------------------------------------------------- */
  heroBadge: {
    es: 'Disponible para nuevas oportunidades',
    en: 'Available for new opportunities',
  },
  heroRole: {
    es: 'Helpdesk IT & Junior Web Developer',
    en: 'Helpdesk IT & Junior Web Developer',
  },
  heroDesc: {
    es: 'Resuelvo incidencias del lado del usuario y construyo la interfaz que las previene. Un perfil a medio camino entre el soporte técnico y el desarrollo web.',
    en: 'I resolve incidents from the user side and build the interface that prevents them. A profile halfway between technical support and web development.',
  },
  btnViewProjects: { es: 'Ver proyectos', en: 'View projects' },
  btnContact: { es: 'Contactar', en: 'Get in touch' },
  statProjects: { es: 'proyectos publicados', en: 'published projects' },
  statDemos: { es: 'con demo en vivo', en: 'with a live demo' },
  statFeatured: { es: 'destacados con ficha técnica', en: 'featured with a technical brief' },

  /* --- About ------------------------------------------------------------- */
  titleAbout: { es: 'Sobre mí', en: 'About me' },
  aboutP1: {
    es: 'Empecé resolviendo incidencias de soporte N1: usuarios bloqueados, redes que fallan, aplicaciones que no arrancan y tickets que hay que priorizar y cerrar contra reloj. Ese contacto diario con el problema real de quien usa la tecnología es lo que me llevó a querer construir yo mismo las herramientas, no solo repararlas.',
    en: 'I started out resolving L1 support incidents: locked-out users, failing networks, apps that will not start, and tickets that have to be prioritised and closed against the clock. That daily contact with the real problems of the people using the technology is what made me want to build the tools myself, not just fix them.',
  },
  aboutP2: {
    es: 'Hoy combino esa experiencia con el desarrollo de aplicaciones web: maquetación responsiva, interactividad con JavaScript y las bases de backend necesarias para que una idea funcione de principio a fin. Sigo aprendiendo cada día, con la misma disciplina con la que se cierra un ticket bien documentado.',
    en: 'Today I combine that experience with web application development: responsive layouts, JavaScript interactivity, and the backend foundations needed to take an idea from start to finish. I keep learning every day, with the same discipline it takes to close a well-documented ticket.',
  },
  statusPanelTitle: { es: 'perfil_actual.status', en: 'current_profile.status' },
  statRoleLabel: { es: 'rol', en: 'role' },
  statRoleValue: { es: 'Técnico de Soporte IT — N1', en: 'IT Support Technician — L1' },
  statFocusLabel: { es: 'enfoque', en: 'focus' },
  statFocusValue: { es: 'Desarrollo Web Frontend', en: 'Frontend Web Development' },
  statLanguagesLabel: { es: 'lenguajes', en: 'languages' },
  statModeLabel: { es: 'modo', en: 'mode' },
  statModeValue: { es: 'Full-stack en formación', en: 'Full-stack in training' },
  statLocationLabel: { es: 'ubicación', en: 'location' },
  statLocationValue: { es: 'Madrid, España', en: 'Madrid, Spain' },
  statAvailabilityLabel: { es: 'disponibilidad', en: 'availability' },
  statAvailabilityValue: {
    es: 'Jornada completa · híbrido o remoto',
    en: 'Full time · hybrid or remote',
  },

  /* --- Projects --------------------------------------------------------- */
  titleProjects: { es: 'Proyectos', en: 'Projects' },
  projectsNote: {
    es: '{total} repositorios · {featured} destacados con ficha técnica',
    en: '{total} repositories · {featured} featured with a technical brief',
  },
  filtersLabel: { es: 'Filtrar:', en: 'Filter:' },
  chipAll: { es: 'Todos', en: 'All' },
  catFrontend: { es: 'Frontend', en: 'Frontend' },
  catBackend: { es: 'Backend y datos', en: 'Backend & data' },
  catApi: { es: 'SPA y APIs', en: 'SPA & APIs' },
  catGame: { es: 'Juegos', en: 'Games' },
  catCreative: { es: 'Creativo', en: 'Creative' },
  catTool: { es: 'Herramientas', en: 'Tools' },
  searchLabel: { es: 'Buscar proyecto o tecnología', en: 'Search project or technology' },
  searchPlaceholder: { es: 'React, Java, API…', en: 'React, Java, API…' },
  emptyTitle: {
    es: 'Ningún proyecto coincide con ese filtro.',
    en: 'No project matches that filter.',
  },
  emptyDesc: {
    es: 'Prueba con otra categoría o borra la búsqueda.',
    en: 'Try another category or clear the search.',
  },
  clearFilters: { es: 'Borrar filtros', en: 'Clear filters' },
  archiveTitle: { es: 'Más proyectos y experimentos', en: 'More projects and experiments' },
  archiveNote: {
    es: 'Piezas creativas, juegos y herramientas — todos con código público.',
    en: 'Creative pieces, games and tools — all with public code.',
  },
  linkLive: { es: 'Ver en vivo', en: 'View live' },
  linkCode: { es: 'Código', en: 'Code' },
  linkSchema: { es: 'Ver esquema', en: 'View schema' },
  linkRepoOnly: { es: 'Ver repositorio', en: 'View repository' },
  viewAllRepos: { es: 'Ver los {n} repositorios en GitHub', en: 'See all {n} repositories on GitHub' },
  resultsLabel: { es: 'Mostrando {n} de {total}', en: 'Showing {n} of {total}' },

  /* --- Stack ------------------------------------------------------------ */
  titleStack: { es: 'Tecnologías', en: 'Tech stack' },
  stackNote: {
    es: 'Lo que uso en el día a día y lo que estoy aprendiendo.',
    en: 'What I use day to day and what I am learning.',
  },
  stackFrontend: { es: 'Frontend', en: 'Frontend' },
  stackLanguages: { es: 'Lenguajes', en: 'Languages' },
  stackBackend: { es: 'Backend y datos', en: 'Backend & data' },
  stackTools: { es: 'Herramientas y flujo', en: 'Tools & workflow' },
  stackLearningTitle: { es: 'Aprendiendo ahora', en: 'Currently learning' },
  stackLearningNote: {
    es: 'React a fondo, Java y patrones de backend, y accesibilidad web (WCAG).',
    en: 'React in depth, Java and backend patterns, and web accessibility (WCAG).',
  },

  /* --- Contact ---------------------------------------------------------- */
  titleContact: { es: 'Contacto', en: 'Contact' },
  contactDesc: {
    es: '¿Buscas a alguien que entienda tanto el ticket como el código que lo evita? Hablemos.',
    en: 'Looking for someone who understands both the ticket and the code that prevents it? Let us talk.',
  },
  contactCta: { es: 'Escríbeme un correo', en: 'Send me an email' },
  contactCopyEmail: { es: 'Copiar correo', en: 'Copy email' },
  contactCopied: { es: 'Correo copiado', en: 'Email copied' },
  contactCopyFailed: {
    es: 'Copia el correo manualmente',
    en: 'Please copy the address manually',
  },
  labelEmail: { es: 'Correo', en: 'Email' },
  labelLinkedin: { es: 'LinkedIn', en: 'LinkedIn' },
  labelGithub: { es: 'GitHub', en: 'GitHub' },
  contactLocationLabel: { es: 'Ubicación', en: 'Location' },
  contactLocationValue: { es: 'Madrid, España — remoto', en: 'Madrid, Spain — remote' },

  /* --- Footer ----------------------------------------------------------- */
  footerBuilt: {
    es: 'HTML, CSS y JavaScript sin frameworks ni dependencias',
    en: 'HTML, CSS and JavaScript — no frameworks, no dependencies',
  },
  footerRights: { es: '© {year} Alejandro Prieto Díez', en: '© {year} Alejandro Prieto Díez' },
  footerSource: { es: 'Código de este portfolio', en: 'Source of this portfolio' },
  footerTop: { es: 'Volver arriba', en: 'Back to top' },
};
