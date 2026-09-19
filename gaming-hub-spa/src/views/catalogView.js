import { getGames } from '../api.js';
import { init3DTilt, animateLootDrop } from '../animations.js';

export async function renderCatalogView(queryParams = new URLSearchParams()) {
  const searchQuery = queryParams.get('search') || '';
  const currentGenreStr = queryParams.get('genres') || '';
  const selectedGenres = currentGenreStr ? currentGenreStr.split(',') : [];
  const currentOrdering = queryParams.get('ordering') || '-rating';
  let currentPage = 1;

  const orderingLabels = {
    '-rating': 'Mejor Valorados',
    '-released': 'Novedades',
    '-added': 'Más Populares',
    'name': 'Nombre (A-Z)'
  };

  const container = document.createElement('div');
  container.className = 'catalog-page';
  container.innerHTML = `
    <section class="hero-section">
      <h1>Abre la <span>DEX</span> de los Videojuegos</h1>
      <p class="hero-subtitle">Descubre títulos legendarios, calificaciones de Metacritic y análisis en tiempo real.</p>
      
      <form id="search-form" class="search-box-wrapper">
        <div class="search-box">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Buscar un juego (ej. Zelda, Cyberpunk, Elden Ring)..." 
            value="${searchQuery}"
          />
          <button type="submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Explorar</span>
          </button>
        </div>

        <div class="filters-container">
          <div class="genre-chips-container" id="genre-chips">
            <button type="button" class="genre-chip ${selectedGenres.length === 0 ? 'active' : ''}" data-genre="">Todos</button>
            <button type="button" class="genre-chip ${selectedGenres.includes('action') ? 'active' : ''}" data-genre="action">Acción</button>
            <button type="button" class="genre-chip ${selectedGenres.includes('role-playing-games-rpg') ? 'active' : ''}" data-genre="role-playing-games-rpg">RPG</button>
            <button type="button" class="genre-chip ${selectedGenres.includes('shooter') ? 'active' : ''}" data-genre="shooter">Shooter</button>
            <button type="button" class="genre-chip ${selectedGenres.includes('adventure') ? 'active' : ''}" data-genre="adventure">Aventura</button>
            <button type="button" class="genre-chip ${selectedGenres.includes('indie') ? 'active' : ''}" data-genre="indie">Indie</button>
            <button type="button" class="genre-chip ${selectedGenres.includes('strategy') ? 'active' : ''}" data-genre="strategy">Estrategia</button>
          </div>

          <input type="hidden" id="filter-genre-val" value="${currentGenreStr}" />
          <input type="hidden" id="filter-ordering-val" value="${currentOrdering}" />

          <div class="custom-dropdown-wrapper">
            <span class="dropdown-label">Ordenar por:</span>
            <div class="custom-dropdown" id="ordering-dropdown">
              <button type="button" class="dropdown-trigger" id="dropdown-trigger">
                <span class="selected-text" id="selected-ordering-text">${orderingLabels[currentOrdering] || 'Mejor Valorados'}</span>
                <svg class="dropdown-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              
              <div class="dropdown-menu" id="dropdown-menu">
                <div class="dropdown-option ${currentOrdering === '-rating' ? 'selected' : ''}" data-value="-rating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Mejor Valorados
                </div>
                <div class="dropdown-option ${currentOrdering === '-released' ? 'selected' : ''}" data-value="-released">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Novedades
                </div>
                <div class="dropdown-option ${currentOrdering === '-added' ? 'selected' : ''}" data-value="-added">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Más Populares
                </div>
                <div class="dropdown-option ${currentOrdering === 'name' ? 'selected' : ''}" data-value="name">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6v12a3 3 0 0 0 3-3H6a3 3 0 0 0 3 3V6"/></svg>
                  Nombre (A-Z)
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>

    <section class="games-grid" id="games-grid">
      ${Array(12).fill('<div class="skeleton-card"></div>').join('')}
    </section>

    <div class="load-more-wrapper">
      <button id="load-more-btn" class="btn-load-more">Mostrar más botín</button>
    </div>
  `;

  function createGameCardHTML(game) {
    const releaseYear = game.released ? game.released.split('-')[0] : 'N/A';
    const platformsList = game.platforms 
      ? game.platforms.slice(0, 3).map(p => `<span class="platform-pill">${p.platform.name}</span>`).join('') 
      : '';
    const genresText = game.genres ? game.genres.map(g => g.name).slice(0, 2).join(' • ') : 'Varios';

    let rarity = 'rare';
    let rarityLabel = 'RARE LOOT';
    if (game.metacritic >= 85 || game.rating >= 4.4) {
      rarity = 'legendary';
      rarityLabel = 'LEGENDARY';
    } else if (game.metacritic >= 75 || game.rating >= 3.8) {
      rarity = 'epic';
      rarityLabel = 'EPIC LOOT';
    }

    return `
      <article class="game-card" data-id="${game.id}" data-rarity="${rarity}">
        <a href="#/game?id=${game.id}">
          <div class="card-media">
            <img src="${game.background_image || 'https://via.placeholder.com/600x350'}" alt="${game.name}" loading="lazy" />
            <div class="card-badges">
              <span class="rarity-badge ${rarity}">${rarityLabel}</span>
              <span class="rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ${game.rating}
              </span>
            </div>
          </div>
          <div class="card-content">
            <h3>${game.name}</h3>
            <div class="card-info-row">
              <span>${genresText}</span>
              <span class="inline-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${releaseYear}
              </span>
            </div>
            <div class="platform-pills">
              ${platformsList}
            </div>
          </div>
        </a>
      </article>
    `;
  }

  function triggerSearch() {
    const query = container.querySelector('#search-input').value.trim();
    const genre = container.querySelector('#filter-genre-val').value;
    const ordering = container.querySelector('#filter-ordering-val').value;

    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (genre) params.set('genres', genre);
    if (ordering) params.set('ordering', ordering);

    window.location.hash = `#/catalog?${params.toString()}`;
  }

  setTimeout(async () => {
    const grid = container.querySelector('#games-grid');
    const loadMoreBtn = container.querySelector('#load-more-btn');
    const genreChipsContainer = container.querySelector('#genre-chips');
    const dropdownWrapper = container.querySelector('#ordering-dropdown');
    const dropdownTrigger = container.querySelector('#dropdown-trigger');
    const dropdownMenu = container.querySelector('#dropdown-menu');

    genreChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.genre-chip');
      if (!chip) return;

      const clickedGenre = chip.dataset.genre;
      const todosChip = genreChipsContainer.querySelector('.genre-chip[data-genre=""]');

      if (clickedGenre === '') {
        genreChipsContainer.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
        todosChip.classList.add('active');
      } else {
        todosChip.classList.remove('active');
        chip.classList.toggle('active');

        const activeChips = genreChipsContainer.querySelectorAll('.genre-chip.active:not([data-genre=""])');
        if (activeChips.length === 0) {
          todosChip.classList.add('active');
        }
      }

      const activeGenres = Array.from(genreChipsContainer.querySelectorAll('.genre-chip.active'))
        .map(c => c.dataset.genre)
        .filter(g => g !== '');

      container.querySelector('#filter-genre-val').value = activeGenres.join(',');
      triggerSearch();
    });

    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownWrapper.classList.toggle('open');
    });

    dropdownMenu.addEventListener('click', (e) => {
      const option = e.target.closest('.dropdown-option');
      if (!option) return;

      dropdownMenu.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      const val = option.dataset.value;
      container.querySelector('#filter-ordering-val').value = val;
      container.querySelector('#selected-ordering-text').textContent = option.textContent.trim();

      dropdownWrapper.classList.remove('open');
      triggerSearch();
    });

    document.addEventListener('click', (e) => {
      if (!dropdownWrapper.contains(e.target)) {
        dropdownWrapper.classList.remove('open');
      }
    });

    async function fetchAndAppendGames(page) {
      try {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Cargando juegos...';

        const genreVal = container.querySelector('#filter-genre-val').value;
        const orderingVal = container.querySelector('#filter-ordering-val').value;

        const data = await getGames({ 
          page: page, 
          search: searchQuery, 
          genres: genreVal,
          ordering: orderingVal,
          pageSize: 12 
        });

        if (!data.results || data.results.length === 0) {
          if (page === 1) {
            grid.innerHTML = `<p class="empty-state">No se encontró botín para esta combinación de filtros.</p>`;
          }
          loadMoreBtn.style.display = 'none';
          return;
        }

        if (page === 1) {
          grid.innerHTML = '';
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.results.map(createGameCardHTML).join('');
        const newCards = Array.from(tempDiv.children);

        newCards.forEach(card => {
          card.classList.add('fresh-card');
          grid.appendChild(card);
        });

        animateLootDrop('.fresh-card');
        init3DTilt('.fresh-card');

        newCards.forEach(card => card.classList.remove('fresh-card'));

        if (!data.next) {
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.disabled = false;
          loadMoreBtn.style.display = 'inline-block';
          loadMoreBtn.textContent = 'Mostrar más botín';
        }

      } catch (err) {
        if (page === 1) {
          grid.innerHTML = `<p class="error-state">Ocurrió un error al saquear la base de datos.</p>`;
        }
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Reintentar';
      }
    }

    await fetchAndAppendGames(currentPage);

    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      fetchAndAppendGames(currentPage);
    });

  }, 0);

  container.addEventListener('submit', (e) => {
    if (e.target.id === 'search-form') {
      e.preventDefault();
      triggerSearch();
    }
  });

  return container;
}