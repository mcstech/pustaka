export interface SearchResult {
  title: string;
  body: string;
  href: string;
  category: string;
  keywords?: string[];
}

export interface RandomVerse {
  text: string;
  reference: string;
  category: "quran" | "bible" | "wejangan";
  href: string;
}