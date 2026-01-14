import { define } from "@/utils.ts";
import { HebrewSubtitle } from "./_components/hebrew-subtitle.tsx";
import { AlKitabVerse } from "./_components/Verse.tsx";

export default define.page(function Home(ctx) {
  const alkitab = ctx.state.alkitab;
  const textDirection = alkitab.translation.textDirection;
  const genesis = alkitab.books.find((book) => book.id === "GEN"); // Genesis
  const chapters = genesis?.translationBookChapter?.chapter.content || [];
  const heading = chapters.find((chapter) => chapter.type === "heading");
  const headingTitle = heading?.content[0];
  const chapterContent = chapters.filter((chapter) => !['heading'].includes(chapter.type));

  return (
    <div class="mx-auto max-w-5xl px-0 py-3 lg:px-8 space-y-3">
      {headingTitle && (
        <h1 class="text-3xl font-bold text-gray-900 uppercase text-center">
          {headingTitle}
        </h1>
      )}
      {chapterContent.map((chapter) => {
        if (chapter.type === "heading") return null;

        if (chapter.type === "line_break") return <p dir={textDirection} key={chapter.type} class="text-center">~</p>;

        if (chapter.type === "hebrew_subtitle") {
          return <HebrewSubtitle chapter={chapter} key={chapter.type} />;
        }
        
        const verseNumber = chapter.number;

        return (
          <AlKitabVerse chapter={chapter} textDirection={textDirection} key={verseNumber} />
        );
      })}
    </div>
  );
});