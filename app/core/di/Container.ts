// app/core/di/Container.ts
import authRepository from '../data/repository/AuthRepository';
import { GetAuthStatusUseCase, GetStoredAuthDataUseCase, LoginUseCase, LogoutUseCase } from '../domain/usecases/auth/LoginUseCase';

// Dependency Injection Container for Clean Architecture
export class DIContainer {
  private static instance: DIContainer;

  // Repositories
  private _authRepository = authRepository;

  // Use Cases
  private _loginUseCase: LoginUseCase;
  private _logoutUseCase: LogoutUseCase;
  private _getAuthStatusUseCase: GetAuthStatusUseCase;
  private _getStoredAuthDataUseCase: GetStoredAuthDataUseCase;

  private constructor() {
    // Initialize use cases with repositories
    this._loginUseCase = new LoginUseCase(this._authRepository);
    this._logoutUseCase = new LogoutUseCase(this._authRepository);
    this._getAuthStatusUseCase = new GetAuthStatusUseCase(this._authRepository);
    this._getStoredAuthDataUseCase = new GetStoredAuthDataUseCase(this._authRepository);
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Repository Getters
  get authRepository() {
    return this._authRepository;
  }

  // Use Case Getters
  get loginUseCase() {
    return this._loginUseCase;
  }

  get logoutUseCase() {
    return this._logoutUseCase;
  }

  get getAuthStatusUseCase() {
    return this._getAuthStatusUseCase;
  }

  get getStoredAuthDataUseCase() {
    return this._getStoredAuthDataUseCase;
  }
}

export default DIContainer.getInstance();