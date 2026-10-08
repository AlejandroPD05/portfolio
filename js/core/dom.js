/**
 * Minimal DOM helpers.
 *
 * Every piece of UI is rendered through `el()`, so project data is inserted as
 * text nodes instead of HTML strings: nothing on the page needs manual escaping.
 */

export const qs = (selector, root = document) => root.querySelector(selector);

export const qsa = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

/**
 * Create an element.
 *
 * Special attribute keys:
 *   text    -> textContent
 *   html    -> innerHTML (trusted inline SVG icons only)
 *   on      -> { eventName: handler }
 *   dataset -> { camelCaseKey: value }
 */
export function el(tag, attributes = {}, children = []) {
  const node = document.createElement(tag);

  Object.entries(attributes).forEach(([name, value]) => {
    if (value === undefined || value === null || value === false) return;

    if (name === 'text') {
      node.textContent = value;
      return;
    }
    if (name === 'html') {
      node.innerHTML = value;
      return;
    }
    if (name === 'on') {
      Object.entries(value).forEach(([event, handler]) =>
        node.addEventListener(event, handler)
      );
      return;
    }
    if (name === 'dataset') {
      Object.entries(value).forEach(([key, val]) => {
        node.dataset[key] = val;
      });
      return;
    }

    node.setAttribute(name, value === true ? '' : String(value));
  });

  append(node, children);
  return node;
}

export function append(parent, children) {
  const list = Array.isArray(children) ? children : [children];

  list.forEach((child) => {
    if (child === undefined || child === null || child === false) return;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });

  return parent;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/**
 * Single source of truth for "should motion be reduced?".
 *
 * Respects the OS/browser preference, except when the URL carries
 * `?motion=on` — a local-testing override that forces the full animation
 * set. The head script paints `html.force-motion` before the first frame,
 * so the CSS media blocks (which cannot read the URL) stay in sync.
 */
export const prefersReducedMotion = () =>
  !document.documentElement.classList.contains('force-motion') &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth-scroll to a section, accounting for the fixed header. */
export function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
    10
  );

  const top =
    target.getBoundingClientRect().top + window.pageYOffset - (headerHeight || 72) - 12;

  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}
