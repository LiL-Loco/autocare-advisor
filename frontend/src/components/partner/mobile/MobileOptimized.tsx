'use client';

import { useState, useEffect } from 'react';
import { X, Menu, Home, Package, Users, Bell, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const navigationItems = [
  { 
    href: '/partner/dashboard', 
    label: 'Dashboard', 
    icon: Home,
    description: 'Overview & Analytics'
  },
  { 
    href: '/partner/products', 
    label: 'Products', 
    icon: Package,
    description: 'Manage Inventory'
  },
  { 
    href: '/partner/customers', 
    label: 'Customers', 
    icon: Users,
    description: 'Customer Insights'
  },
  { 
    href: '/partner/notifications', 
    label: 'Notifications', 
    icon: Bell,
    description: 'Alerts & Updates',
    badge: '3'
  },
  { 
    href: '/partner/analytics', 
    label: 'Analytics', 
    icon: BarChart3,
    description: 'Performance Reports'
  },
  { 
    href: '/partner/settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'Account & Preferences'
  },
];

export default function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AutoCare Partner</h2>
            <p className="text-sm text-gray-600">Product Management</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Partner Info */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">MS</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Mustermann GmbH</p>
              <p className="text-sm text-gray-600">Premium Partner</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">127</p>
              <p className="text-xs text-gray-600">Products</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-600">€2,340</p>
              <p className="text-xs text-gray-600">Monthly Revenue</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  <Icon
                    className={`mr-4 h-6 w-6 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={`ml-2 ${
                            isActive
                              ? 'bg-blue-800 text-blue-100'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isActive ? 'text-blue-200' : 'text-gray-500'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="text-xs">
              Help & Support
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Logout
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            AutoCare Partner v2.1.0
          </p>
        </div>
      </div>
    </>
  );
}

// Mobile-optimized header component
export function MobileHeader({ currentPath = '' }: { currentPath?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  const getCurrentPageTitle = (path: string) => {
    const item = navigationItems.find(nav => nav.href === path);
    return item?.label || 'Dashboard';
  };

  return (
    <>
      <header className="lg:hidden bg-background border-b sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {getCurrentPageTitle(currentPath)}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="relative p-2"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={currentPath}
      />
    </>
  );
}

// Touch-optimized button component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon
}: TouchButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg min-h-[40px]', // Minimum touch target 40px
    md: 'px-6 py-3 text-base rounded-xl min-h-[48px]', // Recommended touch target 48px
    lg: 'px-8 py-4 text-lg rounded-xl min-h-[56px]' // Large touch target 56px
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export function MobileCard({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'sm'
}: MobileCardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${shadowClasses[shadow]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

// Mobile-optimized input component
interface MobileInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function MobileInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  icon
}: MobileInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            block w-full px-4 py-3 text-base border border-gray-300 rounded-xl
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:opacity-50 disabled:bg-gray-50
            placeholder-gray-400
            min-h-[48px]
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          `}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}