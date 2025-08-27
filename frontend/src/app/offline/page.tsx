'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Automatically redirect when back online
      setTimeout(() => {
        router.push('/partner/dashboard');
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    
    // Try to reload the page
    if (navigator.onLine) {
      router.push('/partner/dashboard');
    } else {
      // Simulate network check
      fetch('/api/health', { cache: 'no-cache' })
        .then(() => {
          router.push('/partner/dashboard');
        })
        .catch(() => {
          // Still offline, show user feedback
          console.log('Still offline, try again later');
        });
    }
  };

  const goToDashboard = () => {
    router.push('/partner/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex flex-col items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="text-8xl mb-8 animate-bounce">
          {isOnline ? '🌐' : '📱'}
        </div>

        {/* Status indicator */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full mb-6 transition-all duration-300 ${
          isOnline 
            ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
            : 'bg-red-500/20 border border-red-400/30 text-red-100'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
            isOnline ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          {isOnline ? 'Connection Restored' : 'You\'re Offline'}
        </div>

        {/* Main content */}
        <h1 className="text-4xl font-bold text-white mb-4">
          {isOnline ? 'Back Online!' : 'No Connection'}
        </h1>
        
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          {isOnline 
            ? 'Great! Your connection has been restored. Redirecting you to the dashboard...'
            : 'Don\'t worry, your AutoCare Partner Portal works offline too! You can still view cached data and your dashboard.'
          }
        </p>

        {/* Offline features */}
        {!isOnline && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What you can do offline:</h3>
            <div className="space-y-3 text-sm text-blue-100">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                View cached analytics data
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Browse your product catalog
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Access your dashboard
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                Changes will sync when online
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            disabled={isOnline}
            className="w-full bg-white/20 hover:bg-white/30 disabled:bg-green-500/20 disabled:cursor-not-allowed border-2 border-white/30 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2"
          >
            {isOnline ? (
              <>
                <span className="animate-spin">🔄</span>
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Try Again {retryCount > 0 && `(${retryCount})`}</span>
              </>
            )}
          </button>

          <button
            onClick={goToDashboard}
            className="w-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm"
          >
            Go to Dashboard Anyway
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-xs text-blue-200/80">
          <p>AutoCare Partner Portal • Progressive Web App</p>
          <p className="mt-1">Cached data available offline</p>
        </div>
      </div>

      {/* Connection pulse animation */}
      {!isOnline && (
        <div className="absolute top-8 right-8">
          <div className="relative">
            <div className="w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}