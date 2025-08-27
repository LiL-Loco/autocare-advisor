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
  HelpCircle,
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
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MobileHeader } from '../mobile/MobileOptimized';
import PWAInstallPrompt from '../pwa/PWAInstallPrompt';
import PWAManager from '../pwa/PWAManager';

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
        name: 'Benachrichtigungszentrale',
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
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
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <MobileHeader currentPath={pathname} />

      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-72 bg-card border-r shadow-sm transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 z-30 lg:flex-shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-3 border-b h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">
                AC
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-foreground">
                AutoCare
              </h2>
              <p className="text-xs text-muted-foreground">Partner Portal</p>
            </div>
          </div>
        </div>

        {/* Partner Info */}
        <div className="px-6 py-3 bg-muted/30 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user?.firstName?.[0]?.toUpperCase() || 'P'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                Professional
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = isActiveItem(item.href, item.subItems);
            const isExpanded = expandedItems[item.name] || isActive;
            const IconComponent = item.icon;

            return (
              <div key={item.name} className="space-y-1">
                <div
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() =>
                    item.subItems
                      ? toggleExpanded(item.name)
                      : router.push(item.href)
                  }
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div
                      className={`text-xs ${
                        isActive
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {item.subItems && (
                    <svg
                      className={`ml-2 h-4 w-4 transform transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      } ${
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
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
                  {isActive && !item.subItems && (
                    <div className="ml-auto w-2 h-2 bg-primary-foreground rounded-full"></div>
                  )}
                </div>

                {/* SubItems */}
                {item.subItems && isExpanded && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      const SubIconComponent = subItem.icon;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            isSubActive
                              ? 'bg-accent text-accent-foreground font-medium border-l-2 border-primary'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <SubIconComponent className="h-4 w-4 mr-2" />
                          <span>{subItem.name}</span>
                          {isSubActive && (
                            <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-t">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Schnellaktionen
          </h3>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const ActionIconComponent = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center px-3 py-2 text-xs font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ActionIconComponent className="h-4 w-4 mr-2" />
                  {action.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Abmelden
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:static relative">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-5 w-5" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-foreground">
                  {navigationItems.find((item) => item.href === pathname)
                    ?.name || 'Partner-Portal'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {navigationItems.find((item) => item.href === pathname)
                    ?.description ||
                    'Verwalten Sie Ihre Produkte und Analytics'}
                </p>
              </div>
            </div>

            {/* Top bar actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Search</span>
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
                <span className="sr-only">Notifications</span>
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Help</span>
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* PWA Components */}
      <PWAManager />
      <PWAInstallPrompt />
    </div>
  );
}
