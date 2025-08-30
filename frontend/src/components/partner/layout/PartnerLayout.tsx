'use client';

import {
  BarChart,
  Bell,
  ChevronDown,
  CreditCard,
  Key,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

const PartnerLayout: React.FC<PartnerLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/partner/dashboard',
      icon: LayoutDashboard,
      current: pathname?.startsWith('/partner/dashboard'),
    },
    {
      name: 'Produkte',
      href: '/partner/products',
      icon: Package,
      current: pathname?.startsWith('/partner/products'),
    },
    {
      name: 'Kunden',
      href: '/partner/customers',
      icon: Users,
      current: pathname?.startsWith('/partner/customers'),
    },
    {
      name: 'Analytics',
      href: '/partner/analytics',
      icon: BarChart,
      current: pathname?.startsWith('/partner/analytics'),
    },
    {
      name: 'Benachrichtigungen',
      href: '/partner/notifications',
      icon: Bell,
      current: pathname?.startsWith('/partner/notifications'),
    },
    {
      name: 'Abrechnung',
      href: '/partner/billing',
      icon: CreditCard,
      current: pathname?.startsWith('/partner/billing'),
    },
    {
      name: 'API',
      href: '/partner/api',
      icon: Key,
      current: pathname?.startsWith('/partner/api'),
    },
    {
      name: 'Einstellungen',
      href: '/partner/settings',
      icon: Settings,
      current: pathname?.startsWith('/partner/settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width top header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-teal-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                AutoCare Partner
              </span>
            </div>

            <div className="hidden md:flex relative ml-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Suchen..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/partner/products/new"
              className="hidden sm:flex items-center px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Neues Produkt
            </Link>

            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-2 pl-2">
              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">Partner</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Compact sidebar - starts below header */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-[57px] left-0 z-40 w-56 h-[calc(100vh-57px)] bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out overflow-y-auto`}
        >
          <nav className="px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 lg:ml-56">
          <div className="bg-gray-50 min-h-[calc(100vh-57px)] p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout;
