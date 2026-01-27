import { SearchBarModal, SearchBarTrigger } from "@/islands/search-bar.tsx";

export function HeroForm() {
  return (
    <>
    <form>
      <SearchBarTrigger class="input-lg" />
    </form>
    <SearchBarModal />
    </>
  )
}