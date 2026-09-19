const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export async function getGames({ 
  search = '', 
  page = 1, 
  pageSize = 12, 
  genres = '', 
  platforms = '', 
  ordering = '-rating' 
} = {}) {
  try {
    let url = `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=${ordering}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (genres) {
      url += `&genres=${genres}`;
    }
    if (platforms) {
      url += `&platforms=${platforms}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al conectar con RAWG API');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getGameDetails(id) {
  try {
    const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
    if (!response.ok) throw new Error(`No se pudo obtener el juego ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getGameStores(id) {
  try {
    const response = await fetch(`${BASE_URL}/games/${id}/stores?key=${API_KEY}`);
    if (!response.ok) throw new Error(`No se pudieron obtener las tiendas del juego ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
}