'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { BillingProvider } from '../contexts/BillingContext';
import '../styles/automotive.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${inter.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <BillingProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </BillingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
