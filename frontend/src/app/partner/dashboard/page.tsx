'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function PartnerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user) {
      setDashboardLoading(false);
    }
  }, [user, loading, router]);

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Partner Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome back, {user?.firstName}!
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  router.push('/');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to AutoCare Advisor Partner Portal!
              </h2>
              <p className="text-gray-600 mb-6">
                Your partner account has been successfully created.
              </p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-indigo-900 mb-2">
                  Account Details
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user?.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 mt-6 text-sm">
                Partner dashboard features will be available soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
