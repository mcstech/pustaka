import { Context } from "fresh";
import ALQURAN from "@/data/quran/surahs.json" with { type: "json" };
import BIBLE from "@/data/bible/ind_ayt/books.json" with { type: "json" };
import { State } from "@/utils.ts";

async function prepareFirman(ctx: Context<State>) {
  const url = ctx.url;
  if (url.pathname.startsWith("/quran") || url.pathname.startsWith("/wejangan")) {
    const chapters = ALQURAN.chapters;
    ctx.state.quran = {
      chapters,
    };
  } else if (url.pathname.startsWith("/alkitab")) {
    ctx.state.alkitab = BIBLE as unknown as State["alkitab"];
  }

  return await ctx.next();
};

export { prepareFirman };