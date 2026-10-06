/**
 * Translation Service
 * Uses the free MyMemory Translation API (https://mymemory.translated.net)
 * - No API key required
 * - Works directly from the browser (no backend needed)
 * - Free tier: 100 words/day per IP. Larger texts are automatically chunked.
 */

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

// MyMemory has a 500-char limit per request — chunk long texts
const CHUNK_SIZE = 450;

function chunkText(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + sentence).length > CHUNK_SIZE) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text.substring(0, CHUNK_SIZE)];
}

async function translateChunk(text, targetLang) {
  const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translation API error: ${res.status}`);
  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Translation failed');
  }
  return data.responseData.translatedText;
}

/**
 * Translate text to the given language code.
 * Long texts are automatically chunked to fit API limits.
 *
 * @param {string} text - Source text in English
 * @param {string} targetLang - BCP 47 language code (e.g. 'hi', 'ta', 'es')
 * @param {function} [onProgress] - Optional callback (0-100) for progress updates
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang, onProgress) {
  if (!text || !targetLang || targetLang === 'en') return text;

  const chunks = chunkText(text);
  const translated = [];

  for (let i = 0; i < chunks.length; i++) {
    const result = await translateChunk(chunks[i], targetLang);
    translated.push(result);
    if (onProgress) onProgress(Math.round(((i + 1) / chunks.length) * 100));
    // Small delay to be respectful of the free API
    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 200));
  }

  return translated.join(' ');
}
