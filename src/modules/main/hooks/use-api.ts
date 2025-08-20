import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
      
        
        const result: ApiResponse<T> = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || 'API request failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}