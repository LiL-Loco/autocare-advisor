'use client';

import { Inter } from 'next/font/google';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
import { AuthProvider } from '../context/AuthContext';
import { BillingProvider } from '../contexts/BillingContext';
import '../styles/automotive.css';
import '../styles/pwa.css';
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="application-name" content="AutoCare Partner" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AutoCare Partner" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon-192x192.png"
        />
        <link rel="shortcut icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ServiceWorkerRegistration />
        <AuthProvider>
          <BillingProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </BillingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
