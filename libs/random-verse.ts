import ALQURAN from "@/data/quran/surahs.json" with { type: "json" };
import GENESIS from "@/data/bible/ind_ayt/gen.json" with { type: "json" };

export interface RandomVerse {
  text: string;
  reference: string;
  category: "quran" | "bible";
  href: string;
}

export async function getRandomVerse(): Promise<RandomVerse> {
  const isQuran = Math.random() < 0.5;
  if (isQuran) {
    return await getRandomQuranVerse();
  } else {
    return getRandomBibleVerse();
  }
}

async function getRandomQuranVerse(): Promise<RandomVerse> {
  const surahs = ALQURAN.chapters;
  const surahMeta = surahs[Math.floor(Math.random() * surahs.length)];

  // Validate surah ID is within the expected 1-114 range before dynamic import
  const surahId = Number(surahMeta.id);
  if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) {
    return {
      text: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
      reference: "Al-Fatihah 1:1",
      category: "quran",
      href: "/quran/1/1",
    };
  }

  try {
    const module = await import(`../data/quran/surah/${surahId}.ts`);
    const surahData = module.default[surahId];

    if (!surahData?.translations?.id?.text) {
      throw new Error("No translation found");
    }

    const verseKeys = Object.keys(surahData.translations.id.text);
    const verseKey = verseKeys[Math.floor(Math.random() * verseKeys.length)];
    const text = surahData.translations.id.text[verseKey];

    return {
      text,
      reference: `${surahMeta.name_simple} ${surahId}:${verseKey}`,
      category: "quran",
      href: `/quran/${surahId}/${verseKey}`,
    };
  } catch {
    return {
      text: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
      reference: "Al-Fatihah 1:1",
      category: "quran",
      href: "/quran/1/1",
    };
  }
}

type VerseContentItem = string | { text?: string; poem?: number };

// Returns a random verse from Genesis chapter 1 (the only Bible chapter available locally).
// Content items may be plain strings or objects with a text property (e.g., poetry lines).
function getRandomBibleVerse(): RandomVerse {
  const verses = (GENESIS.chapter.content as Array<
    { type: string; number: number; content: VerseContentItem[] }
  >)
    .filter((c) => c.type === "verse");

  const verse = verses[Math.floor(Math.random() * verses.length)];

  const text = verse.content
    .map((part) => (typeof part === "string" ? part : (part.text ?? "")))
    .join(" ")
    .trim();

  return {
    text,
    reference: `Kejadian 1:${verse.number}`,
    category: "bible",
    href: `/alkitab/GEN/1/${verse.number}`,
  };
}
