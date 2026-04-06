import { define } from "@/utils.ts";
import { Head } from "fresh/runtime";

export default define.page(function QuranAyah(ctx) {
  const { chapterId, ayahId } = ctx.params;
  const id = parseInt(chapterId);
  const ayahNum = parseInt(ayahId);
  const chapter = ctx.state.quran.chapters.find(c => c.id === id);

  if (!chapter?.verses) {
    return <div class="alert alert-error">Ayat tidak ditemukan</div>;
  }

  const surah = chapter.verses[id];
  const arabic = surah.text[ayahId];
  const translation = surah.translations?.id?.text[ayahId];
  const tafsir = surah.tafsir?.id?.kemenag?.text[ayahId];

  if (!arabic) {
    return <div class="alert alert-error">Ayat tidak ditemukan</div>;
  }

  const totalAyah = parseInt(surah.number_of_ayah);
  const hasPrev = ayahNum > 1;
  const hasNext = ayahNum < totalAyah;

  // OG metadata
  const pageTitle = `${surah.name_latin} (${surah.name}) - Ayat ${ayahId}`;
  const pageDescription = translation || arabic;
  const pageUrl = ctx.url.href;
  const ogImageUrl = new URL(`/og/quran/${id}/${ayahId}.svg`, ctx.url).href;

  return (
    <>
      <Head>
        <title>{pageTitle} | Pustaka</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
    <div class="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div class="text-sm breadcrumbs mb-6">
        <ul>
          <li><a href="/quran">Al-Quran</a></li>
          <li><a href={`/quran/${id}`}>{surah.name_latin}</a></li>
          <li>Ayat {ayahId}</li>
        </ul>
      </div>

      {/* Main Card */}
      <div class="card bg-base-100 shadow-2xl">
        <div class="card-body">
          {/* Header */}
          <div class="flex items-center justify-between mb-6">
            <h2 class="card-title text-2xl">
              {surah.name_latin} ({surah.name})
            </h2>
            <div class="badge badge-primary badge-lg">{ayahId}:{totalAyah}</div>
          </div>

          {/* Arabic Text */}
          <div class="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 mb-6">
            <p dir="rtl" class="text-4xl md:text-5xl font-lpmq leading-loose text-center">
              {arabic}
            </p>
          </div>

          {/* Translation */}
          <div class="prose max-w-none mb-6">
            <h3 class="text-lg font-semibold mb-3">Terjemahan</h3>
            <p class="text-base leading-relaxed">{translation}</p>
          </div>

          {/* Tafsir */}
          {tafsir && (
            <div class="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div class="collapse-title text-lg font-semibold">
                Tafsir Kemenag
              </div>
              <div class="collapse-content">
                <div class="prose max-w-none">
                  <p class="whitespace-pre-line text-sm leading-relaxed">
                    {tafsir}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div class="flex justify-between mt-8 gap-4">
        {hasPrev ? (
          <a href={`/quran/${id}/${ayahNum - 1}`} class="btn btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Ayat Sebelumnya
          </a>
        ) : (
          <div></div>
        )}

        <a href={`/quran/${id}`} class="btn btn-ghost">
          Kembali ke Surah
        </a>

        {hasNext ? (
          <a href={`/quran/${id}/${ayahNum + 1}`} class="btn btn-primary">
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
            {Array.from({ length: Math.min(totalAyah, 10) }, (_, i) => i + 1).map(num => (
              <a
                key={num}
                href={`/quran/${id}/${num}`}
                class={`btn btn-sm ${num === ayahNum ? 'btn-primary' : 'btn-ghost'}`}
              >
                {num}
              </a>
            ))}
            {totalAyah > 10 && (
              <a href={`/quran/${id}`} class="btn btn-sm btn-outline">
                Lihat Semua ({totalAyah})
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
});
