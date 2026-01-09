import { createDefine } from "fresh";
import { TranslationBooks } from "./types/bible/books.ts";
import { Surah } from "./types/quran/surah.ts";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
  quran: {
    chapters: Surah[];
  },
  alkitab: {
    books: TranslationBooks;
  }
}

export const define = createDefine<State>();
