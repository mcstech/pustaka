/**
 * Script to generate OG images for all Bible verses
 * Generates SVG images optimized for social media sharing
 */

import { generateOGImageSVG, saveSVG } from "../libs/og-image-generator.ts";

async function generateBibleOGImages() {
  console.log("🎨 Starting Bible OG Image Generation...\n");

  const outputDir = "./static/og/alkitab";
  const bibleDataDir = "./data/bible/ind_ayt";

  // Ensure output directory exists
  try {
    await Deno.mkdir(outputDir, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  // Load books list
  const booksData = JSON.parse(
    await Deno.readTextFile(`${bibleDataDir}/books.json`)
  );

  const translation = booksData.translation;
  const books = booksData.books;

  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const book of books) {
    const bookId = book.id;
    const bookDir = `${outputDir}/${bookId}`;

    console.log(`📖 Processing ${book.commonName} (${bookId})...`);

    // Create book directory
    try {
      await Deno.mkdir(bookDir, { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }

    // Process each chapter
    for (let chapterNum = 1; chapterNum <= book.numberOfChapters; chapterNum++) {
      const chapterDir = `${bookDir}/${chapterNum}`;

      // Create chapter directory
      try {
        await Deno.mkdir(chapterDir, { recursive: true });
      } catch (error) {
        if (!(error instanceof Deno.errors.AlreadyExists)) {
          throw error;
        }
      }

      // Load chapter data
      let chapterData;
      try {
        const chapterFilePath = `${bibleDataDir}/${bookId}/${chapterNum}.json`;
        const chapterContent = await Deno.readTextFile(chapterFilePath);
        chapterData = JSON.parse(chapterContent);
      } catch (error) {
        console.log(`  ⚠️  Skipping chapter ${chapterNum}: data not found`);
        continue;
      }

      // Extract verses from chapter content
      const verses = chapterData.chapter.content.filter(
        (c: any) => c.type === "verse"
      );

      // Generate OG image for each verse
      for (const verse of verses) {
        const verseNum = verse.number;
        const outputPath = `${chapterDir}/${verseNum}.svg`;

        // Skip if already exists
        try {
          await Deno.stat(outputPath);
          continue; // File exists, skip
        } catch {
          // File doesn't exist, proceed
        }

        // Extract verse text
        const verseText = verse.content
          .map((c: any) => {
            if (typeof c === "string") return c;
            if ("text" in c) return c.text;
            if ("heading" in c) return c.heading;
            return "";
          })
          .join(" ");

        if (!verseText.trim()) {
          console.log(`  ⚠️  Skipping ${bookId} ${chapterNum}:${verseNum} - empty text`);
          totalSkipped++;
          continue;
        }

        const svg = generateOGImageSVG({
          type: "bible",
          bookName: book.commonName,
          chapter: chapterNum,
          verse: verseNum,
          verseText,
          translationName: translation.shortName,
        });

        await saveSVG(svg, outputPath);
        totalGenerated++;

        if (verseNum % 20 === 0) {
          console.log(`  ✓ Generated chapter ${chapterNum}, verse ${verseNum}`);
        }
      }
    }

    console.log(`  ✅ Completed ${book.commonName}\n`);
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
  await generateBibleOGImages();
}
