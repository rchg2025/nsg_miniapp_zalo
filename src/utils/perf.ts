// Simple performance instrumentation utilities
export function time<T>(label: string, fn: () => T): T {
  const start = performance.now();
  try { return fn(); }
  finally {
    const end = performance.now();
    if (end - start > 2) { // only log if >2ms
      // eslint-disable-next-line no-console
      console.log(`⏱️ ${label}: ${(end-start).toFixed(2)}ms`);
    }
  }
}

export function safeParse<T=any>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export function chunkArray<T>(arr: T[], size = 50): T[][] {
  const res: T[][] = [];
  for (let i=0; i < arr.length; i += size) res.push(arr.slice(i, i+size));
  return res;
}