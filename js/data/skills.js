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
      'Tailwind CSS',
      'Animaciones CSS y Canvas',
      'Accesibilidad y HTML semántico',
    ],
  },
  {
    id: 'languages',
    labelKey: 'stackLanguages',
    icon: 'terminal',
    items: ['JavaScript', 'Java', 'SQL', 'C++', 'HTML', 'CSS'],
  },
  {
    id: 'backend',
    labelKey: 'stackBackend',
    icon: 'server',
    items: [
      'Modelado relacional',
      'Consultas SQL y JOINs',
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
      'GitHub Pages',
      'Vercel',
      'Vite',
      'DevTools del navegador',
      'Soporte IT nivel 1 y gestión de incidencias',
    ],
  },
];
