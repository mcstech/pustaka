import { Partial } from "fresh/runtime";
import { define } from "@/utils.ts";

export default define.page(function AlkitabVersePage(ctx) {
  const { bookId, chapterId, verseId } = ctx.params;
  const alkitab = ctx.state.alkitab;
  const book = alkitab.books.find((b) => b.id === bookId.toUpperCase());

  if (!book?.translationBookChapter) {
    return <div class="alert alert-error">Ayat tidak ditemukan</div>;
  }

  const verseNum = parseInt(verseId);
  const chapterData = book.translationBookChapter;
  const textDirection = alkitab.translation.textDirection;
  const verses = chapterData.chapter.content.filter((c) => c.type === "verse");
  const verse = verses.find((v) => v.type === "verse" && v.number === verseNum);

  if (!verse || verse.type !== "verse") {
    return <div class="alert alert-error">Ayat tidak ditemukan</div>;
  }

  const verseText = verse.content
    .map((c) => {
      if (typeof c === "string") return c;
      if ("text" in c) return c.text;
      if ("heading" in c) return c.heading;
      return "";
    })
    .join(" ");

  const totalVerses = chapterData.numberOfVerses;
  const hasPrev = verseNum > 1;
  const hasNext = verseNum < totalVerses;

  return (
    <div class="max-w-5xl mx-auto px-4 py-8" f-client-nav>
      {/* Breadcrumb — static, outside the partial */}
      <div class="text-sm breadcrumbs mb-6">
        <ul>
          <li><a href="/alkitab">Al-Kitab</a></li>
          <li><a href={`/alkitab/${book.id}`}>{book.commonName}</a></li>
          <li><a href={`/alkitab/${book.id}/${chapterId}`} f-client-nav={false}>Pasal {chapterId}</a></li>
          <li>Ayat {verseId}</li>
        </ul>
      </div>

      {/* Partial: only this region is swapped on prev/next navigation */}
      <Partial name="verse-content">
        {/* Main Card */}
        <div class="card bg-base-100 shadow-2xl">
          <div class="card-body">
            {/* Header */}
            <div class="flex items-center justify-between mb-6">
              <h2 class="card-title text-2xl">
                {book.commonName} {chapterId}:{verseId}
              </h2>
              <div class="badge badge-primary badge-lg">
                {verseId}/{totalVerses}
              </div>
            </div>

            {/* Translation badge */}
            <div class="flex items-center gap-2 mb-4">
              <div class="badge badge-outline">{alkitab.translation.shortName}</div>
              <span class="text-xs text-base-content/50">{alkitab.translation.name}</span>
            </div>

            {/* Verse Text */}
            <div class="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 mb-6">
              <p dir={textDirection} class="text-2xl md:text-3xl leading-relaxed text-center">
                {verseText}
              </p>
            </div>

            {/* Reference */}
            <p class="text-sm text-base-content/50 text-center">
              {book.commonName} {chapterId}:{verseId} — {alkitab.translation.name} ({alkitab.translation.shortName})
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div class="flex justify-between mt-8 gap-4">
          {hasPrev ? (
            <a href={`/alkitab/${book.id}/${chapterId}/${verseNum - 1}`} class="btn btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Ayat Sebelumnya
            </a>
          ) : (
            <div></div>
          )}

          <a href={`/alkitab/${book.id}/${chapterId}`} class="btn btn-ghost" f-client-nav={false}>
            Kembali ke Pasal
          </a>

          {hasNext ? (
            <a href={`/alkitab/${book.id}/${chapterId}/${verseNum + 1}`} class="btn btn-primary">
              Ayat Selanjutnya
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <div></div>
          )}
        </div>

        {/* Quick Navigation */}
        <div class="card bg-base-200 shadow-lg mt-8">
          <div class="card-body">
            <h3 class="card-title text-sm">Navigasi Cepat</h3>
            <div class="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(totalVerses, 10) }, (_, i) => i + 1).map((num) => (
                <a
                  key={num}
                  href={`/alkitab/${book.id}/${chapterId}/${num}`}
                  class={`btn btn-sm ${num === verseNum ? "btn-primary" : "btn-ghost"}`}
                >
                  {num}
                </a>
              ))}
              {totalVerses > 10 && (
                <a href={`/alkitab/${book.id}/${chapterId}`} class="btn btn-sm btn-outline" f-client-nav={false}>
                  Lihat Semua ({totalVerses})
                </a>
              )}
            </div>
          </div>
        </div>
      </Partial>
    </div>
  );
});
