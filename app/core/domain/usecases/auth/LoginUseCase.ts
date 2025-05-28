// app/core/domain/usecases/auth/LoginUseCase.ts
import { AuthResult, IAuthRepository, LoginCredentials } from '../../repositories/IAuthRepository';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    // Add any business logic validation here
    if (!credentials.userName || !credentials.password) {
      return {
        success: false,
        error: 'Username and password are required',
      };
    }

    // Email validation if needed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.userName)) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      };
    }

    return await this.authRepository.login(credentials);
  }
}

// app/core/domain/usecases/auth/LogoutUseCase.ts
export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<boolean> {
    return await this.authRepository.logout();
  }
}

// app/core/domain/usecases/auth/GetAuthStatusUseCase.ts
export class GetAuthStatusUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<boolean> {
    return await this.authRepository.isAuthenticated();
  }
}

// app/core/domain/usecases/auth/GetStoredAuthDataUseCase.ts
export class GetStoredAuthDataUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<{
    token: string | null;
    user: any | null;
    fullResponse: any | null;
  }> {
    return await this.authRepository.getStoredAuthData();
  }
}