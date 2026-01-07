import { Chapter } from "@quranjs/api";

interface QuranChaptersListProps {
  chapters: Chapter[];
}
export function QuranChaptersList({ chapters }: QuranChaptersListProps) {
  return (
    <div class="py-20 sm:py-10">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 class="text-center text-lg/8 font-semibold text-gray-900">Nama-nama Surah</h2>
        <div class="mx-auto grid max-w-lg grid-cols-1 sm:grid-cols-3 items-center gap-x-8 gap-y-12 sm:max-w-xl lg:mx-0 lg:max-w-none">
          {chapters.map((chapter) => (
            <QuranChapterItem key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function QuranChapterItem({ chapter }: { chapter: Chapter }) {
  return (
    <div class="bg-base-200 border rounded-selector w-full">
      <a class="group no-underline" href={`/${chapter.id.toString()}`}>
        <div class="flex justify-between items-center py-4 px-5 hover:bg-accent/50 transition-colors duration-200">
          <div class="flex items-center">
            <div class="relative bg-base-300 flex items-center size-[calc(2.5*1rem)] rounded rotate-0 me-1 text-center before:absolute before:top-0 before:left-0 before:size-[calc(2.5*1rem)] before:bg-base-300 before:rotate-135 [&_p]:w-full [&_p]:z-10 [&_p]:font-bold">
              <p>{chapter.id}</p>
            </div>
            <h4 aria-label={chapter.nameSimple} class="ml-4 text-lg font-semibold">
              {chapter.nameComplex}
              <span class="block text-sm font-normal text-foreground/70">{chapter.translatedName.name}</span>
            </h4>
          </div>
          <ArabicChapterName name={chapter.nameArabic} versesCount={chapter.versesCount} />
        </div>
      </a>
    </div>
  )
}

function ArabicChapterName({ name, versesCount }: { name: string; versesCount: number }) {
  return (
    <div class="flex flex-col items-center">
      <span translate={false}>{name}</span>
      <span class="text-sm">{versesCount} ayat</span>
    </div>
  )
}