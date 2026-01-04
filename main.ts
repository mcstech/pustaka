import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { client } from "@/libs/quran.ts";
import ALKITAB from "@/libs/bible/ind_ayt/books.json" with { type: "json" };
import { TranslationBooks } from "./types/bible/books.ts";

export const app = new App<State>();

// app.use(csp({
//   // set X-Content-Security-Policy translate to no
//   csp: [
//     ""
//   ]
// }));

app.use(staticFiles());

app.get("/", async (ctx) => {
  const surahs = await client.chapters.findAll();

  if (surahs instanceof Error) {
    return new Response(`Ralat mendapatkan surah: ${surahs.message}`, {
      status: 500,
    });
  }
  
  if (!surahs) {
    return new Response("Tiada surah ditemui", { status: 404 });
  }

  ctx.state.quran = {
    chapters: surahs,
  }

  // normalize textDirection to allowed 'ltr' | 'rtl' values
  const alkitabNormalized = {
    ...ALKITAB,
    translation: {
      ...ALKITAB.translation,
      textDirection: ALKITAB.translation.textDirection === "rtl" ? "rtl" : "ltr",
    },
  } as unknown as TranslationBooks;

  ctx.state.alkitab = {
    books: alkitabNormalized,
  }

  return await ctx.next();
});

// Include file-system based routes here
app.fsRoutes();
