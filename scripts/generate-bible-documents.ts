// Deno script to generate documents for Bible from helloao.org API
// Requirements: deno run --allow-read --allow-write --allow-net scripts/generate-bible-documents.ts

import { TranslationBookChapter, TranslationBooks } from "@/types/bible/books.ts";

interface ExtractedVerse {
  number: number;
  text: string;
}

async function fetchChapterContent(
  bookId: string,
  chapterNumber: number,
  apiLink: string
): Promise<ExtractedVerse[] | null> {
  try {
    const baseUrl = "https://bible.helloao.org";
    // Replace the book ID and chapter number in the API link template
    const url = `${baseUrl}${apiLink.replace(/\d+\.json$/, `${chapterNumber}.json`)}`;
    console.log(`Fetching chapter from URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch chapter ${chapterNumber} of ${bookId}: ${response.status}`);
      return null;
    }

    const data = await response.json() as TranslationBookChapter;
    
    // Extract verses from chapter.content array
    const verses: ExtractedVerse[] = [];
    if (data.chapter?.content) {
      for (const content of data.chapter.content) {
        if (content.type === 'verse') {
          const verse = content as any; // ChapterVerse type
          // Extract text from verse content
          const text = verse.content
            .map((c: any) => {
              if (typeof c === 'string') return c;
              if (c.text) return c.text;
              return '';
            })
            .join('');
          
          verses.push({
            number: verse.number,
            text,
          });
        }
      }
    }
    
    return verses;
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }
    console.warn(`Error fetching chapter ${chapterNumber} of ${bookId}:`, error.message);
    return null;
  }
}

async function main() {
  const base = new URL("../", import.meta.url);
  const booksJsonUrl = new URL("./data/bible/ind_ayt/books.json", base);
  const documentsPathUrl = new URL("./data/documents.json", base);

  const booksJsonText = await Deno.readTextFile(booksJsonUrl);
  const booksData = JSON.parse(booksJsonText) as TranslationBooks;

  // Read existing documents if they exist
  let documents: Array<{ title: string; category: string; href: string; body: string }> = [];
  
  try {
    const existingDocs = await Deno.readTextFile(documentsPathUrl);
    documents = JSON.parse(existingDocs);
  } catch {
    // File doesn't exist yet, start with empty array
    documents = [];
  }

  const initialCount = documents.length;

  for (const book of booksData.books) {
    console.log(`Processing book: ${book.commonName} (${book.firstChapterNumber}-${book.lastChapterNumber})`);

    for (
      let chapterNum = book.firstChapterNumber;
      chapterNum <= book.lastChapterNumber;
      chapterNum++
    ) {
      const verses = await fetchChapterContent(
        book.id,
        chapterNum,
        book.firstChapterApiLink
      );

      if (!verses || verses.length === 0) {
        continue;
      }

      for (const verse of verses) {
        documents.push({
          title: `${verse.text.slice(0, 255)} `,
          category: "bible",
          href: `/alkitab/${book.id}/${chapterNum}/${verse.number}`,
          body: `${verse.text.slice(255)} ~ ${book.commonName} ${chapterNum}:${verse.number}`,
        });
      }

      // Add small delay to avoid overwhelming the API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  await Deno.writeTextFile(documentsPathUrl, JSON.stringify(documents, null, 2));
  const newCount = documents.length - initialCount;
  console.log(
    `Generated ${newCount} new Bible entries. Total entries: ${documents.length}`
  );
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}
