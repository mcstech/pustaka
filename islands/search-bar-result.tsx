import { useRef } from "preact/compat";
import { useSignal, useComputed, effect } from "@preact/signals";
import { escapeHtml, highlightQuery, performSearch } from "@/libs/doc-find.ts";

export function SearchBarResult() {
  const searchParams = useSignal('');
  const results = useSignal([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  // Single effect for URL sync - only runs in browser
  effect(() => {
    // Early return for SSR
    if (typeof globalThis === 'undefined' || typeof globalThis.location === 'undefined') {
      return;
    }

    const updateSearchParams = () => {
      const params = new URLSearchParams(globalThis.location.search);
      const q = params.get('q') || '';
      console.log('URL search param q=', q);
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
      abortControllerRef.current.abort();
    }

    // Debounce search to avoid excessive requests
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    loading.value = true;
    error.value = null;

    debounceTimerRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();
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

      {results.value.length > 0 && (
        <ul class="list bg-base-100 rounded-box shadow-md">
          {results.value.map((result: any, idx: number) => (
            <li key={idx} class="list-row">
              <div>
                <div dangerouslySetInnerHTML={{ __html: highlightQuery(escapeHtml(result.title), searchParams.value) }} />
                <div dangerouslySetInnerHTML={{ __html: highlightQuery(escapeHtml(result.body), searchParams.value) }} class="text-xs uppercase font-semibold opacity-60" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}