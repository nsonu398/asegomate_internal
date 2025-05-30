// app/core/data/repository/AuthRepository.ts
import { API_ENDPOINTS, CLIENT_TYPE } from '@/app/constants/api';
import { AuthResult, IAuthRepository, LoginCredentials } from '@/app/core/domain/repositories/IAuthRepository';
import localStorage from '../datasources/local/LocalStorage';
import apiClient from '../datasources/remote/ApiClient';

export class AuthRepository implements IAuthRepository {
  private static instance: AuthRepository;

  private constructor() {}

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const loginPayload = {
        userName: credentials.userName,
        password: credentials.password,
        clientType: CLIENT_TYPE,
      };

      const response = await apiClient.post<any>(
        API_ENDPOINTS.AUTH.LOGIN,
        loginPayload,
        false // No auth required for login
      );

      if (response.success && response.data) {
        // Store the entire response as-is
        await localStorage.setItem('auth_full_response', response.data);
        
        // Extract token if available
        const token = response.data.token;
        if (token) {
          await localStorage.setItem('auth_token', token);
        }

        // Extract user info if available
        const user = response.data.userDto;
        if (user) {
          await localStorage.setItem('auth_user', user);
        }

        const result: AuthResult = {
          success: true,
          user,
          fullResponse: response.data,
        };
        if (token !== null) {
          result.token = token;
        }
        return result;
      } else {
        return {
          success: false,
          error: response.error || 'Authentication failed',
        };
      }
    } catch (error) {
      console.error('Login error in repository:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  async logout(): Promise<boolean> {
    try {
      // Clear all auth-related data from local storage
      await Promise.all([
        localStorage.removeItem('auth_token'),
        localStorage.removeItem('auth_user'),
        localStorage.removeItem('auth_full_response'),
      ]);
      return true;
    } catch (error) {
      console.error('Logout error in repository:', error);
      return false;
    }
  }

  async refreshToken(token: string): Promise<AuthResult> {
    try {
      // Implement refresh token logic when needed
      // For now, return not implemented
      return {
        success: false,
        error: 'Refresh token not implemented',
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await localStorage.getItem<string>('auth_token');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  async getStoredAuthData(): Promise<{
    token: string | null;
    user: any | null;
    fullResponse: any | null;
  }> {
    try {
      const [token, user, fullResponse] = await Promise.all([
        localStorage.getItem<string>('auth_token'),
        localStorage.getItem<any>('auth_user'),
        localStorage.getItem<any>('auth_full_response'),
      ]);

      return {
        token,
        user,
        fullResponse,
      };
    } catch (error) {
      console.error('Error retrieving stored auth data:', error);
      return {
        token: null,
        user: null,
        fullResponse: null,
      };
    }
  }

  // Helper method to extract token from response
  private extractTokenFromResponse(responseData: any): string | null {
    // Common token field names - adjust based on your API response
    const tokenFields = ['token', 'accessToken', 'access_token', 'authToken', 'jwt'];
    
    for (const field of tokenFields) {
      if (responseData[field]) {
        return responseData[field];
      }
    }

    // Check nested objects
    if (responseData.data && typeof responseData.data === 'object') {
      for (const field of tokenFields) {
        if (responseData.data[field]) {
          return responseData.data[field];
        }
      }
    }

    // Check for nested auth or authentication objects
    const authObjects = ['auth', 'authentication', 'result'];
    for (const authObj of authObjects) {
      if (responseData[authObj] && typeof responseData[authObj] === 'object') {
        for (const field of tokenFields) {
          if (responseData[authObj][field]) {
            return responseData[authObj][field];
          }
        }
      }
    }

    return null;
  }

  // Helper method to extract user info from response
  private extractUserFromResponse(responseData: any): any | null {
    // Common user field names - adjust based on your API response
    const userFields = ['user', 'userInfo', 'userData', 'profile'];
    
    for (const field of userFields) {
      if (responseData[field]) {
        return responseData[field];
      }
    }

    // If no specific user field, try to extract basic user info
    if (responseData.userName || responseData.email || responseData.name) {
      return {
        name: responseData.name || responseData.userName,
        email: responseData.email || responseData.userName,
        id: responseData.id || responseData.userId,
      };
    }

    // Check nested objects
    if (responseData.data && typeof responseData.data === 'object') {
      for (const field of userFields) {
        if (responseData.data[field]) {
          return responseData.data[field];
        }
      }
    }

    return null;
  }
}

export default AuthRepository.getInstance();