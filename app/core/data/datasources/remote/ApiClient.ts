// app/core/data/datasources/remote/ApiClient.ts
import { API_BASE_URL, API_TIMEOUT } from '@/app/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
  timeout?: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Callback function type for handling 401 errors
type UnauthorizedCallback = () => void;

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private timeout: number;
  private unauthorizedCallback: UnauthorizedCallback | null = null;

  private constructor() {
    this.baseUrl = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Method to set the callback for handling 401 errors
  public setUnauthorizedCallback(callback: UnauthorizedCallback): void {
    this.unauthorizedCallback = callback;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  }

  private async createHeaders(requiresAuth: boolean = true): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Connection': 'keep-alive',
      'DNT': '1',
    });

    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers.append('Authorization', `Bearer ${token.replace('"','')}`);
      }
    }

    return headers;
  }

  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeout);
    });
  }

  private async handle401Error(): Promise<void> {
    try {
      // Just call the unauthorized callback - let AuthContext handle cleanup
      if (this.unauthorizedCallback) {
        this.unauthorizedCallback();
      }
    } catch (error) {
      console.error('Error handling 401 unauthorized:', error);
    }
  }

  private handleApiError(error: any, statusCode: number): ApiError {
    // Generic error handling - can be customized based on API response format
    if (typeof error === 'string') {
      return {
        message: error,
        status: statusCode,
      };
    }

    if (error && typeof error === 'object') {
      return {
        message: error.message || error.error || 'An unexpected error occurred',
        code: error.code || error.errorCode,
        status: statusCode,
        details: error.details || error.data,
      };
    }

    return {
      message: 'An unexpected error occurred',
      status: statusCode,
    };
  }

  public async request<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.createHeaders(options.requiresAuth);
      const timeout = options.timeout || this.timeout;

      // Merge custom headers
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.set(key, value);
        });
      }

      const requestOptions: RequestInit = {
        method: options.method,
        headers: headers,
      };

      if (options.body && (options.method !== 'GET' && options.method !== 'DELETE')) {
        requestOptions.body = JSON.stringify(options.body);
      }

      // Create fetch promise with timeout
      const fetchPromise = fetch(url, requestOptions);
      const timeoutPromise = this.createTimeoutPromise(timeout);

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const statusCode = response.status;
      const success = statusCode >= 200 && statusCode < 300;

      // Handle 401 Unauthorized error
      if (statusCode === 401) {
        await this.handle401Error();
        return {
          error: 'Session expired. Please login again.',
          status: statusCode,
          success: false,
        };
      }

      if (success) {
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
          success: true,
        };
      } else {
        let errorData;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorData = await response.text();
          }
        } catch {
          errorData = { message: response.statusText };
        }

        const apiError = this.handleApiError(errorData, statusCode);

        return {
          error: apiError.message,
          status: statusCode,
          success: false,
        };
      }
    } catch (error) {
      console.error('API Request Error:', error);
      
      let errorMessage = 'Network error';
      if (error instanceof Error) {
        errorMessage = error.message === 'Request timeout' ? 'Request timeout' : 'Network error';
      }

      return {
        error: errorMessage,
        status: 0,
        success: false,
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