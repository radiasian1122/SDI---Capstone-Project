import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * useFetch(fn, deps?, options?)
 * - fn: () => Promise<any>  (your data fetcher)
 * - deps: array (controls when to auto-refetch)
 * - options: { auto?: boolean } defaults to { auto: true }
 */
export function useFetch(fn, deps = [], options = {}) {
  const { auto = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(auto));
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const run = useCallback(async () => {
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const result = await fn({ signal: controller.signal });
      if (!controller.signal.aborted) setData(result);
      return result;
    } catch (e) {
      if (!controller.signal.aborted) setError(e);
      throw e;
    } finally {
      if (!abortRef.current?.signal.aborted) setLoading(false);
    }
  }, [fn]);

  // initial or dep-driven fetch
  useEffect(() => {
    if (!auto) return;
    run();
    return () => abortRef.current?.abort?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, auto]);

  const refetch = useCallback(() => run(), [run]);
  return useMemo(
    () => ({ data, loading, error, refetch }),
    [data, loading, error, refetch]
  );
}

// import { useEffect, useState } from "react";

// export function useFetch(fn, deps = []) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     setLoading(true);
//     fn()
//       .then((d) => {
//         if (mounted) setData(d);
//       })
//       .catch((e) => {
//         if (mounted) setError(e);
//       })
//       .finally(() => {
//         if (mounted) setLoading(false);
//       });
//     return () => {
//       mounted = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, deps);

//   return { data, loading, error, refetch: () => fn().then(setData) };
// }
