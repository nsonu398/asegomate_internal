import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { theme as lightTheme } from '@/app/theme';

// Define a type for the theme based on the structure of lightTheme
type Theme = typeof lightTheme;

// Create a dark theme variant ensuring the same structure
const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    neutral: {
      ...lightTheme.colors.neutral,
      background: '#121212',
      gray100: '#1E1E1E',
      gray200: '#2C2C2C',
      gray300: '#3D3D3D',
      gray400: '#5C5C5C',
      gray500: '#818181',
      gray600: '#A3A3A3',
      gray700: '#C6C6C6',
      gray800: '#E0E0E0',
      gray900: '#F5F5F5',
      white: '#FFFFFF',
      black: '#000000',
    },
    primary: {
      ...lightTheme.colors.primary,
      50: '#e0f7fa',
      100: '#b2ebf2',
      200: '#80deea',
      300: '#4dd0e1',
      400: '#26c6da',
      500: '#00bcd4', // Example adjustment for dark mode
      600: '#00acc1',
      700: '#0097a7',
      800: '#00838f',
      900: '#006064',
    },
    secondary: {
      ...lightTheme.colors.secondary,
      50: '#f3e5f5',
      100: '#e1bee7',
      200: '#ce93d8',
      300: '#ba68c8',
      400: '#ab47bc',
      500: '#9c27b0', // Example adjustment for dark mode
      600: '#8e24aa',
      700: '#7b1fa2',
      800: '#6a1b9a',
      900: '#4a148c',
    },
    success: {
      ...lightTheme.colors.success,
    },
    error: {
      ...lightTheme.colors.error,
    },
    warning: {
      ...lightTheme.colors.warning,
    },
    info: {
      ...lightTheme.colors.info,
    },
  },
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: Theme;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const resolvedDarkMode = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
    setIsDarkMode(resolvedDarkMode);
    setCurrentTheme(resolvedDarkMode ? darkTheme : lightTheme);
  }, [themeMode, systemColorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        theme: currentTheme,
        isDarkMode,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};