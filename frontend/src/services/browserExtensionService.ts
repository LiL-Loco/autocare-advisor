/**
 * Browser Extension Detection Service
 * Professional service to detect and handle browser extension interference
 * This ensures our application works seamlessly with popular extensions
 */

interface ExtensionInfo {
  name: string;
  detected: boolean;
  attributes: string[];
  compatibility: 'compatible' | 'minor-issues' | 'major-issues';
  description: string;
}

class BrowserExtensionService {
  private static instance: BrowserExtensionService;
  private detectedExtensions: ExtensionInfo[] = [];
  private initialized = false;

  private readonly knownExtensions: Omit<ExtensionInfo, 'detected'>[] = [
    {
      name: 'ColorZilla',
      attributes: ['cz-shortcut-listen'],
      compatibility: 'compatible',
      description: 'Color picker and eyedropper tool',
    },
    {
      name: 'Grammarly',
      attributes: [
        'data-grammarly-shadow-root',
        'data-new-gr-c-s-check-loaded',
        'data-new-gr-c-s-loaded',
      ],
      compatibility: 'compatible',
      description: 'Writing assistance and grammar checker',
    },
    {
      name: 'LastPass',
      attributes: ['data-lastpass-root', 'data-lastpass-infield'],
      compatibility: 'compatible',
      description: 'Password manager',
    },
    {
      name: '1Password',
      attributes: ['data-1password-extension'],
      compatibility: 'compatible',
      description: 'Password manager',
    },
    {
      name: 'Microsoft Editor',
      attributes: ['data-ms-editor'],
      compatibility: 'compatible',
      description: 'Writing assistance tool',
    },
    {
      name: 'Ad Blockers',
      attributes: ['data-adblock-key', 'data-ublock'],
      compatibility: 'minor-issues',
      description: 'Ad blocking extensions may affect some UI elements',
    },
  ];

  static getInstance(): BrowserExtensionService {
    if (!BrowserExtensionService.instance) {
      BrowserExtensionService.instance = new BrowserExtensionService();
    }
    return BrowserExtensionService.instance;
  }

  /**
   * Initialize extension detection
   */
  public initialize(): void {
    if (this.initialized || typeof window === 'undefined') return;

    this.detectExtensions();
    this.setupPeriodicCheck();
    this.initialized = true;

    // Log detected extensions for debugging
    if (this.detectedExtensions.length > 0) {
      console.group('🔧 Browser Extensions Detected');
      this.detectedExtensions.forEach((ext) => {
        console.info(
          `✓ ${ext.name} - ${ext.description} (${ext.compatibility})`
        );
      });
      console.groupEnd();
    }
  }

  /**
   * Detect all known extensions
   */
  private detectExtensions(): void {
    const body = document.body;
    const html = document.documentElement;

    this.detectedExtensions = this.knownExtensions
      .map((extension) => ({
        ...extension,
        detected: extension.attributes.some(
          (attr) =>
            body.hasAttribute(attr) ||
            html.hasAttribute(attr) ||
            body.getAttribute(attr) !== null ||
            html.getAttribute(attr) !== null
        ),
      }))
      .filter((extension) => extension.detected);
  }

  /**
   * Setup periodic check for extensions that load later
   */
  private setupPeriodicCheck(): void {
    // Check after common extension load times
    const checkTimes = [500, 1000, 2000, 5000];

    checkTimes.forEach((delay) => {
      setTimeout(() => {
        const previousCount = this.detectedExtensions.length;
        this.detectExtensions();

        if (this.detectedExtensions.length > previousCount) {
          console.info('🔧 Additional browser extensions detected');
        }
      }, delay);
    });
  }

  /**
   * Check if any extensions are detected
   */
  public hasExtensions(): boolean {
    return this.detectedExtensions.length > 0;
  }

  /**
   * Get all detected extensions
   */
  public getDetectedExtensions(): ExtensionInfo[] {
    return [...this.detectedExtensions];
  }

  /**
   * Check if hydration warnings should be suppressed
   */
  public shouldSuppressHydrationWarnings(): boolean {
    return this.hasExtensions();
  }

  /**
   * Get compatibility status
   */
  public getCompatibilityStatus(): {
    overall: 'good' | 'warning' | 'issues';
    details: string[];
  } {
    if (this.detectedExtensions.length === 0) {
      return { overall: 'good', details: ['No browser extensions detected'] };
    }

    const hasMinorIssues = this.detectedExtensions.some(
      (ext) => ext.compatibility === 'minor-issues'
    );
    const hasMajorIssues = this.detectedExtensions.some(
      (ext) => ext.compatibility === 'major-issues'
    );

    if (hasMajorIssues) {
      return {
        overall: 'issues',
        details: this.detectedExtensions
          .filter((ext) => ext.compatibility === 'major-issues')
          .map((ext) => `${ext.name} may cause compatibility issues`),
      };
    }

    if (hasMinorIssues) {
      return {
        overall: 'warning',
        details: this.detectedExtensions
          .filter((ext) => ext.compatibility === 'minor-issues')
          .map((ext) => `${ext.name} may cause minor issues`),
      };
    }

    return {
      overall: 'good',
      details: ['All detected extensions are compatible'],
    };
  }
}

// Export singleton instance
export const browserExtensionService = BrowserExtensionService.getInstance();

// Export hook for React components
export const useBrowserExtensionService = () => {
  const [hasExtensions, setHasExtensions] = useState(false);
  const [compatibilityStatus, setCompatibilityStatus] = useState<
    ReturnType<typeof browserExtensionService.getCompatibilityStatus>
  >({
    overall: 'good',
    details: [],
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      browserExtensionService.initialize();

      // Update state
      setHasExtensions(browserExtensionService.hasExtensions());
      setCompatibilityStatus(browserExtensionService.getCompatibilityStatus());

      // Periodic updates to catch late-loading extensions
      const interval = setInterval(() => {
        setHasExtensions(browserExtensionService.hasExtensions());
        setCompatibilityStatus(
          browserExtensionService.getCompatibilityStatus()
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  return {
    hasExtensions,
    compatibilityStatus,
    shouldSuppressHydrationWarnings:
      browserExtensionService.shouldSuppressHydrationWarnings(),
    detectedExtensions: browserExtensionService.getDetectedExtensions(),
  };
};

import { useEffect, useState } from 'react';
