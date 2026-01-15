import { Bismillahirrahmanirrahim } from "@/components/quran/bi-isme-allah.tsx";
import { ChapterIndex } from "@/components/quran/chapters.tsx";

interface Props {
  id?: string;
}

export function ArabicChapterTitle({ id = "1" }: Props) {
  return (
    <span dir="rtl" class="font-surah-names leading-normal text-3xl sm:text-6xl">
      {id.padStart(3, '0')}
    </span>
  )
}

interface ChapterProps {
  id?: string;
  name?: string;
  withBismillah?: boolean;
}

export function Chapter({ id, name, withBismillah = true }: ChapterProps) {
  return (
    <h1 class="flex flex-col items-center justify-center-safe space-x-4 space-x-reverse text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
      <ChapterIndex id={Number(id)} class="text-xl" />
      <div class="flex justify-center items-center gap-x-3">
        <ArabicChapterTitle id={id} />
        <span class="text-center text-2xl font-semibold">{name}</span>
      </div>
      {withBismillah && (
        <Bismillahirrahmanirrahim />
      )}
    </h1>
  )
}