import type { ComponentChildren } from "preact";

import { cn } from "@/libs/utils.ts";
import { ThemeToggle } from "@/islands/ThemeToggle.tsx";

interface HeroProps {
  class?: string;
  children?: ComponentChildren;
}

export function Hero(props: HeroProps) {
  return (
    <div class={cn("relative isolate overflow-hidden", props.class)}>
      <img
        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=fff&sat=-100&exp=15&blend-mode=overlay"
        alt=""
        class="absolute inset-0 -z-10 size-full object-cover opacity-10"
      />
      <div aria-hidden="true" class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary-foreground to-primary opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl py-20">
          <div class="flex flex-col items-center-safe text-center space-y-10">
            {props.children}
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-secondary to-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>
      <div class="absolute top-0 right-0 border rounded-full m-4 p-2 scale-50">
        <ThemeToggle />
      </div>
    </div>
  )
}

export function AnnoucementBanner() {
  return (
    <div class="hidden sm:mb-8 sm:flex sm:justify-center">
      <div class="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        Announcing our next round of funding. <a href="#" class="font-semibold text-indigo-600"><span aria-hidden="true" class="absolute inset-0"></span>Read more <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  )
}