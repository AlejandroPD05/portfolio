/**
 * Magnetic hover for the primary controls.
 *
 * `.btn`, `.icon-toggle` and `.chip` are resolved through one delegated
 * `mouseover` on the document (they are re-rendered by js/projects.js on
 * every filter or language change) and cached as the "active" element. A
 * single `pointermove` listener does all the work — and only for that
 * element: the offset from the element's centre drives an inline
 * `translate()` capped at MAX_PULL px, eased by the
 * `transition: transform 0.3s var(--ease-out)` that `.is-magnetic` carries
 * in css/effects.css.
 *
 * Nothing here calls preventDefault, only transforms are written, and the
 * inline value is cleared on the way out — so clicks, `:focus-visible`
 * rings, text selection and the hover styles authored in components.css all
 * keep behaving exactly as before. Coarse pointers and reduced motion bail
 * out before a single listener is attached.
 */

import { prefersReducedMotion } from '../core/dom.js';

/** Elements that attract the pointer. */
const MAGNETIC_SELECTOR = '.btn, .icon-toggle, .chip';
/** Maximum translation toward the pointer, in px. */
const MAX_PULL = 10;

let initialized = false;

/** Clamp a value into [min, max]. */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Wire the delegated magnetic pull. Idempotent and safe when no matching
 * element exists yet: targets are resolved per `mouseover`, so elements
 * rendered later are picked up automatically.
 */
export function initMagnetic() {
  if (initialized) return;
  initialized = true;

  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (prefersReducedMotion()) return;

  /** The element the pointer is currently attracting, if any. */
  let active = null;

  /** Nearest magnetic ancestor-or-self of an event target. */
  function resolve(event) {
    const target = event.target;
    return target instanceof Element ? target.closest(MAGNETIC_SELECTOR) : null;
  }

  function deactivate() {
    if (!active) return;
    active.classList.remove('is-magnetic');
    active.style.transform = '';
    active = null;
  }

  function onMouseOver(event) {
    const next = resolve(event);
    if (next === active) return;

    deactivate();
    if (!next) return;

    active = next;
    active.classList.add('is-magnetic');
  }

  /** Release when the pointer leaves the active element (or the window). */
  function onMouseOut(event) {
    if (!active) return;

    const to = event.relatedTarget;
    if (to instanceof Node && active.contains(to)) return; /* still inside */

    deactivate();
  }

  /** The only per-frame work: translate the active element toward the tip. */
  function onPointerMove(event) {
    if (!active) return;

    /* Chips are re-rendered on every filter change: drop stale nodes. */
    if (!active.isConnected) {
      deactivate();
      return;
    }

    const rect = active.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const offsetX = clamp(
      (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
      -1,
      1
    );
    const offsetY = clamp(
      (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
      -1,
      1
    );

    active.style.transform =
      'translate(' +
      (offsetX * MAX_PULL).toFixed(2) +
      'px, ' +
      (offsetY * MAX_PULL).toFixed(2) +
      'px)';
  }

  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', deactivate);
}
