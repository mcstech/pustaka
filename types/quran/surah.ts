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
    verses?: VerseKey;
}

// Verse text type - dynamic keys representing verse numbers
export interface VerseText {
    [verseNumber: string]: string;
}

// Translation structure for a specific language
export interface Translation {
    name: string;
    text: VerseText;
}

// Translations object with language codes as keys
export interface Translations {
    [languageCode: string]: Translation;
}

// Tafsir (commentary) for a specific source
export interface TafsirSource {
    name: string;
    source: string;
    text: VerseText;
}

// Tafsir object with different sources
export interface TafsirContent {
    [sourceName: string]: TafsirSource;
}

// Tafsir with language codes
export interface Tafsir {
    [languageCode: string]: TafsirContent;
}

// Individual verse (surah) data
export interface Verse {
    number: string;
    name: string;
    name_latin: string;
    number_of_ayah: string;
    text: VerseText;
    translations: Translations;
    tafsir: Tafsir;
}

// Complete Verses type with surah numbers as keys
export interface VerseKey {
    [surahNumber: string]: Verse;
}
