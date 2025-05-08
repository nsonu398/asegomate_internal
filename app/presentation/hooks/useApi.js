// src/presentation/hooks/useApi.ts
import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/app/core/data/datasources/remote/ApiClient';

interface UseApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  initialData?: T;
  fetchOnMount?: boolean;
  requiresAuth?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetch: (body?: any) => Promise<T | null>;
  reset: () => void;
}

export const useApi = <T>({
  url,
  method = 'GET',
  body,
  initialData = null,
  fetchOnMount = false,
  requiresAuth = true,
}: UseApiOptions<T>): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = useCallback(async (overrideBody?: any): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const requestBody = overrideBody || body;

      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(url, requiresAuth);
          break;
        case 'POST':
          response = await apiClient.post<T>(url, requestBody, requiresAuth);
          break;
        case 'PUT':
          response = await apiClient.put<T>(url, requestBody, requiresAuth);
          break;
        case 'PATCH':
          response = await apiClient.patch<T>(url, requestBody, requiresAuth);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(url, requiresAuth);
          break;
        default:
          response = await apiClient.get<T>(url, requiresAuth);
      }

      if (response.error) {
        setError(response.error);
        return null;
      }

      setData(response.data || null);
      return response.data || null;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, method, body, requiresAuth]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  useEffect(() => {
    if (fetchOnMount) {
      fetch();
    }
  }, [fetchOnMount, fetch]);

  return { data, error, loading, fetch, reset };
};