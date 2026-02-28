import { extract } from "@std/front-matter/yaml";
import { Head, Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";
import { define } from "@/utils.ts";
import { Markdown } from "@/components/markdown.tsx";

export const config: RouteConfig = {};

export default define.page<typeof handler>(function Page(ctx) {
  const data = ctx.data;

  return (
    <Partial name="main-site">
      <Head>
        <title>{data.title} - Pustaka</title>
        <meta name="description" content={data.description} />
      </Head>
      <div class="mx-auto max-w-5xl px-0 py-26 lg:px-8">
        <h1 class="text-4xl lg:text-5xl lg:leading-[1.1] text-pretty font-medium mb-8">
          {data.title}
        </h1>
        <Markdown source={data.content} />
      </div>
    </Partial>
  )
});

export const handler = define.handlers({
  async GET(ctx) {
    const { year, filename } = ctx.params;
    const path = `./data/wejangan/${year}/${filename}.md`;
    const markdown = await Deno.readTextFile(path);
    const { body, attrs } = extract<{ title: string; description: string }>(
      markdown,
    );
    const title = attrs.title as string;
    // extract content from body
    // skip all arabic text
    // skip headlines
    const description = body
      .split("\n")
      .filter((line) => {
        if (line.startsWith("#")) return false;
        if (/[؀-ۿ]/.test(line)) return false;
        return line.trim().length > 0;
      })
      .slice(0, 255)
      .join(" ");

    return {
      data: {
        content: body,
        title,
        description,
      },
    };
  }
});