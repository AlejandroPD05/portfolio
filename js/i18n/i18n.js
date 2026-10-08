/**
 * Language layer.
 *
 * - The chosen language is persisted in localStorage.
 * - On a first visit the browser language decides (Spanish is the default,
 *   English for everyone else) so recruiters abroad land on a readable page.
 * - Markup is translated declaratively:
 *     data-i18n            -> textContent
 *     data-i18n-<attr>     -> that attribute (title, aria-label, content, ...)
 */

import { translations } from './translations.js';
import { prefersReducedMotion } from '../core/dom.js';

const STORAGE_KEY = 'portfolio.lang';
const SUPPORTED_LANGS = ['es', 'en'];
const FALLBACK_LANG = 'es';
const SWAP_DELAY_MS = 180;

let currentLang = FALLBACK_LANG;
const listeners = new Set();

function interpolate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
}

/** Translate a single key, with optional `{placeholder}` values. */
export function t(key, vars = {}) {
  const entry = translations[key];
  if (!entry) return key;

  const template = entry[currentLang] ?? entry[FALLBACK_LANG] ?? key;
  return vars && Object.keys(vars).length > 0 ? interpolate(template, vars) : template;
}

export const getLang = () => currentLang;

/**
 * Resolve a `{ es, en }` copy object (or a plain string) for a language.
 * Shared by the data layer and every renderer so localized values are read the
 * same way everywhere.
 */
export function localized(value, lang = currentLang) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value[FALLBACK_LANG] ?? Object.values(value)[0] ?? '';
}

export function onLangChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Pick an initial language: stored choice first, then the browser. */
function resolveInitialLang() {
  let stored = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    stored = null;
  }

  if (SUPPORTED_LANGS.includes(stored)) return stored;

  const browserLang = (navigator.language || FALLBACK_LANG).slice(0, 2).toLowerCase();
  return browserLang === 'es' ? 'es' : browserLang === 'en' ? 'en' : FALLBACK_LANG;
}

function storeLang(lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    /* private mode: the choice simply does not persist */
  }
}

/** Rewrite every annotated node under `root`. */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  root.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes || []).forEach((attribute) => {
      if (!attribute.name.startsWith('data-i18n-')) return;

      const target = attribute.name.slice('data-i18n-'.length);
      node.setAttribute(target, t(attribute.value));
    });
  });
}

function applyDocumentMeta() {
  document.title = t('metaTitle');

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', t('metaDescription'));

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', t('metaTitle'));

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', t('metaDescription'));
}

function commit(lang) {
  currentLang = lang;
  storeLang(lang);
  document.documentElement.lang = lang;
  applyTranslations();
  applyDocumentMeta();
  listeners.forEach((listener) => listener(lang));
}

/** Change language, fading the page while the copy swaps. */
export function setLang(lang, { animate = true } = {}) {
  if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;

  const reducedMotion = prefersReducedMotion();

  if (!animate || reducedMotion) {
    commit(lang);
    return;
  }

  document.body.classList.add('is-swapping-lang');
  window.setTimeout(() => {
    commit(lang);
    window.requestAnimationFrame(() => document.body.classList.remove('is-swapping-lang'));
  }, SWAP_DELAY_MS);
}

export const toggleLang = () => setLang(currentLang === 'es' ? 'en' : 'es');

/** Boot the language layer without animating the first paint. */
export function initI18n() {
  currentLang = resolveInitialLang();
  document.documentElement.lang = currentLang;
  applyTranslations();
  applyDocumentMeta();
  storeLang(currentLang);
  return currentLang;
}
