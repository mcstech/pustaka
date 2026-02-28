import { useSignal, useComputed } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { initSearch, performSearch, highlightQuery, escapeHtml } from "@/libs/doc-find.ts";
import { SearchResult } from "@/types/index.ts";
import { cn } from "@/libs/utils.ts";

const RECENT_SEARCHES_KEY = "pustaka_recentSearches";
const MAX_RECENT = 5;
const SEARCH_DEBOUNCE_MS = 300;

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const trimmed = query.trim();
    if (!trimmed) return;
    const recent = getRecentSearches().filter((q) => q !== trimmed);
    recent.unshift(trimmed);
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT)),
    );
  } catch {
    // ignore storage errors
  }
}

const SearchIcon = () => (
  <svg
    class="h-[1em] opacity-50 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-width="2.5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </g>
  </svg>
);

const HistoryIcon = () => (
  <svg
    class="w-4 h-4 text-base-content/40 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

interface SearchBarInlineProps {
  class?: string;
}

export function SearchBarInline({ class: className = "" }: SearchBarInlineProps) {
  const query = useSignal("");
  const results = useSignal<SearchResult[]>([]);
  const recentSearches = useSignal<string[]>([]);
  const isOpen = useSignal(false);
  const loading = useSignal(false);
  const initiated = useSignal(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const ensureInit = () => {
    if (!initiated.value) {
      initSearch();
      initiated.value = true;
    }
  };

  const handleFocus = () => {
    recentSearches.value = getRecentSearches();
    isOpen.value = true;
    ensureInit();
  };

  const runSearch = async (value: string) => {
    if (!value.trim()) {
      results.value = [];
      loading.value = false;
      return;
    }
    loading.value = true;
    try {
      const searchResults = await performSearch(value);
      results.value = searchResults || [];
    } catch {
      results.value = [];
    } finally {
      loading.value = false;
    }
  };

  const handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    query.value = value;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      results.value = [];
      loading.value = false;
      return;
    }

    loading.value = true;
    debounceRef.current = setTimeout(() => runSearch(value), SEARCH_DEBOUNCE_MS);
  };

  const handleSearch = async () => {
    const value = query.value.trim();
    if (!value) return;
    ensureInit();
    await runSearch(value);
    isOpen.value = true;
    saveRecentSearch(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentClick = async (recent: string) => {
    query.value = recent;
    ensureInit();
    isOpen.value = true;
    await runSearch(recent);
    saveRecentSearch(recent);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    saveRecentSearch(query.value);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        isOpen.value = false;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showRecent = useComputed(
    () => isOpen.value && !query.value && recentSearches.value.length > 0,
  );
  const showResults = useComputed(
    () => isOpen.value && !!query.value && results.value.length > 0,
  );
  const showEmpty = useComputed(
    () =>
      isOpen.value &&
      !!query.value &&
      !loading.value &&
      results.value.length === 0,
  );
  const showLoading = useComputed(() => isOpen.value && loading.value);

  const showDropdown = useComputed(
    () =>
      showRecent.value ||
      showResults.value ||
      showEmpty.value ||
      showLoading.value,
  );

  // Group results by category
  const groupedResults = useComputed(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.value.forEach((r) => {
      const cat =
        r.category === "quran"
          ? "Al-Qur'an"
          : r.category === "bible"
          ? "Al-Kitab"
          : r.category === "wejangan"
          ? "Wejangan"
          : "Lain-lain";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    return groups;
  });

  return (
    <div ref={containerRef} class={cn("relative w-full", className)}>
      {/* Search input row */}
      <div class="flex w-full border-2 border-base-content/20 rounded-lg overflow-hidden shadow-lg focus-within:border-base-content/50 transition-colors bg-base-100">
        <div class="flex items-center pl-4 text-base">
          <SearchIcon />
        </div>
        <input
          ref={inputRef}
          type="search"
          class="flex-1 px-3 py-3 bg-transparent text-base-content placeholder:text-base-content/40 outline-none text-sm"
          placeholder="Cari ayat, surah, atau kata kunci..."
          value={query.value}
          onInput={handleInput}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autocomplete="off"
          aria-label="Cari ayat"
          aria-expanded={showDropdown.value}
          aria-haspopup="listbox"
        />
        <button
          class="px-6 py-3 bg-base-content text-base-100 font-semibold text-sm uppercase tracking-widest hover:opacity-80 active:opacity-70 transition-opacity shrink-0"
          onClick={handleSearch}
          aria-label="Cari"
        >
          Cari
        </button>
      </div>

      {/* Dropdown panel */}
      {showDropdown.value && (
        <div
          class="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl overflow-hidden"
          role="listbox"
        >
          {/* Loading state */}
          {showLoading.value && (
            <div class="flex items-center gap-2 px-4 py-4 text-sm text-base-content/50">
              <span class="loading loading-spinner loading-xs" />
              Sedang mencari...
            </div>
          )}

          {/* Recent searches */}
          {showRecent.value && (
            <div>
              <div class="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-base-content/40 border-b border-base-200">
                Pencarian Terkini
              </div>
              <ul role="list">
                {recentSearches.value.map((recent, i) => (
                  <li key={i}>
                    <button
                      class="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-base-200 transition-colors border-b border-base-200 last:border-b-0"
                      onClick={() => handleRecentClick(recent)}
                    >
                      <HistoryIcon />
                      <span class="text-base-content">{recent}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search results grouped by category */}
          {showResults.value && (
            <nav aria-label="Hasil Pencarian" class="max-h-80 overflow-y-auto">
              {Object.entries(groupedResults.value).map(([cat, items]) => (
                <div key={cat}>
                  <div class="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-base-content/40 bg-base-200 border-y border-base-300 sticky top-0">
                    {cat}
                  </div>
                  <ul role="list">
                    {items.map((result, idx) => (
                      <li key={idx}>
                        <a
                          href={result.href}
                          class="flex flex-col px-4 py-3 hover:bg-base-200 transition-colors border-b border-base-200 last:border-b-0"
                          onClick={handleResultClick}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightQuery(
                                escapeHtml(result.title),
                                query.value,
                              ),
                            }}
                            class="text-sm font-semibold text-base-content"
                          />
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightQuery(
                                escapeHtml(result.body),
                                query.value,
                              ),
                            }}
                            class="mt-0.5 text-xs text-base-content/60 line-clamp-2"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}

          {/* Empty state */}
          {showEmpty.value && (
            <div class="px-4 py-6 text-center text-sm text-base-content/50">
              Tidak ada hasil untuk &ldquo;{query.value}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
