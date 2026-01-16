import { Surah } from "@/types/quran/surah.ts";
import { cn } from "@/libs/utils.ts";

interface QuranChaptersListProps {
  chapters: Surah[];
}
export function QuranChaptersList({ chapters }: QuranChaptersListProps) {
  return (
    <div class="py-20 sm:py-10">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 class="text-center text-lg/8 font-semibold text-gray-900">Nama-nama Surah</h2>
        <div class="mx-auto grid max-w-lg grid-cols-1 sm:grid-cols-3 items-center gap-x-8 gap-y-3 sm:gap-y-12 sm:max-w-xl lg:mx-0 lg:max-w-none">
          {chapters.map((chapter) => (
            <QuranChapterItem key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function QuranChapterItem({ chapter }: { chapter: Surah }) {
  const href = chapter.id === 1 ? '/quran' : `/quran/${chapter.id.toString()}`;
  return (
    <div class="bg-base-200 border rounded-selector w-full">
      <a class="group no-underline" href={href}>
        <div class="flex justify-between items-center py-4 px-5 hover:bg-accent/50 transition-colors duration-200">
          <div class="flex items-center">
            <ChapterIndex id={chapter.id} />
            <h4 aria-label={chapter.name_simple} class="ml-4 text-lg font-semibold">
              {chapter.name_complex}
              <span class="block text-sm font-normal text-foreground/70">{chapter.translated_name.name}</span>
            </h4>
          </div>
          <ArabicChapterName name={chapter.name_arabic} versesCount={chapter.verses_count} />
        </div>
      </a>
    </div>
  )
}

function ArabicChapterName({ name, versesCount }: { name: string; versesCount: number }) {
  return (
    <div class="flex flex-col items-center">
      <span translate={false} class="font-lpmq leading-loose">{name}</span>
      <span class="text-sm">{versesCount} ayat</span>
    </div>
  )
}

export function ChapterIndex({ id, class: className }: { id: number; class?: string }) {
  return (
    <div class={cn("relative bg-base-300 flex items-center size-[calc(2.5*1rem)] rounded rotate-0 me-1 text-center before:absolute before:top-0 before:left-0 before:size-[calc(2.5*1rem)] before:bg-base-300 before:rotate-135 [&_p]:w-full [&_p]:z-10 [&_p]:font-bold", className)}>
      <p>{id}</p>
    </div>
  )
}