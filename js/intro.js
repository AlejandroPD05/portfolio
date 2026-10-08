/**
 * Terminal boot intro â€” types a short boot log over a full-screen overlay and
 * hands the page back to the caller exactly once.
 *
 * Contract (wired by main.js):
 *
 *   runIntro(onDone)
 *
 * `onDone` fires exactly once on every path â€” natural finish, skip (key /
 * pointer / wheel / touch), reduced motion, missing markup or an unexpected
 * error â€” so the page is never left scroll-locked behind the overlay.
 */

import { t } from './i18n/i18n.js';
import { prefersReducedMotion } from './core/dom.js';

/* Boot log keys, typed into #introLines one line after another. They resolve
   through the language layer, so the intro speaks the visitor's language. */
const LINE_KEYS = ['introBoot1', 'introBoot2', 'introBoot3', 'introBoot4', 'introBoot5', 'introBoot6'];

/* Timing in ms. ~10ms per char with a short gap between lines lands the whole
   sequence around 1.7s â€” inside the 1.6â€“2.2s budget for the intro. */
const CHAR_MS = 10;
const LINE_GAP_MS = 100;
const HOLD_MS = 200;
const EXIT_FALLBACK_MS = 1000; // hard timeout behind the 0.55s CSS exit wipe
const WATCHDOG_MS = 4000; // absolute safety net: finish() can never be starved

const SKIP_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'];

export function runIntro(onDone) {
  /* Copy + timing, resolved for the active language. */
  const lines = LINE_KEYS.map((key) => t(key));
  const typingMs =
    lines.reduce((sum, line) => sum + line.length, 0) * CHAR_MS + (lines.length - 1) * LINE_GAP_MS;

  /* --- State ------------------------------------------------------------ */
  let notified = false; // onDone has been called
  let cleaned = false; // overlay removed + scroll released
  let finished = false; // exit transition started

  let rafId = 0;
  let holdTimer = 0;
  let exitTimer = 0;
  let watchdog = 0;

  /* Typing state. */
  let started = false;
  let startAt = 0;
  let lineIndex = 0;
  let charIndex = 0;
  let lineStartedAt = 0;
  let nextLineAt = 0;
  let holdUntil = 0;
  let currentLine = null;

  let root = null;
  let intro = null;
  let linesEl = null;
  let barFill = null;

  /* --- Teardown --------------------------------------------------------- */

  /** Fire the callback at most once, however many paths converge on it. */
  function notify() {
    if (notified) return;
    notified = true;
    if (typeof onDone === 'function') onDone();
  }

  /** Remove the overlay, release the scroll lock, then report back. */
  function cleanup() {
    if (cleaned) return;
    cleaned = true;

    window.cancelAnimationFrame(rafId);
    window.clearTimeout(holdTimer);
    window.clearTimeout(exitTimer);
    window.clearTimeout(watchdog);
    removeSkipListeners();

    try {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    } catch (error) {
      /* Already detached â€” nothing left to remove. */
    }

    try {
      if (root) root.classList.remove('intro-active');
    } catch (error) {
      /* Never let class bookkeeping block the callback. */
    }

    notify();
  }

  /** Best-effort teardown for timer/rAF paths, where nothing else catches. */
  function forceCleanup() {
    try {
      cleanup();
    } catch (error) {
      // Never throw out of an async callback: the DOM is already released.
    }
  }

  /** Single, idempotent exit: wipe the overlay, then release everything. */
  function finish() {
    if (finished) return;
    finished = true;

    try {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(holdTimer);
      window.clearTimeout(watchdog);
      removeSkipListeners();

      // Glide the bar to 100% so a skip never leaves it frozen mid-way.
      if (barFill) {
        barFill.style.transition = 'width 200ms linear';
        barFill.style.width = '100%';
      }

      if (!intro) {
        cleanup();
        return;
      }

      intro.classList.add('is-done');
      intro.addEventListener('transitionend', onTransitionEnd);
      exitTimer = window.setTimeout(cleanup, EXIT_FALLBACK_MS);
    } catch (error) {
      forceCleanup();
    }
  }

  /** Ignore bubbled transitions from .intro-inner; react only to the wipe. */
  function onTransitionEnd(event) {
    if (!intro || event.target !== intro) return;
    intro.removeEventListener('transitionend', onTransitionEnd);
    cleanup();
  }

  /* --- Skip ------------------------------------------------------------- */

  function onSkip() {
    finish();
  }

  function addSkipListeners() {
    SKIP_EVENTS.forEach((type) =>
      window.addEventListener(type, onSkip, { capture: true, passive: true })
    );
  }

  function removeSkipListeners() {
    SKIP_EVENTS.forEach((type) => window.removeEventListener(type, onSkip, true));
  }

  /* --- Sequence --------------------------------------------------------- */

  /** Drive #introBarFill across exactly the typing window. */
  function startBar() {
    if (!barFill) return;

    barFill.style.transition = 'none';
    barFill.style.width = '0%';
    void barFill.offsetWidth; // flush the 0% start so the transition plays
    barFill.style.transition = `width ${typingMs}ms linear`;
    barFill.style.width = '100%';
  }

  /** One rAF step: reveal characters against the wall clock, then finish. */
  function frame(now) {
    if (finished) return;

    try {
      if (!started) {
        started = true;
        startAt = now;
      }
      const elapsed = now - startAt;

      // All lines typed: hold on the finished log, then exit.
      if (lineIndex >= lines.length) {
        if (elapsed >= holdUntil) {
          finish();
          return;
        }
        rafId = window.requestAnimationFrame(frame);
        return;
      }

      // Waiting in the gap between two lines.
      if (!currentLine) {
        if (elapsed < nextLineAt) {
          rafId = window.requestAnimationFrame(frame);
          return;
        }
        currentLine = document.createElement('p');
        currentLine.className = 'intro-line is-active';
        linesEl.append(currentLine);
        lineStartedAt = elapsed;
        charIndex = 0;
      }

      const text = lines[lineIndex];
      const target = Math.min(text.length, Math.floor((elapsed - lineStartedAt) / CHAR_MS));

      if (target > charIndex) {
        charIndex = target;
        currentLine.textContent = text.slice(0, charIndex);
      }

      if (charIndex >= text.length) {
        if (lineIndex === lines.length - 1) {
          // Keep the final prompt in its accent state through the hold.
          lineIndex = lines.length;
          holdUntil = elapsed + HOLD_MS;
          holdTimer = window.setTimeout(finish, HOLD_MS);
        } else {
          currentLine.classList.remove('is-active');
          currentLine = null;
          charIndex = 0;
          lineIndex += 1;
          nextLineAt = elapsed + LINE_GAP_MS;
        }
      }

      rafId = window.requestAnimationFrame(frame);
    } catch (error) {
      forceCleanup();
    }
  }

  /* --- Entry point ------------------------------------------------------ */

  try {
    root = document.documentElement;
    intro = document.getElementById('intro');
    linesEl = document.getElementById('introLines');
    barFill = document.getElementById('introBarFill');

    const reducedMotion = prefersReducedMotion();

    // Fast path: nothing to animate â€” tear down instantly and synchronously.
    if (!intro || !linesEl || reducedMotion) {
      cleanup();
      return;
    }

    root.classList.add('intro-active');
    startBar();
    addSkipListeners();
    watchdog = window.setTimeout(finish, WATCHDOG_MS);
    rafId = window.requestAnimationFrame(frame);
  } catch (error) {
    forceCleanup();
  }
}
