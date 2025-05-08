// src/presentation/contexts/AppContext.tsx
import React, { createContext, ReactNode, useContext } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

// Interface for the context type
interface AppContextType {
  // Add global app state or methods here if needed
}

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
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