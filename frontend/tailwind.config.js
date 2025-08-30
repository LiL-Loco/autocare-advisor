/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Custom theme spacing and sizing
      spacing: {
        'theme-xs': 'var(--spacing-xs)',
        'theme-sm': 'var(--spacing-sm)',
        'theme-md': 'var(--spacing-md)',
        'theme-lg': 'var(--spacing-lg)',
        'theme-xl': 'var(--spacing-xl)',
      },
      fontSize: {
        'theme-xs': ['var(--text-xs-size)', { lineHeight: '1.25' }],
        'theme-sm': ['var(--text-sm-size)', { lineHeight: '1.375' }],
        'theme-base': ['var(--text-base-size)', { lineHeight: '1.5' }],
      },
      width: {
        sidebar: 'var(--sidebar-width)',
      },
      height: {
        header: 'var(--header-height)',
        button: 'var(--button-height)',
        input: 'var(--input-height)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    // Custom plugin for theme-aware utilities
    function ({ addUtilities, addComponents, theme }) {
      // Theme-aware component classes
      addComponents({
        '.theme-button': {
          height: 'var(--button-height)',
          'padding-left': 'var(--spacing-sm)',
          'padding-right': 'var(--spacing-sm)',
          'padding-top': 'var(--spacing-xs)',
          'padding-bottom': 'var(--spacing-xs)',
          'font-size': 'var(--text-sm-size)',
          'border-radius': '0.5rem',
          transition: 'all 0.15s ease-in-out',
        },
        '.theme-input': {
          height: 'var(--input-height)',
          'padding-left': 'var(--spacing-sm)',
          'padding-right': 'var(--spacing-sm)',
          'font-size': 'var(--text-sm-size)',
          'border-radius': '0.375rem',
        },
        '.theme-card': {
          padding: 'var(--spacing-lg)',
          'border-radius': '0.5rem',
          'background-color': 'white',
          'box-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
        '.theme-sidebar': {
          width: 'var(--sidebar-width)',
          padding: 'var(--spacing-sm)',
        },
        '.theme-header': {
          height: 'var(--header-height)',
          'padding-left': 'var(--spacing-lg)',
          'padding-right': 'var(--spacing-lg)',
          'padding-top': 'var(--spacing-sm)',
          'padding-bottom': 'var(--spacing-sm)',
        },
      });

      // Utility classes for theme-aware spacing
      addUtilities({
        '.p-theme-xs': { padding: 'var(--spacing-xs)' },
        '.p-theme-sm': { padding: 'var(--spacing-sm)' },
        '.p-theme-md': { padding: 'var(--spacing-md)' },
        '.p-theme-lg': { padding: 'var(--spacing-lg)' },
        '.p-theme-xl': { padding: 'var(--spacing-xl)' },
        '.text-theme-xs': { 'font-size': 'var(--text-xs-size)' },
        '.text-theme-sm': { 'font-size': 'var(--text-sm-size)' },
        '.text-theme-base': { 'font-size': 'var(--text-base-size)' },
        '.gap-theme-sm': { gap: 'var(--spacing-sm)' },
        '.gap-theme-md': { gap: 'var(--spacing-md)' },
        '.space-y-theme-sm > * + *': { 'margin-top': 'var(--spacing-sm)' },
        '.space-y-theme-md > * + *': { 'margin-top': 'var(--spacing-md)' },
      });
    },
  ],
};
