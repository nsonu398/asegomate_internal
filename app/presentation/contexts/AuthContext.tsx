// app/presentation/contexts/AuthContext.tsx
import apiClient from "@/app/core/data/datasources/remote/ApiClient";
import diContainer from "@/app/core/di/Container";
import { User } from "@/app/core/domain/entities/User";
import React, { createContext, useContext, useEffect, useReducer } from "react";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  loginResponse: any | null; // Store the full API response
}

type AuthAction =
  | { type: "LOGIN_START" }
  | {
      type: "LOGIN_SUCCESS";
      payload: { user: User | null; token: string | null; loginResponse: any };
    }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | {
      type: "RESTORE_TOKEN";
      payload: {
        user: User | null;
        token: string | null;
        loginResponse: any | null;
      };
    };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  getLoginResponse: () => any | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  loginResponse: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        loginResponse: action.payload.loginResponse,
        error: null,
        isAuthenticated: true,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
        loginResponse: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        loginResponse: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "RESTORE_TOKEN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loginResponse: action.payload.loginResponse,
        isLoading: false,
        isAuthenticated: !!action.payload.token,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Attempt to restore authentication state on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedAuthData =
          await diContainer.getStoredAuthDataUseCase.execute();

        dispatch({
          type: "RESTORE_TOKEN",
          payload: {
            token: storedAuthData.token,
            user: storedAuthData.user,
            loginResponse: storedAuthData.fullResponse,
          },
        });
      } catch (error) {
        console.error("Failed to restore authentication state:", error);
        dispatch({
          type: "RESTORE_TOKEN",
          payload: {
            token: null,
            user: null,
            loginResponse: null,
          },
        });
      }
    };

    bootstrapAsync();
  }, []);

  useEffect(() => {
    // Set up 401 error handling
    apiClient.setUnauthorizedCallback(() => {
      logout();
    });
  }, []);

  useEffect(() => {
    console.log("Auth state changed:", state);
  }, [state]);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const result = await diContainer.loginUseCase.execute({
        userName: email, // API expects userName instead of email
        password,
      });

      if (result.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.user || null,
            token: result.token || null,
            loginResponse: result.fullResponse,
          },
        });
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: result.error || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error in context:", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Network error. Please check your connection and try again.",
      });
    }
  };

  const logout = async () => {
    try {
      await diContainer.logoutUseCase.execute();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      dispatch({ type: "LOGOUT" });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const getLoginResponse = () => {
    return state.loginResponse;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        getLoginResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
