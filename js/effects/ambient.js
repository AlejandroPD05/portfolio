/**
 * Ambient glow budget — keeps the hero's drift affordable.
 *
 * `.hero::before` carries the slow `heroDrift` animation. It is free on a
 * compositor with hardware acceleration, but on software rendering — GPU
 * blocklisted, driver switched off, remote desktop, old integrated chip — every
 * frame of it costs a full repaint of a viewport-sized gradient plus a re-blur
 * of the fixed header's backdrop-filter, and the landing falls from 165 to 57
 * fps. Measured on a 165Hz panel with the GPU disabled, stopping the drift is
 * worth ~108 fps: the single largest cost on the page.
 *
 * Rather than give the effect up everywhere, this module only spends it where
 * it is affordable. Two independent hooks, both purely presentational:
 *
 *   drift-paused   the hero is scrolled out of view, or the tab is hidden.
 *                  Reversible: the drift resumes exactly where it stopped.
 *   drift-off      the one-way verdict of the probe below. The glow stays on
 *                  screen and simply stops moving.
 *
 * The probe is an A/B comparison, not an absolute threshold. The page is
 * sampled twice — once with the drift running, once with it paused — and the
 * drift is only cut when the first median is materially worse than the second.
 * An absolute budget would have to guess the display's refresh rate and would
 * misfire on 60Hz, 120Hz and 165Hz panels alike; comparing the page against
 * itself answers the only question that matters: does the drift cost anything
 * HERE? On a healthy renderer the two medians match and nothing is touched.
 *
 * Nothing here matters under reduced motion — css/base.css already collapses
 * every animation to 0.001ms — so the module bails out early. The probe runs
 * once, after the entrance has settled, so it cannot be fooled by the intro.
 */

import { qs, prefersReducedMotion } from '../core/dom.js';

const HERO_SELECTOR = '.hero';
const PAUSED_CLASS = 'drift-paused';
const OFF_CLASS = 'drift-off';

/* The hero entrance runs 700ms and the name scramble follows it, so sampling
   any earlier would measure the intro rather than the drift. */
const PROBE_DELAY_MS = 1600;

/* ~48 samples at 60Hz; the second window is padded so the pause has landed
   before it starts counting. */
const SAMPLE_MS = 800;
const SETTLE_MS = 60;

/* The drift is only cut when it eats at least a third of the frame. Anything
   less and the "win" would be within measurement noise — and the effect is
   worth more than a millisecond or two of budget. */
const COST_RATIO = 1.35;

/* A median built from fewer samples than this says nothing worth acting on.
   Eight samples tolerates renderers down to about 10fps. */
const MIN_SAMPLES = 8;

const median = (values) => {
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

/** Collect frame deltas for `duration` ms. Resolves null if the tab hides. */
function sampleFrames(duration) {
  return new Promise((resolve) => {
    const deltas = [];
    const startedAt = performance.now();
    let previous = 0;

    const tick = (now) => {
      if (document.hidden) {
        resolve(null);
        return;
      }

      if (previous) deltas.push(now - previous);
      previous = now;

      if (now - startedAt < duration) {
        requestAnimationFrame(tick);
        return;
      }
      resolve(deltas);
    };

    requestAnimationFrame(tick);
  });
}

export function initAmbient() {
  const hero = qs(HERO_SELECTOR);
  if (!hero || prefersReducedMotion()) return;

  let offScreen = false;
  let tabHidden = document.hidden;
  let probed = false;
  const startedAt = performance.now();

  const driftPaused = () => offScreen || tabHidden;
  const sync = () => hero.classList.toggle(PAUSED_CLASS, driftPaused());

  /**
   * Sample the page with the drift running, freeze it, sample again, then put
   * everything back exactly as it was. The freeze lasts well under a second on
   * a 16s animation, so it reads as nothing more than the glow holding still
   * for a moment — and when the verdict is "too expensive" it holds still for
   * good.
   */
  async function runProbe() {
    const running = await sampleFrames(SAMPLE_MS);
    if (!running || running.length < MIN_SAMPLES) return;

    hero.classList.add(PAUSED_CLASS);
    await sampleFrames(SETTLE_MS);
    const paused = await sampleFrames(SAMPLE_MS);
    sync(); /* restore whatever pause state the page was actually in */

    if (!paused || paused.length < MIN_SAMPLES) return;
    if (median(running) > median(paused) * COST_RATIO) hero.classList.add(OFF_CLASS);
  }

  /* One sample, once per page load, and never while the drift is paused —
     a paused drift would "prove" the page is fast and the verdict would be
     meaningless. */
  const maybeProbe = () => {
    if (probed || driftPaused()) return;

    const wait = PROBE_DELAY_MS - (performance.now() - startedAt);
    if (wait > 0) {
      window.setTimeout(maybeProbe, wait);
      return;
    }

    probed = true;
    runProbe();
  };

  /* The glow is invisible past the hero, so animating it there only burns
     frames nobody can see. */
  if (typeof IntersectionObserver === 'function') {
    const observer = new IntersectionObserver(([entry]) => {
      offScreen = !entry.isIntersecting;
      sync();
      maybeProbe();
    });
    observer.observe(hero);
  }

  document.addEventListener('visibilitychange', () => {
    tabHidden = document.hidden;
    sync();
    maybeProbe();
  });

  maybeProbe();
}
