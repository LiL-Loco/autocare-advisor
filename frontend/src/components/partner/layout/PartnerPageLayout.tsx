'use client';

import PartnerHeader from '@/components/partner/layout/PartnerHeader';
import PartnerSidebar from '@/components/partner/layout/PartnerSidebar';
import { useThemeClasses } from '@/contexts/ThemeContext';
import React, { useState } from 'react';

interface PartnerPageLayoutProps {
  children: React.ReactNode;
}

const PartnerPageLayout: React.FC<PartnerPageLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const themeClasses = useThemeClasses();

  return (
    <div className={`min-h-screen bg-gray-50 ${themeClasses.text.xs}`}>
      {/* Header - Full Width */}
      <PartnerHeader />

      <div className="flex">
        {/* Sidebar */}
        <PartnerSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area */}
        <main className={`flex-1 lg:ml-0 ${themeClasses.content.padding}`}>
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PartnerPageLayout;
