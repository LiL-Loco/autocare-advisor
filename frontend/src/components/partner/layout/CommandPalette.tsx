'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Download,
  FileBarChart,
  FileText,
  HelpCircle,
  Key,
  MessageSquare,
  Package,
  PenTool,
  Plug2,
  Search,
  Settings,
  Target,
  TrendingUp,
  Upload,
  Users,
  Webhook,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  icon: React.ComponentType<any>;
  keywords: string[];
}

const searchDatabase: SearchItem[] = [
  // Navigation
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Übersicht & Analytics',
    category: 'Navigation',
    href: '/partner/dashboard',
    icon: BarChart3,
    keywords: ['dashboard', 'übersicht', 'analytics', 'statistiken'],
  },
  {
    id: 'products',
    title: 'Produkte',
    description: 'Produktverwaltung und Katalog',
    category: 'Navigation',
    href: '/partner/dashboard/products',
    icon: Package,
    keywords: ['produkte', 'katalog', 'inventory', 'waren'],
  },
  {
    id: 'products-advanced',
    title: 'Erweiterte Produktverwaltung',
    description: 'Automatisierung und erweiterte Einstellungen',
    category: 'Navigation',
    href: '/partner/dashboard/products/advanced',
    icon: TrendingUp,
    keywords: ['erweitert', 'automatisierung', 'regeln', 'advanced'],
  },
  {
    id: 'products-analytics',
    title: 'Produkt-Analytics',
    description: 'Detaillierte Produktleistung und Metriken',
    category: 'Navigation',
    href: '/partner/dashboard/products/analytics',
    icon: BarChart3,
    keywords: ['analytics', 'metriken', 'leistung', 'statistiken'],
  },
  {
    id: 'customers',
    title: 'Kunden',
    description: 'Kundeneinblicke und Verwaltung',
    category: 'Navigation',
    href: '/partner/dashboard/customers',
    icon: Users,
    keywords: ['kunden', 'clients', 'benutzer', 'user'],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Kampagnenverwaltung und Werbung',
    category: 'Navigation',
    href: '/partner/dashboard/marketing',
    icon: Target,
    keywords: ['marketing', 'kampagnen', 'werbung', 'promotion'],
  },
  {
    id: 'billing',
    title: 'Abrechnung',
    description: 'Rechnungen, Zahlungen und Abonnements',
    category: 'Navigation',
    href: '/partner/billing',
    icon: CreditCard,
    keywords: ['abrechnung', 'rechnung', 'zahlung', 'payment', 'billing'],
  },

  // Einstellungen
  {
    id: 'settings',
    title: 'Einstellungen',
    description: 'Konto und allgemeine Einstellungen',
    category: 'Einstellungen',
    href: '/partner/dashboard/settings',
    icon: Settings,
    keywords: ['einstellungen', 'settings', 'konfiguration', 'config'],
  },
  {
    id: 'settings-security',
    title: 'Sicherheitseinstellungen',
    description: 'Passwort, 2FA und Sicherheit',
    category: 'Einstellungen',
    href: '/partner/dashboard/settings/security',
    icon: Key,
    keywords: [
      'sicherheit',
      'security',
      'passwort',
      '2fa',
      'authentifizierung',
    ],
  },
  {
    id: 'api-management',
    title: 'API-Verwaltung',
    description: 'API-Schlüssel und Integrationen',
    category: 'Einstellungen',
    href: '/partner/dashboard/api',
    icon: Plug2,
    keywords: ['api', 'integration', 'schlüssel', 'webhook', 'entwickler'],
  },
  {
    id: 'notifications-settings',
    title: 'Benachrichtigungseinstellungen',
    description: 'E-Mail und Push-Benachrichtigungen konfigurieren',
    category: 'Einstellungen',
    href: '/partner/dashboard/notifications/preferences',
    icon: Bell,
    keywords: [
      'benachrichtigungen',
      'notifications',
      'email',
      'push',
      'alerts',
    ],
  },

  // Aktionen
  {
    id: 'product-upload',
    title: 'Produkt hinzufügen',
    description: 'Neues Produkt zum Katalog hinzufügen',
    category: 'Aktionen',
    href: '/partner/dashboard/products/upload',
    icon: Upload,
    keywords: ['hinzufügen', 'upload', 'neu', 'erstellen', 'add'],
  },
  {
    id: 'bulk-operations',
    title: 'Massenoperationen',
    description: 'Mehrere Produkte gleichzeitig bearbeiten',
    category: 'Aktionen',
    href: '/partner/dashboard/products/bulk',
    icon: Package,
    keywords: ['bulk', 'masse', 'mehrere', 'batch', 'massenbearbeitung'],
  },
  {
    id: 'export-data',
    title: 'Daten exportieren',
    description: 'Produktdaten und Analytics exportieren',
    category: 'Aktionen',
    href: '/partner/dashboard/analytics/exports',
    icon: Download,
    keywords: ['export', 'download', 'daten', 'csv', 'backup'],
  },

  // Berichte
  {
    id: 'analytics-reports',
    title: 'Analytics-Berichte',
    description: 'Detaillierte Berichte und Auswertungen',
    category: 'Berichte',
    href: '/partner/dashboard/analytics/reports',
    icon: FileBarChart,
    keywords: ['berichte', 'reports', 'auswertung', 'analyse'],
  },
  {
    id: 'billing-history',
    title: 'Rechnungshistorie',
    description: 'Vergangene Rechnungen und Zahlungen',
    category: 'Berichte',
    href: '/partner/billing/history',
    icon: FileText,
    keywords: ['historie', 'history', 'vergangene', 'rechnungen'],
  },

  // Hilfe
  {
    id: 'help',
    title: 'Hilfe & Support',
    description: 'Dokumentation und Support kontaktieren',
    category: 'Hilfe',
    href: '/partner/help',
    icon: HelpCircle,
    keywords: ['hilfe', 'help', 'support', 'dokumentation', 'faq'],
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter and categorize results
  const filteredResults = searchDatabase.filter((item) => {
    if (!searchTerm) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.keywords.some((keyword) => keyword.includes(searchLower))
    );
  });

  // Group by category
  const categorizedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  const allResults = filteredResults;
  const totalResults = allResults.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, totalResults - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (allResults[selectedIndex]) {
            router.push(allResults[selectedIndex].href);
            onClose();
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalResults, allResults, router, onClose]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleItemClick = (item: SearchItem) => {
    router.push(item.href);
    onClose();
  };

  let currentIndex = 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 bg-white">
        <div className="border-b border-gray-200">
          {/* Search Input */}
          <div className="flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-lg placeholder-gray-400"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!searchTerm ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Beginnen Sie mit der Eingabe um zu suchen...</p>
            </div>
          ) : Object.keys(categorizedResults).length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Keine Ergebnisse gefunden für "{searchTerm}"</p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(categorizedResults).map(([category, items]) => (
                <div key={category} className="mb-4">
                  {/* Category Header */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    {category} {items.length}
                  </div>

                  {/* Category Items */}
                  <div>
                    {items.map((item) => {
                      const isSelected = currentIndex === selectedIndex;
                      const itemIndex = currentIndex++;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors ${
                            isSelected
                              ? 'bg-blue-50 border-r-2 border-r-blue-500'
                              : ''
                          }`}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <item.icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {item.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {searchTerm && totalResults > 0 && (
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-1 bg-white border rounded text-xs font-mono">
                    ↑↓
                  </kbd>
                  <span>navigieren</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-1 bg-white border rounded text-xs font-mono">
                    ↵
                  </kbd>
                  <span>öffnen</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-1 bg-white border rounded text-xs font-mono">
                    esc
                  </kbd>
                  <span>schließen</span>
                </div>
              </div>
              <span>
                {totalResults} Ergebnis{totalResults !== 1 ? 'se' : ''}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
