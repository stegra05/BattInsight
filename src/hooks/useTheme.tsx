import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeColor = 'blue' | 'purple' | 'green' | 'amber' | 'rose';

interface ThemeOptions {
  mode: ThemeMode;
  color: ThemeColor;
}

interface ThemeContextType {
  theme: ThemeOptions;
  toggleMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeColor: (color: ThemeColor) => void;
  setFullTheme: (theme: ThemeOptions) => void;
  isDark: boolean;
  currentColor: ThemeColor;
}

// Default color maps for each theme color
export const themeColorMap: Record<ThemeColor, { primary: string, secondary: string, accent: string }> = {
  blue: {
    primary: 'rgb(59, 130, 246)', // blue-500
    secondary: 'rgb(37, 99, 235)', // blue-600
    accent: 'rgb(96, 165, 250)', // blue-400
  },
  purple: {
    primary: 'rgb(139, 92, 246)', // purple-500
    secondary: 'rgb(124, 58, 237)', // purple-600
    accent: 'rgb(167, 139, 250)', // purple-400
  },
  green: {
    primary: 'rgb(34, 197, 94)', // green-500
    secondary: 'rgb(22, 163, 74)', // green-600
    accent: 'rgb(74, 222, 128)', // green-400
  },
  amber: {
    primary: 'rgb(245, 158, 11)', // amber-500
    secondary: 'rgb(217, 119, 6)', // amber-600
    accent: 'rgb(251, 191, 36)', // amber-400
  },
  rose: {
    primary: 'rgb(244, 63, 94)', // rose-500
    secondary: 'rgb(225, 29, 72)', // rose-600
    accent: 'rgb(251, 113, 133)', // rose-400
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeOptions>(() => {
    // Check for saved theme in localStorage
    const savedThemeStr = localStorage.getItem('theme');
    
    if (savedThemeStr) {
      try {
        const savedTheme = JSON.parse(savedThemeStr) as ThemeOptions;
        // Validate theme contains correct values
        if (
          savedTheme && 
          typeof savedTheme === 'object' && 
          (savedTheme.mode === 'light' || savedTheme.mode === 'dark') && 
          Object.keys(themeColorMap).includes(savedTheme.color)
        ) {
          return savedTheme;
        }
      } catch (e) {
        // If invalid JSON, fall back to default
        console.error('Invalid theme in localStorage', e);
      }
    }
    
    // Default theme settings based on system preference
    return {
      mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      color: 'blue'
    };
  });

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', JSON.stringify(theme));
    
    // Update document class for Tailwind dark mode
    const root = window.document.documentElement;
    
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply theme color variables
    const colorStyles = themeColorMap[theme.color];
    root.style.setProperty('--color-primary', colorStyles.primary);
    root.style.setProperty('--color-secondary', colorStyles.secondary);
    root.style.setProperty('--color-accent', colorStyles.accent);
    
    // Remove any previous theme color classes
    Object.keys(themeColorMap).forEach(colorName => {
      root.classList.remove(`theme-${colorName}`);
    });
    
    // Add current theme color class
    root.classList.add(`theme-${theme.color}`);
    
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme.mode === 'light' || theme.mode === 'dark') {
        // Only auto-update if the user hasn't explicitly set a preference
        const preferenceTimestamp = localStorage.getItem('theme-preference-timestamp');
        const PREFERENCE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (!preferenceTimestamp || (Date.now() - parseInt(preferenceTimestamp)) > PREFERENCE_EXPIRY) {
          setThemeMode(e.matches ? 'dark' : 'light');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  const toggleMode = () => {
    setThemeMode(theme.mode === 'light' ? 'dark' : 'light');
    // Save timestamp when user explicitly changes theme preference
    localStorage.setItem('theme-preference-timestamp', Date.now().toString());
  };

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      mode
    }));
  };

  const setThemeColor = (color: ThemeColor) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      color
    }));
  };

  const setFullTheme = (newTheme: ThemeOptions) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleMode,
    setThemeMode,
    setThemeColor,
    setFullTheme,
    isDark: theme.mode === 'dark',
    currentColor: theme.color
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
} 