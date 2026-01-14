import { Fragment } from "preact/compat/jsx-dev-runtime";
import { ChapterVerse } from "@/types/bible/books.ts";

export function AlKitabVerse({ chapter, textDirection }: { chapter: ChapterVerse; textDirection: "ltr" | "rtl" }) {
  if (!Array.isArray(chapter.content)) return null;
  const verseNumber = chapter.number;

  return (
    <div class="flex items-center gap-4">
      <div class="text-2xl font-thin opacity-30 tabular-nums text-right">{verseNumber}</div>
      <div class="flex-1 [&_blockquote]:max-w-md [&_blockquote]:mx-auto">
      {chapter.content.map((content, index) => {
        if (typeof content === "string") {
          return (
            <p dir={textDirection} key={index} class="text-base/7 text-gray-600" >{content}</p>
          )
        } else if (typeof content === "object" && "text" in content && "poem" in content) {
          return (
            <Fragment key={index}>
              {content.poem && (
                <blockquote class="text-base/7 font-semibold text-gray-900 italic">
                  <span class="text-lg font-thin opacity-30 tabular-nums">{content.poem}</span>
                  {content.text}
                </blockquote>
              )}
            </Fragment>
          )
        }
      })}
      </div>
    </div>
  );
}