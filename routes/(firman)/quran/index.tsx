import { define } from "@/utils.ts";
import { Chapter } from "./_components/chapter-title.tsx";

export default define.page(function Home(ctx) {
  const quran = ctx.state.quran;
  const alfatihah = quran.chapters.find((chapter) => chapter.id === 1);
  const verses = alfatihah?.verses || [];
  console.log(alfatihah)
  return (
    <div class="mx-auto max-w-5xl px-0 py-26 lg:px-8">
      <Chapter
        id={alfatihah?.id.toString()}
        name={alfatihah?.name_complex}
        withBismillah={alfatihah?.bismillah_pre}
      />
      <dl class="mt-20 divide-y divide-gray-900/10">
        {verses.map((verse) => (
          <div key={verse.id} class="py-8 first:pt-0 last:pb-0 flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-8">
            <dt dir="ltr" class="text-base/7 font-semibold text-gray-900 lg:col-span-5 ltr:ml-3">
              {verse.id}. {verse.translations?.[0].text}
            </dt>
            <dd dir="rtl" class="mt-4 lg:col-span-7 lg:mt-0">
              <p class="text-base/7 text-gray-600 rtl:mr-3 font-uthmanic-hafs">
                {verse.text_uthmani}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
});