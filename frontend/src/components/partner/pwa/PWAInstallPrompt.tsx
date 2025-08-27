'use client';

import { useEffect, useState } from 'react';

interface PWAInstallProps {
  onInstalled?: () => void;
  onDismissed?: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC<PWAInstallProps> = ({ onInstalled, onDismissed }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'other'>('other');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    const checkStandalone = () => {
      if (typeof window === 'undefined') return;
      
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                             (window.navigator as any).standalone === true ||
                             document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    // Detect platform
    const detectPlatform = () => {
      if (typeof window === 'undefined') return;
      
      const userAgent = navigator.userAgent;
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        setPlatform('ios');
      } else if (/Android/.test(userAgent)) {
        setPlatform('android');
      } else if (/Windows|Mac|Linux/.test(userAgent)) {
        setPlatform('desktop');
      }
    };

    checkStandalone();
    detectPlatform();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setIsInstallable(true);
      
      // Show prompt after a delay if not in standalone mode
      setTimeout(() => {
        if (!isStandalone) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
      onInstalled?.();
    };

    // Only add event listeners on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, [isStandalone, onInstalled]);

  // Check localStorage in a separate useEffect to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissedTime = localStorage.getItem('pwa-install-dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[PWA] User choice:', outcome);
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        onInstalled?.();
      } else {
        onDismissed?.();
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismissed?.();
    
    // Don't show again for 24 hours (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }
  };

  const getInstallInstructions = () => {
    switch (platform) {
      case 'ios':
        return {
          title: 'Install AutoCare Partner',
          steps: [
            'Tap the Share button',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to install the app'
          ],
          icon: '📱'
        };
      case 'android':
        return {
          title: 'Install AutoCare Partner',
          steps: [
            'Tap "Add to Home Screen" in your browser menu',
            'Or use the install button below',
            'Access the app directly from your home screen'
          ],
          icon: '🤖'
        };
      case 'desktop':
        return {
          title: 'Install AutoCare Partner',
          steps: [
            'Click the install button below',
            'Or look for the install icon in your address bar',
            'Access the app from your desktop or taskbar'
          ],
          icon: '💻'
        };
      default:
        return {
          title: 'Install AutoCare Partner',
          steps: [
            'Add this app to your home screen',
            'Access it like a native app',
            'Works offline with cached data'
          ],
          icon: '⚡'
        };
    }
  };

  // Don't show if already in standalone mode or recently dismissed
  if (isStandalone || isDismissed) return null;

  if (!showPrompt && !isInstallable) return null;

  const instructions = getInstallInstructions();

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{instructions.icon}</span>
              <div>
                <h3 className="font-semibold text-lg">{instructions.title}</h3>
                <p className="text-sm text-blue-100">Get the full app experience</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Dismiss install prompt"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3 mb-4">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">App Benefits:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Offline access
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Push notifications
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Faster loading
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Native-like experience
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Install App</span>
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;