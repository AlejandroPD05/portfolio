/**
 * Scroll-reactive page chrome.
 *
 * One rAF-throttled scroll handler drives three pieces of feedback:
 *
 *   a) the progress bar pinned to the bottom edge of the fixed header
 *      (transform-only writes, `will-change` set in css/motion.css),
 *   b) auto-hide of the header: scrolling decisively past it hides it,
 *      scrolling back up brings it back — never while the mobile panel is
 *      open or while the keyboard focus sits inside the header,
 *   c) `.is-scrolled` on the header for a stronger glass surface.
 *
 * Only the scroll position is read inside the frame. The document height is
 * measured on init, resize and load, so writing styles never forces a reflow
 * in the same frame (no layout thrash).
 *
 * Nav active states are owned by js/nav.js and are deliberately untouched.
 */

import { qs, prefersReducedMotion } from '../core/dom.js';

/** Pixels of scroll before the header counts as scrolled. */
const SCROLLED_OFFSET = 8;
/** One-directional travel (px) needed to flip the hidden/visible state. */
const HIDE_THRESHOLD = 6;
/** Pixels of scroll before the progress bar fades in. */
const PROGRESS_EPSILON = 2;
/** Fallback when --header-h cannot be read. */
const FALLBACK_HEADER_H = 72;

let initialized = false;

/**
 * Wire the header chrome once: scroll progress, `.is-scrolled` and the
 * hide/show behaviour. Idempotent and silent when the header is missing.
 */
export function initScrollChrome() {
  if (initialized) return;
  initialized = true;

  const header = qs('.site-header');
  if (!header) return;

  const progress = qs('#scrollProgress');
  const fill = progress ? qs('span', progress) : null;

  const navToggle = qs('#navToggle');
  const navPanel = qs('#navDesktop');

  const autoHide = !prefersReducedMotion();
  const headerHeight = autoHide ? readHeaderHeight() : 0;

  /* Optional hero depth: the copy drifts a touch slower than the page while
     the hero is on screen, then snaps back untouched once it has scrolled by. */
  const hero = qs('.hero');
  const heroInner = qs('.hero-inner');
  const PARALLAX_FACTOR = 0.16;
  let parallaxCleared = true;

  let scrollRange = 1;
  let needsMeasure = true;
  let ticking = false;
  let lastRatio = -1;

  /* Hide/show state: `runDirection`/`runStart` track the reversal point of the
     current scroll gesture so 6px of jitter can never flip the header. */
  let hidden = false;
  let prevY = window.scrollY || window.pageYOffset || 0;
  let runDirection = 0;
  let runStart = prevY;

  /** Value of --header-h in px (72 by default). */
  function readHeaderHeight() {
    const raw = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h');
    const parsed = parseInt(raw, 10);

    return Number.isNaN(parsed) ? FALLBACK_HEADER_H : parsed;
  }

  /** Cache the scrollable distance: scrollHeight is never read mid-loop. */
  function measure() {
    const root = document.documentElement;
    scrollRange = Math.max(1, root.scrollHeight - root.clientHeight);
  }

  /** The header must stay put while the menu is open or focus is inside it. */
  function isPinned() {
    if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') return true;
    if (navPanel && navPanel.classList.contains('is-open')) return true;

    const active = document.activeElement;
    if (!active || !header.contains(active)) return false;

    try {
      /* Mouse clicks do not match :focus-visible, so they never pin the bar. */
      return active.matches(':focus-visible');
    } catch (error) {
      /* Selector unsupported: keep the header visible to stay safe. */
      return true;
    }
  }

  function setHidden(next) {
    if (hidden === next) return;
    hidden = next;
    header.classList.toggle('is-hidden', next);
  }

  function updateHeaderVisibility(y) {
    /* Just under the header it is always visible, and the gesture restarts. */
    if (y < headerHeight) {
      setHidden(false);
      runDirection = 0;
      runStart = y;
      prevY = y;
      return;
    }

    if (y !== prevY) {
      const direction = y > prevY ? 1 : -1;
      if (direction !== runDirection) {
        runDirection = direction;
        runStart = prevY;
      }
    }

    /* Pinned: re-anchor so closing the menu cannot hide the header later. */
    if (isPinned()) {
      runStart = y;
      prevY = y;
      return;
    }

    if (runDirection > 0 && y - runStart >= HIDE_THRESHOLD) {
      setHidden(true);
    } else if (runDirection < 0 && runStart - y >= HIDE_THRESHOLD) {
      setHidden(false);
    }

    prevY = y;
  }

  /** Write the progress fill (transform only) and its visibility state. */
  function paintProgress(y) {
    if (!progress || !fill) return;

    const ratio = Math.min(1, Math.max(0, y / scrollRange));

    if (ratio !== lastRatio) {
      lastRatio = ratio;
      fill.style.transform = 'scaleX(' + ratio + ')';
    }

    progress.classList.toggle('is-active', y > PROGRESS_EPSILON);
  }

  /** Drift the hero copy while it is on screen; clear it afterwards. */
  function paintParallax(y) {
    if (!autoHide || !hero || !heroInner) return;

    const height = hero.offsetHeight || 1;

    if (y >= height) {
      if (parallaxCleared) return;
      parallaxCleared = true;
      heroInner.style.transform = '';
      heroInner.style.opacity = '';
      return;
    }

    parallaxCleared = false;
    heroInner.style.transform = 'translate3d(0, ' + (y * PARALLAX_FACTOR).toFixed(1) + 'px, 0)';
    heroInner.style.opacity = String(Math.max(0, 1 - (y / height) * 1.15).toFixed(3));
  }

  function update() {
    if (needsMeasure) {
      needsMeasure = false;
      measure();
    }

    /* Read scroll position once per frame, before any style write. */
    const y = window.scrollY || window.pageYOffset || 0;

    paintProgress(y);
    paintParallax(y);
    header.classList.toggle('is-scrolled', y > SCROLLED_OFFSET);

    if (autoHide) updateHeaderVisibility(y);
  }

  function schedule() {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }

  function invalidate() {
    needsMeasure = true;
    schedule();
  }

  /* First paint: reflect the current position (history restores included). */
  update();

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', invalidate);
  window.addEventListener('load', invalidate);

  /* Filtered project lists change the page height without a window resize;
     re-measure from the observer so the ratio never goes stale. Our writes
     are transforms and classes only, so this can never loop. */
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(invalidate);
    observer.observe(document.documentElement);
  }
}
