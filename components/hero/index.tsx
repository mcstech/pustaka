import type { ComponentChildren } from "preact";

import { cn } from "@/libs/utils.ts";
import { ThemeToggle } from "@/islands/ThemeToggle.tsx";

interface HeroProps {
  class?: string;
  children?: ComponentChildren;
}

export function Hero(props: HeroProps) {
  return (
    <div class={cn("relative isolate flex flex-col overscroll-contain overflow-hidden", props.class)}>
      {/* Subtle background decorations */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary-foreground to-primary opacity-10 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      {/* Theme toggle in top-right */}
      <div class="absolute top-0 right-0 m-4 p-1 rounded-full border border-base-300 scale-75 origin-top-right">
        <ThemeToggle />
      </div>

      {/* Centered content */}
      <div class="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-8">
        <div class="flex flex-col items-center gap-8 w-full max-w-2xl">
          {props.children}
        </div>
      </div>

      {/* Bottom navigation links */}
      <div class="flex justify-center gap-6 text-xs text-base-content/40">
        <a href="/quran" class="hover:text-base-content transition-colors">
          Al-Quran
        </a>
        <span aria-hidden="true">·</span>
        <a href="/alkitab" class="hover:text-base-content transition-colors">
          Alkitab
        </a>
      </div>

      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-secondary to-secondary opacity-10 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
    </div>
  );
}
