import type { RandomVerse } from "@/libs/random-verse.ts";

interface HeroVerseProps {
  verse: RandomVerse;
}

export function HeroVerse({ verse }: HeroVerseProps) {
  return (
    <a
      href={verse.href}
      class="group max-w-xl mx-auto text-center px-4 transition-opacity hover:opacity-80"
    >
      <blockquote class="text-base-content/70 text-sm italic leading-relaxed">
        &ldquo;{verse.text}&rdquo;
      </blockquote>
      <cite class="mt-2 block text-xs text-base-content/40 not-italic tracking-wide uppercase">
        — {verse.reference}
      </cite>
    </a>
  );
}
