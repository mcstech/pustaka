import { Drawer } from "@/components/drawer.tsx";
import { define } from "@/utils.ts";

export default define.layout((props) => {
  const { Component, state, url } = props;
  const pattern = new URLPattern({ pathname: "/quran" });
  const currentURL = new URL(url.href);
  const currentSurahPath = currentURL.pathname.split("/").pop();
  const currentSelectedChapter = currentSurahPath && !['quran', 'alkitab'].includes(currentSurahPath)
    ? parseInt(currentSurahPath, 10)
    : 1;
  const currentSelectedBook = currentSurahPath && !['quran', 'alkitab'].includes(currentSurahPath)
    ? currentSurahPath
    : 'GEN';
  const isQuran = pattern.test(url.href);
  const kitab = isQuran ? state.quran : state.alkitab;
  const listTitles = 'chapters' in kitab ? kitab.chapters : kitab.books;
  const selected = isQuran ? currentSelectedChapter : currentSelectedBook;
  return (
    <Drawer isQuran={isQuran} data={listTitles} selected={selected}>
      <Component />
    </Drawer>
  );
});