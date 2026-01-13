/**
 * Maps chapter number to verse count
 */
declare const versesMapping: {
    readonly 1: 7;
    readonly 2: 286;
    readonly 3: 200;
    readonly 4: 176;
    readonly 5: 120;
    readonly 6: 165;
    readonly 7: 206;
    readonly 8: 75;
    readonly 9: 129;
    readonly 10: 109;
    readonly 11: 123;
    readonly 12: 111;
    readonly 13: 43;
    readonly 14: 52;
    readonly 15: 99;
    readonly 16: 128;
    readonly 17: 111;
    readonly 18: 110;
    readonly 19: 98;
    readonly 20: 135;
    readonly 21: 112;
    readonly 22: 78;
    readonly 23: 118;
    readonly 24: 64;
    readonly 25: 77;
    readonly 26: 227;
    readonly 27: 93;
    readonly 28: 88;
    readonly 29: 69;
    readonly 30: 60;
    readonly 31: 34;
    readonly 32: 30;
    readonly 33: 73;
    readonly 34: 54;
    readonly 35: 45;
    readonly 36: 83;
    readonly 37: 182;
    readonly 38: 88;
    readonly 39: 75;
    readonly 40: 85;
    readonly 41: 54;
    readonly 42: 53;
    readonly 43: 89;
    readonly 44: 59;
    readonly 45: 37;
    readonly 46: 35;
    readonly 47: 38;
    readonly 48: 29;
    readonly 49: 18;
    readonly 50: 45;
    readonly 51: 60;
    readonly 52: 49;
    readonly 53: 62;
    readonly 54: 55;
    readonly 55: 78;
    readonly 56: 96;
    readonly 57: 29;
    readonly 58: 22;
    readonly 59: 24;
    readonly 60: 13;
    readonly 61: 14;
    readonly 62: 11;
    readonly 63: 11;
    readonly 64: 18;
    readonly 65: 12;
    readonly 66: 12;
    readonly 67: 30;
    readonly 68: 52;
    readonly 69: 52;
    readonly 70: 44;
    readonly 71: 28;
    readonly 72: 28;
    readonly 73: 20;
    readonly 74: 56;
    readonly 75: 40;
    readonly 76: 31;
    readonly 77: 50;
    readonly 78: 40;
    readonly 79: 46;
    readonly 80: 42;
    readonly 81: 29;
    readonly 82: 19;
    readonly 83: 36;
    readonly 84: 25;
    readonly 85: 22;
    readonly 86: 17;
    readonly 87: 19;
    readonly 88: 26;
    readonly 89: 30;
    readonly 90: 20;
    readonly 91: 15;
    readonly 92: 21;
    readonly 93: 11;
    readonly 94: 8;
    readonly 95: 8;
    readonly 96: 19;
    readonly 97: 5;
    readonly 98: 8;
    readonly 99: 8;
    readonly 100: 11;
    readonly 101: 11;
    readonly 102: 8;
    readonly 103: 3;
    readonly 104: 9;
    readonly 105: 5;
    readonly 106: 4;
    readonly 107: 7;
    readonly 108: 3;
    readonly 109: 6;
    readonly 110: 3;
    readonly 111: 5;
    readonly 112: 4;
    readonly 113: 5;
    readonly 114: 6;
};

type NumberRange<Start extends number, End extends number> = Exclude<_NumbersFrom0ToN<End>, _NumbersFrom0ToN<Start>>;
type _NumbersFrom0ToN<Nr extends number> = Nr extends Nr ? number extends Nr ? number : Nr extends 0 ? never : _NumbersFrom0ToNRec<Nr, [], 0> : never;
type _NumbersFrom0ToNRec<Nr extends number, Counter extends unknown[], Accumulator extends number> = Counter["length"] extends Nr ? Accumulator : _NumbersFrom0ToNRec<Nr, [
    unknown,
    ...Counter
], Accumulator | Counter["length"]>;
/**
 * Builds a tuple with a length equal to the provided number literal.
 * Used for type-level arithmetic.
 */
type BuildTuple<TLength extends number, TAccumulator extends unknown[] = []> = TAccumulator["length"] extends TLength ? TAccumulator : BuildTuple<TLength, [...TAccumulator, unknown]>;
/**
 * Increments a numeric literal type by 1.
 */
type Increment<TNumber extends number> = [
    ...BuildTuple<TNumber>,
    unknown
]["length"];

interface TranslatedName {
    name: string;
    language_name: string;
}

export interface Surah {
    id: number;
    verses_count: number;
    bismillah_pre: boolean;
    revelation_order: number;
    revelation_place: string;
    pages: Array<number>;
    name_complex: string;
    name_simple: string;
    name_arabic: string;
    translated_name: TranslatedName;
    verses?: Verse[];
}

export type VerseKey = {
    [TChapter in keyof typeof versesMapping]: `${TChapter}:${NumberRange<1, Increment<(typeof versesMapping)[TChapter]>>}`;
}[keyof typeof versesMapping];

export interface Verse {
    id: number;
    verse_number: number;
    verse_key: VerseKey;
    page_number: number;
    juz_number: number;
    hizb_number: number;
    rub_el_hizb_number: number;
    words?: Word[];
    text_uthmani?: string;
    text_uthmani_simple?: string;
    text_uthmani_tajweed?: string;
    text_imlaei?: string;
    text_imlaei_simple?: string;
    text_indopak?: string;
    text_indopak_nastaleeq?: string;
    sajdah_number: null;
    image_url?: string;
    image_width?: number;
    v1_page?: number;
    v2_page?: number;
    code_v1?: string;
    code_v2?: string;
    translations?: Translation[];
}

interface Translation {
    id?: number;
    text: string;
    resource_id?: number;
    resource_name?: string;
    verseId?: number;
    languageId?: number;
    languageName?: string;
    verseKey?: VerseKey;
    chapterId?: number;
    verseNumber?: number;
    juzNumber?: number;
    hizbNumber?: number;
    rubNumber?: number;
    pageNumber?: number;
}

interface Word {
    id?: number;
    position: number;
    audio_url: string | null;
    char_type_name: string;
    codeV1?: string;
    codeV2?: string;
    page_number?: number;
    line_number?: number;
    text?: string;
    textUthmani?: string;
    textIndopak?: string;
    textImlaei?: string;
    translation: Translation;
    transliteration: Transliteration;
    location?: string;
    verseKey?: VerseKey;
}

interface Transliteration {
    language_name?: string;
    text?: string | null;
}