import Handlebars from 'handlebars';

// ============================================================================
// HANDLEBARS HELPERS
// ============================================================================

/**
 * Register custom Handlebars helpers for email templates
 */
export function registerTemplateHelpers() {
  // Format currency
  Handlebars.registerHelper(
    'currency',
    function (amount: number, currency: string = '€') {
      if (typeof amount !== 'number' || isNaN(amount)) return '0,00 €';
      return `${amount.toFixed(2).replace('.', ',')} ${currency}`;
    }
  );

  // Format date
  Handlebars.registerHelper(
    'formatDate',
    function (date: Date, format: string = 'DD.MM.YYYY') {
      if (!date) return '';

      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      switch (format) {
        case 'DD.MM.YYYY':
          return `${day}.${month}.${year}`;
        case 'DD/MM/YYYY':
          return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
          return `${year}-${month}-${day}`;
        case 'long':
          const months = [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember',
          ];
          return `${parseInt(day)}. ${months[d.getMonth()]} ${year}`;
        default:
          return `${day}.${month}.${year}`;
      }
    }
  );

  // Truncate text
  Handlebars.registerHelper(
    'truncate',
    function (text: string, length: number = 100) {
      if (!text || text.length <= length) return text;
      return text.substring(0, length) + '...';
    }
  );

  // Conditional comparison
  Handlebars.registerHelper(
    'ifEquals',
    function (this: any, arg1: any, arg2: any, options: any) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    }
  );

  // Math operations
  Handlebars.registerHelper('add', function (a: number, b: number) {
    return a + b;
  });

  Handlebars.registerHelper('multiply', function (a: number, b: number) {
    return a * b;
  });

  Handlebars.registerHelper(
    'percentage',
    function (value: number, total: number) {
      if (total === 0) return '0%';
      return Math.round((value / total) * 100) + '%';
    }
  );

  // Capitalize first letter
  Handlebars.registerHelper('capitalize', function (text: string) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  });

  // URL encoding
  Handlebars.registerHelper('urlEncode', function (text: string) {
    return encodeURIComponent(text || '');
  });

  // Array operations
  Handlebars.registerHelper('length', function (array: any[]) {
    return Array.isArray(array) ? array.length : 0;
  });

  Handlebars.registerHelper(
    'join',
    function (array: any[], separator: string = ', ') {
      return Array.isArray(array) ? array.join(separator) : '';
    }
  );

  // Default value helper
  Handlebars.registerHelper(
    'default',
    function (value: any, defaultValue: any) {
      return value || defaultValue;
    }
  );

  // Generate unsubscribe URL
  Handlebars.registerHelper(
    'unsubscribeUrl',
    function (email: string, type: string = 'all') {
      const baseUrl =
        process.env.FRONTEND_URL || 'https://autocare-advisor.com';
      const encodedEmail = encodeURIComponent(email);
      return `${baseUrl}/unsubscribe?email=${encodedEmail}&type=${type}`;
    }
  );

  // Generate tracking pixel URL
  Handlebars.registerHelper('trackingPixel', function (messageId: string) {
    const baseUrl = process.env.API_URL || 'https://api.autocare-advisor.com';
    return `${baseUrl}/api/emails/tracking/open?messageId=${encodeURIComponent(messageId)}`;
  });

  // Generate click tracking URL
  Handlebars.registerHelper(
    'trackClick',
    function (url: string, messageId: string) {
      const baseUrl = process.env.API_URL || 'https://api.autocare-advisor.com';
      const encodedUrl = encodeURIComponent(url);
      const encodedMessageId = encodeURIComponent(messageId);
      return `${baseUrl}/api/emails/tracking/click?url=${encodedUrl}&messageId=${encodedMessageId}`;
    }
  );

  console.log('[Template Engine] Handlebars helpers registered successfully');
}

// ============================================================================
// TEMPLATE RENDERING ENGINE
// ============================================================================

export interface TemplateContext {
  // User data
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: any;
  };

  // Company/Partner data
  partner?: {
    companyName?: string;
    contactPerson?: string;
    email?: string;
    [key: string]: any;
  };

  // Product data
  product?: {
    name?: string;
    price?: number;
    description?: string;
    imageUrl?: string;
    [key: string]: any;
  };

  // Campaign data
  campaign?: {
    name?: string;
    subject?: string;
    [key: string]: any;
  };

  // Custom variables
  [key: string]: any;

  // Tracking
  messageId?: string;
  unsubscribeUrl?: string;
}

export class EmailTemplateEngine {
  private static instance: EmailTemplateEngine;
  private isInitialized: boolean = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): EmailTemplateEngine {
    if (!EmailTemplateEngine.instance) {
      EmailTemplateEngine.instance = new EmailTemplateEngine();
    }
    return EmailTemplateEngine.instance;
  }

  private initialize() {
    if (!this.isInitialized) {
      registerTemplateHelpers();
      this.isInitialized = true;
    }
  }

  /**
   * Render HTML template with context
   */
  renderHtml(templateContent: string, context: TemplateContext): string {
    try {
      const template = Handlebars.compile(templateContent);
      return template(context);
    } catch (error) {
      console.error('[Template Engine] Failed to render HTML template:', error);
      throw new Error(
        `Template rendering failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Render text template with context
   */
  renderText(templateContent: string, context: TemplateContext): string {
    try {
      // For text templates, we use basic variable replacement
      let rendered = templateContent;

      // Replace simple variables like {{variable}}
      const variableRegex = /\{\{([^}]+)\}\}/g;
      rendered = rendered.replace(variableRegex, (match, variable) => {
        const value = this.getNestedValue(context, variable.trim());
        return value !== undefined ? String(value) : match;
      });

      return rendered;
    } catch (error) {
      console.error('[Template Engine] Failed to render text template:', error);
      throw new Error(
        `Text template rendering failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Render subject line with context
   */
  renderSubject(subjectTemplate: string, context: TemplateContext): string {
    try {
      const template = Handlebars.compile(subjectTemplate);
      return template(context);
    } catch (error) {
      console.error('[Template Engine] Failed to render subject:', error);
      throw new Error(
        `Subject rendering failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get nested object value using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Validate template syntax
   */
  validateTemplate(templateContent: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    try {
      // Try to compile the template
      Handlebars.compile(templateContent);

      // Check for common issues
      const unclosedBlocks = templateContent.match(/\{\{#\w+/g);
      const closedBlocks = templateContent.match(/\{\{\/\w+/g);

      if ((unclosedBlocks?.length || 0) !== (closedBlocks?.length || 0)) {
        errors.push('Unmatched opening/closing blocks detected');
      }

      // Check for unescaped HTML in variables that should be escaped
      const unescapedVars = templateContent.match(/\{\{\{[^}]+\}\}\}/g);
      if (unescapedVars) {
        errors.push(
          'Found unescaped variables - ensure they are safe for HTML output'
        );
      }
    } catch (error) {
      errors.push(
        `Template compilation error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Extract variables from template
   */
  extractVariables(templateContent: string): string[] {
    const variables = new Set<string>();

    // Extract simple variables {{variable}}
    const simpleVars = templateContent.match(/\{\{([^#\/!>][^}]*)\}\}/g);
    if (simpleVars) {
      simpleVars.forEach((match) => {
        const variable = match.replace(/\{\{|\}\}/g, '').trim();
        // Skip Handlebars helpers and built-in functions
        if (
          !variable.includes('(') &&
          !variable.startsWith('this.') &&
          !variable.startsWith('@')
        ) {
          variables.add(variable.split(' ')[0]); // Take first part before any spaces (helpers)
        }
      });
    }

    // Extract block variables {{#each items}}
    const blockVars = templateContent.match(/\{\{#\w+\s+([^}]+)\}\}/g);
    if (blockVars) {
      blockVars.forEach((match) => {
        const parts = match
          .replace(/\{\{#\w+\s+|\}\}/g, '')
          .trim()
          .split(' ');
        variables.add(parts[0]);
      });
    }

    return Array.from(variables).sort();
  }
}

// ============================================================================
// PRE-DEFINED TEMPLATE CONTEXTS
// ============================================================================

export const TEMPLATE_CONTEXTS = {
  PARTNER_WELCOME: {
    user: {
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@example.com',
    },
    partner: {
      companyName: 'Muster Auto GmbH',
      contactPerson: 'Max Mustermann',
    },
  },

  PARTNER_ONBOARDING: {
    user: {
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna.schmidt@example.com',
    },
    partner: {
      companyName: 'Schmidt Autopflege',
      contactPerson: 'Anna Schmidt',
    },
    onboardingStep: 2,
    totalSteps: 7,
  },

  PRODUCT_RECOMMENDATION: {
    user: {
      firstName: 'Thomas',
      lastName: 'Weber',
      email: 'thomas.weber@example.com',
    },
    product: {
      name: 'Premium Autowachs',
      price: 29.99,
      description: 'Hochwertiges Carnaubawachs für perfekten Glanz',
      imageUrl: 'https://example.com/product.jpg',
    },
  },

  CAMPAIGN_NEWSLETTER: {
    user: {
      firstName: 'Maria',
      lastName: 'Müller',
      email: 'maria.mueller@example.com',
    },
    campaign: {
      name: 'Frühjahrs-Special',
      subject: 'Jetzt bereit für den Frühling!',
    },
    products: [
      {
        name: 'Frühjahrs-Reinigungsset',
        price: 39.99,
        imageUrl: 'https://example.com/spring-set.jpg',
      },
      {
        name: 'Pollenfilter-Reiniger',
        price: 12.99,
        imageUrl: 'https://example.com/pollen-cleaner.jpg',
      },
    ],
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

// Create singleton instance
export const templateEngine = EmailTemplateEngine.getInstance();

export default EmailTemplateEngine;
