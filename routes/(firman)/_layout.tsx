import { Head, asset} from "fresh/runtime";
import { Drawer } from "@/components/drawer.tsx";
import { define } from "@/utils.ts";

export default define.layout((props) => {
  const { Component, state, url } = props;
  const currentURL = new URL(url.href);
  const currentSurahPath = currentURL.pathname.split("/").pop();
  const currentSelectedChapter = currentSurahPath && !['quran', 'alkitab'].includes(currentSurahPath)
    ? parseInt(currentSurahPath, 10)
    : 1;
  const currentSelectedBook = currentSurahPath && !['quran', 'alkitab'].includes(currentSurahPath)
    ? currentSurahPath
    : 'GEN';
  const isQuran = currentURL.pathname.startsWith("/quran") || currentURL.pathname.startsWith("/wejangan");
  const kitab = isQuran ? state.quran : state.alkitab;
  const listTitles = kitab && 'chapters' in kitab ? kitab.chapters : kitab.books;
  const selected = isQuran ? currentSelectedChapter : currentSelectedBook;

  return (
    <Drawer isQuran={isQuran} data={listTitles} selected={selected}>
      <Head>
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
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/duotone/style.css"
        />
      </Head>
      <Component />
    </Drawer>
  );
});