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
    transliterated_name: string;
    name_arabic: string;
    translated_name: TranslatedName;
}