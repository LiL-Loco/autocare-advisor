'use client';

import PartnerPageLayout from '../../components/partner/layout/PartnerPageLayout';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

interface PartnerRootLayoutProps {
  children: React.ReactNode;
}

export default function PartnerRootLayout({
  children,
}: PartnerRootLayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PartnerPageLayout>{children}</PartnerPageLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}
