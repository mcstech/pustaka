/**
 * Script to generate OG images for all Quran verses
 * Generates SVG images optimized for social media sharing
 */

import { generateOGImageSVG, saveSVG } from "../libs/og-image-generator.ts";
import surahs from "../data/quran/surahs.json" with { type: "json" };

interface QuranData {
  chapters: Array<{
    id: number;
    name_simple: string;
    name_arabic: string;
    verses_count: number;
  }>;
}

const quranData = surahs as QuranData;

async function generateQuranOGImages() {
  console.log("🎨 Starting Quran OG Image Generation...\n");

  const outputDir = "./static/og/quran";

  // Ensure output directory exists
  try {
    await Deno.mkdir(outputDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const chapter of quranData.chapters) {
    const chapterId = chapter.id;
    const chapterDir = `${outputDir}/${chapterId}`;

    // Create chapter directory
    try {
      await Deno.mkdir(chapterDir, { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }

    console.log(`📖 Processing ${chapter.name_simple} (${chapter.name_arabic})...`);

    // Load chapter verse data
    let verseData;
    try {
      const module = await import(`../data/quran/surah/${chapterId}.ts`);
      verseData = module.default[chapterId];
    } catch (error) {
      console.log(`  ⚠️  Skipping: verse data not found`);
      totalSkipped += chapter.verses_count;
      continue;
    }

    // Generate OG image for each verse
    for (let verseNum = 1; verseNum <= chapter.verses_count; verseNum++) {
      const outputPath = `${chapterDir}/${verseNum}.svg`;

      // Skip if already exists
      try {
        await Deno.stat(outputPath);
        continue; // File exists, skip
      } catch {
        // File doesn't exist, proceed
      }

      const arabicText = verseData.text[verseNum.toString()];
      const translation = verseData.translations?.id?.text[verseNum.toString()];

      if (!arabicText || !translation) {
        console.log(`  ⚠️  Skipping ${chapterId}:${verseNum} - missing data`);
        totalSkipped++;
        continue;
      }

      const svg = generateOGImageSVG({
        type: "quran",
        surahName: chapter.name_simple,
        surahNameArabic: chapter.name_arabic,
        ayahNumber: verseNum,
        arabicText,
        translation,
      });

      await saveSVG(svg, outputPath);
      totalGenerated++;

      if (verseNum % 10 === 0) {
        console.log(`  ✓ Generated ${verseNum}/${chapter.verses_count} verses`);
      }
    }

    console.log(`  ✅ Completed ${chapter.name_simple}\n`);
  }

  console.log("\n🎉 Generation Complete!");
  console.log(`✅ Generated: ${totalGenerated} images`);
  if (totalSkipped > 0) {
    console.log(`⚠️  Skipped: ${totalSkipped} images`);
  }
  console.log(`📁 Output directory: ${outputDir}`);
}

// Run the script
if (import.meta.main) {
  await generateQuranOGImages();
}
