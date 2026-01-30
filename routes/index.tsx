import { page } from "fresh";
import { Head, asset } from "fresh/runtime";
import { define } from "@/utils.ts";
import { AtasNamaTuanSemestaAlam } from "@/components/anTSA.tsx";
import { Hero } from "@/components/hero/index.tsx";
import { HeroForm } from "@/components/hero/form.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const url = new URL(ctx.req.url);
    let option = url.searchParams.get("option") || "";
    if (!option) {
      option = "quran";
    }
    
    return page({ option });
  },
});

export default define.page<typeof handler>(function Home(ctx) {
  const option = ctx.data.option;
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
        <link
          rel="preload"
          href={asset("/fonts/quran/lpmq.woff")}
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={asset("/fonts/quran/surah-names/v1/surah-names.woff2")}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <AtasNamaTuanSemestaAlam />
      <Hero>
        <HeroForm />
      </Hero>
    </>
  );
});
