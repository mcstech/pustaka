import { Context } from "fresh";
import ALQURAN from "@/data/quran/surahs.json" with { type: "json" };
import BIBLE from "@/data/bible/ind_ayt/books.json" with { type: "json" };
import GENESIS from "@/data/bible/ind_ayt/gen.json" with { type: "json" };
import { State } from "@/utils.ts";

async function prepareFirman(ctx: Context<State>) {
  const url = ctx.url;
  if (url.pathname.startsWith("/quran")) {
    const chapters = ALQURAN.chapters;
    ctx.state.quran = {
      chapters,
    };
  } else if (url.pathname.startsWith("/alkitab")) {
    const chapters = BIBLE.books.map((book) => {
      if (book.id === "GEN") {
        return {
          ...book,
          translationBookChapter: GENESIS
        }
      }
      return book;
    });
    ctx.state.alkitab = {
      ...BIBLE,
      books: chapters,
    } as unknown as State["alkitab"];
  }

  return await ctx.next();
};

export { prepareFirman };