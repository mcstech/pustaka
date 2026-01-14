import { Fragment } from "preact/compat/jsx-dev-runtime";
import { ChapterHebrewSubtitle } from "@/types/bible/books.ts";

export function HebrewSubtitle({ chapter }: { chapter: ChapterHebrewSubtitle }) {
  if (!Array.isArray(chapter.content)) return null;

  return (
    <dl class="mt-20">
      <div key={chapter.type} class="py-8 first:pt-0 last:pb-0 flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-8">
        {chapter.content.map((content, index) => {
          if (typeof content === "string") {
            return (
              <Fragment key={index}>
                <dt dir="ltr" />
                <dd dir="rtl" class="mt-4 lg:col-span-7 lg:mt-0" key={index}>
                  <p class="text-base/7 text-gray-600 rtl:mr-3" >{content}</p>
                </dd>
              </Fragment>
            )
          } else if (typeof content === "object" && "text" in content && "poem" in content) {
            return (
              <Fragment key={index}>
                {content.poem && (
                  <dt dir="ltr" class="text-base/7 font-semibold text-gray-900 lg:col-span-5 ltr:ml-3">
                    [Puisi Baris {content.poem}]
                  </dt>
                )}
                <dd dir="rtl" class="mt-4 lg:col-span-7 lg:mt-0" key={index}>
                  <p class="text-base/7 text-gray-600 rtl:mr-3">{content.text}</p>
                </dd>
              </Fragment>
            )
          }
        })}
      </div>
    </dl>
  );
}