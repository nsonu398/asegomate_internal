// src/presentation/contexts/AppContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import localStorage from '../../core/data/datasources/local/LocalStorage';
import { AuthProvider } from "./AuthContext";
import { MasterDataProvider } from "./MasterDataContext";
import { ThemeProvider } from "./ThemeContext";


// Interface for the context type
interface AppContextType {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  user: any | null;

  // Calendar callback functionality
  setCalendarCallback: (callback: (date: string) => void) => void;
  executeCalendarCallback: (date: string) => void;
  clearCalendarCallback: () => void;
}

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarCallback, setCalendarCallbackState] = useState<
    ((date: string) => void) | null
  >(null);
  const [user, setUser] = useState<any | null>(null);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const clearError = () => {
    setError(null);
  };

  const setCalendarCallback = (callback: (date: string) => void) => {
    setCalendarCallbackState(() => callback); // Use function form to avoid calling the callback immediately
  };

  const executeCalendarCallback = (date: string) => {
    if (calendarCallback) {
      calendarCallback(date);
      setCalendarCallbackState(null); // Clear after execution
    }
  };

  const clearCalendarCallback = () => {
    setCalendarCallbackState(null);
  };

  //initialize user state from localStorage or set to null
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const _user = await localStorage.getItem("auth_user");
        setUser(_user || null);
      } catch (e) {
        console.error("Error fetching auth_user from localStorage", e);
      }
    };

    fetchUser();
  }, []);

  const contextValue: AppContextType = {
    isLoading,
    error,
    user,
    setLoading,
    setError,
    clearError,
    setCalendarCallback,
    executeCalendarCallback,
    clearCalendarCallback,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider>
        <AuthProvider>
          <MasterDataProvider>{children}</MasterDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

// Create a hook for using the AppContext
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
