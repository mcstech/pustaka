// import { Suspense, lazy } from "preact/compat";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { initSearch } from "@/libs/doc-find.ts";
import { SearchBarInput } from "./search-bar-input.tsx";
import { SearchBarResult } from "./search-bar-result.tsx";
import { cn } from "@/libs/utils.ts";
// const SearchBarInput = lazy(() => import('./search-bar-input.tsx').then(module => ({ default: module.SearchBarInput })));

export function SearchBar() {
  return (
    <div class="relative">
      <SearchBarTrigger />
      <SearchBarModal />
    </div>
  )
}

export function SearchBarTrigger({ class: className = "" }) {
  const initiated = useSignal(false);
  const handleOpenModal = () => {
    const dialog = document.getElementById("docFind") as HTMLDialogElement | null;

    if (!dialog) return;
    if (dialog.open) return; // guard against repeated showModal calls throwing

    dialog.showModal();
    if (!initiated.value) {
      initSearch();
      initiated.value = true;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        handleOpenModal();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      class={cn("input input-sm drop-shadow-md", className)}
      role="search"
      aria-label="Open search dialog"
      onClick={handleOpenModal}
    >
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
      <input
        type="search"
        class="grow"
        placeholder="Cari"
        onClick={handleOpenModal}
        onFocus={handleOpenModal}
        readOnly
      />
      <kbd class="kbd kbd-sm">⌘</kbd>
      <kbd class="kbd kbd-sm">K</kbd>
    </div>
  )
}

export function SearchBarModal() {
  return (
    <dialog
      id="docFind"
      class="modal modal-bottom sm:modal-middle"
    >
      <div class="modal-box p-0 overflow-hidden">
        <SearchBarInput />
        <SearchBarResult />
      </div>
      {/* Backdrop: clicking outside closes the dialog */}
      <form method="dialog" class="modal-backdrop">
        <button type="button">close</button>
      </form>
    </dialog>
  )
}
