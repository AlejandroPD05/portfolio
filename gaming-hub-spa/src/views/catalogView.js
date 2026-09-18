import { getGames } from '../api.js';
import { init3DTilt, animateLootDrop } from '../animations.js';

export async function renderCatalogView(queryParams = {}) {
  const searchQuery = queryParams.get('search') || '';

  const container = document.createElement('div');
  container.className = 'catalog-page';
  container.innerHTML = `
    <section class="hero-section">
      <h1>Abre el <span>Vault</span> de los Videojuegos</h1>
      <p class="hero-subtitle">Descubre títulos legendarios, calificaciones de Metacritic y análisis en tiempo real.</p>
      <form id="search-form" class="search-box">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Buscar un juego (ej. Zelda, Cyberpunk, Elden Ring)..." 
          value="${searchQuery}"
        />
        <button type="submit">Explorar</button>
      </form>
    </section>

    <section class="games-grid" id="games-grid">
      ${Array(12).fill('<div class="skeleton-card"></div>').join('')}
    </section>
  `;

  setTimeout(async () => {
    const grid = container.querySelector('#games-grid');
    try {
      const data = await getGames({ search: searchQuery, pageSize: 12 });
      
      if (!data.results || data.results.length === 0) {
        grid.innerHTML = `<p class="empty-state">No se encontró botín para "${searchQuery}".</p>`;
        return;
      }

      grid.innerHTML = data.results.map(game => {
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
      }).join('');

      animateLootDrop('.game-card');
      init3DTilt('.game-card');

    } catch (err) {
      grid.innerHTML = `<p class="error-state">Ocurrió un error al saquear la base de datos. Revisa tu API Key.</p>`;
    }
  }, 0);

  container.addEventListener('submit', (e) => {
    if (e.target.id === 'search-form') {
      e.preventDefault();
      const query = container.querySelector('#search-input').value.trim();
      window.location.hash = query ? `#/catalog?search=${encodeURIComponent(query)}` : '#/';
    }
  });

  return container;
}