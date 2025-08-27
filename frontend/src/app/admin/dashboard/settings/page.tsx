'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Activity,
  Bell,
  CheckCircle,
  Database,
  Edit,
  Eye,
  Globe,
  Key,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Timer,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    twoFactorRequired: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    allowedIpAddresses: string[];
    sslEnabled: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    adminNotifications: {
      newUsers: boolean;
      newOrders: boolean;
      systemErrors: boolean;
      securityAlerts: boolean;
    };
    userNotifications: {
      orderUpdates: boolean;
      newsletters: boolean;
      promotions: boolean;
    };
  };
  api: {
    rateLimit: number;
    allowedOrigins: string[];
    webhookUrl: string;
    apiKeysCount: number;
  };
  database: {
    connectionStatus: 'connected' | 'disconnected' | 'error';
    lastBackup: string;
    nextBackup: string;
    autoBackup: boolean;
    backupRetention: number;
  };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );
  const [newApiKey, setNewApiKey] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchAdminUsers();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // Simulierte Settings-Daten
      const mockSettings: SystemSettings = {
        general: {
          siteName: 'AutoCare Advisor',
          siteDescription: 'Professional B2B Autopflegemittel Platform',
          siteUrl: 'https://autocare-advisor.com',
          adminEmail: 'admin@autocare-advisor.com',
          timezone: 'Europe/Berlin',
          language: 'de',
          maintenanceMode: false,
        },
        security: {
          twoFactorRequired: true,
          passwordMinLength: 8,
          sessionTimeout: 1440,
          maxLoginAttempts: 5,
          allowedIpAddresses: ['192.168.1.0/24', '10.0.0.0/8'],
          sslEnabled: true,
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          adminNotifications: {
            newUsers: true,
            newOrders: true,
            systemErrors: true,
            securityAlerts: true,
          },
          userNotifications: {
            orderUpdates: true,
            newsletters: true,
            promotions: false,
          },
        },
        api: {
          rateLimit: 1000,
          allowedOrigins: [
            'https://app.autocare-advisor.com',
            'https://partner.autocare-advisor.com',
          ],
          webhookUrl: 'https://api.autocare-advisor.com/webhooks',
          apiKeysCount: 3,
        },
        database: {
          connectionStatus: 'connected',
          lastBackup: new Date(Date.now() - 86400000).toISOString(),
          nextBackup: new Date(Date.now() + 86400000).toISOString(),
          autoBackup: true,
          backupRetention: 30,
        },
      };

      setSettings(mockSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      // Simulierte Admin-User-Daten
      const mockUsers: AdminUser[] = [
        {
          id: '1',
          name: 'Super Admin',
          email: 'superadmin@autocare.com',
          role: 'super_admin',
          status: 'active',
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          permissions: ['all'],
        },
        {
          id: '2',
          name: 'John Smith',
          email: 'john@autocare.com',
          role: 'admin',
          status: 'active',
          lastLogin: new Date(Date.now() - 7200000).toISOString(),
          permissions: ['users', 'products', 'orders', 'reports'],
        },
        {
          id: '3',
          name: 'Sarah Wilson',
          email: 'sarah@autocare.com',
          role: 'moderator',
          status: 'active',
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          permissions: ['moderation', 'reports'],
        },
      ];

      setAdminUsers(mockUsers);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // Implement settings save logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      console.log('Starting database backup...');
      // Implement backup logic
    } catch (err) {
      console.error('Error backing up database:', err);
    }
  };

  const generateApiKey = () => {
    const key =
      'ak_' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setNewApiKey(key);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleColor = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Settings
            </h1>
            <p className="text-gray-600">
              Manage platform configuration and administrative settings
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchSettings}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API & Integration</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="users">Admin Users</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Site Configuration
                </CardTitle>
                <CardDescription>
                  Basic site settings and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Site Name
                    </label>
                    <Input
                      value={settings.general.siteName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            siteName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Admin Email
                    </label>
                    <Input
                      type="email"
                      value={settings.general.adminEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            adminEmail: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Site Description
                    </label>
                    <Textarea
                      value={settings.general.siteDescription}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            siteDescription: e.target.value,
                          },
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Site URL
                    </label>
                    <Input
                      value={settings.general.siteUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            siteUrl: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Timezone
                    </label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, timezone: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Berlin">
                          Europe/Berlin
                        </SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          America/New_York
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-gray-600">
                      Put the site in maintenance mode
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          maintenanceMode: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure authentication and security policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">
                      Two-Factor Authentication Required
                    </p>
                    <p className="text-sm text-gray-600">
                      Require 2FA for all admin users
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorRequired}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          twoFactorRequired: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Minimum Password Length
                    </label>
                    <Input
                      type="number"
                      min="6"
                      max="50"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            passwordMinLength: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Session Timeout (minutes)
                    </label>
                    <Input
                      type="number"
                      min="15"
                      max="2880"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            sessionTimeout: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Max Login Attempts
                    </label>
                    <Input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            maxLoginAttempts: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Allowed IP Addresses
                  </label>
                  <Textarea
                    placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                    value={settings.security.allowedIpAddresses.join('\n')}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          allowedIpAddresses: e.target.value
                            .split('\n')
                            .filter((ip) => ip.trim()),
                        },
                      })
                    }
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    One IP address or CIDR block per line
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Admin Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure notifications for administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(
                    settings.notifications.adminNotifications
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Get notified about {key.toLowerCase()}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              adminNotifications: {
                                ...settings.notifications.adminNotifications,
                                [key]: e.target.checked,
                              },
                            },
                          })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    User Notifications
                  </CardTitle>
                  <CardDescription>
                    Default notification settings for users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.notifications.userNotifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Default setting for {key.toLowerCase()}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                userNotifications: {
                                  ...settings.notifications.userNotifications,
                                  [key]: e.target.checked,
                                },
                              },
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Manage API settings and integration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Rate Limit (requests/hour)
                    </label>
                    <Input
                      type="number"
                      min="100"
                      max="10000"
                      value={settings.api.rateLimit}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          api: {
                            ...settings.api,
                            rateLimit: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Active API Keys
                    </label>
                    <div className="flex items-center gap-2">
                      <Input value={settings.api.apiKeysCount} disabled />
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Allowed Origins
                  </label>
                  <Textarea
                    placeholder="https://app.example.com&#10;https://api.example.com"
                    value={settings.api.allowedOrigins.join('\n')}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        api: {
                          ...settings.api,
                          allowedOrigins: e.target.value
                            .split('\n')
                            .filter((origin) => origin.trim()),
                        },
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Webhook URL
                  </label>
                  <Input
                    value={settings.api.webhookUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        api: { ...settings.api, webhookUrl: e.target.value },
                      })
                    }
                    placeholder="https://your-webhook-url.com/webhook"
                  />
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Generate New API Key</h4>
                    <Button onClick={generateApiKey}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  {newApiKey && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Input
                          value={newApiKey}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-orange-600 mt-2">
                        ⚠️ Save this key securely - it won't be shown again!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
                <CardDescription>
                  Database status, backups, and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700">
                      Database Connected
                    </p>
                    <p className="text-sm text-green-600">
                      All systems operational
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="font-medium text-blue-700">Last Backup</p>
                    <p className="text-sm text-blue-600">
                      {formatDate(settings.database.lastBackup)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Timer className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="font-medium text-purple-700">Next Backup</p>
                    <p className="text-sm text-purple-600">
                      {formatDate(settings.database.nextBackup)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Backup Settings</h4>
                      <p className="text-sm text-gray-600">
                        Configure automatic database backups
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.database.autoBackup}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          database: {
                            ...settings.database,
                            autoBackup: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Backup Retention (days)
                      </label>
                      <Input
                        type="number"
                        min="7"
                        max="365"
                        value={settings.database.backupRetention}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            database: {
                              ...settings.database,
                              backupRetention: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleBackupDatabase} className="w-full">
                        <Database className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Admin Users
                    </CardTitle>
                    <CardDescription>
                      Manage administrator accounts and permissions
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Last login: {formatDate(user.lastLogin)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge
                          variant={
                            user.status === 'active' ? 'default' : 'secondary'
                          }
                        >
                          {user.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.role !== 'super_admin' && (
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
