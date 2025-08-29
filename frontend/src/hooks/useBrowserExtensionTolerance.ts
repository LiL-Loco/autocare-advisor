import { useEffect, useState } from 'react';

/**
 * Hook to handle browser extension compatibility issues
 * Many browser extensions modify the DOM after initial load, causing hydration mismatches
 * This hook provides a way to handle these gracefully
 */
export const useBrowserExtensionTolerance = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [extensionDetected, setExtensionDetected] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Detect common browser extension attributes that cause hydration issues
    const detectExtensions = () => {
      if (typeof window === 'undefined') return;

      const body = document.body;
      const commonExtensionAttributes = [
        'cz-shortcut-listen', // ColorZilla
        'data-grammarly-shadow-root', // Grammarly
        'data-lastpass-root', // LastPass
        'data-1password-extension', // 1Password
        'spellcheck', // Various spell checkers
        'data-ms-editor', // Microsoft Editor
        'data-new-gr-c-s-check-loaded', // Grammarly
        'data-new-gr-c-s-loaded', // Grammarly
      ];

      const hasExtensionAttributes = commonExtensionAttributes.some(
        (attr) => body.hasAttribute(attr) || body.getAttribute(attr) !== null
      );

      if (hasExtensionAttributes) {
        setExtensionDetected(true);
        console.info(
          '🔧 Browser extension detected - hydration warnings may be safely ignored'
        );
      }
    };

    // Check immediately and after a short delay to catch extensions that load later
    detectExtensions();
    const timer = setTimeout(detectExtensions, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    isMounted,
    extensionDetected,
    shouldSuppressHydrationWarning: extensionDetected,
  };
};
