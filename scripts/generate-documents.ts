// Deno script to generate data/documents.json from surah TS modules
// Requirements: deno run --allow-read --allow-write scripts/generate-documents.ts

interface ChapterMeta {
  id: number;
}

async function main() {
  const base = new URL("file:///Users/mcsdev/Documents/e-bacaan/");
  const surahsJsonUrl = new URL("./data/quran/surahs.json", base);
  const documentsPathUrl = new URL("./data/documents.json", base);

  const surahsJsonText = await Deno.readTextFile(surahsJsonUrl);
  const surahs = JSON.parse(surahsJsonText) as { chapters: ChapterMeta[] };

  const documents: Array<{ title: string; category: string; href: string; body: string }> = [];

  for (const chapter of surahs.chapters) {
    const id = chapter.id;
    const moduleUrl = new URL(`./data/quran/surah/${id}.ts`, base);
    const mod = await import(moduleUrl.href);
    const surahMap = mod.default as Record<string, any>;
    const key = String(id);
    const surah = surahMap[key] ?? surahMap[id];

    if (!surah) {
      console.warn(`Surah ${id} not found in module.`);
      continue;
    }

    const nameLatin: string = surah.name_latin ?? surah.name_latin ?? surah.name_simple ?? `Surah ${id}`;

    // Prefer Indonesian translation if available, else fallback to first available language
    let translationText: Record<string, string> | undefined = surah.translations?.id?.text;
    if (!translationText) {
      const translationsObj: Record<string, any> | undefined = surah.translations;
      if (translationsObj) {
        const firstLang = Object.keys(translationsObj)[0];
        translationText = translationsObj[firstLang]?.text;
      }
    }

    if (!translationText) {
      console.warn(`No translations text found for Surah ${id}`);
      continue;
    }

    const ayahNumbers = Object.keys(translationText).sort((a, b) => Number(a) - Number(b));
    for (const ayah of ayahNumbers) {
      const body = translationText[ayah];
      documents.push({
        title: nameLatin,
        category: "quran",
        href: `/quran/${id}/${ayah}`,
        body,
      });
    }
  }

  await Deno.writeTextFile(documentsPathUrl, JSON.stringify(documents, null, 2));
  console.log(`Generated ${documents.length} entries at ${documentsPathUrl.pathname}`);
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}
