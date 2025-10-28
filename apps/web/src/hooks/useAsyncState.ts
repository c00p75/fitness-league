import { useState, useEffect, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAsyncState<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

// Hook for handling form submission states
export function useFormSubmission<T>(
  submitFn: (data: T) => Promise<any>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submit = useCallback(async (data: T) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);
      
      await submitFn(data);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [submitFn]);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submit,
    reset,
  };
}

// Hook for handling network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection message
        console.log('Connection restored');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}

// Hook for handling retry logic with exponential backoff
export function useRetry(
  maxRetries: number = 3,
  baseDelay: number = 1000
) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async (fn: () => Promise<any>) => {
    if (retryCount >= maxRetries) {
      throw new Error(`Max retries (${maxRetries}) exceeded`);
    }

    setIsRetrying(true);
    
    try {
      const result = await fn();
      setRetryCount(0); // Reset on success
      return result;
    } catch (error) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      if (newRetryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, newRetryCount - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retry(fn);
      } else {
        throw error;
      }
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries, baseDelay]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retryCount,
    isRetrying,
    retry,
    reset,
    canRetry: retryCount < maxRetries,
  };
}

// Hook for handling optimistic updates
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (optimisticData: T) => {
    // Optimistically update the UI
    setData(optimisticData);
    setIsUpdating(true);
    setError(null);

    try {
      // Perform the actual update
      const result = await updateFn(optimisticData);
      setData(result);
    } catch (err) {
      // Revert on error
      setData(initialData);
      setError(err instanceof Error ? err : new Error('Update failed'));
    } finally {
      setIsUpdating(false);
    }
  }, [initialData, updateFn]);

  return {
    data,
    isUpdating,
    error,
    update,
  };
}

// Hook for handling pagination
export function usePagination<T>(
  fetchFn: (page: number, limit: number) => Promise<{ data: T[]; total: number; hasMore: boolean }>,
  limit: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchPage = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn(pageNum, limit);
      
      if (append) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Fetch failed'));
    } finally {
      setLoading(false);
    }
  }, [fetchFn, limit]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage, true);
    }
  }, [hasMore, loading, page, fetchPage]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchPage(1, false);
  }, [fetchPage]);

  return {
    data,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
    fetchPage,
  };
}
