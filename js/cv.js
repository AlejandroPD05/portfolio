/**
 * Curriculum section.
 *
 * The "print or save as PDF" action is scoped with an `html.print-cv` flag
 * that base.css uses to drop every section except #cv, so the dialog lays out
 * a clean résumé. A plain Ctrl+P never sets the flag and still prints the
 * whole page.
 */

import { qs } from './core/dom.js';

/* Safety net: if an engine never fires afterprint (dialog force-closed, very
   old browser), the flag must not linger and hijack the next full print. */
const CLEAR_FALLBACK_MS = 60000;

export function initCv() {
  const button = qs('#printCvButton');
  if (!button) return;

  const root = document.documentElement;
  let fallbackTimer = 0;

  const clear = () => {
    root.classList.remove('print-cv');
    window.clearTimeout(fallbackTimer);
  };

  button.addEventListener('click', () => {
    root.classList.add('print-cv');
    window.addEventListener('afterprint', clear, { once: true });
    fallbackTimer = window.setTimeout(clear, CLEAR_FALLBACK_MS);

    try {
      window.print();
    } catch {
      /* Printing blocked (embedded viewer, permissions): restore the page. */
      clear();
    }
  });
}
