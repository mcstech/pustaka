import type { ComponentChildren } from "preact";

import { cn } from "@/libs/utils.ts";
import { AtasNamaTuanSemestaAlam } from "../anTSA.tsx";

interface HeroProps {
  class?: string;
  children?: ComponentChildren;
}

export function Hero(props: HeroProps) {
  return (
    <div class={cn("relative isolate flex flex-col justify-between overscroll-contain overflow-hidden h-screen", props.class)}>
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

      {/* Centered content */}
      <div class="grid place-content-center place-items-center h-[calc(100vh-10px)] md:h-full px-4 [&_div]:row-span-1 [&_div]:col-span-1">
        <AtasNamaTuanSemestaAlam />
        {props.children}
      </div>

      {/* Bottom navigation links */}
      <div class="flex justify-center gap-6 text-xs text-base-content/40 mb-10">
        <a href="/quran" class="btn btn-neutral">
          Al-Quran
        </a>
        <span aria-hidden="true">·</span>
        <a href="/alkitab" class="btn btn-neutral">
          Al-Kitab
        </a>
      </div>

      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-[calc(100%-15rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-secondary to-secondary opacity-10 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
    </div>
  );
}
