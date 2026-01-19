import { useEffect, useRef } from "preact/compat";
import { useSignal } from "@preact/signals";

export function SearchBarInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSignal('');
  
  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;

      searchParams.value = new URLSearchParams({ q: value }).toString();
      const newUrl = `${globalThis.location.pathname}?${searchParams.value}`;
      globalThis.history.replaceState({}, "", newUrl);
    };

    inputElement.addEventListener("input", handleInput);

    return () => {
      inputElement.removeEventListener("input", handleInput);
    };
  }, []);

  return (
    <div class="flex items-center gap-3 border-b border-base-300 px-4 py-3">
      <form method="get">
        <label class="input w-[clamp(30rem,20rem,100%)]">
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
            id="search-input"
            ref={inputRef}
            class="grow"
            placeholder="Cari ayat, surah, atau kata kunci"
            autocomplete="off"
            autoFocus
          />
        </label>
      </form>
    </div>
  )
}