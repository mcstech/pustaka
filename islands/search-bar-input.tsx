import { useSignal, effect } from "@preact/signals";
import { useRef } from "preact/hooks";

export function SearchBarInput() {
  const inputValue = useSignal('');
  const debounceTimerRef = useRef<number | null>(null);
  
  // Debounced URL update - runs only after user stops typing
  effect(() => {
    const value = inputValue.value;
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce URL update by 300ms
    debounceTimerRef.current = setTimeout(() => {
      // Only run in browser environment
      if (typeof globalThis.location === 'undefined' || typeof globalThis.history === 'undefined') {
        return;
      }
      
      if (value) {
        const searchParams = new URLSearchParams({ q: value }).toString();
        const newUrl = `${globalThis.location.pathname}?${searchParams}`;
        globalThis.history.replaceState({}, "", newUrl);
      } else {
        // Clear URL params when input is empty
        globalThis.history.replaceState({}, "", globalThis.location.pathname);
      }
      
      // Dispatch custom event to notify other components of URL change
      globalThis.dispatchEvent(new CustomEvent('urlchange'));
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  });

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    inputValue.value = target.value;
  };

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
            value={inputValue.value}
            onInput={handleInput}
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