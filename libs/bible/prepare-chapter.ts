import { Context } from "fresh";
import { State } from "@/utils.ts";
import { TranslationBookChapter } from "@/types/bible/books.ts";

const BIBLE_API_BASE = "https://bible.helloao.org";

async function fetchBibleChapter(bookId: string, chapterId: number): Promise<TranslationBookChapter | null> {
  try {
    const url = `${BIBLE_API_BASE}/api/ind_ayt/${bookId}/${chapterId}.json`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json() as TranslationBookChapter;
  } catch (error) {
    console.error(`Failed to fetch Bible chapter ${bookId}/${chapterId}:`, error);
    return null;
  }
}

async function prepareBibleChapter(ctx: Context<State>) {
  const { bookId, chapterId } = ctx.params;
  const chapterNum = parseInt(chapterId);

  if (!bookId || isNaN(chapterNum)) {
    return new Response("Not Found", { status: 404 });
  }

  const book = ctx.state.alkitab?.books.find((b) => b.id === bookId.toUpperCase());
  if (!book) {
    return new Response("Not Found", { status: 404 });
  }

  if (chapterNum < book.firstChapterNumber || chapterNum > book.lastChapterNumber) {
    return new Response("Not Found", { status: 404 });
  }

  const chapterData = await fetchBibleChapter(bookId.toUpperCase(), chapterNum);
  if (!chapterData) {
    return new Response("Not Found", { status: 404 });
  }

  ctx.state.alkitab = {
    ...ctx.state.alkitab,
    books: ctx.state.alkitab.books.map((b) =>
      b.id === bookId.toUpperCase()
        ? { ...b, translationBookChapter: chapterData }
        : b
    ),
  };

  return await ctx.next();
}

export { prepareBibleChapter };
