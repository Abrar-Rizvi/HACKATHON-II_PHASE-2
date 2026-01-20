import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
}

export const useApi = <T,>(
  apiCall: () => Promise<T>,
  deps: React.DependencyList = []
): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
  }, deps);

  return { data, loading, error, execute };
};

// Specific hooks for common operations
export const useTasks = () => {
  const { data, loading, error, execute } = useApi(() => apiClient.getTasks(), []);
  return { tasks: data || [], loading, error, refetch: execute };
};

export const useTask = (id: string) => {
  const { data, loading, error, execute } = useApi(() => apiClient.getTaskById(id), [id]);
  return { task: data || null, loading, error, refetch: execute };
};