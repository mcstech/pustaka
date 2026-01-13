import { Surah } from "@/types/quran/surah.ts";
import { TranslationBooks } from "@/types/bible/books.ts";

interface BookSelectorProps {
  isQuran?: boolean;
}

export function DrawerBookSelector({ isQuran }: BookSelectorProps) {
  const tooltip = isQuran ? "Al-Quran" : "Al-Kitab";
  return (
    <button type="button" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={tooltip}>
      <label for="quran-drawer" aria-label="open sidebar">
        <div class="flex items-center-safe">
        <i class="ph-duotone ph-books text-xl" />
        <div class="inline-flex ml-3 items-center-safe is-drawer-close:hidden w-48">
          <BookSelector />
        </div>
        </div>
      </label>
    </button>
  )
}

export function BookSelector() {
  return (
    <div role="tablist" class="tabs tabs-box tabs-xs">
      <a role="tab" href="/quran" class="tab aria-[current]:tab-active">Al-Quran</a>
      <a role="tab" href="/kitab" class="tab aria-[current]:tab-active">Al-Kitab</a>
    </div>
  )
}

export interface BookToCProps {
  data: Surah[] | TranslationBooks["books"];
  selected?: number | string;
}

export function BookToC({ data, selected }: BookToCProps) {
  const tooltip = typeof selected === 'number' 
    ? (data.find((surah) => surah.id === selected) as Surah)?.name_complex
    : (data.find((book) => book.id === selected) as TranslationBooks["books"][0])?.commonName;
  const selectedSurahId = typeof selected === 'number' ? selected : 1;
  const selectedSurah = data.find((item) => item.id === selectedSurahId) as Surah | undefined;
  const selectedSurahVerses = selectedSurah ? Array.from({ length: selectedSurah.verses_count }, (_, i) => i + 1) : [];

  return (
    <div
      class="is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:tooltip-primary ps-0 pe-0 py-0"
      data-tip={tooltip}
    >
      <i class="ph-duotone ph-list-numbers text-xl is-drawer-open:hidden" />
      <div class="carousel carousel-end carousel-vertical h-96 is-drawer-close:hidden">
        <ul class="list bg-base-100 me-0 ms-0 ps-0">
          <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Surah</li>
          {data.map((item) => {
            return (
              <li class="list-row data-selected:bg-base-300 rounded-none" data-selected={item.id === selected}>
                <a class="group" href={typeof selected === "number" ? `/quran/${item.id}` : `/kitab/${item.id}`}>
                  <div class="text-xs font-bold opacity-30 tabular-nums">{item.id}</div>
                  <div class="list-col-grow">
                    <p class="list-col-wrap">{typeof selected === 'number' ? (item as Surah).name_complex : (item as TranslationBooks["books"][0]).commonName}</p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
      {selectedSurah && Object.keys(selectedSurah).length && (
        <div class="carousel carousel-end carousel-vertical h-96 is-drawer-close:hidden">
          <ul class="list bg-base-100 me-0 ms-0 ps-0">
            <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Ayat</li>
            {selectedSurahVerses.map((verseNumber) => (
              <li class="list-row">
                <div class="text-xl font-thin opacity-30 tabular-nums">{verseNumber}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
  )
}