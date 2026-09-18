export async function translateToSpanish(text) {
  if (!text) return 'Sin descripción disponible.';

  const textToTranslate = text.length > 800 ? text.substring(0, 800) + '...' : text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(textToTranslate)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0]) {
      return data[0].map(segment => segment[0]).join('');
    }
  } catch (error) {
    console.warn('Error al traducir, mostrando original:', error);
  }

  return text;
}