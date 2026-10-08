/**
 * Custom pointer cursor (fine pointers only).
 *
 * Two `position: fixed` layers are appended to <body> and driven by ONE rAF
 * loop: the dot is written straight from the latest pointer position (zero
 * lag) while the ring lerps toward it at RING_EASE per frame for a trailing,
 * weighted feel. `html.has-custom-cursor` — added by this module — is the
 * hook css/effects.css uses to hide the native pointer (typeable fields keep
 * their text caret) and to paint the two layers.
 *
 * Hover feedback is delegated: `mouseover`/`mouseout` + closest() resolve
 * `a, button, input, [role="button"]`, the ring switches to a dashed
 * accent-soft halo and grows, and both layers shrink on `pointerdown`.
 * Leaving <html> hides the pair; re-entering restores it with the ring
 * snapped to the pointer so it can never sweep in from a stale position.
 *
 * The loop parks itself once the ring has caught up (an idle pointer costs
 * zero frames) and a single `frameId` guard means repeated calls can never
 * stack loops. Coarse pointers and reduced motion bail out before any side
 * effect, and activation waits for the boot overlay (#intro, z-index 300 >
 * the layers' 250) to lift so the native pointer stays visible while the
 * terminal intro plays.
 */

import { prefersReducedMotion } from '../core/dom.js';

/** Per-frame lerp for the trailing ring (~0.15 reads as smooth at 60fps). */
const RING_EASE = 0.15;
/** Ring scale while the pointer is over an interactive element. */
const HOVER_SCALE = 1.6;
/** Both layers shrink while a pointer button is held down. */
const PRESS_SCALE_RING = 0.72;
const PRESS_SCALE_DOT = 0.6;
/** Resting scale of both layers. */
const REST_SCALE = 1;
/** Deltas below which the ring counts as settled and the loop parks. */
const SETTLE_DISTANCE = 0.05;
const SETTLE_SCALE = 0.001;
/** Elements whose hover changes the ring's style. */
const HOVER_SELECTOR = 'a, button, input, [role="button"]';
/** Never wait longer than this for the boot overlay to lift. */
const IDLE_WAIT_MAX_MS = 6000;

let initialized = false;
let frameId = null;

/**
 * Run `task` as soon as the terminal boot overlay is gone, so the custom
 * cursor never hides the native pointer behind #intro. The wait is bounded:
 * a stuck overlay can stall the effect, never the activation.
 */
function whenIdle(task) {
  const intro = document.getElementById('intro');
  const startedAt = performance.now();

  const isIdle = () =>
    (!intro || !intro.isConnected) &&
    !document.documentElement.classList.contains('intro-active');

  if (isIdle()) {
    task();
    return;
  }

  const poll = () => {
    if (isIdle() || performance.now() - startedAt >= IDLE_WAIT_MAX_MS) {
      task();
      return;
    }
    window.requestAnimationFrame(poll);
  };

  window.requestAnimationFrame(poll);
}

/**
 * Build the two pointer layers, wire the delegated listeners and start the
 * single rAF loop. Runs at most once, after initCursor() has passed every
 * gate.
 */
function activate() {
  const dot = document.createElement('div');
  dot.className = 'fx-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.className = 'fx-cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  document.documentElement.classList.add('has-custom-cursor');
  document.body.append(dot, ring);

  /* Loop state: written by listeners, consumed by exactly one rAF. */
  let pointerX = 0;
  let pointerY = 0;
  let ringX = 0;
  let ringY = 0;
  let ringScale = REST_SCALE;
  let dotScale = REST_SCALE;
  let ringTarget = REST_SCALE;
  let dotTarget = REST_SCALE;
  let shown = false;
  let pressed = false;
  let hovering = false;

  /** One frame: ease the ring, write both transforms, park when settled. */
  function frame() {
    frameId = null;

    ringX += (pointerX - ringX) * RING_EASE;
    ringY += (pointerY - ringY) * RING_EASE;
    ringScale += (ringTarget - ringScale) * RING_EASE;
    dotScale += (dotTarget - dotScale) * RING_EASE;

    dot.style.transform =
      'translate3d(' + pointerX + 'px,' + pointerY + 'px,0) scale(' + dotScale + ')';
    ring.style.transform =
      'translate3d(' + ringX + 'px,' + ringY + 'px,0) scale(' + ringScale + ')';

    const settled =
      Math.abs(pointerX - ringX) < SETTLE_DISTANCE &&
      Math.abs(pointerY - ringY) < SETTLE_DISTANCE &&
      Math.abs(ringTarget - ringScale) < SETTLE_SCALE &&
      Math.abs(dotTarget - dotScale) < SETTLE_SCALE;

    if (!settled) frameId = window.requestAnimationFrame(frame);
  }

  /** Keep at most one frame in flight, however many events ask for one. */
  function schedule() {
    if (frameId === null) frameId = window.requestAnimationFrame(frame);
  }

  /** Track the pointer; reveal the layers on first sight, snapped to it. */
  function show(x, y) {
    pointerX = x;
    pointerY = y;

    if (!shown) {
      shown = true;
      ringX = x;
      ringY = y; /* snap — never sweep in from a stale position */
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
    }

    schedule();
  }

  /** Pointer left <html>: hide everything and drop transient hover/press. */
  function hide() {
    shown = false;
    pressed = false;
    hovering = false;
    dot.classList.remove('is-visible', 'is-pressed');
    ring.classList.remove('is-visible', 'is-pressed', 'is-hovering');
    dotTarget = REST_SCALE;
    ringTarget = REST_SCALE;
    schedule(); /* settle the scales behind the fade-out */
  }

  function setHovering(next) {
    if (next === hovering) return;
    hovering = next;
    ring.classList.toggle('is-hovering', next);
    ringTarget = next ? HOVER_SCALE : pressed ? PRESS_SCALE_RING : REST_SCALE;
    schedule();
  }

  function onPointerMove(event) {
    show(event.clientX, event.clientY);
  }

  function onPointerDown() {
    if (pressed) return;
    pressed = true;
    dot.classList.add('is-pressed');
    ring.classList.add('is-pressed');
    dotTarget = PRESS_SCALE_DOT;
    ringTarget = PRESS_SCALE_RING;
    schedule();
  }

  function onPointerUp() {
    if (!pressed) return;
    pressed = false;
    dot.classList.remove('is-pressed');
    ring.classList.remove('is-pressed');
    dotTarget = REST_SCALE;
    ringTarget = hovering ? HOVER_SCALE : REST_SCALE;
    schedule();
  }

  function onMouseOver(event) {
    const target = event.target;
    const hit = target instanceof Element ? target.closest(HOVER_SELECTOR) : null;
    setHovering(Boolean(hit));
  }

  function onMouseOut(event) {
    const from = event.target;
    if (!(from instanceof Element)) return;

    const origin = from.closest(HOVER_SELECTOR);
    if (!origin) return;

    const to = event.relatedTarget;
    if (to instanceof Element && origin.contains(to)) return; /* still inside */

    setHovering(false);
  }

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.addEventListener('pointerup', onPointerUp, { passive: true });
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);
  document.documentElement.addEventListener('pointerenter', onPointerMove);
  document.documentElement.addEventListener('pointerleave', hide);
}

/**
 * Enable the custom cursor. Idempotent, silent when the DOM is not ready,
 * and with zero side effects when the pointer is coarse or the user prefers
 * reduced motion (both checked before anything is created or scheduled).
 */
export function initCursor() {
  if (initialized) return;
  initialized = true;

  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (prefersReducedMotion()) return;

  whenIdle(activate);
}
