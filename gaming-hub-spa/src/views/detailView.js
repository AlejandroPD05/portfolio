import { getGameDetails } from '../api.js';
import { translateToSpanish } from '../services/translator.js';

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
    const game = await getGameDetails(gameId);

    const rawDescription = game.description_raw || game.description || '';
    const descriptionES = await translateToSpanish(rawDescription);

    container.innerHTML = `
      <article class="game-detail-hero" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), #07090e), url('${game.background_image_additional || game.background_image}')">
        <a href="#/" class="back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver al Vault
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
        </div>
        
        <aside class="sidebar">
          <h3>Plataformas</h3>
          <ul>${game.platforms ? game.platforms.map(p => `<li>${p.platform.name}</li>`).join('') : 'N/A'}</ul>
          
          <h3>Desarrolladores</h3>
          <ul>${game.developers ? game.developers.map(d => `<li>${d.name}</li>`).join('') : 'N/A'}</ul>
        </aside>
      </section>
    `;
  } catch (error) {
    container.innerHTML = `<div class="error-state"><p>Error al obtener la información del juego.</p><a href="#/" class="back-btn">Volver</a></div>`;
  }

  return container;
}