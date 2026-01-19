import { useEffect, useRef } from "preact/compat";
import { useSignal } from "@preact/signals";
import { performSearch } from "@/libs/doc-find.ts";

export function SearchBarResult() {
  const searchParams = useSignal('');
  const results = useSignal([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const updateSearchParams = () => {
      // read the q param from the url
      const params = new URLSearchParams(globalThis.location.search);
      const q = params.get('q') || '';
      searchParams.value = q;
    };

    // Update on mount
    updateSearchParams();

    // Listen for URL changes (back/forward navigation)
    globalThis.addEventListener('popstate', updateSearchParams);

    // Listen for visibility changes (when tab becomes active)
    globalThis.addEventListener('visibilitychange', () => {
      if (!globalThis.document.hidden) {
        updateSearchParams();
      }
    });

    // Periodic check in case URL changes without events
    const interval = setInterval(updateSearchParams, 500);

    return () => {
      globalThis.removeEventListener('popstate', updateSearchParams);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // perform search when searchParams changes
    if (!searchParams.value) {
      results.value = [];
      error.value = null;
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

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchParams.value]);

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

        {!loading.value && !error.value && results.value.length === 0 && searchParams.value && (
          <div class="p-4 text-center text-gray-500">
            No results found for "{searchParams.value}"
          </div>
        )}

        {results.value.length > 0 && (
          <div class="divide-y">
            {results.value.map((result: any, idx: number) => (
              <div key={idx} class="p-4 hover:bg-gray-50">
                <div class="font-semibold">{result.title || result.name}</div>
                <div class="text-sm text-gray-600 mt-1">{result.preview || result.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
  )
}