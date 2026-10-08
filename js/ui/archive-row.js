/**
 * Archive row — the compact view for "more projects and experiments".
 */

import { el } from '../core/dom.js';
import { icon } from './icons.js';
import { t, localized } from '../i18n/i18n.js';

const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' };

function createLink(href, label, iconName) {
  return el('a', { class: 'link-arrow', href, ...NEW_TAB }, [
    label,
    el('span', { html: icon(iconName) }),
  ]);
}

function createMeta(project) {
  const meta = [project.language, project.year].filter(Boolean).join(' · ');
  return el('span', { class: 'archive-meta', text: meta });
}

function createLinks(project) {
  const links = [createMeta(project)];

  if (project.demo) {
    links.push(createLink(project.demo, t('linkLive'), 'arrowUpRight'));
  }

  if (project.repo) {
    links.push(createLink(project.repo, t('linkCode'), 'github'));
  }

  return el('div', { class: 'archive-links' }, links);
}

/**
 * @param {object} project entry from `js/data/projects.js`
 * @param {string} lang    current language code
 * @returns {HTMLElement} a list item ready to drop into `.archive-list`
 */
export function createArchiveRow(project, lang) {
  return el('li', { class: 'archive-row', dataset: { id: project.id } }, [
    el('div', { class: 'archive-main' }, [
      el('span', { class: 'archive-name', text: localized(project.name, lang) }),
      el('span', { class: 'archive-desc', text: localized(project.tag, lang) }),
    ]),
    createLinks(project),
  ]);
}
