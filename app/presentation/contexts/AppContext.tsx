// src/presentation/contexts/AppContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AuthProvider } from './AuthContext';
import { MasterDataProvider } from './MasterDataContext';
import { ThemeProvider } from './ThemeContext';

// Interface for the context type
interface AppContextType {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AppContextType = {
    isLoading,
    error,
    setLoading,
    setError,
    clearError,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider>
        <AuthProvider>
          <MasterDataProvider>
            {children}
          </MasterDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

// Create a hook for using the AppContext
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};