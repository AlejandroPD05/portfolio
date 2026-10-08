/**
 * Colour-scheme layer.
 *
 * Every visit opens on the white/light scheme: the tiny inline script in
 * index.html always paints `light-mode` before the first frame, so there is
 * never a flash and the operating-system preference is deliberately ignored.
 * Switching to the dark palette is a session-only choice — nothing is written
 * to localStorage, so the next visit starts white again.
 */

import { prefersReducedMotion } from './core/dom.js';

const THEMES = ['light', 'dark'];

const listeners = new Set();

let currentTheme = 'light';

function paint(theme) {
  const isDark = theme === 'dark';

  const apply = () => {
    document.documentElement.classList.toggle('dark-mode', isDark);
    document.documentElement.classList.toggle('light-mode', !isDark);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', isDark ? '#000000' : '#ffffff');
  };

  // Modern engines cross-fade the whole page while the palette swaps under
  // it (keyframes in css/base.css); everything else repaints immediately.
  const reducedMotion = prefersReducedMotion();
  if (typeof document.startViewTransition === 'function' && !reducedMotion) {
    document.startViewTransition(apply);
    return;
  }

  apply();
}

export const getTheme = () => currentTheme;

export function onThemeChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setTheme(theme) {
  if (!THEMES.includes(theme)) return;

  currentTheme = theme;
  paint(theme);
  listeners.forEach((listener) => listener(theme));
}

export const toggleTheme = () => setTheme(currentTheme === 'dark' ? 'light' : 'dark');

/**
 * Boot: always light — the head script has already painted it, this only
 * keeps the module state and the meta theme-colour in sync.
 */
export function initTheme() {
  setTheme('light');
  return currentTheme;
}
