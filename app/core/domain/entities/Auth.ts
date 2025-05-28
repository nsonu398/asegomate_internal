// app/core/domain/entities/Auth.ts
export interface LoginRequest {
  userName: string;
  password: string;
  clientType: 'mobile' | 'web';
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  message?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt?: string;
}