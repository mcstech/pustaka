import { define } from "@/utils.ts";
import { prepareBibleChapter } from "@/libs/bible/prepare-chapter.ts";

export const handler = define.middleware(prepareBibleChapter);
