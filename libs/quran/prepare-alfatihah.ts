import { Context } from "fresh";
import { State } from "@/utils.ts";
import alFatihah from "@/data/quran/surah/1.ts";

async function prepareAlfatihah(ctx: Context<State>) {
  const url = ctx.url;
  if (url.pathname.startsWith("/quran")) {
    ctx.state.quran.chapters = ctx.state.quran.chapters.map((chapter) => {
      if (chapter.id === 1) {
        return {
          ...chapter,
          verses: alFatihah
        }
      }
      return chapter;
    });
  }

  return await ctx.next();
};

export { prepareAlfatihah };