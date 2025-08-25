'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { BillingProvider } from '../contexts/BillingContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BillingProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </BillingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
