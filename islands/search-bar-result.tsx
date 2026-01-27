import { useRef } from "preact/compat";
import { useSignal, useComputed, effect } from "@preact/signals";
import { escapeHtml, highlightQuery, performSearch } from "@/libs/doc-find.ts";
import { SearchResult } from "@/types/index.ts";

export function SearchBarResult() {
  const searchParams = useSignal('');
  const results = useSignal<SearchResult[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  effect(() => {
    // Single effect for URL sync - only runs in browser
    // Early return for SSR
    if (typeof globalThis === 'undefined' || typeof globalThis.location === 'undefined') {
      return;
    }

    const updateSearchParams = () => {
      const params = new URLSearchParams(globalThis.location.search);
      const q = params.get('q') || '';
      console.log('URL search param q=', q);
      if (!q) {
        searchParams.value = '';
        results.value = [];
        error.value = null;
        loading.value = false;
        return;
      }

      searchParams.value = q;
    };

    // Initial sync on mount - only run once
    if (!mountedRef.current) {
      mountedRef.current = true;
      updateSearchParams();
    }

    // Listen for URL changes (back/forward navigation)
    const handlePopState = () => {
      console.log('popstate event detected');
      updateSearchParams();
    };
    
    // Listen for custom URL change events (from search input)
    const handleUrlChange = () => {
      console.log('urlchange event detected');
      updateSearchParams();
    };
    
    // Listen for visibility changes (when returning to tab)
    const handleVisibility = () => {
      if (!globalThis.document.hidden) {
        console.log('visibilitychange event detected');
        updateSearchParams();
      }
    };
    
    globalThis.addEventListener('popstate', handlePopState);
    globalThis.addEventListener('urlchange', handleUrlChange);
    globalThis.addEventListener('visibilitychange', handleVisibility);

    // Cleanup function - critical for preventing memory leaks
    return () => {
      globalThis.removeEventListener('popstate', handlePopState);
      globalThis.removeEventListener('urlchange', handleUrlChange);
      globalThis.removeEventListener('visibilitychange', handleVisibility);
    };
  });

  // Separate effect for search - reacts to searchParams changes
  effect(() => {
    console.log('Effect run');
    // Early return for SSR
    if (typeof globalThis === 'undefined' || typeof globalThis.location === 'undefined') {
      return;
    }
    
    // perform search when searchParams changes
    if (!searchParams.value) {
      results.value = [];
      error.value = null;
      loading.value = false;
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      console.log('Aborting previous search request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      return;
    }

    // Debounce search to avoid excessive requests
    if (debounceTimerRef.current) {
      console.log('Clearing previous debounce timer');
      clearTimeout(debounceTimerRef.current);
    }

    loading.value = true;
    error.value = null;

    debounceTimerRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();
        console.log(`Searching for "${searchParams.value}"...`);
        const searchResults = await performSearch(searchParams.value);

        if (!abortControllerRef.current.signal.aborted) {
          results.value = searchResults || [];
          error.value = null;
        }
      } catch (err) {
        if (!abortControllerRef.current?.signal.aborted) {
          error.value = err instanceof Error ? err.message : 'Search failed';
          results.value = [];
          console.error('Search error:', err);
        }
      } finally {
        loading.value = false;
      }
    }, 300);

    // Cleanup function - prevents memory leaks from timers and abort controllers
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  });

  // Computed signal for showing empty state
  const showEmptyState = useComputed(() => 
    !loading.value && !error.value && results.value.length === 0 && searchParams.value
  );
  // Computed search result grouped by category
  const groupedResults = useComputed(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.value.forEach((result) => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });
    return groups;
  });

  return (
    <div class="max-h-96 overflow-y-auto">
      {loading.value && (
        <div class="p-4 text-center text-gray-500">
          Searching...
        </div>
      )}

      {error.value && (
        <div class="p-4 bg-red-100 text-red-700 rounded">
          {error.value}
        </div>
      )}

      {showEmptyState.value && (
        <div class="p-4 text-center text-gray-500">
          No results found for "{searchParams.value}"
        </div>
      )}

      {groupedResults.value && (
        <nav aria-label="Search Results" class="h-full overflow-y-auto">
          {Object.entries(groupedResults.value).map(([category, items]) => (
            <div class="relative" key={category}>
              <div class="sticky top-0 z-10 border-y border-t-gray-100 border-b-gray-200 bg-gray-50 px-3 py-1.5 text-sm/6 font-semibold text-gray-900">
                <h3 class="relative">{category}</h3>
              </div>
              <ul role="list" class="divide-y divide-gray-100">
                {items.map((result, idx: number) => (
                  <li key={idx} class="flex gap-x-4 px-3 py-5 hover:bg-secondary">
                    <a href={result.href}>
                      <div class="flex-auto">
                        <div class="flex items-baseline justify-between gap-x-4">
                          <p dangerouslySetInnerHTML={{ __html: highlightQuery(escapeHtml(result.title), searchParams.value) }} class="text-sm/6 font-semibold text-gray-900" />
                          {result.keywords?.length && <p class="flex-none text-xs text-gray-600">{result.keywords.join(', ')}</p>}
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: highlightQuery(escapeHtml(result.body), searchParams.value) }} class="mt-1 line-clamp-2 text-sm/6 text-gray-600" />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}