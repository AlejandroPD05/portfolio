/**
 * Terminal-style text decode.
 *
 * The first time a `.section-title` (or the `.hero-role` line) intersects the
 * viewport its copy is rebuilt character by character out of random terminal
 * glyphs, resolving left to right with a little per-character jitter.
 *
 * Only the element's text node is touched, so the blinking `_` cursor drawn by
 * `.section-title::after` is never part of the animation, and the original
 * string is written back verbatim at the end: the result is byte-identical to
 * whatever was on the page when the decode started (i18n swaps that happened
 * earlier are picked up because the text is read fresh at animation time).
 */

import { qsa, prefersReducedMotion } from '../core/dom.js';

/** Glyph pool used while a character is still resolving. */
const GLYPHS = '01<>/\\{}[]#*+-=_';

/** Hard cap of one decode run — kept inside the 600–900ms budget. */
const DURATION_MS = 800;
/** Window in which characters are allowed to resolve (left to right). */
const RESOLVE_SPAN_MS = 560;
/** Extra per-character randomness on top of the resolve window. */
const JITTER_MS = 200;
/** Never wait longer than this for the boot overlay to lift. */
const IDLE_WAIT_MAX_MS = 6000;

const INTERSECTION_OPTIONS = { threshold: 0.6 };

let initialized = false;
const animated = new WeakSet();

/**
 * Run `task` now, or as soon as the terminal boot overlay is gone.
 *
 * Hero effects would otherwise play hidden behind `#intro`. The wait is
 * bounded, so a missing overlay can never stall the effect for good.
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

/** First text node carrying real content, or null when there is nothing to decode. */
function firstTextNode(element) {
  const children = element.childNodes;

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    if (child.nodeType === 3 && child.nodeValue && child.nodeValue.trim()) {
      return child;
    }
  }

  return null;
}

/** Decode one text node in place with a single rAF loop. */
function decode(node) {
  const finalText = node.nodeValue;
  const chars = Array.from(finalText);
  if (chars.length === 0) return;

  const startedAt = performance.now();

  const resolveAt = chars.map((char, index) => {
    /* Word gaps stay fixed so the line keeps its shape while it decodes. */
    if (char.trim() === '') return 0;

    const spread = chars.length > 1 ? index / (chars.length - 1) : 1;
    return spread * RESOLVE_SPAN_MS + Math.random() * JITTER_MS;
  });

  const frame = (now) => {
    const elapsed = now - startedAt;

    /* Never fight the i18n layer: while a swap is in flight it owns the text. */
    if (document.body && document.body.classList.contains('is-swapping-lang')) return;

    if (elapsed >= DURATION_MS) {
      node.nodeValue = finalText;
      return;
    }

    let output = '';
    let pending = false;

    for (let i = 0; i < chars.length; i += 1) {
      if (elapsed >= resolveAt[i]) {
        output += chars[i];
        continue;
      }

      pending = true;
      output += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
    }

    if (!pending) {
      node.nodeValue = finalText;
      return;
    }

    node.nodeValue = output;
    window.requestAnimationFrame(frame);
  };

  window.requestAnimationFrame(frame);
}

/** Start a single decode run for an element, unless the page is mid-swap. */
function startDecode(element) {
  whenIdle(() => {
    if (document.body && document.body.classList.contains('is-swapping-lang')) return;

    const node = firstTextNode(element);
    if (node) decode(node);
  });
}

/**
 * Arm the decode effect on every `.section-title` and on `.hero-role`.
 *
 * Idempotent (guarded) and silent when nothing matches; with reduced motion or
 * without IntersectionObserver the copy simply stays static.
 */
export function initScramble() {
  if (initialized) return;
  initialized = true;

  if (!('IntersectionObserver' in window)) return;
  if (prefersReducedMotion()) return;

  const targets = qsa('.section-title, .hero-role');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        observer.unobserve(target);
        if (animated.has(target)) return;
        animated.add(target);

        /* A language swap already running wins: skip this element entirely. */
        if (document.body && document.body.classList.contains('is-swapping-lang')) return;
        if (prefersReducedMotion()) return;

        startDecode(target);
      });
    },
    INTERSECTION_OPTIONS
  );

  targets.forEach((target) => {
    if (animated.has(target)) return;
    observer.observe(target);
  });
}
