'use client';

import {
  BarChart,
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Download,
  FileBarChart,
  FileText,
  Key,
  LogOut,
  Menu,
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
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MobileHeader } from '../mobile/MobileOptimized';
import CommandPalette from './CommandPalette';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  subItems?: { name: string; href: string; icon: React.ComponentType<any> }[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/partner/dashboard',
    icon: BarChart3,
    description: 'Übersicht & Analytics',
  },
  {
    name: 'Produkte',
    href: '/partner/dashboard/products',
    icon: Package,
    description: 'Produktverwaltung',
    subItems: [
      {
        name: 'Erweiterte Produktverwaltung',
        href: '/partner/dashboard/products/advanced',
        icon: TrendingUp,
      },
      {
        name: 'Massenoperationen',
        href: '/partner/dashboard/products/bulk',
        icon: Upload,
      },
      {
        name: 'Produkt-Analytics',
        href: '/partner/dashboard/products/analytics',
        icon: BarChart,
      },
    ],
  },
  {
    name: 'Analytics',
    href: '/partner/dashboard/analytics',
    icon: TrendingUp,
    description: 'Erweiterte Analytics',
  },
  {
    name: 'Kunden',
    href: '/partner/dashboard/customers',
    icon: Users,
    description: 'Kundeneinblicke',
    subItems: [
      {
        name: 'Kunden-Journey',
        href: '/partner/dashboard/customers/journey',
        icon: BarChart,
      },
      {
        name: 'Segmentierung',
        href: '/partner/dashboard/customers/segments',
        icon: Target,
      },
      {
        name: 'Verhaltensanalyse',
        href: '/partner/dashboard/customers/behavior',
        icon: Search,
      },
    ],
  },
  {
    name: 'Marketing',
    href: '/partner/dashboard/marketing',
    icon: Target,
    description: 'Kampagnenverwaltung',
    subItems: [
      {
        name: 'Kampagnen-Tools',
        href: '/partner/dashboard/marketing/campaigns',
        icon: MessageSquare,
      },
      {
        name: 'Vorlagen',
        href: '/partner/dashboard/marketing/templates',
        icon: FileText,
      },
      {
        name: 'Leistung',
        href: '/partner/dashboard/marketing/performance',
        icon: TrendingUp,
      },
    ],
  },
  {
    name: 'API-Verwaltung',
    href: '/partner/dashboard/api',
    icon: Plug2,
    description: 'API & Integrationen',
    subItems: [
      { name: 'API-Schlüssel', href: '/partner/dashboard/api/keys', icon: Key },
      {
        name: 'Webhooks',
        href: '/partner/dashboard/api/webhooks',
        icon: Webhook,
      },
      {
        name: 'Dokumentation',
        href: '/partner/dashboard/api/docs',
        icon: FileText,
      },
      {
        name: 'Integrationen',
        href: '/partner/dashboard/api/integrations',
        icon: Plug2,
      },
    ],
  },
  {
    name: 'Benachrichtigungen',
    href: '/partner/dashboard/notifications',
    icon: Bell,
    description: 'Benachrichtigungen & Meldungen',
    subItems: [
      {
        name: 'Zentrale',
        href: '/partner/dashboard/notifications/center',
        icon: Target,
      },
      {
        name: 'Einstellungen',
        href: '/partner/dashboard/notifications/preferences',
        icon: Settings,
      },
      {
        name: 'Vorlagen',
        href: '/partner/dashboard/notifications/templates',
        icon: PenTool,
      },
      {
        name: 'Analytics',
        href: '/partner/dashboard/notifications/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    name: 'Abrechnung',
    href: '/partner/billing',
    icon: CreditCard,
    description: 'Nutzung & Abrechnung',
    subItems: [
      {
        name: 'Abonnement-Pläne',
        href: '/partner/billing/plans',
        icon: FileBarChart,
      },
      {
        name: 'Nutzungsverfolgung',
        href: '/partner/billing/usage',
        icon: BarChart3,
      },
      {
        name: 'Rechnungshistorie',
        href: '/partner/billing/history',
        icon: FileText,
      },
      {
        name: 'Zahlungsmethoden',
        href: '/partner/billing/payment',
        icon: DollarSign,
      },
    ],
  },
  {
    name: 'Einstellungen',
    href: '/partner/dashboard/settings',
    icon: Settings,
    description: 'Konto & Präferenzen',
    subItems: [
      {
        name: 'Dashboard-Einstellungen',
        href: '/partner/dashboard/settings/dashboard',
        icon: BarChart3,
      },
      {
        name: 'Sicherheit',
        href: '/partner/dashboard/settings/security',
        icon: Key,
      },
      {
        name: 'Integrationen',
        href: '/partner/dashboard/settings/integrations',
        icon: Plug2,
      },
      {
        name: 'Markengestaltung',
        href: '/partner/dashboard/settings/branding',
        icon: PenTool,
      },
      {
        name: 'Sicherung',
        href: '/partner/dashboard/settings/backup',
        icon: Download,
      },
    ],
  },
];

const quickActions = [
  {
    name: 'Produkte hochladen',
    href: '/partner/dashboard/products/upload',
    icon: Upload,
  },
  {
    name: 'Daten Exportieren',
    href: '/partner/dashboard/analytics/exports',
    icon: Download,
  },
  {
    name: 'Berichte anzeigen',
    href: '/partner/dashboard/analytics/reports',
    icon: FileBarChart,
  },
];

export default function PartnerLayout({ children }: PartnerLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const headerSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K for global command palette
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isActiveItem = (href: string, subItems?: { href: string }[]) => {
    if (pathname === href) return true;
    if (subItems) {
      return subItems.some((subItem) => pathname.startsWith(subItem.href));
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Global Header - Shopify Style */}
      <div className="sticky top-0 z-10 bg-background border-b h-16">
        <div className="flex items-center justify-between px-4 py-4 h-16">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground lg:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm font-bold">
                AC
              </div>
              <h2 className="ml-3 text-lg font-semibold text-foreground">
                AutoCare
              </h2>
            </div>
          </div>

          {/* Center: Search Bar - Command Palette Trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center px-3 py-2 bg-muted rounded-lg border-0 text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Search className="h-4 w-4 mr-3" />
              <span>Suchen</span>
              <div className="ml-auto">
                <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-background border rounded">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right: User Info - Shopify Style */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-3 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {user?.firstName?.[0]?.toUpperCase() || 'P'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area mit Sidebar */}
      <div className="flex flex-1">
        {/* Mobile Header */}
        <MobileHeader currentPath={pathname} />

        {/* Mobile menu overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Shopify Style */}
        <div
          className={`fixed top-16 left-0 bottom-0 flex flex-col w-56 bg-card border-r transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0`}
        >
          {/* Navigation - Super Clean Shopify Style */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = isActiveItem(item.href, item.subItems);
              const isExpanded = expandedItems[item.name] || isActive;
              const IconComponent = item.icon;

              return (
                <div key={item.name} className="space-y-1">
                  <div
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                    onClick={() => {
                      if (item.subItems) {
                        // Für Menüpunkte mit Untermenü: Navigation zur Hauptseite UND Dropdown öffnen
                        router.push(item.href);
                        toggleExpanded(item.name);
                      } else {
                        // Für Menüpunkte ohne Untermenü: Nur Navigation
                        router.push(item.href);
                      }
                    }}
                  >
                    <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.subItems && (
                      <svg
                        className={`ml-auto h-4 w-4 transform transition-transform text-muted-foreground ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* SubItems - Shopify Style */}
                  {item.subItems && isExpanded && (
                    <div className="ml-8 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        const SubIconComponent = subItem.icon;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`group flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                              isSubActive
                                ? 'bg-muted text-foreground font-medium'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            }`}
                          >
                            <span className="text-xs mr-3">•</span>
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer - Minimalist */}
          <div className="flex-shrink-0 p-2 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-muted-foreground rounded-md hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
              Abmelden
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-muted/20">{children}</main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
