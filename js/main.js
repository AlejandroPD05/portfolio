/**
 * Application bootstrap.
 *
 * Boot order matters: the language layer runs before anything that renders
 * copy, and the theme layer runs after the inline head script has already
 * painted the correct colour scheme.
 */

import { qs, prefersReducedMotion } from './core/dom.js';
import { initI18n, toggleLang, t, onLangChange } from './i18n/i18n.js';
import { initTheme, toggleTheme, getTheme, onThemeChange } from './theme.js';
import { runIntro } from './intro.js';
import { initHero } from './hero.js';
import { initNav } from './nav.js';
import { initProjects } from './projects.js';
import { initStack } from './stack.js';
import { initContact } from './contact.js';
import { initCv } from './cv.js';
import { observeReveals } from './reveal.js';
import { initScramble } from './effects/scramble.js';
import { initCounters } from './effects/counters.js';
import { initScrollChrome } from './effects/chrome.js';
import { initCursor } from './effects/cursor.js';
import { initMagnetic } from './effects/magnet.js';
import { initTilt } from './effects/tilt.js';

const HERO_READY_DELAY_MS = 60;
/* Safety net: if the intro overlay ever fails to report completion, the page
   must still reveal itself instead of staying locked behind hidden content. */
const REVEAL_FALLBACK_MS = 4000;

/** Keep the theme button's label and pressed state in sync. */
function syncThemeButton(button) {
  const isDark = getTheme() === 'dark';

  button.setAttribute('aria-label', t(isDark ? 'toggleThemeToDay' : 'toggleThemeToNight'));
  button.setAttribute('aria-pressed', String(isDark));
}

function wireHeaderControls() {
  const langButton = qs('#langToggle');
  const themeButton = qs('#modeToggle');

  if (langButton) {
    langButton.setAttribute('aria-label', t('toggleLangLabel'));
    langButton.addEventListener('click', toggleLang);
    onLangChange(() => langButton.setAttribute('aria-label', t('toggleLangLabel')));
  }

  if (themeButton) {
    syncThemeButton(themeButton);
    themeButton.addEventListener('click', toggleTheme);
    onThemeChange(() => syncThemeButton(themeButton));
    onLangChange(() => syncThemeButton(themeButton));
  }
}

/** Trigger the hero entrance animation once the page is on screen. */
function revealHero() {
  const hero = qs('.hero');
  if (!hero) return;

  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    hero.classList.add('is-ready');
    return;
  }

  window.setTimeout(() => hero.classList.add('is-ready'), HERO_READY_DELAY_MS);
}

function boot() {
  initI18n();
  initTheme();
  wireHeaderControls();
  initHero();
  initNav();
  initProjects();
  initStack();
  initContact();
  initCv();
  initScrollChrome();
  initScramble();
  initCounters();
  initCursor();
  initMagnetic();
  initTilt();

  /* Content stays hidden behind the boot overlay until it lifts, so the
     scroll reveals and the hero entrance fire exactly when the page appears. */
  let started = false;
  const startPage = () => {
    if (started) return;
    started = true;
    observeReveals(document);
    revealHero();
  };

  runIntro(startPage);
  window.setTimeout(startPage, REVEAL_FALLBACK_MS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
