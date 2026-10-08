/**
 * Inline SVG icon set.
 *
 * Icons are returned as trusted markup strings and injected through the `html`
 * attribute of `el()`. Keeping them inline avoids an extra network request and
 * lets every icon inherit the current text colour.
 */

const SVG_BASE = 'viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"';

const STROKE_ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z"/>',
  arrowDown: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  arrowUpRight: '<path d="M7 17L17 7M9 7h8v8"/>',
  external: '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6M10 14L21 3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  terminal: '<path d="M4 17l6-5-6-5"/><path d="M12 19h8"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
  tools: '<path d="M14.7 6.3a4 4 0 01-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 015.4-5.4l-2.6 2.6-1.4-1.4 2.6-2.6a4 4 0 00-.6-.6z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4.35-4.35"/>',
  sprout: '<path d="M12 20v-7"/><path d="M12 13c0-3.5 2.5-6 7-6 0 4.5-2.5 6-7 6z"/><path d="M12 15c0-3-2-5-6-5 0 3.5 2 5 6 5z"/>',
  layers: '<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
  filter: '<path d="M3 4h18l-7 8v7l-4 2v-9L3 4z"/>',
  folder: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>',
};

const FILLED_ICONS = {
  github:
    '<path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.07c-3.2.7-3.87-1.4-3.87-1.4-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>',
  linkedin:
    '<path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 002.48 2.5A2.5 2.5 0 007.5 6a2.5 2.5 0 00-2.52-2.5zM3 9h4v12H3zM10 9h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4z"/>',
};

const STROKE_STYLE =
  'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

/**
 * @param {string} name  key of the icon set
 * @returns {string} SVG markup, or an empty string when the icon is unknown
 */
export function icon(name) {
  if (FILLED_ICONS[name]) {
    return `<svg ${SVG_BASE}>${FILLED_ICONS[name]}</svg>`;
  }

  const paths = STROKE_ICONS[name];
  if (!paths) return '';

  return `<svg ${SVG_BASE} ${STROKE_STYLE}>${paths}</svg>`;
}

export const brandIcons = {
  github: 'github',
  linkedin: 'linkedin',
  mail: 'mail',
};
