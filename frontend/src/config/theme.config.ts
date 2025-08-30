export interface ThemeConfig {
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  heights: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  gaps: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  sidebar: {
    width: string;
    padding: string;
    itemSpacing: string;
    itemPadding: string;
    childPadding: string;
    iconSize: string;
    childIconSize: string;
    iconMargin: string;
  };
  header: {
    height: string;
    padding: string;
  };
  content: {
    padding: string;
    margin: string;
  };
  form: {
    inputHeight: string;
    buttonHeight: string;
    buttonPadding: string;
  };
  card: {
    padding: string;
    spacing: string;
    borderRadius: string;
  };
}

// Standard Theme Configuration
export const standardTheme: ThemeConfig = {
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
  typography: {
    xs: 'text-sm',
    sm: 'text-base',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  },
  heights: {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-14',
  },
  gaps: {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  },
  sidebar: {
    width: 'w-60',
    padding: 'p-3',
    itemSpacing: 'space-y-1',
    itemPadding: 'py-2.5 px-4',
    childPadding: 'py-2 pl-11 pr-4',
    iconSize: 'w-4 h-4',
    childIconSize: 'w-3.5 h-3.5',
    iconMargin: 'mr-3',
  },
  header: {
    height: 'h-14',
    padding: 'px-6 py-3',
  },
  content: {
    padding: 'p-6',
    margin: 'm-4',
  },
  form: {
    inputHeight: 'h-10',
    buttonHeight: 'h-10',
    buttonPadding: 'px-4 py-2',
  },
  card: {
    padding: 'p-4',
    spacing: 'space-y-4',
    borderRadius: 'rounded-lg',
  },
};

// Compact Theme Configuration
export const compactTheme: ThemeConfig = {
  spacing: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-6',
  },
  typography: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
  },
  heights: {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  },
  gaps: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  },
  sidebar: {
    width: 'w-52',
    padding: 'p-2',
    itemSpacing: 'space-y-0.5',
    itemPadding: 'py-1.5 px-3',
    childPadding: 'py-1 pl-8 pr-3',
    iconSize: 'w-3.5 h-3.5',
    childIconSize: 'w-3 h-3',
    iconMargin: 'mr-2',
  },
  header: {
    height: 'h-12',
    padding: 'px-4 py-2',
  },
  content: {
    padding: 'p-2',
    margin: 'm-2',
  },
  form: {
    inputHeight: 'h-8',
    buttonHeight: 'h-8',
    buttonPadding: 'px-3 py-1',
  },
  card: {
    padding: 'p-3',
    spacing: 'space-y-2',
    borderRadius: 'rounded-md',
  },
};

// Theme-aware utility functions
export function getThemeConfig(themeMode: 'standard' | 'compact'): ThemeConfig {
  return themeMode === 'compact' ? compactTheme : standardTheme;
}

// CSS custom properties for dynamic theming
export const themeCSSVariables = {
  standard: {
    '--sidebar-width': '240px',
    '--header-height': '56px',
    '--content-padding': '24px',
    '--text-base-size': '16px',
    '--text-sm-size': '14px',
    '--text-xs-size': '12px',
    '--spacing-sm': '8px',
    '--spacing-md': '16px',
    '--spacing-lg': '24px',
    '--icon-sm': '16px',
    '--icon-md': '20px',
    '--button-height': '40px',
    '--input-height': '40px',
  },
  compact: {
    '--sidebar-width': '208px',
    '--header-height': '48px',
    '--content-padding': '8px',
    '--text-base-size': '14px',
    '--text-sm-size': '12px',
    '--text-xs-size': '11px',
    '--spacing-sm': '4px',
    '--spacing-md': '8px',
    '--spacing-lg': '12px',
    '--icon-sm': '14px',
    '--icon-md': '16px',
    '--button-height': '32px',
    '--input-height': '32px',
  },
};

// Responsive breakpoints for theme switching
export const themeBreakpoints = {
  // Automatically switch to compact on smaller screens
  autoCompactBreakpoint: 'lg', // Below 1024px
  // Force standard on very large screens
  forceStandardBreakpoint: '2xl', // Above 1536px
};

// Component-specific theme mappings
export const componentThemes = {
  button: {
    standard: {
      size: 'px-4 py-2 text-sm h-10',
      icon: 'w-4 h-4',
      rounded: 'rounded-lg',
    },
    compact: {
      size: 'px-3 py-1 text-xs h-8',
      icon: 'w-3.5 h-3.5',
      rounded: 'rounded-md',
    },
  },
  input: {
    standard: {
      size: 'px-3 py-2 text-sm h-10',
      rounded: 'rounded-lg',
    },
    compact: {
      size: 'px-2 py-1 text-xs h-8',
      rounded: 'rounded-md',
    },
  },
  card: {
    standard: {
      padding: 'p-4',
      spacing: 'space-y-4',
      rounded: 'rounded-lg',
      title: 'text-lg font-semibold',
      text: 'text-sm',
    },
    compact: {
      padding: 'p-3',
      spacing: 'space-y-2',
      rounded: 'rounded-md',
      title: 'text-base font-semibold',
      text: 'text-xs',
    },
  },
  modal: {
    standard: {
      padding: 'p-6',
      spacing: 'space-y-4',
      title: 'text-xl font-bold',
      maxWidth: 'max-w-lg',
    },
    compact: {
      padding: 'p-4',
      spacing: 'space-y-3',
      title: 'text-lg font-bold',
      maxWidth: 'max-w-md',
    },
  },
  table: {
    standard: {
      cellPadding: 'px-4 py-3',
      headerPadding: 'px-4 py-2',
      text: 'text-sm',
      headerText: 'text-sm font-medium',
    },
    compact: {
      cellPadding: 'px-3 py-2',
      headerPadding: 'px-3 py-1.5',
      text: 'text-xs',
      headerText: 'text-xs font-medium',
    },
  },
};
