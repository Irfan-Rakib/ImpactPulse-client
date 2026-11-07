"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

/**
 * Runs a memoized async fetcher and keeps its result, loading, and error state.
 * Pass a `useCallback` fetcher so the effect re-runs when its inputs change.
 */
export function useApiData<T>(fetcher: () => Promise<T>): ApiDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const [loadedFetcher, setLoadedFetcher] = useState<(() => Promise<T>) | null>(
    null,
  );

  useEffect(() => {
    const id = ++requestId.current;

    fetcher()
      .then((result) => {
        if (id !== requestId.current) return;

        setLoadedFetcher(() => fetcher);
        setData(result);
        setError("");
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (id !== requestId.current) return;

        setLoadedFetcher(() => fetcher);
        setError(getErrorMessage(cause));
        setLoading(false);
      });

    return () => {
      requestId.current += 1;
    };
  }, [fetcher]);

  const reload = useCallback(() => {
    const id = ++requestId.current;

    setLoading(true);
    setError("");

    return fetcher()
      .then((result) => {
        if (id !== requestId.current) return;

        setLoadedFetcher(() => fetcher);
        setData(result);
        setError("");
      })
      .catch((cause: unknown) => {
        if (id !== requestId.current) return;

        setLoadedFetcher(() => fetcher);
        setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (id !== requestId.current) return;

        setLoading(false);
      });
  }, [fetcher]);

  const isStale = loadedFetcher !== fetcher;

  return {
    data,
    loading: loading || isStale,
    error: isStale ? "" : error,
    reload,
  };
}

function getErrorMessage(cause: unknown) {
  return cause instanceof Error ? cause.message : "Something went wrong.";
}
