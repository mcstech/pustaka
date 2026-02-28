import { page } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import { AtasNamaTuanSemestaAlam } from "@/components/anTSA.tsx";
import { Hero } from "@/components/hero/index.tsx";
import { HeroForm, HeroLogo } from "@/components/hero/form.tsx";
import { HeroVerse } from "@/components/hero/verse.tsx";
import { getRandomVerse } from "@/libs/random-verse.ts";
import { RandomVerse } from "@/types/index.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    let option = url.searchParams.get("option") || "";
    if (!option) {
      option = "quran";
    }

    const verse: RandomVerse = await getRandomVerse();

    return page({ option, verse });
  },
});

export default define.page<typeof handler>(function Home(ctx) {
  const { option, verse } = ctx.data;
  const headTitle = option === "quran"
    ? "Pustaka Bacaan Al-Quran Digital"
    : "Pustaka Bacaan Alkitab Digital";
  const headDescription = option === "quran"
    ? "Baca Al-Quran dalam talian dengan mudah. Akses teks suci, terjemahan, dan sumber berkaitan di satu tempat."
    : "Baca Alkitab dalam talian dengan mudah. Akses teks suci, terjemahan, dan sumber berkaitan di satu tempat.";

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta property="og:title" content={headTitle} />
        <meta name="description" content={headDescription} />
        <meta property="og:description" content={headDescription} />
        <meta property="og:image" content="/og-image.webp" />
        
      </Head>
      <AtasNamaTuanSemestaAlam />
      <Hero>
        <HeroLogo />
        <HeroForm />
        <HeroVerse verse={verse} />
      </Hero>
    </>
  );
});
