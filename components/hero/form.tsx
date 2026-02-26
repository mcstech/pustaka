import { asset } from "fresh/runtime";
import { SearchBarModal, SearchBarTrigger } from "@/islands/search-bar.tsx";

export function HeroLogo() {
  return (
    <div class="flex flex-col items-center gap-3">
      <img
        src={asset("/logo.svg")}
        alt="Pustaka"
        width="72"
        height="72"
        class="drop-shadow-lg"
      />
      <h1 class="text-5xl font-bold tracking-tight text-base-content">
        Pustaka
      </h1>
      <p class="text-sm text-base-content/50 tracking-[0.25em] uppercase">
        Koleksi Ayat-Ayat Suci
      </p>
    </div>
  );
}

export function HeroForm() {
  return (
    <>
      <form class="w-full max-w-xl">
        <SearchBarTrigger class="input-lg w-full" />
      </form>
      <SearchBarModal />
    </>
  );
}
