/**
 * Projects section controller: filter bar, project grid and archive list.
 *
 * All copy comes from `js/data/projects.js`; this module only owns the filter
 * state and the rendering cycle.
 */

import { qs, el, clear } from './core/dom.js';
import { t, getLang, onLangChange } from './i18n/i18n.js';
import {
  categories,
  filterProjects,
  getCategoryCounts,
  getFeaturedProjects,
  getProjectCount,
  GITHUB_PROFILE,
} from './data/projects.js';
import { createProjectCard } from './ui/project-card.js';
import { createArchiveRow } from './ui/archive-row.js';
import { observeReveals } from './reveal.js';

const SEARCH_DEBOUNCE_MS = 120;
const ALL_CATEGORY = 'all';

const state = { category: ALL_CATEGORY, query: '' };

let elements = null;
let searchTimer = null;

function createChip({ id, label, count }) {
  const isActive = state.category === id;

  return el(
    'button',
    {
      type: 'button',
      class: 'chip',
      dataset: { category: id },
      'aria-pressed': String(isActive),
      on: { click: () => selectCategory(id) },
    },
    [label, el('span', { class: 'chip-count', text: String(count) })]
  );
}

/** Rebuild the category chips, with counts, for the current language. */
function renderChips() {
  const counts = getCategoryCounts();
  const chips = [
    createChip({ id: ALL_CATEGORY, label: t('chipAll'), count: getProjectCount() }),
    ...categories
      .slice()
      .sort((a, b) => a.order - b.order)
      .filter((category) => counts.has(category.id))
      .map((category) =>
        createChip({
          id: category.id,
          label: t(category.labelKey),
          count: counts.get(category.id),
        })
      ),
  ];

  clear(elements.chips);
  chips.forEach((chip) => elements.chips.append(chip));
}

function selectCategory(categoryId) {
  state.category = categoryId;
  renderChips();
  renderResults();
}

function createEmptyState() {
  return el('div', { class: 'empty-state' }, [
    el('p', { text: t('emptyTitle') }),
    el('p', { class: 'archive-desc', text: t('emptyDesc') }),
    el('button', {
      type: 'button',
      class: 'btn btn-outline',
      text: t('clearFilters'),
      on: { click: resetFilters },
    }),
  ]);
}

function resetFilters() {
  state.category = ALL_CATEGORY;
  state.query = '';
  if (elements.search) elements.search.value = '';
  renderChips();
  renderResults();
}

function renderGrid(projects) {
  clear(elements.grid);
  projects.forEach((project) => {
    elements.grid.append(createProjectCard(project, getLang()));
  });
}

function renderArchive(projects) {
  const hasProjects = projects.length > 0;

  elements.archiveHead.hidden = !hasProjects;
  elements.archive.hidden = !hasProjects;

  clear(elements.archive);
  projects.forEach((project) => elements.archive.append(createArchiveRow(project, getLang())));
}

function renderCounter(total, shown) {
  const isFiltered = state.category !== ALL_CATEGORY || state.query.trim() !== '';

  elements.results.textContent = isFiltered ? t('resultsLabel', { n: shown, total }) : '';
}

function renderResults() {
  const lang = getLang();
  const matches = filterProjects(state, lang);
  const featured = matches.filter((project) => project.tier === 'featured');
  const archive = matches.filter((project) => project.tier !== 'featured');

  const nothingFound = matches.length === 0;

  if (nothingFound) {
    clear(elements.grid);
    elements.grid.append(createEmptyState());
    renderArchive([]);
  } else {
    renderGrid(featured);
    renderArchive(archive);
  }

  renderCounter(getProjectCount(), matches.length);
  observeReveals(elements.grid);
  observeReveals(elements.archive);
}

function renderNote() {
  elements.note.textContent = t('projectsNote', {
    total: getProjectCount(),
    featured: getFeaturedProjects().length,
  });
}

function renderAll() {
  renderNote();
  renderChips();
  renderResults();
  renderArchiveLink();
}

function renderArchiveLink() {
  if (!elements.allRepos) return;
  elements.allRepos.href = GITHUB_PROFILE;
  elements.allRepos.textContent = t('viewAllRepos', { n: getProjectCount() });
}

function onSearchInput(event) {
  window.clearTimeout(searchTimer);

  const value = event.target.value;

  searchTimer = window.setTimeout(() => {
    state.query = value;
    renderResults();
  }, SEARCH_DEBOUNCE_MS);
}

export function initProjects() {
  elements = {
    grid: qs('#projectGrid'),
    archive: qs('#archiveList'),
    archiveHead: qs('#archiveHead'),
    chips: qs('#categoryChips'),
    search: qs('#projectSearch'),
    note: qs('#projectsNote'),
    results: qs('#projectsResults'),
    allRepos: qs('#allReposLink'),
  };

  if (!elements.grid || !elements.chips) return;

  if (elements.search) {
    elements.search.addEventListener('input', onSearchInput);
  }

  onLangChange(renderAll);
  renderAll();
}
