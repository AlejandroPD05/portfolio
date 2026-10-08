/**
 * Scroll reveal.
 *
 * The hidden state only exists under `html.js` (set by an inline script in the
 * head), so if the JavaScript bundle never runs, the content stays visible
 * instead of a blank page.
 */

import { qsa } from './core/dom.js';

const REVEAL_MARGIN = '0px 0px -40px 0px';

let observer = null;

function getObserver() {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: REVEAL_MARGIN }
  );

  return observer;
}

/**
 * Watch every `.reveal` element under `root` and fade it in when it scrolls
 * into view. Safe to call again after a re-render : already revealed elements
 * are skipped, new ones are picked up.
 */
export function observeReveals(root = document) {
  const targets = root === document ? qsa('.reveal') : qsa('.reveal', root);
  if (targets.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  targets.forEach((element) => {
    if (element.classList.contains('is-visible')) return;
    getObserver().observe(element);
  });
}
