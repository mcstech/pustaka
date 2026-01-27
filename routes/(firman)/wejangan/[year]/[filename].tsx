import { extract } from "@std/front-matter/yaml";
import { define } from "@/utils.ts";
import { Markdown } from "@/components/markdown.tsx";

export default define.page<typeof handler>(function Page(ctx) {
  const data = ctx.data;

  return (
    <div class="mx-auto max-w-5xl px-0 py-26 lg:px-8">
      <h1 class="text-4xl lg:text-5xl lg:leading-[1.1] text-balance font-medium mb-8">
        {data.title}
      </h1>
      <Markdown source={data.content} />
    </div>
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

    ctx.state.meta = {
      title: `${title} - Pustaka`,
      description: attrs.description as string,
    };

    return {
      data: {
        content: body,
        title,
      },
    };
  }
});