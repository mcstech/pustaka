import { define } from "@/utils.ts";
import { Chapter } from "../_components/chapter-title.tsx";

export default define.page(function QuranChapter(ctx) {
  const { chapterId } = ctx.params;
  const id = parseInt(chapterId);
  const chapter = ctx.state.quran.chapters.find(c => c.id === id);

  if (!chapter?.verses) {
    return <div class="alert alert-error">Surah tidak ditemukan</div>;
  }

  const surah = chapter.verses[id];
  const verses = Object.keys(surah.text);

  return (
    <div class="mx-auto max-w-5xl px-0 py-26 lg:px-8">
      <Chapter
        id={id.toString()}
        name={chapter.name_complex}
        withBismillah={chapter.bismillah_pre}
      />

      <dl class="mt-10 divide-y divide-gray-900/10 space-y-4">
        {verses.map((ayahNum) => {
          const arabic = surah.text[ayahNum];
          const translation = surah.translations?.id?.text[ayahNum];

          return (
            <div key={ayahNum} class="card bg-base-100 flex flex-col-reverse shadow-xs hover:shadow-xl transition-shadow">
              <dt dir="ltr"  class="text-base/7 font-semibold ltr:ml-3">
                <a
                  href={`/quran/${id}/${ayahNum}`}
                  class="badge badge-accent badge-lg shrink-0 hover:badge-primary transition-colors"
                >
                  {ayahNum}
                </a>
                {translation}
              </dt>
              <dd dir="rtl"class="text-base/7 font-lpmq leading-loose rtl:mr-3">
                {arabic}
              </dd>
            </div>
          );
        })}
      </dl>

      {/* Navigation */}
      <div class="join grid grid-cols-3 mt-12 max-w-md mx-auto">
        {id > 1 && (
          <a href={`/quran/${id - 1}`} class="join-item btn btn-outline">
            « Sebelumnya
          </a>
        )}
        <a href="/quran" class="join-item btn btn-ghost">
          Daftar Surah
        </a>
        {id < 114 && (
          <a href={`/quran/${id + 1}`} class="join-item btn btn-outline">
            Selanjutnya »
          </a>
        )}
      </div>
    </div>
  );
});
