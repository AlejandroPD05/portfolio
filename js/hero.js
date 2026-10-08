/**
 * Hero statistics — counted from the project dataset so the numbers can never
 * drift away from the actual catalogue.
 */

import { qs } from './core/dom.js';
import { getFeaturedProjects, getLiveDemoCount, getProjectCount } from './data/projects.js';

function setStat(selector, value) {
  const node = qs(selector);
  if (node) node.textContent = String(value);
}

export function initHero() {
  setStat('#statProjectCount', getProjectCount());
  setStat('#statDemoCount', getLiveDemoCount());
  setStat('#statFeaturedCount', getFeaturedProjects().length);
}
