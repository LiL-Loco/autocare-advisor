'use client';

import AdminLayout from '@/components/admin/AdminLayout';

// Temporäre Vereinfachung wegen React 19 TypeScript Kompatibilitätsproblemen
export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Coming soon - Analytics dashboard is being updated for React 19
            compatibility
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Update in Progress
            </h3>
            <p className="text-blue-700 text-sm">
              This page is temporarily simplified during the React 19 update
              process. Full analytics functionality will be restored soon.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
