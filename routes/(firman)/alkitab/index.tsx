import { define } from "@/utils.ts";
import { AlKitabBooksList } from "@/components/bible/books.tsx";

export default define.page(function AlkitabHome(ctx) {
  const alkitab = ctx.state.alkitab;

  return (
    <div class="mx-auto max-w-5xl px-0 py-3 lg:px-8 space-y-3">
      <AlKitabBooksList kitab={alkitab} />
    </div>
  );
});