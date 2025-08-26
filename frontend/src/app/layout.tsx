'use client';

import { Inter, Poppins } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { BillingProvider } from '../contexts/BillingContext';
import '../styles/automotive.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <BillingProvider>
            <div className="min-h-screen bg-gray-50 font-poppins">
              {children}
            </div>
          </BillingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
