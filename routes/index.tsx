import { page } from "fresh";
import { define } from "@/utils.ts";
import { AtasNamaTuanSemestaAlam } from "@/components/anTSA.tsx";
import { Hero } from "@/components/hero/index.tsx";
import { QuranChaptersList } from "@/components/quran/chapters.tsx";
import { AlKitabBooksList } from "../components/bible/books.tsx";
import { BooksTab } from "../components/BooksTab.tsx";
import { HeroForm } from "@/components/hero/form.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const url = new URL(ctx.req.url);
    let option = url.searchParams.get("option") || "";
    if (!option) {
      option = "quran";
      ctx.state.meta = {
        ...ctx.state.meta,
        title: "Pustaka Bacaan Al-Quran dan Alkitab Digital",
        description:
          "Baca Al-Quran dan Alkitab dalam talian dengan mudah. Akses teks suci, terjemahan, dan sumber berkaitan di satu tempat.",
      };
    } else if (option === "alkitab") {
      ctx.state.meta = {
        ...ctx.state.meta,
        title: "Pustaka Bacaan Alkitab Digital",
        description:
          "Baca Alkitab dalam talian dengan mudah. Akses teks suci, terjemahan, dan sumber berkaitan di satu tempat.",
      };
    }
    
    // ctx.state.ogImage = new URL(asset("/og-image.webp"), ctx.url).href;

    return page({ option });
  },
});

export default define.page<typeof handler>(function Home(ctx) {
  const option = ctx.data.option;

  return (
    <>
      <AtasNamaTuanSemestaAlam />
      <Hero>
        <BooksTab option={option} />
        <HeroForm />
      </Hero>
      {option === "quran" && <QuranChaptersList chapters={ctx.state.quran.chapters} />}
      {option === "alkitab" && <AlKitabBooksList kitab={ctx.state.alkitab} />}
    </>
  );
});
