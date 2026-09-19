import { getGameDetails, getGameStores } from '../api.js';
import { translateToSpanish } from '../services/translator.js';

function getStoreSvgIcon(slug) {
  if (slug.includes('steam')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.41 2.87 8.16 6.84 9.5l2.68-3.87a3.48 3.48 0 0 1-.52-1.83c0-.33.05-.66.13-.97l-3.32-2.38a4.34 4.34 0 0 1-2.81-4.1c0-2.4 1.95-4.35 4.35-4.35 2.37 0 4.3 1.9 4.35 4.25l3.87 2.76c.38-.1.78-.16 1.18-.16 2.62 0 4.75 2.13 4.75 4.75 0 2.62-2.13 4.75-4.75 4.75a4.75 4.75 0 0 1-4.73-4.34l-3.83 2.76A10 10 0 0 0 12 22a10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/></svg>`;
  }
  if (slug.includes('playstation')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8.882 17.55c-1.828-.43-3.033-1.047-3.033-1.74 0-1.218 3.565-1.854 7.15-1.854 3.585 0 7.15.636 7.15 1.854 0 .693-1.205 1.31-3.033 1.74l-.001 2.222c3.488-.535 6.034-1.848 6.034-3.962 0-2.613-3.856-3.854-10.15-3.854S2.85 13.39 2.85 16.003c0 2.114 2.546 3.427 6.033 3.962l-.001-2.415zM12 2.25L7.3 3.95v8.528l4.7-1.725V2.25z"/></svg>`;
  }
  if (slug.includes('xbox')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.1 4.5C2.3 6.5 1.2 9.1 1.2 12c0 2.8 1.1 5.4 2.8 7.4l4.2-5.7L4.1 4.5zm15.8 0l-4.1 9.2 4.2 5.7c1.7-2 2.8-4.6 2.8-7.4 0-2.9-1.1-5.5-2.9-7.5zM12 2.2C9.4 2.2 7 3.1 5.2 4.6l6.8 9.8 6.8-9.8C17 3.1 14.6 2.2 12 2.2zm0 19.6c2.6 0 5-.9 6.8-2.4l-6.8-9.8-6.8 9.8c1.8 1.5 4.2 2.4 6.8 2.4z"/></svg>`;
  }
  if (slug.includes('epic')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 6v12l10 4 10-4V6L12 2zm6 13.5l-6 2.4-6-2.4V8.5l6-2.4 6 2.4v7z"/></svg>`;
  }
  if (slug.includes('nintendo')) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm-3 15H6V7h3v10zm9 0h-3V7h3v10z"/></svg>`;
  }
  // Icono por defecto (tienda/carrito en SVG)
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
}

export async function renderDetailView(queryParams) {
  const gameId = queryParams.get('id');
  const container = document.createElement('div');
  container.className = 'detail-page';

  if (!gameId) {
    container.innerHTML = `<div class="error-state"><p>Juego no encontrado.</p><a href="#/" class="back-btn">Volver al catálogo</a></div>`;
    return container;
  }

  container.innerHTML = `<div class="loader-spinner">Cargando botín...</div>`;

  try {
    const [game, storesData] = await Promise.all([
      getGameDetails(gameId),
      getGameStores(gameId)
    ]);

    const rawDescription = game.description_raw || game.description || '';
    const descriptionES = await translateToSpanish(rawDescription);

    const storesHTML = storesData.results && storesData.results.length > 0
      ? storesData.results.map(item => {
          const storeName = item.store ? item.store.name : 'Tienda externa';
          const storeSlug = item.store ? item.store.slug : '';
          const url = item.url;
          return `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="store-button">
              <span class="store-icon">${getStoreSvgIcon(storeSlug)}</span>
              <span>${storeName}</span>
            </a>
          `;
        }).join('')
      : '<p class="no-data">No hay enlaces directos a tiendas disponibles.</p>';

    container.innerHTML = `
      <article class="game-detail-hero" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), #07090e), url('${game.background_image_additional || game.background_image}')">
        <a href="#/" class="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver a la DEX
        </a>
        <div class="hero-info">
          <h1>${game.name}</h1>
          <div class="meta-tags">
            <span>Lanzamiento: ${game.released || 'N/A'}</span>
            <span>Metacritic: ${game.metacritic || 'N/A'}</span>
            <span>Rating: ${game.rating} / 5</span>
          </div>
        </div>
      </article>

      <section class="detail-body">
        <div class="description">
          <h2>Descripción</h2>
          <p>${descriptionES}</p>

          <div class="stores-section">
            <h3>Conseguir copia (Tiendas Oficiales)</h3>
            <div class="stores-grid">
              ${storesHTML}
            </div>
          </div>
        </div>
        
        <aside class="sidebar">
          <h3>Plataformas</h3>
          <ul>${game.platforms ? game.platforms.map(p => `<li>${p.platform.name}</li>`).join('') : 'N/A'}</ul>
          
          <h3>Desarrolladores</h3>
          <ul>${game.developers ? game.developers.map(d => `<li>${d.name}</li>`).join('') : 'N/A'}</ul>

          <h3>Géneros</h3>
          <ul>${game.genres ? game.genres.map(g => `<li>${g.name}</li>`).join('') : 'N/A'}</ul>
        </aside>
      </section>
    `;
  } catch (error) {
    container.innerHTML = `<div class="error-state"><p>Error al obtener la información del juego.</p><a href="#/" class="back-btn">Volver</a></div>`;
  }

  return container;
}