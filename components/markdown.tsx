import { Marked, render } from "@deno/gfm";
import { markedSmartypants } from "marked-smartypants";

Marked.marked.use(markedSmartypants());

type TocItem = {
  id: string;
  text: string;
  depth: number;
};

export function Markdown(
  { source, baseURL, mediaBaseURL }: {
    source: string;
    baseURL?: string;
    mediaBaseURL?: string;
  },
) {
  const slugCounts = new Map<string, number>();
  const toSlug = (text: string) => {
    const base = text
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-") || "section";
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };

  const toc = (Marked.marked.lexer(source) as Array<
    { type: string; depth?: number; text?: string }
  >)
    .filter((token) =>
      token.type === "heading" &&
      typeof token.depth === "number" &&
      typeof token.text === "string"
    )
    .map((token) => ({
      id: toSlug(token.text!),
      text: token.text!,
      depth: token.depth!,
    })) as TocItem[];

  const html = render(source, {
    allowIframes: false,
    baseUrl: baseURL,
    mediaBaseUrl: mediaBaseURL,
  });
  
  // Process HTML to add dir=rtl to pre tags containing Arabic text
  const processedHtml = html.replace(
    /<blockquote>([^<]*[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF][^<]*)<\/blockquote>/g,
    '<blockquote dir="rtl">$1</blockquote>'
  );

  let headingIndex = 0;
  const htmlWithHeadingIds = processedHtml.replace(
    /<h([1-6])([^>]*)>/g,
    (match, level, attrs) => {
      const entry = toc[headingIndex++];
      if (!entry || /\sid=/.test(attrs)) return match;
      return `<h${level}${attrs} id="${entry.id}">`;
    },
  );

  return (
    <div class={toc.length > 0 ? "lg:grid lg:grid-cols-5 lg:gap-10" : ""}>
      <div
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body prose sm:prose-xl prose-p:text-base-content prose-blockquote:rtl:font-lpmq prose-blockquote:rtl:text-3xl prose-blockquote:rtl:leading-loose prose-blockquote:rtl:text-pretty prose-blockquote:rtl:mr-3 prose-blockquote:rtl:not-italic prose-blockquote:rtl:text-justify prose-blockquote:rtl:border-0 prose-h1:text-3xl prose-h2:text-xl lg:col-span-4"
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: htmlWithHeadingIds }}
      />
      {toc.length > 0 && (
        <nav class="mb-8 rounded-xl border border-base-300 bg-base-200 p-4 lg:sticky lg:top-24 lg:mb-0 lg:col-span-1 lg:overflow-auto">
          <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-base-content/70">
            Daftar Isi
          </p>
          <ol class="space-y-2">
            {toc.map((item) => (
              <li
                key={item.id}
                class="text-sm leading-snug"
                style={{ paddingLeft: `${Math.max(0, item.depth - 1) * 0.75}rem` }}
              >
                <a href={`#${item.id}`} class="text-base-content/80 hover:text-base-content hover:underline">
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}
