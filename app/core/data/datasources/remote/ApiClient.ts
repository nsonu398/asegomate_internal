// src/core/data/datasources/remote/ApiClient.ts
import { API_BASE_URL } from '@/app/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('userToken');
  }

  private async createHeaders(requiresAuth: boolean = true): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  public async request<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.createHeaders(options.requiresAuth);

      const requestOptions: RequestInit = {
        method: options.method,
        headers: { ...headers, ...options.headers },
      };

      if (options.body && (options.method !== 'GET' && options.method !== 'DELETE')) {
        requestOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, requestOptions);
      const statusCode = response.status;

      if (statusCode >= 200 && statusCode < 300) {
        const contentType = response.headers.get('content-type');
        let data: T;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text() as unknown as T;
        }

        return {
          data,
          status: statusCode,
        };
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        return {
          error: errorData.message || 'Something went wrong',
          status: statusCode,
        };
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  public async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  public async post<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
      requiresAuth,
    });
  }

  public async put<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
      requiresAuth,
    });
  }

  public async patch<T>(
    endpoint: string,
    data: any,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data,
      requiresAuth,
    });
  }

  public async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }
}

export default ApiClient.getInstance();