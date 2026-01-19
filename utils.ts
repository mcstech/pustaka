import { createDefine } from "fresh";
import { TranslationBooks } from "./types/bible/books.ts";
import { Surah } from "./types/quran/surah.ts";


export interface Meta {
  title?: string;
  description?: string;
  ogImage?: string;
}
// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  meta: Meta;
  noIndex?: boolean;
  quran: {
    chapters: Surah[];
  },
  alkitab: TranslationBooks;
}

export interface WejanganBMS {
  css: string;
  comrakCss: string;
  script: string;
  // null only on index page
  breadcrumbs: string | null;
  // null only on all symbols page
  toc: string | null;
  main: string;
}

export const define = createDefine<State>();
