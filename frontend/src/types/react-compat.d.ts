// React 19 Compatibility fixes for TypeScript
declare module 'react' {
  interface ReactPortal {
    children?: React.ReactNode;
  }
}

// Extend global React namespace for better component compatibility
declare global {
  namespace React {
    type ReactNode = import('react').ReactNode;
  }
}

export {};
