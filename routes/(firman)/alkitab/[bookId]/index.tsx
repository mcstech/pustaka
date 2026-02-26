import { define } from "@/utils.ts";

export default define.page(function AlkitabBook(ctx) {
  const { bookId } = ctx.params;
  const alkitab = ctx.state.alkitab;
  const book = alkitab.books.find((b) => b.id === bookId.toUpperCase());

  if (!book) {
    return <div class="alert alert-error">Kitab tidak ditemukan</div>;
  }

  const chapters = Array.from(
    { length: book.numberOfChapters },
    (_, i) => book.firstChapterNumber + i,
  );

  return (
    <div class="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <div class="text-sm breadcrumbs mb-6">
        <ul>
          <li><a href="/alkitab">Al-Kitab</a></li>
          <li>{book.commonName}</li>
        </ul>
      </div>

      {/* Header */}
      <div class="mb-8">
        <h1 class="text-3xl font-bold">{book.commonName}</h1>
        {book.title && book.title !== book.commonName && (
          <p class="text-base-content/60 mt-1">{book.title}</p>
        )}
        <p class="text-sm text-base-content/50 mt-2">
          {book.numberOfChapters} pasal · {book.totalNumberOfVerses} ayat
        </p>
        <div class="badge badge-outline mt-2">{alkitab.translation.shortName}</div>
      </div>

      {/* Chapters grid */}
      <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {chapters.map((chapterNum) => (
          <a
            key={chapterNum}
            href={`/alkitab/${book.id}/${chapterNum}`}
            class="btn btn-outline btn-sm"
          >
            {chapterNum}
          </a>
        ))}
      </div>
    </div>
  );
});
