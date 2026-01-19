import search, { init } from "@/output/docfind.js";

export async function initSearch() {
  const searchStart = performance.now();
  try {
    await init();
  } catch (error) {
    console.warn('Failed to pre-load search library:', error);
  }
  const searchTime = (performance.now() - searchStart).toFixed(2);
  console.log(`Search library initialized in ${searchTime} ms.`);
}

export function highlightQuery(text: string, query: string) {
  if (!query.trim()) return text;

  const words = query.toLowerCase().split(/\s+/);
  let highlighted = text;

  words.forEach((word) => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlighted = highlighted.replace(regex, '<strong style="background-color: #fff3cd; font-weight: 600;">$1</strong>');
  });

  return highlighted;
}

export function truncate(text: string, maxLength: number = 250) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export async function performSearch (query: string) {
  const searchStart = performance.now();

  try {
    const results = await search(query, 100);
    const searchTime = (performance.now() - searchStart).toFixed(2);

    console.log(`Search for "${query}" returned ${results.length} results in ${searchTime} ms.`);
    return results;
  } catch (error) {
    console.error('Search error:', error);
  }
};