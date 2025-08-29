'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

// Pure client-side component - no SSR
export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
