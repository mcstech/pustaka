/**
 * Test script to generate a sample OG image
 */

import { generateOGImageSVG, saveSVG } from "../libs/og-image-generator.ts";

// Test Quran OG image
const quranSVG = generateOGImageSVG({
  type: "quran",
  surahName: "Al-Fatihah",
  surahNameArabic: "الفاتحة",
  ayahNumber: 1,
  arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
});

// Test Bible OG image
const bibleSVG = generateOGImageSVG({
  type: "bible",
  bookName: "KEJADIAN",
  chapter: 1,
  verse: 1,
  verseText: "Pada mulanya Allah menciptakan langit dan bumi.",
  translationName: "AYT",
});

// Create test directory
try {
  await Deno.mkdir("./test-og", { recursive: true });
} catch (error) {
  if (!(error instanceof Deno.errors.AlreadyExists)) {
    throw error;
  }
}

// Save test images
await saveSVG(quranSVG, "./test-og/quran-test.svg");
await saveSVG(bibleSVG, "./test-og/bible-test.svg");

console.log("✅ Test OG images generated successfully!");
console.log("📁 Check ./test-og/ directory for sample images");
console.log("  - quran-test.svg");
console.log("  - bible-test.svg");
