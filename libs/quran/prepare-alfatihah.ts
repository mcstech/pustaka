import { Context } from "fresh";
import ALQURAN from "@/data/quran/surahs.json" with { type: "json" };
import ALFATIHAH from "@/data/quran/alfatihah.json" with { type: "json" };
import { State } from "@/utils.ts";
import { Surah, VerseKey } from "@/types/quran/surah.ts";

async function prepareAlFatihah(ctx: Context<State>) {
  const chapters = ALQURAN.chapters.reduce<Surah[]>((acc, chapter) => {
    if (chapter.id === 1) {
      acc.push({
        ...chapter,
        verses: ALFATIHAH.verses.map((verse) => {
          return {
            ...verse,
            verse_key: verse.verse_key as VerseKey,
          }
        }),
      });
    } else {
      acc.push(chapter as unknown as Surah);
    }
    return acc;
  }, []);

  ctx.state.quran = {
    chapters,
  };

  return await ctx.next();
};

export { prepareAlFatihah };