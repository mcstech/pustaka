import { Context } from "fresh";
import ALQURAN from "@/data/quran/surahs.json" with { type: "json" };
import ALFATIHAH from "@/data/quran/alfatihah.json" with { type: "json" };
import BIBLE from "@/data/bible/ind_ayt/books.json" with { type: "json" };
import GENESIS from "@/data/bible/ind_ayt/gen.json" with { type: "json" };
import { State } from "@/utils.ts";
import { Surah, VerseKey } from "@/types/quran/surah.ts";

async function prepareFirman(ctx: Context<State>) {
  const url = ctx.url;
  if (url.pathname.startsWith("/quran")) {
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
  } else if (url.pathname.startsWith("/alkitab")) {
    const chapters = BIBLE.books.map((book) => {
      if (book.id === "gen") {
        return {
          ...book,
          translationBookChapter: GENESIS
        }
      }
      return book;
    });
    ctx.state.alkitab = chapters as unknown as State["alkitab"];
  }

  return await ctx.next();
};

export { prepareFirman };