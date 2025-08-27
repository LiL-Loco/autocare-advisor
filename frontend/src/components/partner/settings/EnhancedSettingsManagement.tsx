'use client';

import {
  Database,
  Home,
  Link2,
  Palette,
  Settings as SettingsIcon,
  Shield,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Types for Enhanced Settings
interface DashboardSettings {
  theme: 'light' | 'dark' | 'auto';
  layout: 'compact' | 'comfortable' | 'spacious';
  sidebar: 'expanded' | 'collapsed' | 'auto';
  notifications: boolean;
  animations: boolean;
  autoSave: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  apiKeyRotation: boolean;
  loginNotifications: boolean;
  deviceTracking: boolean;
  encryptionEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

interface IntegrationSettings {
  webhookUrl: string;
  apiVersion: string;
  rateLimiting: boolean;
  cachingEnabled: boolean;
  compressionEnabled: boolean;
  loggingLevel: 'error' | 'warn' | 'info' | 'debug';
  retryAttempts: number;
  timeout: number;
}

interface UserPreferences {
  defaultView: string;
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number;
  exportFormat: 'csv' | 'excel' | 'json';
  emailDigest: 'daily' | 'weekly' | 'monthly' | 'never';
  marketingEmails: boolean;
  productUpdates: boolean;
}

interface BrandingSettings {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCSS: string;
  favicon: string;
  companyName: string;
  brandingEnabled: boolean;
}

interface BackupSettings {
  autoBackup: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  retention: number;
  location: 'local' | 'cloud' | 'both';
  encryption: boolean;
  compression: boolean;
  notifications: boolean;
}

const EnhancedSettingsManagement: React.FC = () => {
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>(
    {
      theme: 'light',
      layout: 'comfortable',
      sidebar: 'expanded',
      notifications: true,
      animations: true,
      autoSave: true,
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'US',
    }
  );

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    ipWhitelist: [],
    apiKeyRotation: true,
    loginNotifications: true,
    deviceTracking: false,
    encryptionEnabled: true,
    backupFrequency: 'daily',
  });

  const [integrationSettings, setIntegrationSettings] =
    useState<IntegrationSettings>({
      webhookUrl: '',
      apiVersion: 'v1',
      rateLimiting: true,
      cachingEnabled: true,
      compressionEnabled: false,
      loggingLevel: 'info',
      retryAttempts: 3,
      timeout: 30000,
    });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    defaultView: 'dashboard',
    itemsPerPage: 25,
    autoRefresh: false,
    refreshInterval: 60,
    exportFormat: 'csv',
    emailDigest: 'weekly',
    marketingEmails: false,
    productUpdates: true,
  });

  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280',
    accentColor: '#10B981',
    fontFamily: 'Inter',
    customCSS: '',
    favicon: '',
    companyName: '',
    brandingEnabled: false,
  });

  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackup: true,
    frequency: 'daily',
    retention: 30,
    location: 'cloud',
    encryption: true,
    compression: true,
    notifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'security'
    | 'integrations'
    | 'preferences'
    | 'branding'
    | 'backup'
  >('dashboard');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    // Simulate loading settings from backend
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveSettings = async (section: string) => {
    // Simulate API call to save settings
    console.log(`Saving ${section} settings...`);
    // Show success notification
  };

  const handleResetSettings = (section: string) => {
    // Reset to default values based on section
    console.log(`Resetting ${section} settings...`);
    setShowResetModal(false);
  };

  const handleExportSettings = () => {
    const allSettings = {
      dashboard: dashboardSettings,
      security: securitySettings,
      integrations: integrationSettings,
      preferences: userPreferences,
      branding: brandingSettings,
      backup: backupSettings,
    };

    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `settings-export-${
      new Date().toISOString().split('T')[0]
    }.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    setShowExportModal(false);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          // Apply imported settings
          if (settings.dashboard) setDashboardSettings(settings.dashboard);
          if (settings.security) setSecuritySettings(settings.security);
          if (settings.integrations)
            setIntegrationSettings(settings.integrations);
          if (settings.preferences) setUserPreferences(settings.preferences);
          if (settings.branding) setBrandingSettings(settings.branding);
          if (settings.backup) setBackupSettings(settings.backup);
        } catch (error) {
          console.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Settings & Customization
          </h1>
          <p className="text-gray-600 mt-1">
            Personalize your dashboard and manage your preferences
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            Import Settings
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export Settings
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: Home },
            { key: 'security', label: 'Security', icon: Shield },
            { key: 'integrations', label: 'Integrations', icon: Link2 },
            { key: 'preferences', label: 'Preferences', icon: SettingsIcon },
            { key: 'branding', label: 'Branding', icon: Palette },
            { key: 'backup', label: 'Backup', icon: Database },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Settings Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Dashboard Customization
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={dashboardSettings.theme}
                  onChange={(e) =>
                    setDashboardSettings((prev) => ({
                      ...prev,
                      theme: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout
                </label>
                <select
                  value={dashboardSettings.layout}
                  onChange={(e) =>
                    setDashboardSettings((prev) => ({
                      ...prev,
                      layout: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sidebar
                </label>
                <select
                  value={dashboardSettings.sidebar}
                  onChange={(e) =>
                    setDashboardSettings((prev) => ({
                      ...prev,
                      sidebar: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="expanded">Always Expanded</option>
                  <option value="collapsed">Always Collapsed</option>
                  <option value="auto">Auto (Responsive)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={dashboardSettings.language}
                  onChange={(e) =>
                    setDashboardSettings((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={dashboardSettings.timezone}
                  onChange={(e) =>
                    setDashboardSettings((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="UTC">UTC</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={dashboardSettings.dateFormat}
                  onChange={(e) =>
                    setDashboardSettings((prev) => ({
                      ...prev,
                      dateFormat: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-md font-medium text-gray-900">
                Display Options
              </h3>
              <div className="space-y-3">
                {[
                  {
                    key: 'notifications',
                    label: 'Show notifications',
                    description: 'Display in-app notifications',
                  },
                  {
                    key: 'animations',
                    label: 'Enable animations',
                    description: 'Use smooth transitions and animations',
                  },
                  {
                    key: 'autoSave',
                    label: 'Auto-save changes',
                    description: 'Automatically save changes as you work',
                  },
                ].map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        dashboardSettings[
                          option.key as keyof DashboardSettings
                        ] as boolean
                      }
                      onChange={(e) =>
                        setDashboardSettings((prev) => ({
                          ...prev,
                          [option.key]: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleSaveSettings('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Dashboard Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Security Configuration
            </h2>

            <div className="space-y-6">
              {/* Authentication */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Authentication
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </span>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorEnabled}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          twoFactorEnabled: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          sessionTimeout: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      min="5"
                      max="480"
                    />
                  </div>
                </div>
              </div>

              {/* Access Control */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Access Control
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IP Whitelist (one per line)
                    </label>
                    <textarea
                      value={securitySettings.ipWhitelist.join('\n')}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          ipWhitelist: e.target.value
                            .split('\n')
                            .filter((ip) => ip.trim()),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                      placeholder="192.168.1.1&#10;10.0.0.0/8"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">
                        Login Notifications
                      </span>
                      <p className="text-sm text-gray-600">
                        Receive alerts for new login attempts
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.loginNotifications}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          loginNotifications: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Data Protection */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Data Protection
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      key: 'encryptionEnabled',
                      label: 'Data Encryption',
                      description: 'Encrypt sensitive data at rest',
                    },
                    {
                      key: 'apiKeyRotation',
                      label: 'Automatic API Key Rotation',
                      description: 'Rotate API keys periodically',
                    },
                    {
                      key: 'deviceTracking',
                      label: 'Device Tracking',
                      description: 'Track and manage logged-in devices',
                    },
                  ].map((option) => (
                    <div
                      key={option.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-900">
                          {option.label}
                        </span>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                          securitySettings[
                            option.key as keyof SecuritySettings
                          ] as boolean
                        }
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            [option.key]: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleSaveSettings('security')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Settings Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Integration Configuration
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={integrationSettings.webhookUrl}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        webhookUrl: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Version
                  </label>
                  <select
                    value={integrationSettings.apiVersion}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        apiVersion: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="v1">v1</option>
                    <option value="v2">v2</option>
                    <option value="beta">Beta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logging Level
                  </label>
                  <select
                    value={integrationSettings.loggingLevel}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        loggingLevel: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout (ms)
                  </label>
                  <input
                    type="number"
                    value={integrationSettings.timeout}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        timeout: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="1000"
                    max="300000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retry Attempts
                  </label>
                  <input
                    type="number"
                    value={integrationSettings.retryAttempts}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        retryAttempts: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                    max="10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900">
                  Performance Options
                </h3>
                {[
                  {
                    key: 'rateLimiting',
                    label: 'Rate Limiting',
                    description: 'Enable request rate limiting',
                  },
                  {
                    key: 'cachingEnabled',
                    label: 'Response Caching',
                    description: 'Cache API responses to improve performance',
                  },
                  {
                    key: 'compressionEnabled',
                    label: 'Response Compression',
                    description: 'Enable gzip compression for responses',
                  },
                ].map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        integrationSettings[
                          option.key as keyof IntegrationSettings
                        ] as boolean
                      }
                      onChange={(e) =>
                        setIntegrationSettings((prev) => ({
                          ...prev,
                          [option.key]: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleSaveSettings('integrations')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Integration Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              User Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default View
                </label>
                <select
                  value={userPreferences.defaultView}
                  onChange={(e) =>
                    setUserPreferences((prev) => ({
                      ...prev,
                      defaultView: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="products">Products</option>
                  <option value="orders">Orders</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items per Page
                </label>
                <select
                  value={userPreferences.itemsPerPage}
                  onChange={(e) =>
                    setUserPreferences((prev) => ({
                      ...prev,
                      itemsPerPage: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={userPreferences.exportFormat}
                  onChange={(e) =>
                    setUserPreferences((prev) => ({
                      ...prev,
                      exportFormat: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Digest
                </label>
                <select
                  value={userPreferences.emailDigest}
                  onChange={(e) =>
                    setUserPreferences((prev) => ({
                      ...prev,
                      emailDigest: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="never">Never</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  value={userPreferences.refreshInterval}
                  onChange={(e) =>
                    setUserPreferences((prev) => ({
                      ...prev,
                      refreshInterval: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="30"
                  max="300"
                  disabled={!userPreferences.autoRefresh}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-md font-medium text-gray-900">
                Communication Preferences
              </h3>
              <div className="space-y-3">
                {[
                  {
                    key: 'autoRefresh',
                    label: 'Auto-refresh data',
                    description: 'Automatically refresh dashboard data',
                  },
                  {
                    key: 'marketingEmails',
                    label: 'Marketing emails',
                    description: 'Receive marketing and promotional emails',
                  },
                  {
                    key: 'productUpdates',
                    label: 'Product updates',
                    description: 'Get notified about new features and updates',
                  },
                ].map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        userPreferences[
                          option.key as keyof UserPreferences
                        ] as boolean
                      }
                      onChange={(e) =>
                        setUserPreferences((prev) => ({
                          ...prev,
                          [option.key]: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleSaveSettings('preferences')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branding Settings Tab */}
      {activeTab === 'branding' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Brand Customization
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">
                    Enable Custom Branding
                  </span>
                  <p className="text-sm text-gray-600">
                    Customize the appearance with your brand colors and logo
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={brandingSettings.brandingEnabled}
                  onChange={(e) =>
                    setBrandingSettings((prev) => ({
                      ...prev,
                      brandingEnabled: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {brandingSettings.brandingEnabled && (
                <div className="space-y-6 pl-4 border-l-2 border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={brandingSettings.companyName}
                        onChange={(e) =>
                          setBrandingSettings((prev) => ({
                            ...prev,
                            companyName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Your Company Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Family
                      </label>
                      <select
                        value={brandingSettings.fontFamily}
                        onChange={(e) =>
                          setBrandingSettings((prev) => ({
                            ...prev,
                            fontFamily: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={brandingSettings.primaryColor}
                          onChange={(e) =>
                            setBrandingSettings((prev) => ({
                              ...prev,
                              primaryColor: e.target.value,
                            }))
                          }
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandingSettings.primaryColor}
                          onChange={(e) =>
                            setBrandingSettings((prev) => ({
                              ...prev,
                              primaryColor: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) =>
                            setBrandingSettings((prev) => ({
                              ...prev,
                              secondaryColor: e.target.value,
                            }))
                          }
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) =>
                            setBrandingSettings((prev) => ({
                              ...prev,
                              secondaryColor: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={brandingSettings.accentColor}
                          onChange={(e) =>
                            setBrandingSettings((prev) => ({
                              ...prev,
                              accentColor: e.target.value,
                            }))
                          }
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={brandingSettings.accentColor}
                          onChange={(e) =>
                            setBrandingSettings((prev) => ({
                              ...prev,
                              accentColor: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={brandingSettings.logo}
                      onChange={(e) =>
                        setBrandingSettings((prev) => ({
                          ...prev,
                          logo: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://your-domain.com/logo.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      value={brandingSettings.favicon}
                      onChange={(e) =>
                        setBrandingSettings((prev) => ({
                          ...prev,
                          favicon: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://your-domain.com/favicon.ico"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom CSS
                    </label>
                    <textarea
                      value={brandingSettings.customCSS}
                      onChange={(e) =>
                        setBrandingSettings((prev) => ({
                          ...prev,
                          customCSS: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      rows={8}
                      placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  color: #333;&#10;}"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setShowResetModal(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset to Default
              </button>
              <button
                onClick={() => handleSaveSettings('branding')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Branding Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Settings Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Backup & Recovery
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">
                    Automatic Backup
                  </span>
                  <p className="text-sm text-gray-600">
                    Enable automatic data backups
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) =>
                    setBackupSettings((prev) => ({
                      ...prev,
                      autoBackup: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {backupSettings.autoBackup && (
                <div className="space-y-6 pl-4 border-l-2 border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={backupSettings.frequency}
                        onChange={(e) =>
                          setBackupSettings((prev) => ({
                            ...prev,
                            frequency: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Location
                      </label>
                      <select
                        value={backupSettings.location}
                        onChange={(e) =>
                          setBackupSettings((prev) => ({
                            ...prev,
                            location: e.target.value as any,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="local">Local Storage</option>
                        <option value="cloud">Cloud Storage</option>
                        <option value="both">Both Local & Cloud</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retention Period (days)
                      </label>
                      <input
                        type="number"
                        value={backupSettings.retention}
                        onChange={(e) =>
                          setBackupSettings((prev) => ({
                            ...prev,
                            retention: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">
                      Backup Options
                    </h3>
                    {[
                      {
                        key: 'encryption',
                        label: 'Encrypt Backups',
                        description: 'Encrypt backup files for security',
                      },
                      {
                        key: 'compression',
                        label: 'Compress Backups',
                        description: 'Reduce backup file size with compression',
                      },
                      {
                        key: 'notifications',
                        label: 'Backup Notifications',
                        description: 'Get notified about backup status',
                      },
                    ].map((option) => (
                      <div
                        key={option.key}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium text-gray-900">
                            {option.label}
                          </span>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            backupSettings[
                              option.key as keyof BackupSettings
                            ] as boolean
                          }
                          onChange={(e) =>
                            setBackupSettings((prev) => ({
                              ...prev,
                              [option.key]: e.target.checked,
                            }))
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Manual Backup Available
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        You can create a manual backup of your data at any time.
                        This includes all your settings, products, and
                        configuration.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button className="bg-yellow-100 px-3 py-2 rounded-lg text-yellow-800 hover:bg-yellow-200 transition-colors text-sm font-medium">
                        Create Manual Backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleSaveSettings('backup')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Backup Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Settings Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Export Settings
              </h3>
              <button onClick={() => setShowExportModal(false)}>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Export all your settings as a JSON file. This includes dashboard
                preferences, security settings, integrations, and more.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportSettings}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Export Settings
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSettingsManagement;
