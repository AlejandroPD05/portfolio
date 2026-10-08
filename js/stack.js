/**
 * Tech stack section: renders the grouped technology list.
 */

import { qs, el, clear } from './core/dom.js';
import { icon } from './ui/icons.js';
import { t, onLangChange } from './i18n/i18n.js';
import { skillGroups } from './data/skills.js';
import { observeReveals } from './reveal.js';

function createGroup(group) {
  return el('article', { class: 'stack-card' }, [
    el('h3', { class: 'stack-card-head' }, [
      el('span', { html: icon(group.icon) }),
      el('span', { text: t(group.labelKey) }),
    ]),
    el(
      'ul',
      { class: 'stack-items' },
      group.items.map((item) => el('li', { class: 'pill pill-stack', text: item }))
    ),
  ]);
}

export function initStack() {
  const grid = qs('#stackGrid');
  if (!grid) return;

  const render = () => {
    clear(grid);
    skillGroups.forEach((group) => grid.append(createGroup(group)));
    observeReveals(grid);
  };

  onLangChange(render);
  render();
}
