'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type ThemeMode = 'standard' | 'compact';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isCompact: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('standard');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('partner-theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'standard' || savedTheme === 'compact')) {
      setThemeMode(savedTheme);
    }
    setIsHydrated(true);
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('partner-theme', themeMode);
      // Add CSS class to body for global theme styling
      document.body.classList.remove('theme-standard', 'theme-compact');
      document.body.classList.add(`theme-${themeMode}`);
    }
  }, [themeMode, isHydrated]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'standard' ? 'compact' : 'standard'));
  };

  const setTheme = (theme: ThemeMode) => {
    setThemeMode(theme);
  };

  const value: ThemeContextType = {
    themeMode,
    toggleTheme,
    setTheme,
    isCompact: themeMode === 'compact',
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility hook for getting theme-specific classes
export function useThemeClasses() {
  const { isCompact } = useTheme();

  return {
    // Text sizes
    text: {
      xs: isCompact ? 'text-xs' : 'text-sm',
      sm: isCompact ? 'text-sm' : 'text-base',
      base: isCompact ? 'text-sm' : 'text-base',
      lg: isCompact ? 'text-base' : 'text-lg',
      xl: isCompact ? 'text-lg' : 'text-xl',
      '2xl': isCompact ? 'text-xl' : 'text-2xl',
    },

    // Spacing
    spacing: {
      xs: isCompact ? 'p-1' : 'p-2',
      sm: isCompact ? 'p-2' : 'p-3',
      md: isCompact ? 'p-3' : 'p-4',
      lg: isCompact ? 'p-4' : 'p-6',
      xl: isCompact ? 'p-6' : 'p-8',
    },

    // Gaps
    gap: {
      xs: isCompact ? 'gap-1' : 'gap-2',
      sm: isCompact ? 'gap-2' : 'gap-3',
      md: isCompact ? 'gap-3' : 'gap-4',
      lg: isCompact ? 'gap-4' : 'gap-6',
    },

    // Heights
    height: {
      sm: isCompact ? 'h-6' : 'h-8',
      md: isCompact ? 'h-8' : 'h-10',
      lg: isCompact ? 'h-10' : 'h-12',
      xl: isCompact ? 'h-12' : 'h-14',
    },

    // Sidebar specific
    sidebar: {
      width: isCompact ? 'w-52' : 'w-60',
      padding: isCompact ? 'p-2' : 'p-3',
      itemSpacing: isCompact ? 'space-y-0.5' : 'space-y-1',
      itemPadding: isCompact ? 'py-1.5 px-3' : 'py-2.5 px-4',
      childPadding: isCompact ? 'py-1 pl-8 pr-3' : 'py-2 pl-11 pr-4',
      iconSize: isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4',
      childIconSize: isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5',
      iconMargin: isCompact ? 'mr-2' : 'mr-3',
    },

    // Header specific
    header: {
      height: isCompact ? 'h-12' : 'h-14',
      padding: isCompact ? 'px-4 py-2' : 'px-6 py-3',
    },

    // Content area
    content: {
      padding: isCompact ? 'p-2' : 'p-6',
      margin: isCompact ? 'm-2' : 'm-4',
    },

    // Form elements
    form: {
      inputHeight: isCompact ? 'h-8' : 'h-10',
      buttonHeight: isCompact ? 'h-8' : 'h-10',
      buttonPadding: isCompact ? 'px-3 py-1' : 'px-4 py-2',
    },

    // Cards and containers
    card: {
      padding: isCompact ? 'p-3' : 'p-4',
      spacing: isCompact ? 'space-y-2' : 'space-y-4',
      borderRadius: isCompact ? 'rounded-md' : 'rounded-lg',
    },
  };
}
