/**
 * 3D tilt + pointer-following glare for the card surfaces.
 *
 * `.project-card` (primary) and `.status-panel` (secondary) are re-rendered
 * by js/projects.js, so ONE delegated `pointermove` on the document resolves
 * them with closest() — no per-card listeners, ever. The active card is
 * tracked by a single rAF loop that each frame reads its rect first
 * (transform-only writes never dirty layout, so the read stays cheap and
 * also keeps the tilt honest while the page scrolls under a still pointer),
 * eases the rotation toward the pointer-derived target, and then writes
 * `transform` plus the `--mx`/`--my` glare coordinates in one batch.
 *
 * `is-tilting` (css/effects.css) hands the card will-change, the z-index
 * bump and the ::after glare; the transform itself is written inline as
 * `perspective(900px) rotateX(..deg) rotateY(..deg) scale(1.015)` capped at
 * MAX_DEGREE. Nothing here ever calls preventDefault or stopPropagation, so
 * links and buttons inside the cards keep working; `pointerleave` on <html>,
 * an isConnected guard and an out-of-bounds check all reset a card cleanly
 * even mid-animation. Coarse pointers and reduced motion bail out first.
 */

import { prefersReducedMotion } from '../core/dom.js';

/** Surfaces that tilt: project cards first, the about panel second. */
const TILT_SELECTOR = '.project-card, .status-panel';
/** Maximum rotation on either axis, in degrees. */
const MAX_DEGREE = 7;
/** Perspective baked into the transform string, in px. */
const PERSPECTIVE = 900;
/** Slight scale that sells the lift without moving any layout. */
const HOVER_SCALE = 1.015;
/** Exponential smoothing per frame (~0.15 feels silky at 60fps). */
const SMOOTHING = 0.15;
/** Pointer offset (fraction of the rect) tolerated before counting as left. */
const LEAVE_TOLERANCE = 0.02;

let initialized = false;

/** Clamp a value into [min, max]. */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Round to two decimals so identical frames reuse the same style strings. */
const round = (value) => Math.round(value * 100) / 100;

/**
 * Wire the delegated tilt. Idempotent and silent when no card exists yet:
 * targets are resolved per `pointermove`, so dynamically rendered cards are
 * picked up automatically.
 */
export function initTilt() {
  if (initialized) return;
  initialized = true;

  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (prefersReducedMotion()) return;

  /** The card currently under the pointer, if any. */
  let active = null;
  /** Last known pointer position, in viewport coordinates. */
  let pointerX = 0;
  let pointerY = 0;
  /** Values being written, easing toward the pointer-derived target. */
  let rotateX = 0;
  let rotateY = 0;
  let scale = 1;
  /** Last values written — identical repeats are skipped entirely. */
  let lastRotateX = null;
  let lastRotateY = null;
  let lastScale = null;
  let lastMx = '';
  let lastMy = '';
  let frameId = null;

  /** Full reset: cancel the frame and hand the card back to CSS. */
  function reset() {
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
    if (!active) return;

    active.classList.remove('is-tilting');
    active.style.transform = '';
    active.style.removeProperty('--mx');
    active.style.removeProperty('--my');
    active = null;

    rotateX = 0;
    rotateY = 0;
    scale = 1;
    lastRotateX = null;
    lastRotateY = null;
    lastScale = null;
    lastMx = '';
    lastMy = '';
  }

  /** Keep at most one frame in flight while a card is active. */
  function schedule() {
    if (active === null || frameId !== null) return;
    frameId = window.requestAnimationFrame(frame);
  }

  /** Write the transform and the glare coordinates, but only when changed. */
  function write(px, py) {
    const rx = round(rotateX);
    const ry = round(rotateY);
    const nextScale = round(scale);

    if (rx !== lastRotateX || ry !== lastRotateY || nextScale !== lastScale) {
      lastRotateX = rx;
      lastRotateY = ry;
      lastScale = nextScale;
      active.style.transform =
        'perspective(' +
        PERSPECTIVE +
        'px) rotateX(' +
        rx +
        'deg) rotateY(' +
        ry +
        'deg) scale(' +
        nextScale +
        ')';
    }

    const mx = round(px * 100) + '%';
    const my = round(py * 100) + '%';

    if (mx !== lastMx) {
      lastMx = mx;
      active.style.setProperty('--mx', mx);
    }
    if (my !== lastMy) {
      lastMy = my;
      active.style.setProperty('--my', my);
    }
  }

  /** One frame: measure first, ease second, write last. */
  function frame() {
    frameId = null;
    if (active === null) return;

    if (!active.isConnected) {
      reset();
      return;
    }

    /* Read before any write: transforms never dirty layout, so pulling the
       rect once per frame stays a cheap geometry query. */
    const rect = active.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      schedule();
      return;
    }

    const rawX = (pointerX - rect.left) / rect.width;
    const rawY = (pointerY - rect.top) / rect.height;

    /* Safety net for scroll: if the card slid out from under a still
       pointer no pointermove will ever arrive to reset it. */
    if (
      rawX < -LEAVE_TOLERANCE ||
      rawX > 1 + LEAVE_TOLERANCE ||
      rawY < -LEAVE_TOLERANCE ||
      rawY > 1 + LEAVE_TOLERANCE
    ) {
      reset();
      return;
    }

    const px = clamp(rawX, 0, 1);
    const py = clamp(rawY, 0, 1);

    /* The card's face turns toward the pointer: above centre tilts the top
       back, right of centre turns the right edge away. */
    rotateX += ((0.5 - py) * 2 * MAX_DEGREE - rotateX) * SMOOTHING;
    rotateY += ((px - 0.5) * 2 * MAX_DEGREE - rotateY) * SMOOTHING;
    scale += (HOVER_SCALE - scale) * SMOOTHING;

    write(px, py);
    schedule();
  }

  function onPointerMove(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;

    const target =
      event.target instanceof Element ? event.target.closest(TILT_SELECTOR) : null;

    if (target === active) {
      schedule();
      return;
    }

    reset(); /* leaving one card (or re-entering mid-reset) starts clean */

    if (target === null) return;

    active = target;
    active.classList.add('is-tilting');
    schedule();
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
}
