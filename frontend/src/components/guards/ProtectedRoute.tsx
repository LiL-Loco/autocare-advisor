'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'partner')[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/',
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // No user - redirect to homepage
      if (!user) {
        router.replace(redirectTo);
        return;
      }

      // Check if user has allowed role
      if (!allowedRoles.includes(user.role as 'admin' | 'partner')) {
        router.replace(redirectTo);
        return;
      }

      // Check if userType matches role for consistency
      if (user.userType !== user.role) {
        router.replace(redirectTo);
        return;
      }
    }
  }, [user, loading, router, allowedRoles, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="text-emerald-600 text-lg">
            Checking authentication...
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no user or wrong role
  if (!user || !allowedRoles.includes(user.role as 'admin' | 'partner')) {
    return null;
  }

  return <>{children}</>;
}
