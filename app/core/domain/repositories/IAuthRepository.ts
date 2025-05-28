// app/core/domain/repositories/IAuthRepository.ts
export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: any;
  fullResponse?: any; // Store the complete API response
  error?: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  logout(): Promise<boolean>;
  refreshToken(token: string): Promise<AuthResult>;
  isAuthenticated(): Promise<boolean>;
  getStoredAuthData(): Promise<{
    token: string | null;
    user: any | null;
    fullResponse: any | null;
  }>;
}