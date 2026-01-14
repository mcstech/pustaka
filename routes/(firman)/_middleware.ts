import { prepareFirman } from "@/libs/quran/prepare-alfatihah.ts";
import { define } from "@/utils.ts";

export const handler = define.middleware(prepareFirman);