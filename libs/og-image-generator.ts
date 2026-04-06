/**
 * OG Image Generator for Pustaka
 * Generates premium, breathtaking Open Graph images for verse sharing
 * Portrait ratio optimized for WhatsApp and social media
 */

interface QuranOGImageParams {
  type: "quran";
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
}

interface BibleOGImageParams {
  type: "bible";
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  translationName: string;
}

type OGImageParams = QuranOGImageParams | BibleOGImageParams;

/**
 * Wraps text to fit within a specified width
 */
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  // Approximate character width based on font size
  const avgCharWidth = fontSize * 0.55;
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Escapes XML special characters for SVG
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates SVG for Quran verse OG image
 */
function generateQuranSVG(params: QuranOGImageParams): string {
  const { surahName, surahNameArabic, ayahNumber, arabicText, translation } = params;

  // Portrait ratio: 1080x1920 (Instagram Story/WhatsApp optimal)
  const width = 1080;
  const height = 1920;

  // Wrap text for better display
  const arabicLines = wrapText(arabicText, width - 160, 72);
  const translationLines = wrapText(translation, width - 160, 36);

  // Limit lines to prevent overflow
  const maxArabicLines = 8;
  const maxTranslationLines = 10;
  const displayArabicLines = arabicLines.slice(0, maxArabicLines);
  const displayTranslationLines = translationLines.slice(0, maxTranslationLines);

  // Add ellipsis if truncated
  if (arabicLines.length > maxArabicLines) {
    displayArabicLines[maxArabicLines - 1] += "...";
  }
  if (translationLines.length > maxTranslationLines) {
    displayTranslationLines[maxTranslationLines - 1] += "...";
  }

  const arabicTextY = 520;
  const arabicLineHeight = 100;
  const translationTextY = arabicTextY + (displayArabicLines.length * arabicLineHeight) + 120;
  const translationLineHeight = 52;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e94560;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#f39c12;stop-opacity:0.8" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>

  <!-- Decorative pattern overlay -->
  <g opacity="0.03">
    <circle cx="100" cy="200" r="150" fill="#ffffff"/>
    <circle cx="${width - 100}" cy="${height - 200}" r="200" fill="#ffffff"/>
    <circle cx="${width / 2}" cy="100" r="100" fill="#ffffff"/>
  </g>

  <!-- Header section -->
  <g>
    <!-- Top decorative line -->
    <rect x="80" y="120" width="920" height="4" fill="url(#accentGradient)" rx="2" filter="url(#glow)"/>

    <!-- Surah name -->
    <text x="${width / 2}" y="220" font-family="Georgia, serif" font-size="56" font-weight="bold"
          fill="#ffffff" text-anchor="middle" letter-spacing="2">
      ${escapeXml(surahName)}
    </text>

    <!-- Arabic name and ayah number -->
    <text x="${width / 2}" y="300" font-family="Traditional Arabic, serif" font-size="48"
          fill="#f39c12" text-anchor="middle" direction="rtl">
      ${escapeXml(surahNameArabic)} - آية ${ayahNumber}
    </text>

    <!-- Bottom decorative line -->
    <rect x="80" y="350" width="920" height="4" fill="url(#accentGradient)" rx="2" filter="url(#glow)"/>
  </g>

  <!-- Arabic text section -->
  <g>
    ${displayArabicLines.map((line, index) => `
    <text x="${width / 2}" y="${arabicTextY + (index * arabicLineHeight)}"
          font-family="Traditional Arabic, serif" font-size="72" font-weight="500"
          fill="#ffffff" text-anchor="middle" direction="rtl">
      ${escapeXml(line)}
    </text>`).join("")}
  </g>

  <!-- Translation section -->
  <g>
    <text x="${width / 2}" y="${translationTextY - 60}" font-family="Arial, sans-serif"
          font-size="32" font-weight="600" fill="#f39c12" text-anchor="middle" letter-spacing="1">
      TERJEMAHAN
    </text>
    ${displayTranslationLines.map((line, index) => `
    <text x="${width / 2}" y="${translationTextY + (index * translationLineHeight)}"
          font-family="Georgia, serif" font-size="36" font-weight="400"
          fill="#e8e8e8" text-anchor="middle" opacity="0.95">
      ${escapeXml(line)}
    </text>`).join("")}
  </g>

  <!-- Footer -->
  <g>
    <rect x="80" y="${height - 280}" width="920" height="3" fill="url(#accentGradient)" opacity="0.5" rx="2"/>
    <text x="${width / 2}" y="${height - 200}" font-family="Arial, sans-serif"
          font-size="40" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="3">
      PUSTAKA
    </text>
    <text x="${width / 2}" y="${height - 150}" font-family="Arial, sans-serif"
          font-size="28" fill="#f39c12" text-anchor="middle" letter-spacing="2">
      Koleksi Ayat-Ayat Suci
    </text>
  </g>
</svg>`;
}

/**
 * Generates SVG for Bible verse OG image
 */
function generateBibleSVG(params: BibleOGImageParams): string {
  const { bookName, chapter, verse, verseText, translationName } = params;

  // Portrait ratio: 1080x1920
  const width = 1080;
  const height = 1920;

  // Wrap text for better display
  const verseLines = wrapText(verseText, width - 160, 40);

  // Limit lines to prevent overflow
  const maxVerseLines = 18;
  const displayVerseLines = verseLines.slice(0, maxVerseLines);

  if (verseLines.length > maxVerseLines) {
    displayVerseLines[maxVerseLines - 1] += "...";
  }

  const verseTextY = 600;
  const verseLineHeight = 60;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#34495e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a252f;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3498db;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#9b59b6;stop-opacity:0.8" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>

  <!-- Decorative pattern overlay -->
  <g opacity="0.04">
    <circle cx="150" cy="300" r="180" fill="#ffffff"/>
    <circle cx="${width - 150}" cy="${height - 300}" r="220" fill="#ffffff"/>
    <circle cx="${width / 2}" cy="150" r="120" fill="#ffffff"/>
  </g>

  <!-- Header section -->
  <g>
    <!-- Top decorative line -->
    <rect x="80" y="150" width="920" height="4" fill="url(#accentGradient)" rx="2" filter="url(#glow)"/>

    <!-- Book name -->
    <text x="${width / 2}" y="260" font-family="Georgia, serif" font-size="60" font-weight="bold"
          fill="#ffffff" text-anchor="middle" letter-spacing="2">
      ${escapeXml(bookName)}
    </text>

    <!-- Chapter and verse -->
    <text x="${width / 2}" y="350" font-family="Georgia, serif" font-size="52"
          fill="#3498db" text-anchor="middle" font-weight="600">
      ${chapter}:${verse}
    </text>

    <!-- Bottom decorative line -->
    <rect x="80" y="400" width="920" height="4" fill="url(#accentGradient)" rx="2" filter="url(#glow)"/>
  </g>

  <!-- Verse text section -->
  <g>
    ${displayVerseLines.map((line, index) => `
    <text x="${width / 2}" y="${verseTextY + (index * verseLineHeight)}"
          font-family="Georgia, serif" font-size="40" font-weight="400"
          fill="#f0f0f0" text-anchor="middle" opacity="0.95">
      ${escapeXml(line)}
    </text>`).join("")}
  </g>

  <!-- Reference -->
  <g>
    <rect x="200" y="${height - 480}" width="680" height="120" fill="#2c3e50" opacity="0.5" rx="10"/>
    <text x="${width / 2}" y="${height - 400}" font-family="Georgia, serif"
          font-size="34" font-style="italic" fill="#3498db" text-anchor="middle">
      ${escapeXml(bookName)} ${chapter}:${verse}
    </text>
    <text x="${width / 2}" y="${height - 350}" font-family="Arial, sans-serif"
          font-size="26" fill="#b0b0b0" text-anchor="middle">
      ${escapeXml(translationName)}
    </text>
  </g>

  <!-- Footer -->
  <g>
    <rect x="80" y="${height - 280}" width="920" height="3" fill="url(#accentGradient)" opacity="0.5" rx="2"/>
    <text x="${width / 2}" y="${height - 200}" font-family="Arial, sans-serif"
          font-size="40" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="3">
      PUSTAKA
    </text>
    <text x="${width / 2}" y="${height - 150}" font-family="Arial, sans-serif"
          font-size="28" fill="#3498db" text-anchor="middle" letter-spacing="2">
      Koleksi Ayat-Ayat Suci
    </text>
  </g>
</svg>`;
}

/**
 * Generates OG image SVG based on scripture type
 */
export function generateOGImageSVG(params: OGImageParams): string {
  if (params.type === "quran") {
    return generateQuranSVG(params);
  } else {
    return generateBibleSVG(params);
  }
}

/**
 * Saves SVG to a file
 */
export async function saveSVG(svg: string, outputPath: string): Promise<void> {
  await Deno.writeTextFile(outputPath, svg);
}
