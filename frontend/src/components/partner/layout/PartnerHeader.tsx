'use client';

import { useTheme, useThemeClasses } from '@/contexts/ThemeContext';
import { Bell, ChevronDown, Monitor, Plus, Search, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const PartnerHeader: React.FC = () => {
  const { themeMode, toggleTheme, isCompact } = useTheme();
  const themeClasses = useThemeClasses();

  return (
    <div
      className={`bg-white border-b border-gray-200 ${themeClasses.header.padding} sticky top-0 z-50 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-teal-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              AutoCare Partner
            </span>
          </div>

          {/* Shopify-style Search */}
          <div className="hidden md:flex relative ml-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Produkte, Kunden, Bestellungen durchsuchen..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-80 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors group`}
            title={`Zu ${isCompact ? 'Standard' : 'Kompakt'} Layout wechseln`}
          >
            <Monitor
              className={`${themeClasses.sidebar.iconSize} text-gray-600 group-hover:text-teal-600 transition-colors`}
            />
            <span
              className={`ml-1 ${themeClasses.text.xs} text-gray-500 hidden lg:inline`}
            >
              {isCompact ? 'Standard' : 'Kompakt'}
            </span>
          </button>

          <Link
            href="/partner/products/new"
            className={`hidden sm:flex items-center ${themeClasses.form.buttonPadding} bg-teal-600 text-white ${themeClasses.text.xs} font-medium rounded-md hover:bg-teal-700 transition-colors`}
          >
            <Plus className={`${themeClasses.sidebar.iconSize} mr-1.5`} />
            Neues Produkt
          </Link>

          <button className="p-2 rounded-md hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2 pl-2 cursor-pointer hover:bg-gray-50 rounded-md p-1">
            <div
              className={`${themeClasses.height.sm} ${themeClasses.height.sm} bg-gray-300 rounded-full flex items-center justify-center`}
            >
              <User
                className={`${themeClasses.sidebar.iconSize} text-gray-600`}
              />
            </div>
            <div className="hidden md:block">
              <div
                className={`${themeClasses.text.xs} font-medium text-gray-900`}
              >
                Partner
              </div>
            </div>
            <ChevronDown
              className={`${themeClasses.sidebar.iconSize} text-gray-400`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerHeader;
