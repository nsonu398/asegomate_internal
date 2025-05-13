// src/presentation/contexts/AuthContext.tsx
import { User } from '@/app/core/domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

interface CreatePolicyState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type CreatePolicyAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_TOKEN'; payload: { user: User | null; token: string | null } };

interface CreatePolicyContextType extends CreatePolicyState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: CreatePolicyState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
  isAuthenticated: false
};

const authReducer = (state: CreatePolicyState, action: CreatePolicyAction): CreatePolicyState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isAuthenticated : true
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated : false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated : false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

const CreatePolicyContext = createContext<CreatePolicyContextType | undefined>(undefined);

export const CreatePolicyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Attempt to restore token on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        
        if (storedToken && storedUser) {
          dispatch({ 
            type: 'RESTORE_TOKEN', 
            payload: { 
              token: storedToken, 
              user: JSON.parse(storedUser) 
            } 
          });
        } else {
          dispatch({ 
            type: 'RESTORE_TOKEN', 
            payload: { 
              token: null, 
              user: null 
            } 
          });
        }
      } catch (e) {
        console.error('Failed to restore authentication state:', e);
        dispatch({ 
          type: 'RESTORE_TOKEN', 
          payload: { 
            token: null, 
            user: null 
          } 
        });
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // This would be an API call in a real app
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: '1',
        email,
        name: 'Travel User',
      };
      const mockToken = 'mock-auth-token';
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store authentication data
      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: mockUser, 
          token: mockToken
        } 
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Invalid email or password. Please try again.' 
      });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // This would be an API call in a real app
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: '1',
        email,
        name,
      };
      const mockToken = 'mock-auth-token';
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store authentication data
      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: mockUser, 
          token: mockToken 
        } 
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: 'Registration failed. Please try again.' 
      });
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      dispatch({ type: 'LOGOUT' });
    } catch (e) {
      console.error('Failed to log out:', e);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <CreatePolicyContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </CreatePolicyContext.Provider>
  );
};

export const useCreatePolicy = () => {
  const context = useContext(CreatePolicyContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};