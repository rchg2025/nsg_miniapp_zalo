import { useEffect, useRef, useState } from 'react';

/**
 * Generic auto refresh hook that respects `appSettings.autoRefresh` in localStorage.
 * It centralizes interval creation and clears on unmount. If autoRefresh is disabled,
 * it skips scheduling and only runs the callback once (initial).
 */
export function useAutoRefresh(callback: () => void, intervalMs = 5000, depKey: string = '') {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    const run = () => savedCallback.current();
    // Always run once initially
    run();
    const appSettingsRaw = localStorage.getItem('appSettings');
    let autoRefresh = true;
    if (appSettingsRaw) {
      try {
        const settings = JSON.parse(appSettingsRaw);
        autoRefresh = settings.autoRefresh !== false;
      } catch { /* ignore */ }
    }
    if (!autoRefresh) return; // skip interval
    const id = setInterval(run, intervalMs);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, depKey]);
}

/** Debounce helper hook */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}