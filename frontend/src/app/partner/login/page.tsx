'use client';

import {
  BuildingStorefrontIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PartnerLoginPage() {
  const [email, setEmail] = useState('partner@autocare.de');
  const [password, setPassword] = useState('partner123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState('');

  const router = useRouter();

  // SEO Protection - Add meta tags dynamically
  useEffect(() => {
    document.title = 'AutoCare Advisor';

    // Add meta tags for SEO protection
    const metaTags = [
      { name: 'robots', content: 'noindex, nofollow, nosnippet, noarchive' },
      { name: 'googlebot', content: 'noindex, nofollow' },
      { name: 'bingbot', content: 'noindex, nofollow' },
    ];

    metaTags.forEach((tag) => {
      const existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!existingTag) {
        const metaTag = document.createElement('meta');
        metaTag.name = tag.name;
        metaTag.content = tag.content;
        document.head.appendChild(metaTag);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoginAttempt('');

    try {
      // Zuerst als Partner versuchen
      setLoginAttempt('🔍 Trying partner login...');

      let response = await fetch(
        'http://localhost:5001/api/auth/partner/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        }
      );

      let data;
      let userType = '';

      if (response.ok) {
        // Partner-Login erfolgreich (kann auch Admin sein)
        data = await response.json();
        userType = data.user.role; // Use actual role from backend response

        if (userType === 'admin') {
          setLoginAttempt(
            '✅ Admin detected via partner login! Login successful...'
          );
        } else {
          setLoginAttempt('✅ Partner detected! Login successful...');
        }
      } else {
        // Partner-Login fehlgeschlagen, versuche Admin-Login
        setLoginAttempt('🔍 Partner login failed, trying admin login...');

        response = await fetch('http://localhost:5001/api/auth/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (response.ok) {
          data = await response.json();
          userType = data.user.role; // Use actual role from backend response
          setLoginAttempt(
            '✅ Admin detected via dedicated admin login! Login successful...'
          );
        } else {
          // Beide Login-Versuche fehlgeschlagen
          const adminError = await response
            .json()
            .catch(() => ({ message: 'Unknown error' }));

          setLoginAttempt('❌ Both login attempts failed');
          throw new Error(
            `Login failed. Neither partner nor admin access possible. ` +
              `Details: ${
                adminError.message || adminError.error || 'Unknown error'
              }`
          );
        }
      }

      // Tokens speichern
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.tokens.accessToken);
      localStorage.setItem('userType', userType);

      // Cookie für Middleware setzen
      document.cookie = `authToken=${data.tokens.accessToken}; path=/; max-age=86400; samesite=strict`;

      // Weiterleitung basierend auf Benutzertyp
      if (userType === 'admin') {
        setLoginAttempt(
          '✅ Admin login successful! Redirecting to admin dashboard...'
        );
        setTimeout(() => router.push('/admin/dashboard'), 1500);
      } else if (userType === 'partner') {
        setLoginAttempt(
          '✅ Partner login successful! Redirecting to partner dashboard...'
        );
        setTimeout(() => router.push('/partner/dashboard'), 1500);
      }
    } catch (err: any) {
      console.error('Universal Login Error:', err);
      setError(err.message || 'Login failed - unknown error');
      setLoginAttempt('❌ Login process aborted');
    } finally {
      setLoading(false);
    }
  };

  // Add SEO protection meta tags dynamically
  useEffect(() => {
    document.title = 'AutoCare Advisor';

    // Add meta tags for SEO protection
    const metaTags = [
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
      { name: 'bingbot', content: 'noindex, nofollow' },
    ];

    metaTags.forEach((tag) => {
      const existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!existingTag) {
        const metaTag = document.createElement('meta');
        metaTag.name = tag.name;
        metaTag.content = tag.content;
        document.head.appendChild(metaTag);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            🚗 AutoCare Advisor
          </h1>
          <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
          <h2 className="text-2xl font-semibold text-emerald-600">
            Universal Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Automatische Erkennung: Partner & Admin Portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-emerald-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {loginAttempt && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm text-center">
                ℹ️ {loginAttempt}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-Mail-Adresse (Partner oder Admin)
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="ihre@email.de"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Passwort
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  '🔑 Anmelden'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-xs text-gray-500">
              Partner & Admin Portal • Automatische Erkennung • Sicherer Zugang
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2025 AutoCare Advisor. Partner access only.
        </p>
      </div>
    </div>
  );
}
