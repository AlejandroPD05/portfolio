import { getGameDetails, getGameStores } from '../api.js';
import { translateToSpanish } from '../services/translator.js';
import { init3DTilt, animateLootDrop } from '../animations.js';

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function getRarityInfo(score, rating) {
  const calcScore = score || (rating ? rating * 20 : 0);
  if (calcScore >= 85 || rating >= 4.4) return { rarity: 'legendary', label: 'LEGENDARIO' };
  if (calcScore >= 75 || rating >= 3.8) return { rarity: 'epic', label: 'ÉPICO' };
  if (calcScore >= 60 || rating >= 3.0) return { rarity: 'rare', label: 'RARO' };
  if (calcScore >= 40 || rating >= 2.0) return { rarity: 'uncommon', label: 'POCO COMÚN' };
  return { rarity: 'common', label: 'COMÚN' };
}

function getStoreSvgIcon(slug, url = '') {
  const s = slug.toLowerCase();
  const u = url.toLowerCase();

  if (s.includes('steam') || u.includes('steampowered.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 14.719C1.842 20.061 6.678 24 12.001 24c6.624 0 11.999-5.375 11.999-12S18.604 0 11.979 0zM7.54 18.21a1.901 1.901 0 0 1-1.896-1.902c0-.18.028-.355.078-.521l2.022.836c-.021.12-.036.242-.036.368 0 1.047.849 1.896 1.896 1.896a1.89 1.89 0 0 0 1.341-.555l-2.001-.827c-.328.432-.843.705-1.404.705zm8.932-6.289a2.53 2.53 0 0 1-2.525-2.523 2.529 2.529 0 0 1 2.525-2.525 2.529 2.529 0 0 1 2.525 2.525c0 1.391-1.134 2.523-2.525 2.523z"/></svg>`;
  }
  if (s.includes('playstation') || u.includes('playstation.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8.882 17.55c-1.828-.43-3.033-1.047-3.033-1.74 0-1.218 3.565-1.854 7.15-1.854 3.585 0 7.15.636 7.15 1.854 0 .693-1.205 1.31-3.033 1.74l-.001 2.222c3.488-.535 6.034-1.848 6.034-3.962 0-2.613-3.856-3.854-10.15-3.854S2.85 13.39 2.85 16.003c0 2.114 2.546 3.427 6.033 3.962l-.001-2.415zM12 2.25L7.3 3.95v8.528l4.7-1.725V2.25z"/></svg>`;
  }
  if (s.includes('xbox') || u.includes('microsoft.com') || u.includes('xbox.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.1 4.5C2.3 6.5 1.2 9.1 1.2 12c0 2.8 1.1 5.4 2.8 7.4l4.2-5.7L4.1 4.5zm15.8 0l-4.1 9.2 4.2 5.7c1.7-2 2.8-4.6 2.8-7.4 0-2.9-1.1-5.5-2.9-7.5zM12 2.2C9.4 2.2 7 3.1 5.2 4.6l6.8 9.8 6.8-9.8C17 3.1 14.6 2.2 12 2.2zm0 19.6c2.6 0 5-.9 6.8-2.4l-6.8-9.8-6.8 9.8c1.8 1.5 4.2 2.4 6.8 2.4z"/></svg>`;
  }
  if (s.includes('epic') || u.includes('epicgames.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 6v12l10 4 10-4V6L12 2zm6 13.5l-6 2.4-6-2.4V8.5l6-2.4 6 2.4v7z"/></svg>`;
  }
  if (s.includes('nintendo') || u.includes('nintendo.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm-3 15H6V7h3v10zm9 0h-3V7h3v10z"/></svg>`;
  }
  if (s.includes('gog') || u.includes('gog.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>`;
  }
  if (s.includes('apple') || s.includes('app-store') || u.includes('apple.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.31c.67-.82 1.13-1.96.99-3.1-.98.04-2.2.66-2.88 1.46-.61.71-1.15 1.87-.99 2.98 1.1.08 2.23-.52 2.88-1.34z"/></svg>`;
  }
  if (s.includes('google') || s.includes('play') || u.includes('google.com')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.55.33-.95.84-.95.18 0 .37.05.54.16l14.12 8.5a1.1 1.1 0 0 1 0 1.89L4.38 21.6c-.17.11-.36.16-.54.16-.51 0-.84-.4-.84-.95z"/></svg>`;
  }

  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
}

function mergeStores(gameStores = [], apiStores = []) {
  const urlMap = new Map();
  if (Array.isArray(apiStores)) {
    apiStores.forEach(s => {
      if (s.store_id && s.url) {
        urlMap.set(s.store_id, s.url);
      }
    });
  }

  if (gameStores.length > 0) {
    return gameStores.map(item => {
      const storeObj = item.store || {};
      const storeId = storeObj.id || item.store_id;
      const url = urlMap.get(storeId) || item.url || (storeObj.domain ? `https://${storeObj.domain}` : '#');
      const name = storeObj.name || 'Tienda Digital';
      const slug = storeObj.slug || '';

      return {
        name,
        slug,
        url,
        icon: getStoreSvgIcon(slug, url)
      };
    });
  }

  return apiStores.map(item => {
    const url = item.url || '#';
    let name = 'Tienda Digital';
    let slug = '';

    if (url.includes('steampowered.com')) { name = 'Steam'; slug = 'steam'; }
    else if (url.includes('playstation.com')) { name = 'PlayStation Store'; slug = 'playstation'; }
    else if (url.includes('microsoft.com') || url.includes('xbox.com')) { name = 'Xbox Store'; slug = 'xbox'; }
    else if (url.includes('epicgames.com')) { name = 'Epic Games Store'; slug = 'epic-games'; }
    else if (url.includes('gog.com')) { name = 'GOG'; slug = 'gog'; }
    else if (url.includes('nintendo.com')) { name = 'Nintendo eShop'; slug = 'nintendo'; }
    else if (url.includes('apple.com')) { name = 'App Store'; slug = 'apple'; }
    else if (url.includes('google.com')) { name = 'Google Play'; slug = 'google-play'; }

    return { name, slug, url, icon: getStoreSvgIcon(slug, url) };
  });
}

export async function renderDetailView(queryParams = new URLSearchParams()) {
  const gameId = queryParams.get('id');
  const container = document.createElement('div');
  container.className = 'detail-page';

  if (!gameId) {
    container.innerHTML = `
      <div class="error-state">
        <p>Juego no encontrado en el Stash.</p>
        <a href="#/catalog" class="back-btn">Volver al catálogo</a>
      </div>
    `;
    return container;
  }

  container.innerHTML = `
    <div class="loader-wrapper">
      <div class="loader-spinner"></div>
      <p>Desenterrando botín legendario...</p>
    </div>
  `;

  try {
    const [game, storesData] = await Promise.all([
      getGameDetails(gameId),
      getGameStores(gameId)
    ]);

    const rawDescription = game.description_raw || game.description || '';
    const descriptionES = rawDescription ? await translateToSpanish(rawDescription) : 'Sin descripción disponible.';

    const resolvedStores = mergeStores(game.stores, storesData?.results);
    const rarityInfo = getRarityInfo(game.metacritic, game.rating);

    const storesHTML = resolvedStores.length > 0
      ? resolvedStores.map(store => `
          <a href="${escapeHTML(store.url)}" target="_blank" rel="noopener noreferrer" class="store-button tilt-card" title="Ir a ${escapeHTML(store.name)}">
            <span class="store-icon">${store.icon}</span>
            <span>${escapeHTML(store.name)}</span>
          </a>
        `).join('')
      : '<p class="no-data">No hay enlaces directos a tiendas oficiales registrados.</p>';

    const platformsHTML = game.platforms && game.platforms.length > 0
      ? game.platforms.map(p => `<li>${escapeHTML(p.platform.name)}</li>`).join('')
      : '<li>No especificado</li>';

    const developersHTML = game.developers && game.developers.length > 0
      ? game.developers.map(d => `<li>${escapeHTML(d.name)}</li>`).join('')
      : '<li>No especificado</li>';

    const genresHTML = game.genres && game.genres.length > 0
      ? game.genres.map(g => `<li>${escapeHTML(g.name)}</li>`).join('')
      : '<li>Varios</li>';

    const bgImage = game.background_image_additional || game.background_image || 'https://via.placeholder.com/1200x600';

    container.innerHTML = `
      <article class="game-detail-hero" style="background-image: linear-gradient(to bottom, rgba(7, 9, 14, 0.4), #07090e), url('${escapeHTML(bgImage)}')">
        <a href="#/catalog" class="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          <span>Volver al Stash</span>
        </a>
        
        <div class="hero-info">
          <div class="hero-header-tags">
            <span class="rarity-badge ${rarityInfo.rarity}">${rarityInfo.label}</span>
            ${game.metacritic ? `<span class="metacritic-pill">Metacritic: <strong>${game.metacritic}</strong></span>` : ''}
          </div>
          <h1>${escapeHTML(game.name)}</h1>
          <div class="meta-tags">
            <span class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${escapeHTML(game.released || 'N/A')}
            </span>
            <span class="meta-item rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ${game.rating || 'N/A'} / 5
            </span>
          </div>
        </div>
      </article>

      <section class="detail-body">
        <div class="description-column">
          <div class="detail-card">
            <h2>Descripción</h2>
            <div class="description-content">${escapeHTML(descriptionES).replace(/\n/g, '<br/>')}</div>
          </div>

          <div class="detail-card stores-section">
            <h3>Conseguir copia (Tiendas Oficiales)</h3>
            <div class="stores-grid">
              ${storesHTML}
            </div>
          </div>
        </div>
        
        <aside class="sidebar-column">
          <div class="sidebar-card">
            <h3>Plataformas</h3>
            <ul class="detail-list">${platformsHTML}</ul>
          </div>
          
          <div class="sidebar-card">
            <h3>Desarrolladores</h3>
            <ul class="detail-list">${developersHTML}</ul>
          </div>

          <div class="sidebar-card">
            <h3>Géneros</h3>
            <ul class="detail-list">${genresHTML}</ul>
          </div>
        </aside>
      </section>
    `;

    setTimeout(() => {
      animateLootDrop('.detail-card, .sidebar-card');
      init3DTilt('.tilt-card');
    }, 0);

  } catch (error) {
    container.innerHTML = `
      <div class="error-state">
        <p>Error al saquear la base de datos para este juego.</p>
        <a href="#/catalog" class="back-btn">Volver al catálogo</a>
      </div>
    `;
  }

  return container;
}