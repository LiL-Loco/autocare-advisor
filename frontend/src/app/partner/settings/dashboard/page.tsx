'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  BarChart3,
  Calendar,
  Eye,
  EyeOff,
  Globe,
  Grid,
  Layout,
  List,
  Monitor,
  Moon,
  Palette,
  RefreshCw,
  Save,
  Settings,
  ShoppingCart,
  Sun,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface DashboardSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  dashboardLayout: 'grid' | 'list';
  defaultView: 'analytics' | 'products' | 'customers' | 'orders';
  refreshInterval: number;
  compactMode: boolean;
  showWelcomeMessage: boolean;
  enableAnimations: boolean;
  enableNotifications: boolean;
  autoSave: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
}

interface WidgetSettings {
  analytics: {
    enabled: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
  };
  recentOrders: {
    enabled: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
  };
  topProducts: {
    enabled: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
  };
  customerActivity: {
    enabled: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
  };
  revenueChart: {
    enabled: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
  };
  quickStats: {
    enabled: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
  };
}

const SettingsDashboardPage = () => {
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>(
    {
      theme: 'light',
      language: 'de',
      timezone: 'Europe/Berlin',
      dateFormat: 'DD.MM.YYYY',
      currency: 'EUR',
      dashboardLayout: 'grid',
      defaultView: 'analytics',
      refreshInterval: 30,
      compactMode: false,
      showWelcomeMessage: true,
      enableAnimations: true,
      enableNotifications: true,
      autoSave: true,
    }
  );

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      securityAlerts: true,
      systemUpdates: true,
      orderNotifications: true,
      lowStockAlerts: true,
    });

  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>({
    analytics: { enabled: true, position: 1, size: 'large' },
    recentOrders: { enabled: true, position: 2, size: 'medium' },
    topProducts: { enabled: true, position: 3, size: 'medium' },
    customerActivity: { enabled: true, position: 4, size: 'small' },
    revenueChart: { enabled: true, position: 5, size: 'large' },
    quickStats: { enabled: true, position: 6, size: 'small' },
  });

  const [showPreview, setShowPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleDashboardSettingChange = (
    key: keyof DashboardSettings,
    value: any
  ) => {
    setDashboardSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleNotificationSettingChange = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleWidgetSettingChange = (
    widget: keyof WidgetSettings,
    property: string,
    value: any
  ) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [widget]: { ...prev[widget], [property]: value },
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    console.log('Saving dashboard settings...', {
      dashboardSettings,
      notificationSettings,
      widgetSettings,
    });
    setHasChanges(false);
    // Hier würde die API-Logik implementiert
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setDashboardSettings({
      theme: 'light',
      language: 'de',
      timezone: 'Europe/Berlin',
      dateFormat: 'DD.MM.YYYY',
      currency: 'EUR',
      dashboardLayout: 'grid',
      defaultView: 'analytics',
      refreshInterval: 30,
      compactMode: false,
      showWelcomeMessage: true,
      enableAnimations: true,
      enableNotifications: true,
      autoSave: true,
    });
    setHasChanges(true);
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const languages = [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
    { value: 'it', label: 'Italiano' },
  ];

  const timezones = [
    { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' },
    { value: 'Europe/Vienna', label: 'Wien (UTC+1)' },
    { value: 'Europe/Zurich', label: 'Zürich (UTC+1)' },
    { value: 'UTC', label: 'UTC (UTC+0)' },
    { value: 'America/New_York', label: 'New York (UTC-5)' },
  ];

  const dateFormats = [
    { value: 'DD.MM.YYYY', label: '31.12.2024 (DD.MM.YYYY)' },
    { value: 'MM/DD/YYYY', label: '12/31/2024 (MM/DD/YYYY)' },
    { value: 'YYYY-MM-DD', label: '2024-12-31 (YYYY-MM-DD)' },
    { value: 'DD/MM/YYYY', label: '31/12/2024 (DD/MM/YYYY)' },
  ];

  const refreshIntervals = [
    { value: 15, label: '15 Sekunden' },
    { value: 30, label: '30 Sekunden' },
    { value: 60, label: '1 Minute' },
    { value: 300, label: '5 Minuten' },
    { value: 900, label: '15 Minuten' },
    { value: 0, label: 'Manuell' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard-Einstellungen
          </h1>
          <p className="text-gray-600 mt-1">
            Personalisieren Sie Ihr Dashboard und Ihre Arbeitsumgebung
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showPreview ? 'Vorschau ausblenden' : 'Vorschau anzeigen'}
          </Button>
          {hasChanges && (
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200"
            >
              Ungespeicherte Änderungen
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Darstellung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-2">
              <Label>Design-Theme</Label>
              <Select
                value={dashboardSettings.theme}
                onValueChange={(value: any) =>
                  handleDashboardSettingChange('theme', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Hell
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dunkel
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dashboard Layout */}
            <div className="space-y-2">
              <Label>Dashboard-Layout</Label>
              <Select
                value={dashboardSettings.dashboardLayout}
                onValueChange={(value: any) =>
                  handleDashboardSettingChange('dashboardLayout', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">
                    <div className="flex items-center gap-2">
                      <Grid className="h-4 w-4" />
                      Raster-Ansicht
                    </div>
                  </SelectItem>
                  <SelectItem value="list">
                    <div className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Listen-Ansicht
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Default View */}
            <div className="space-y-2">
              <Label>Standard-Startseite</Label>
              <Select
                value={dashboardSettings.defaultView}
                onValueChange={(value: any) =>
                  handleDashboardSettingChange('defaultView', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analytik
                    </div>
                  </SelectItem>
                  <SelectItem value="products">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Produkte
                    </div>
                  </SelectItem>
                  <SelectItem value="customers">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Kunden
                    </div>
                  </SelectItem>
                  <SelectItem value="orders">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Bestellungen
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Display Options */}
            <div className="space-y-4">
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Kompakte Ansicht</Label>
                    <p className="text-sm text-gray-600">
                      Weniger Abstände für mehr Inhalt
                    </p>
                  </div>
                  <Switch
                    checked={dashboardSettings.compactMode}
                    onCheckedChange={(value) =>
                      handleDashboardSettingChange('compactMode', value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Willkommensnachricht</Label>
                    <p className="text-sm text-gray-600">
                      Begrüßung beim Dashboard-Besuch
                    </p>
                  </div>
                  <Switch
                    checked={dashboardSettings.showWelcomeMessage}
                    onCheckedChange={(value) =>
                      handleDashboardSettingChange('showWelcomeMessage', value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animationen aktivieren</Label>
                    <p className="text-sm text-gray-600">
                      Smooth Transitions und Hover-Effekte
                    </p>
                  </div>
                  <Switch
                    checked={dashboardSettings.enableAnimations}
                    onCheckedChange={(value) =>
                      handleDashboardSettingChange('enableAnimations', value)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Region & Sprache
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language */}
            <div className="space-y-2">
              <Label>Sprache</Label>
              <Select
                value={dashboardSettings.language}
                onValueChange={(value) =>
                  handleDashboardSettingChange('language', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label>Zeitzone</Label>
              <Select
                value={dashboardSettings.timezone}
                onValueChange={(value) =>
                  handleDashboardSettingChange('timezone', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div className="space-y-2">
              <Label>Datumsformat</Label>
              <Select
                value={dashboardSettings.dateFormat}
                onValueChange={(value) =>
                  handleDashboardSettingChange('dateFormat', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Währung</Label>
              <Select
                value={dashboardSettings.currency}
                onValueChange={(value) =>
                  handleDashboardSettingChange('currency', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">US-Dollar ($)</SelectItem>
                  <SelectItem value="CHF">Schweizer Franken (CHF)</SelectItem>
                  <SelectItem value="GBP">Britisches Pfund (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System-Einstellungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Refresh Interval */}
            <div className="space-y-2">
              <Label>Auto-Aktualisierung</Label>
              <Select
                value={dashboardSettings.refreshInterval.toString()}
                onValueChange={(value) =>
                  handleDashboardSettingChange(
                    'refreshInterval',
                    parseInt(value)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {refreshIntervals.map((interval) => (
                    <SelectItem
                      key={interval.value}
                      value={interval.value.toString()}
                    >
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                Wie oft sollen die Dashboard-Daten aktualisiert werden?
              </p>
            </div>

            <Separator />

            {/* System Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatisches Speichern</Label>
                  <p className="text-sm text-gray-600">
                    Änderungen automatisch speichern
                  </p>
                </div>
                <Switch
                  checked={dashboardSettings.autoSave}
                  onCheckedChange={(value) =>
                    handleDashboardSettingChange('autoSave', value)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Desktop-Benachrichtigungen</Label>
                  <p className="text-sm text-gray-600">
                    Browser-Notifications aktivieren
                  </p>
                </div>
                <Switch
                  checked={dashboardSettings.enableNotifications}
                  onCheckedChange={(value) =>
                    handleDashboardSettingChange('enableNotifications', value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Widget Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Widget-Konfiguration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(widgetSettings).map(([key, widget]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={widget.enabled}
                      onCheckedChange={(value) =>
                        handleWidgetSettingChange(
                          key as keyof WidgetSettings,
                          'enabled',
                          value
                        )
                      }
                    />
                    <div>
                      <Label className="capitalize">
                        {key === 'analytics' && 'Analytik-Übersicht'}
                        {key === 'recentOrders' && 'Aktuelle Bestellungen'}
                        {key === 'topProducts' && 'Top-Produkte'}
                        {key === 'customerActivity' && 'Kunden-Aktivität'}
                        {key === 'revenueChart' && 'Umsatz-Diagramm'}
                        {key === 'quickStats' && 'Schnell-Statistiken'}
                      </Label>
                      <p className="text-sm text-gray-600">
                        Position: {widget.position}
                      </p>
                    </div>
                  </div>
                  <Select
                    value={widget.size}
                    onValueChange={(value) =>
                      handleWidgetSettingChange(
                        key as keyof WidgetSettings,
                        'size',
                        value
                      )
                    }
                    disabled={!widget.enabled}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Klein</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="large">Groß</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white p-4 border-t sticky bottom-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Zurücksetzen
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {hasChanges && (
            <p className="text-sm text-orange-600">
              Sie haben ungespeicherte Änderungen
            </p>
          )}
          <Button
            onClick={handleSaveSettings}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Einstellungen speichern
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboardPage;
