/**
 * Tech stack shown in the "Tecnologías" section.
 *
 * `items` are plain strings because technology names are not translated.
 * `icon` maps to a key in `js/ui/icons.js`.
 */

export const skillGroups = [
  {
    id: 'frontend',
    labelKey: 'stackFrontend',
    icon: 'layout',
    items: [
      'HTML5 semántico',
      'CSS3 · Flexbox y Grid',
      'Diseño responsivo',
      'JavaScript ES6+',
      'React',
      'TanStack Query',
      'Tailwind CSS',
      'Animaciones CSS y Canvas',
      'Accesibilidad y HTML semántico',
    ],
  },
  {
    id: 'languages',
    labelKey: 'stackLanguages',
    icon: 'terminal',
    items: ['JavaScript', 'TypeScript', 'Java', 'SQL', 'C++', 'HTML', 'CSS'],
  },
  {
    id: 'backend',
    labelKey: 'stackBackend',
    icon: 'server',
    items: [
      'Modelado relacional',
      'Consultas SQL y JOINs',
      'Diseño de APIs REST',
      'Spring Boot',
      'Spring Security y JWT',
      'JPA / Hibernate',
      'PostgreSQL',
      'Migraciones con Flyway',
      'Consumo de APIs REST',
      'Manejo de JSON',
      'Google Sheets como fuente de datos',
    ],
  },
  {
    id: 'tools',
    labelKey: 'stackTools',
    icon: 'tools',
    items: [
      'Git y GitHub',
      'GitHub Actions',
      'Docker',
      'GitHub Pages',
      'Vercel',
      'Vite',
      'JUnit y MockMvc',
      'Vitest y Testing Library',
      'DevTools del navegador',
      'Soporte IT nivel 1 y gestión de incidencias',
    ],
  },
];
