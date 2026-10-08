/**
 * Header navigation: mobile menu, scroll spy and language-aware labels.
 *
 * Section scrolling itself is left to the browser — `scroll-behavior` and
 * `scroll-padding-top` in the stylesheet already offset the fixed header, so no
 * JavaScript is needed to jump between sections.
 */

import { qs, qsa } from './core/dom.js';
import { t, onLangChange } from './i18n/i18n.js';

const MOBILE_BREAKPOINT = 720;
const SPY_ROOT_MARGIN = '-45% 0px -50% 0px';

function syncMenuLabels(navToggle, isOpen) {
  navToggle.setAttribute('aria-label', isOpen ? t('closeMenu') : t('openMenu'));
}

export function initNav() {
  const navToggle = qs('#navToggle');
  const navPanel = qs('#navDesktop');

  if (!navToggle || !navPanel) return;

  const isOpen = () => navToggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open) => {
    navPanel.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    syncMenuLabels(navToggle, open);
  };

  navToggle.addEventListener('click', () => setOpen(!isOpen()));

  qsa('.nav-link', navPanel).forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!isOpen()) return;
    if (navPanel.contains(event.target) || navToggle.contains(event.target)) return;
    setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT && isOpen()) setOpen(false);
  });

  // Refresh the open/close wording when the language changes.
  onLangChange(() => syncMenuLabels(navToggle, isOpen()));

  observeActiveSection();
}

/** Highlight the nav link of the section currently under the header. */
function observeActiveSection() {
  const sections = qsa('main section[id]');
  const navLinks = qsa('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const linksBySection = new Map(
    navLinks
      .filter((link) => link.dataset.section)
      .map((link) => [link.dataset.section, link])
  );

  if (!('IntersectionObserver' in window)) return;

  const setActive = (sectionId) => {
    linksBySection.forEach((link, id) => {
      link.setAttribute('aria-current', String(id === sectionId));
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: SPY_ROOT_MARGIN, threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}
