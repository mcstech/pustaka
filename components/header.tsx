import { cn } from "@/libs/utils.ts";
import { BookSelector } from "./book-selector.tsx";

interface HeaderProps {
  class?: string;
}

export function Header(props: HeaderProps) {
  return (
    <header class={`flex items-center justify-between p-4 lg:p-3 ${props.class ?? ""}`}>
      <div class="inline-flex pt-[.3rem] pr-[.3rem] pb-[.3rem] pl-[1.1rem] backdrop-blur-md border border-gray-100 rounded-[6.25rem] justify-start items-center">
        <h3 class="text-[.8rem] tracking-[1.2px] leading-none text-pretty text-primary-foreground">RUH KUDUS</h3>
      </div>
      {/* <div class="inline-flex p-[.3rem] backdrop-blur-md border border-gray-100 rounded-[6.25rem] justify-start items-center">
        
      </div> */}
    </header>
  )
}

export function HeaderDrawer(props: HeaderProps) {
  return (
    <nav class={cn("navbar w-full bg-base-300 space-x-3 items-center", props.class)}>
      <label for="quran-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor" class="inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
      </label>
      <label class="input input-sm">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input type="search" class="grow" placeholder="Search" />
        <kbd class="kbd kbd-sm">⌘</kbd>
        <kbd class="kbd kbd-sm">K</kbd>
      </label>
      <div class="hidden ml-auto flex-row flex-none lg:flex">
        <BookSelector />
        <ul class="menu menu-horizontal menu-xs py-1">
          <li><a>Al-Kitab</a></li>
        </ul>
      </div>
    </nav>
  )
}