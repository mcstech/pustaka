import { Marked, render } from "@deno/gfm";
import { markedSmartypants } from "marked-smartypants";

Marked.marked.use(markedSmartypants());

export function Markdown(
  { source, baseURL, mediaBaseURL }: {
    source: string;
    baseURL?: string;
    mediaBaseURL?: string;
  },
) {
  const html = render(source, {
    allowIframes: false,
    baseUrl: baseURL,
    mediaBaseUrl: mediaBaseURL,
  });
  
  // Process HTML to add dir=rtl to pre tags containing Arabic text
  const processedHtml = html.replace(
    /<pre>([^<]*[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF][^<]*)<\/pre>/g,
    '<pre dir="rtl">$1</pre>'
  );
  
  return (
    <div
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body prose sm:prose-xl prose-p:text-base-content prose-pre:font-lpmq prose-pre:text-2xl prose-pre:text-end prose-h1:text-3xl prose-h2:text-xl"
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}