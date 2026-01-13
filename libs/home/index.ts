import { Context } from "fresh";
import ALKITAB from "@/data/bible/ind_ayt/books.json" with { type: "json" };
import ALQURAN from "@/data/quran/surahs.json" with { type: "json" };
import { TranslationBooks } from "@/types/bible/books.ts";
import { State } from "@/utils.ts";
import { Surah } from "@/types/quran/surah.ts";

async function prepareHome(ctx: Context<State>) {
  ctx.state.quran = {
    chapters: ALQURAN.chapters as unknown as Surah[],
  }

  // normalize textDirection to allowed 'ltr' | 'rtl' values
  const alkitabNormalized = {
    ...ALKITAB,
    translation: {
      ...ALKITAB.translation,
      textDirection: ALKITAB.translation.textDirection === "rtl" ? "rtl" : "ltr",
    },
  } as unknown as TranslationBooks;

  ctx.state.alkitab = alkitabNormalized

  return await ctx.next();
};

export { prepareHome };