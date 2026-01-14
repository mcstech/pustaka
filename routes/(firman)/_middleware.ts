import { prepareFirman } from "@/libs/prepare-firman.ts";
import { define } from "@/utils.ts";

export const handler = define.middleware(prepareFirman);