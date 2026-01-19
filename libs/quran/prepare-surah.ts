import { Context } from "fresh";
import { State } from "@/utils.ts";

async function prepareSurah(ctx: Context<State>) {
  const { chapterId } = ctx.params;
  const id = parseInt(chapterId);

  if (isNaN(id) || id < 1 || id > 114) {
    return new Response("Not Found", { status: 404 });
  }
  try {
    // Load surah data and enrich the chapter
    const module = await import(`../../data/quran/surah/${id}.ts`);
    const surahData = module.default[id];

    // Find and enrich the chapter in state
    const chapterIndex = ctx.state.quran.chapters.findIndex((c) => c.id === id);
    if (chapterIndex !== -1) {
      ctx.state.quran.chapters[chapterIndex] = {
        ...ctx.state.quran.chapters[chapterIndex],
        verses: { [id]: surahData }
      };
    }
  } catch (error) {
    console.error(`Failed to load surah ${id}:`, error);
    return new Response("Not Found", { status: 404 });
  }

  return await ctx.next();
};

export { prepareSurah };