import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      secondaryDark: string;
      info: string;
      success: string;
      warning: string;
      danger: string;
      text: {
        primary: string;
        secondary: string;
        muted: string;
        inverse: string;
      };
      background: string;
      backgroundLight: string;
      surface: string;
      searchBackground: string;
      border: string;
      primaryDark: string;
    };
    typography: {
      fontFamily: string;
      baseFontSize: string;
      headings: {
        h1: { fontSize: string; lineHeight: string; fontWeight: number };
        h2: { fontSize: string; lineHeight: string; fontWeight: number };
        h3: { fontSize: string; lineHeight: string; fontWeight: number };
      };
      body: {
        small: {
          fontSize: string;
          lineHeight: string;
        };
        medium: {
          fontSize: string;
          lineHeight: string;
        };
        large: {
          fontSize: string;
          lineHeight: string;
        };
      };
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    radii: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}

export const theme = {
  colors: {
    primary: '#62A59D', 
    primaryDark: '#3B7E76', 
    secondary: '#10b981',
    secondaryDark: '#059669',
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: {
      primary: '#171717',
      secondary: '#6b7280',
      muted: '#9ca3af',
      inverse: '#ffffff',
    },
    background: '#F9FAFB', 
    backgroundLight: '#ffffff', 
    surface: '#f5f5f5', 
    searchBackground: '#e5e7eb', 
    border: '#e5e7eb',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    baseFontSize: '16px',
    headings: {
      h1: {
        fontSize: '2.5rem',
        lineHeight: '1.2',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        lineHeight: '1.3',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.5rem',
        lineHeight: '1.4',
        fontWeight: 600,
      },
    },
    body: {
      small: {
        fontSize: '0.875rem',
        lineHeight: '1.5',
      },
      medium: {
        fontSize: '1rem',
        lineHeight: '1.5',
      },
      large: {
        fontSize: '1.125rem',
        lineHeight: '1.5',
      },
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
} as const;