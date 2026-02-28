import { asset } from "fresh/runtime";
import { SearchBarModal, SearchBarTrigger } from "@/islands/search-bar.tsx";

export function HeroLogo() {
  return (
    <div class="flex flex-col items-center gap-3">
      <div class="flex items-center gap-2">
        <img
          src={asset("/logo-2.svg")}
          alt="Pustaka"
          width="100"
          height="56.25"
          class="drop-shadow-lg"
        />
        <h1 class="text-5xl font-bold tracking-tight text-base-content">
          Pustaka
        </h1>
      </div>
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
