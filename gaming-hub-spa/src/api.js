const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export async function getGames({ search = '', page = 1, pageSize = 12 } = {}) {
  try {
    let url = `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=-rating`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
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