'use client';

import { BarChart, BarChart3, Package, TrendingUp, Upload } from 'lucide-react';
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

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/partner/dashboard',
    icon: BarChart3,
    description: 'Overview & Analytics',
  },
  {
    name: 'Products',
    href: '/partner/dashboard/products',
    icon: Package,
    description: 'Product Management',
    subItems: [
      {
        name: 'Advanced Product Management',
        href: '/partner/dashboard/products/advanced',
        icon: TrendingUp,
      },
      {
        name: 'Bulk Operations',
        href: '/partner/dashboard/products/bulk',
        icon: Upload,
      },
      {
        name: 'Product Analytics',
        href: '/partner/dashboard/products/analytics',
        icon: BarChart,
      },
    ],
  },
  {
    name: 'Analytics',
    href: '/partner/dashboard/analytics',
    icon: '📈',
    description: 'Advanced Analytics',
  },
  {
    name: 'Customers',
    href: '/partner/dashboard/customers',
    icon: '👥',
    description: 'Customer Insights',
    subItems: [
      {
        name: 'Customer Journey',
        href: '/partner/dashboard/customers/journey',
        icon: '🛤️',
      },
      {
        name: 'Segmentation',
        href: '/partner/dashboard/customers/segments',
        icon: '🎯',
      },
      {
        name: 'Behavior Analysis',
        href: '/partner/dashboard/customers/behavior',
        icon: '🔍',
      },
    ],
  },
  {
    name: 'Marketing',
    href: '/partner/dashboard/marketing',
    icon: '🎯',
    description: 'Campaign Management',
    subItems: [
      {
        name: 'Campaign Tools',
        href: '/partner/dashboard/marketing/campaigns',
        icon: '📢',
      },
      {
        name: 'Templates',
        href: '/partner/dashboard/marketing/templates',
        icon: '📄',
      },
      {
        name: 'Performance',
        href: '/partner/dashboard/marketing/performance',
        icon: '📈',
      },
    ],
  },
  {
    name: 'API Management',
    href: '/partner/dashboard/api',
    icon: '�',
    description: 'API & Integrations',
    subItems: [
      { name: 'API Keys', href: '/partner/dashboard/api/keys', icon: '🔑' },
      { name: 'Webhooks', href: '/partner/dashboard/api/webhooks', icon: '🔄' },
      {
        name: 'Documentation',
        href: '/partner/dashboard/api/docs',
        icon: '📚',
      },
      {
        name: 'Integrations',
        href: '/partner/dashboard/api/integrations',
        icon: '🔌',
      },
    ],
  },
  {
    name: 'Notifications',
    href: '/partner/dashboard/notifications',
    icon: '🔔',
    description: 'Alerts & Messages',
    subItems: [
      {
        name: 'Notification Center',
        href: '/partner/dashboard/notifications/center',
        icon: '🎯',
      },
      {
        name: 'Preferences',
        href: '/partner/dashboard/notifications/preferences',
        icon: '⚙️',
      },
      {
        name: 'Templates',
        href: '/partner/dashboard/notifications/templates',
        icon: '📝',
      },
      {
        name: 'Analytics',
        href: '/partner/dashboard/notifications/analytics',
        icon: '📊',
      },
    ],
  },
  {
    name: 'Billing',
    href: '/partner/billing',
    icon: '💳',
    description: 'Usage & Billing',
    subItems: [
      {
        name: 'Subscription Plans',
        href: '/partner/billing/plans',
        icon: '📋',
      },
      { name: 'Usage Tracking', href: '/partner/billing/usage', icon: '📊' },
      { name: 'Billing History', href: '/partner/billing/history', icon: '📄' },
      { name: 'Payment Methods', href: '/partner/billing/payment', icon: '💰' },
    ],
  },
  {
    name: 'Settings',
    href: '/partner/dashboard/settings',
    icon: '⚙️',
    description: 'Account & Preferences',
    subItems: [
      {
        name: 'Dashboard Settings',
        href: '/partner/dashboard/settings/dashboard',
        icon: '🏠',
      },
      {
        name: 'Security',
        href: '/partner/dashboard/settings/security',
        icon: '🔒',
      },
      {
        name: 'Integrations',
        href: '/partner/dashboard/settings/integrations',
        icon: '🔗',
      },
      {
        name: 'Branding',
        href: '/partner/dashboard/settings/branding',
        icon: '🎨',
      },
      {
        name: 'Backup',
        href: '/partner/dashboard/settings/backup',
        icon: '💾',
      },
    ],
  },
];

const quickActions = [
  {
    name: 'Upload Products',
    href: '/partner/dashboard/products/upload',
    icon: '📤',
  },
  {
    name: 'Export Data',
    href: '/partner/dashboard/analytics/exports',
    icon: '📊',
  },
  {
    name: 'View Reports',
    href: '/partner/dashboard/analytics/reports',
    icon: '📋',
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
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close sidebar</span>✕
          </button>
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
                  <span className="text-lg mr-3">{item.icon}</span>
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
                          <span className="text-sm mr-2">{subItem.icon}</span>
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
            Quick Actions
          </h3>
          <div className="space-y-1">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center px-3 py-2 text-xs font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors"
              >
                <span className="mr-2">{action.icon}</span>
                {action.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <span className="mr-3">🚪</span>
            Sign out
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
                <span className="sr-only">Open sidebar</span>☰
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-foreground">
                  {navigationItems.find((item) => item.href === pathname)
                    ?.name || 'Partner Portal'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {navigationItems.find((item) => item.href === pathname)
                    ?.description || 'Manage your products and analytics'}
                </p>
              </div>
            </div>

            {/* Top bar actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Search</span>
                🔍
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
                <span className="sr-only">Notifications</span>
                🔔
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Help</span>❓
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
