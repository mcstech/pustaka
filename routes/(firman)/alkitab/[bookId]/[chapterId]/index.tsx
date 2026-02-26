import { define } from "@/utils.ts";
import { HebrewSubtitle } from "../../_components/hebrew-subtitle.tsx";
import { AlKitabVerse } from "../../_components/verse.tsx";

export default define.page(function AlkitabChapter(ctx) {
  const { bookId, chapterId } = ctx.params;
  const alkitab = ctx.state.alkitab;
  const book = alkitab.books.find((b) => b.id === bookId.toUpperCase());

  if (!book?.translationBookChapter) {
    return <div class="alert alert-error">Pasal tidak ditemukan</div>;
  }

  const chapterData = book.translationBookChapter;
  const chapterNum = parseInt(chapterId);
  const textDirection = alkitab.translation.textDirection;
  const contents = chapterData.chapter.content;
  const heading = contents.find((c) => c.type === "heading");
  const headingTitle = heading?.type === "heading" ? heading.content[0] : null;
  const chapterContent = contents.filter((c) => c.type !== "heading");

  const prevChapter = chapterNum > book.firstChapterNumber ? chapterNum - 1 : null;
  const nextChapter = chapterNum < book.lastChapterNumber ? chapterNum + 1 : null;

  return (
    <div class="mx-auto max-w-5xl px-4 py-6 lg:px-8 space-y-4">
      {/* Breadcrumb */}
      <div class="text-sm breadcrumbs">
        <ul>
          <li><a href="/alkitab">Al-Kitab</a></li>
          <li><a href={`/alkitab/${book.id}`}>{book.commonName}</a></li>
          <li>Pasal {chapterId}</li>
        </ul>
      </div>

      {/* Translation badge */}
      <div class="flex items-center gap-2">
        <div class="badge badge-outline">{alkitab.translation.shortName}</div>
        <span class="text-xs text-base-content/50">{alkitab.translation.name}</span>
      </div>

      {/* Chapter heading */}
      {headingTitle && (
        <h1 class="text-2xl font-bold text-center pt-4">{headingTitle}</h1>
      )}

      {/* Chapter content */}
      {chapterContent.map((chapter, index) => {
        if (chapter.type === "heading") return null;

        if (chapter.type === "line_break") {
          return <p dir={textDirection} key={index} class="text-center">~</p>;
        }

        if (chapter.type === "hebrew_subtitle") {
          return <HebrewSubtitle chapter={chapter} key={index} />;
        }

        const verseNumber = chapter.number;
        return (
          <a
            key={verseNumber}
            href={`/alkitab/${book.id}/${chapterId}/${verseNumber}`}
            class="block hover:bg-base-200 rounded-lg px-2 transition-colors"
          >
            <AlKitabVerse chapter={chapter} textDirection={textDirection} />
          </a>
        );
      })}

      {/* Navigation */}
      <div class="join grid grid-cols-3 mt-12 max-w-md mx-auto">
        {prevChapter ? (
          <a href={`/alkitab/${book.id}/${prevChapter}`} class="join-item btn btn-outline">
            « Sebelumnya
          </a>
        ) : (
          <span class="join-item btn btn-disabled">« Sebelumnya</span>
        )}
        <a href={`/alkitab/${book.id}`} class="join-item btn btn-ghost">
          Daftar Pasal
        </a>
        {nextChapter ? (
          <a href={`/alkitab/${book.id}/${nextChapter}`} class="join-item btn btn-outline">
            Selanjutnya »
          </a>
        ) : (
          <span class="join-item btn btn-disabled">Selanjutnya »</span>
        )}
      </div>
    </div>
  );
});
