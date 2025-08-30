'use client';

import { useThemeClasses } from '@/contexts/ThemeContext';
import {
  BarChart,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  History,
  Key,
  LayoutDashboard,
  Menu,
  Package,
  Palette,
  PieChart,
  Plus,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Upload,
  Users,
  Webhook,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  current?: boolean;
  children?: NavigationItem[];
}

interface PartnerSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const PartnerSidebar: React.FC<PartnerSidebarProps> = ({
  isOpen = false,
  onToggle,
}) => {
  const pathname = usePathname();
  const themeClasses = useThemeClasses();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/partner/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/partner/dashboard',
    },
    {
      name: 'Produkte',
      icon: Package,
      current:
        pathname?.startsWith('/partner/products') ||
        pathname?.startsWith('/partner/dashboard/products'),
      children: [
        {
          name: 'Alle Produkte',
          href: '/partner/products',
          icon: Package,
          current: pathname === '/partner/products',
        },
        {
          name: 'Neues Produkt',
          href: '/partner/products/new',
          icon: Plus,
          current: pathname === '/partner/products/new',
        },
        {
          name: 'Bulk Upload',
          href: '/partner/dashboard/products/upload',
          icon: Upload,
          current: pathname === '/partner/dashboard/products/upload',
        },
        {
          name: 'Import',
          href: '/partner/dashboard/products/import',
          icon: Download,
          current: pathname === '/partner/dashboard/products/import',
        },
        {
          name: 'Bulk Actions',
          href: '/partner/dashboard/products/bulk',
          icon: Database,
          current: pathname === '/partner/dashboard/products/bulk',
        },
        {
          name: 'Analytics',
          href: '/partner/dashboard/products/analytics',
          icon: PieChart,
          current: pathname === '/partner/dashboard/products/analytics',
        },
      ],
    },
    {
      name: 'Analytics',
      icon: BarChart,
      current: pathname?.startsWith('/partner/dashboard/analytics'),
      children: [
        {
          name: 'Overview',
          href: '/partner/dashboard/analytics',
          icon: BarChart,
          current: pathname === '/partner/dashboard/analytics',
        },
        {
          name: 'Reports',
          href: '/partner/dashboard/analytics/reports',
          icon: FileText,
          current: pathname === '/partner/dashboard/analytics/reports',
        },
        {
          name: 'Exports',
          href: '/partner/dashboard/analytics/exports',
          icon: Download,
          current: pathname === '/partner/dashboard/analytics/exports',
        },
      ],
    },
    {
      name: 'Kunden',
      icon: Users,
      current: pathname?.startsWith('/partner/customers'),
      children: [
        {
          name: 'Insights',
          href: '/partner/customers/insights',
          icon: Eye,
          current: pathname === '/partner/customers/insights',
        },
        {
          name: 'Segmente',
          href: '/partner/customers/segments',
          icon: Filter,
          current: pathname === '/partner/customers/segments',
        },
        {
          name: 'Verhalten',
          href: '/partner/customers/behavior',
          icon: TrendingUp,
          current: pathname === '/partner/customers/behavior',
        },
      ],
    },
    {
      name: 'Marketing',
      icon: Target,
      current:
        pathname?.startsWith('/partner/marketing') ||
        pathname?.startsWith('/partner/dashboard/marketing'),
      children: [
        {
          name: 'Campaigns',
          href: '/partner/dashboard/marketing/campaigns',
          icon: Target,
          current: pathname === '/partner/dashboard/marketing/campaigns',
        },
        {
          name: 'Performance',
          href: '/partner/marketing/performance',
          icon: TrendingUp,
          current: pathname === '/partner/marketing/performance',
        },
        {
          name: 'Templates',
          href: '/partner/marketing/templates',
          icon: FileText,
          current: pathname === '/partner/marketing/templates',
        },
      ],
    },
    {
      name: 'Notifications',
      icon: Bell,
      current:
        pathname?.startsWith('/partner/notifications') ||
        pathname?.startsWith('/partner/dashboard/notifications'),
      children: [
        {
          name: 'Center',
          href: '/partner/dashboard/notifications/center',
          icon: Bell,
          current: pathname === '/partner/dashboard/notifications/center',
        },
        {
          name: 'Templates',
          href: '/partner/notifications/templates',
          icon: FileText,
          current: pathname === '/partner/notifications/templates',
        },
        {
          name: 'Preferences',
          href: '/partner/notifications/preferences',
          icon: Settings,
          current: pathname === '/partner/notifications/preferences',
        },
        {
          name: 'Analytics',
          href: '/partner/notifications/analytics',
          icon: BarChart,
          current: pathname === '/partner/notifications/analytics',
        },
      ],
    },
    {
      name: 'Billing',
      icon: CreditCard,
      current: pathname?.startsWith('/partner/billing'),
      children: [
        {
          name: 'Overview',
          href: '/partner/billing',
          icon: CreditCard,
          current: pathname === '/partner/billing',
        },
        {
          name: 'Plans',
          href: '/partner/billing/plans',
          icon: Package,
          current: pathname === '/partner/billing/plans',
        },
        {
          name: 'Usage',
          href: '/partner/billing/usage',
          icon: BarChart,
          current: pathname === '/partner/billing/usage',
        },
        {
          name: 'History',
          href: '/partner/billing/history',
          icon: History,
          current: pathname === '/partner/billing/history',
        },
        {
          name: 'Payment Methods',
          href: '/partner/billing/payment-methods',
          icon: CreditCard,
          current: pathname === '/partner/billing/payment-methods',
        },
        {
          name: 'Upgrade',
          href: '/partner/billing/upgrade',
          icon: TrendingUp,
          current: pathname === '/partner/billing/upgrade',
        },
      ],
    },
    {
      name: 'API',
      icon: Key,
      current:
        pathname?.startsWith('/partner/api') ||
        pathname?.startsWith('/partner/dashboard/api'),
      children: [
        {
          name: 'Overview',
          href: '/partner/dashboard/api',
          icon: Key,
          current: pathname === '/partner/dashboard/api',
        },
        {
          name: 'Keys',
          href: '/partner/api/keys',
          icon: Key,
          current: pathname === '/partner/api/keys',
        },
        {
          name: 'Documentation',
          href: '/partner/api/documentation',
          icon: BookOpen,
          current: pathname === '/partner/api/documentation',
        },
        {
          name: 'Webhooks',
          href: '/partner/api/webhooks',
          icon: Webhook,
          current: pathname === '/partner/api/webhooks',
        },
        {
          name: 'Integrations',
          href: '/partner/api/integrations',
          icon: Zap,
          current: pathname === '/partner/api/integrations',
        },
      ],
    },
    {
      name: 'Settings',
      icon: Settings,
      current:
        pathname?.startsWith('/partner/settings') ||
        pathname?.startsWith('/partner/dashboard/settings'),
      children: [
        {
          name: 'General',
          href: '/partner/dashboard/settings',
          icon: Settings,
          current: pathname === '/partner/dashboard/settings',
        },
        {
          name: 'Security',
          href: '/partner/settings/security',
          icon: Shield,
          current: pathname === '/partner/settings/security',
        },
        {
          name: 'Integrations',
          href: '/partner/settings/integrations',
          icon: Zap,
          current: pathname === '/partner/settings/integrations',
        },
        {
          name: 'Branding',
          href: '/partner/settings/branding',
          icon: Palette,
          current: pathname === '/partner/settings/branding',
        },
        {
          name: 'Backup',
          href: '/partner/settings/backup',
          icon: Database,
          current: pathname === '/partner/settings/backup',
        },
      ],
    },
  ];

  const renderNavItem = (item: NavigationItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.name.toLowerCase());

    return (
      <div key={item.name}>
        {/* Main nav item */}
        {item.href ? (
          <Link
            href={item.href}
            className={`group flex items-center ${
              themeClasses.sidebar.itemPadding
            } ${
              themeClasses.text.xs
            } font-medium rounded-lg transition-all duration-150 ${
              item.current
                ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => onToggle && onToggle()}
          >
            <Icon
              className={`${themeClasses.sidebar.iconSize} ${themeClasses.sidebar.iconMargin} flex-shrink-0`}
            />
            <span className="truncate">{item.name}</span>
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSection(item.name.toLowerCase());
                }}
                className="ml-auto p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                )}
              </button>
            )}
          </Link>
        ) : (
          <button
            onClick={() => toggleSection(item.name.toLowerCase())}
            className={`group flex items-center w-full ${themeClasses.sidebar.itemPadding} ${themeClasses.text.xs} font-medium rounded-lg transition-all duration-150 text-gray-700 hover:bg-gray-50 hover:text-gray-900`}
          >
            <Icon
              className={`${themeClasses.sidebar.iconSize} ${themeClasses.sidebar.iconMargin} flex-shrink-0`}
            />
            <span className="truncate">{item.name}</span>
            {hasChildren && (
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                )}
              </div>
            )}
          </button>
        )}

        {/* Children - Shopify-style indented list */}
        {hasChildren && isExpanded && (
          <div className={`mt-0.5 ${themeClasses.sidebar.itemSpacing}`}>
            {item.children!.map((child) => (
              <Link
                key={child.name}
                href={child.href!}
                className={`flex items-center ${
                  themeClasses.sidebar.childPadding
                } ${
                  themeClasses.text.xs
                } rounded-lg transition-all duration-150 ${
                  child.current
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => onToggle && onToggle()}
              >
                <child.icon
                  className={`${themeClasses.sidebar.childIconSize} ${themeClasses.sidebar.iconMargin} flex-shrink-0`}
                />
                <span className="truncate">{child.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-[50px] left-0 z-40 ${
          themeClasses.sidebar.width
        } h-[calc(100vh-50px)] bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out overflow-y-auto scrollbar-hide`}
      >
        <nav
          className={`${themeClasses.sidebar.padding} ${themeClasses.sidebar.itemSpacing}`}
        >
          {navigation.map((item) => renderNavItem(item))}
        </nav>

        {/* Shopify-style bottom section */}
        <div
          className={`absolute bottom-0 left-0 right-0 ${themeClasses.spacing.sm} border-t border-gray-200 bg-gray-50`}
        >
          <div className={`${themeClasses.text.xs} text-gray-500 text-center`}>
            AutoCare Partner v2.1
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerSidebar;
