import { define } from "@/utils.ts";
import { prepareSurah } from "@/libs/quran/prepare-surah.ts";

export const handler = define.middleware(prepareSurah);
