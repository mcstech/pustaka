import { Language, QuranClient } from "@quranjs/api";

const QURAN_CLIENT_ID = Deno.env.get("QURAN_CLIENT_ID")!;
const QURAN_CLIENT_SECRET = Deno.env.get("QURAN_CLIENT_SECRET")!;
const QURAN_AUTH_URL = Deno.env.get("QURAN_AUTH_URL")!;
const QURAN_API_URL = Deno.env.get("QURAN_API_BASE_URL")!;

if (!QURAN_CLIENT_ID || !QURAN_CLIENT_SECRET) {
  throw new Error("QURAN_CLIENT_ID and QURAN_CLIENT_SECRET must be set");
}

const client = new QuranClient({
  clientId: QURAN_CLIENT_ID,
  clientSecret: QURAN_CLIENT_SECRET,
  authBaseUrl: QURAN_AUTH_URL,
  contentBaseUrl: QURAN_API_URL,
  defaults: {
    language: Language.INDONESIAN,
  },
});

export { client };