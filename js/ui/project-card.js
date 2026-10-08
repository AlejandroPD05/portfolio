/**
 * Featured project card — the detailed view used in the projects grid.
 */

import { el } from '../core/dom.js';
import { icon } from './icons.js';
import { t, localized } from '../i18n/i18n.js';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' };

function createActionLink(href, label, iconName) {
  return el('a', { class: 'link-arrow', href, ...NEW_TAB }, [
    label,
    el('span', { html: icon(iconName) }),
  ]);
}

function createHeader(project, lang) {
  const meta = [project.ticket ? `#${project.ticket}` : null, project.year]
    .filter(Boolean)
    .join(' · ');

  return el('div', { class: 'card-top' }, [
    el('span', { class: 'card-index', text: meta }),
    el('span', { class: 'tag', text: localized(project.kicker, lang) }),
  ]);
}

function createHighlights(project, lang) {
  const items = localized(project.highlights, lang);
  if (!Array.isArray(items) || items.length === 0) return null;

  return el(
    'ul',
    { class: 'card-highlights' },
    items.map((item) => el('li', { text: item }))
  );
}

function createStack(project) {
  const stack = project.stack ?? [];
  if (stack.length === 0) return null;

  return el(
    'div',
    { class: 'card-tags' },
    stack.map((technology) => el('span', { class: 'pill', text: technology }))
  );
}

function createActions(project) {
  const actions = [];

  if (project.demo) {
    actions.push(
      createActionLink(project.demo, t(project.demoLabelKey ?? 'linkLive'), 'arrowUpRight')
    );
  }

  if (project.repo) {
    actions.push(createActionLink(project.repo, t('linkCode'), 'github'));
  }

  return el('div', { class: 'card-actions' }, actions);
}

/**
 * @param {object} project entry from `js/data/projects.js`
 * @param {string} lang    current language code
 * @returns {HTMLElement} a fully rendered card
 */
export function createProjectCard(project, lang) {
  return el(
    'article',
    {
      class: 'project-card reveal',
      dataset: { id: project.id, categories: project.categories.join(' ') },
    },
    [
      createHeader(project, lang),
      el('h3', { class: 'card-title', text: localized(project.title, lang) }),
      el('p', { class: 'card-desc', text: localized(project.summary, lang) }),
      createHighlights(project, lang),
      createStack(project),
      createActions(project),
    ]
  );
}
