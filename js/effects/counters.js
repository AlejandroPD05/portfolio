/**
 * Hero statistics counters.
 *
 * js/hero.js writes the real totals into the stat elements at boot, so the
 * numbers can never drift away from the catalogue; this module only replays
 * them as a short 0 → target animation the first time each element becomes
 * visible. The final value is re-read from the DOM when the run starts, and
 * written back untouched when the run ends.
 *
 * One shared rAF loop drives every active counter.
 */

import { prefersReducedMotion } from '../core/dom.js';

/** The three hero statistics, in document order. */
const STAT_IDS = ['statProjectCount', 'statDemoCount', 'statFeaturedCount'];

/** Counting duration — fast start, long soft landing. */
const DURATION_MS = 1100;
/** Never wait longer than this for the boot overlay to lift. */
const IDLE_WAIT_MAX_MS = 6000;

const INTERSECTION_OPTIONS = { threshold: 0.5 };

let initialized = false;
let frameId = null;

const animated = new WeakSet();
const running = new Map();

/** Exponential ease-out: ~99.9% of the target by the end of the run. */
function easeOutExpo(progress) {
  return progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress);
}

/**
 * Run `task` now, or as soon as the terminal boot overlay is gone, so the
 * counters are never spent behind `#intro`. The wait is bounded.
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

/** Single loop for every running counter; idles itself when the Map empties. */
function step(now) {
  frameId = null;

  running.forEach((state, node) => {
    const progress = Math.max(0, (now - state.start) / DURATION_MS);

    if (progress >= 1) {
      running.delete(node);
      node.textContent = String(state.target);
      return;
    }

    node.textContent = String(Math.round(state.target * easeOutExpo(progress)));
  });

  if (running.size > 0) frameId = window.requestAnimationFrame(step);
}

/** Queue one counter, painting `0` synchronously so no final value flashes. */
function startCounter(node, target) {
  running.set(node, { target, start: performance.now() });
  node.textContent = '0';

  if (frameId === null) frameId = window.requestAnimationFrame(step);
}

/**
 * Arm the counters on `#statProjectCount`, `#statDemoCount` and
 * `#statFeaturedCount`.
 *
 * Idempotent (guarded) and silent when the elements are missing; with reduced
 * motion the values hero.js already wrote are left exactly as they are.
 */
export function initCounters() {
  if (initialized) return;
  initialized = true;

  if (!('IntersectionObserver' in window)) return;
  if (prefersReducedMotion()) return;

  const nodes = STAT_IDS.map((id) => document.getElementById(id)).filter(
    (node) => node !== null
  );
  if (nodes.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const node = entry.target;
        observer.unobserve(node);
        if (animated.has(node)) return;
        animated.add(node);

        if (prefersReducedMotion()) return;

        whenIdle(() => {
          /* Read the target fresh: hero.js may have written it after boot. */
          const target = parseInt(node.textContent, 10);
          if (Number.isNaN(target) || target <= 0) return;

          startCounter(node, target);
        });
      });
    },
    INTERSECTION_OPTIONS
  );

  nodes.forEach((node) => observer.observe(node));
}
