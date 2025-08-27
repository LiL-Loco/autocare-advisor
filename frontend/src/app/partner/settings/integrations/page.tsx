'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  AlertCircle,
  BarChart3,
  Check,
  CreditCard,
  Database,
  ExternalLink,
  Key,
  Mail,
  Plug,
  Plus,
  RefreshCw,
  Settings,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category:
    | 'analytics'
    | 'communication'
    | 'payment'
    | 'crm'
    | 'storage'
    | 'other';
  provider: string;
  isConnected: boolean;
  isActive: boolean;
  connectedAt?: Date;
  lastSync?: Date;
  permissions: string[];
  webhookUrl?: string;
  apiKey?: string;
  config: { [key: string]: any };
  status: 'active' | 'error' | 'syncing' | 'disconnected';
  icon: string;
}

interface AvailableIntegration {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  features: string[];
  pricing: string;
  isPopular?: boolean;
  icon: string;
}

const SettingsIntegrationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  const connectedIntegrations: Integration[] = [
    {
      id: '1',
      name: 'Google Analytics',
      description: 'Web-Analytics und Tracking',
      category: 'analytics',
      provider: 'Google',
      isConnected: true,
      isActive: true,
      connectedAt: new Date('2024-01-15'),
      lastSync: new Date(),
      permissions: ['analytics:read', 'reports:generate'],
      config: {
        propertyId: 'GA4-XXXXXXX',
        trackingId: 'G-XXXXXXXXX',
      },
      status: 'active',
      icon: 'analytics',
    },
    {
      id: '2',
      name: 'Mailchimp',
      description: 'E-Mail Marketing und Automation',
      category: 'communication',
      provider: 'Mailchimp',
      isConnected: true,
      isActive: true,
      connectedAt: new Date('2024-01-20'),
      lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      permissions: ['lists:read', 'campaigns:create', 'campaigns:send'],
      apiKey: 'mc_***********************',
      config: {
        listId: 'abc123def456',
        audienceId: '789xyz',
      },
      status: 'active',
      icon: 'mail',
    },
    {
      id: '3',
      name: 'Stripe',
      description: 'Zahlungsabwicklung',
      category: 'payment',
      provider: 'Stripe',
      isConnected: true,
      isActive: false,
      connectedAt: new Date('2024-02-01'),
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      permissions: ['payments:process', 'customers:manage'],
      webhookUrl: 'https://api.autocare.com/webhooks/stripe',
      config: {
        publishableKey: 'pk_test_***************',
        webhookSecret: 'whsec_***************',
      },
      status: 'error',
      icon: 'credit-card',
    },
    {
      id: '4',
      name: 'Salesforce',
      description: 'CRM und Kundenverwaltung',
      category: 'crm',
      provider: 'Salesforce',
      isConnected: true,
      isActive: true,
      connectedAt: new Date('2024-02-10'),
      lastSync: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      permissions: ['contacts:read', 'contacts:write', 'opportunities:read'],
      config: {
        instanceUrl: 'https://company.lightning.force.com',
        apiVersion: '58.0',
      },
      status: 'syncing',
      icon: 'users',
    },
  ];

  const availableIntegrations: AvailableIntegration[] = [
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automatisierung zwischen 1000+ Apps',
      category: 'automation',
      provider: 'Zapier',
      features: [
        'Workflow-Automation',
        'Multi-App-Integration',
        'Trigger & Aktionen',
      ],
      pricing: 'Kostenlos - €50/Monat',
      isPopular: true,
      icon: 'zap',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing, Sales & Service Hub',
      category: 'crm',
      provider: 'HubSpot',
      features: ['Contact Management', 'Email Marketing', 'Sales Pipeline'],
      pricing: 'Kostenlos - €1200/Monat',
      isPopular: true,
      icon: 'users',
    },
    {
      id: 'aws-s3',
      name: 'Amazon S3',
      description: 'Cloud-Speicher und Backup',
      category: 'storage',
      provider: 'Amazon',
      features: ['File Storage', 'Backup', 'CDN Integration'],
      pricing: '€0.02/GB/Monat',
      icon: 'cloud',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team-Kommunikation und Alerts',
      category: 'communication',
      provider: 'Slack',
      features: ['Team Messaging', 'Notifications', 'File Sharing'],
      pricing: 'Kostenlos - €12/User/Monat',
      icon: 'message-square',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Aktiv
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Fehler
          </Badge>
        );
      case 'syncing':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 mr-1" />
            Synchronisiert
          </Badge>
        );
      case 'disconnected':
        return <Badge variant="outline">Getrennt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />;
      case 'communication':
        return <Mail className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'crm':
        return <Users className="h-4 w-4" />;
      case 'storage':
        return <Database className="h-4 w-4" />;
      case 'automation':
        return <Zap className="h-4 w-4" />;
      default:
        return <Plug className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'analytics':
        return 'Analytics';
      case 'communication':
        return 'Kommunikation';
      case 'payment':
        return 'Zahlung';
      case 'crm':
        return 'CRM';
      case 'storage':
        return 'Speicher';
      case 'automation':
        return 'Automation';
      default:
        return 'Sonstige';
    }
  };

  const handleToggleIntegration = (integrationId: string) => {
    console.log('Toggle integration:', integrationId);
    // Hier würde die API-Logik implementiert
  };

  const handleDisconnectIntegration = (integrationId: string) => {
    console.log('Disconnect integration:', integrationId);
    // Hier würde die API-Logik implementiert
  };

  const handleSyncIntegration = (integrationId: string) => {
    console.log('Sync integration:', integrationId);
    // Hier würde die API-Logik implementiert
  };

  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigDialog(true);
  };

  const filteredIntegrations =
    selectedCategory === 'all'
      ? connectedIntegrations
      : connectedIntegrations.filter(
          (integration) => integration.category === selectedCategory
        );

  const categories = [
    {
      value: 'all',
      label: 'Alle Kategorien',
      icon: <Plug className="h-4 w-4" />,
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      value: 'communication',
      label: 'Kommunikation',
      icon: <Mail className="h-4 w-4" />,
    },
    {
      value: 'payment',
      label: 'Zahlung',
      icon: <CreditCard className="h-4 w-4" />,
    },
    { value: 'crm', label: 'CRM', icon: <Users className="h-4 w-4" /> },
    {
      value: 'storage',
      label: 'Speicher',
      icon: <Database className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrationen</h1>
          <p className="text-gray-600 mt-1">
            Verbinden Sie AutoCare mit Ihren Lieblings-Tools
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Integration hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neue Integration hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableIntegrations.map((integration) => (
                <Card key={integration.id} className="relative">
                  {integration.isPopular && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-orange-500 text-white">
                        Beliebt
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(integration.category)}
                      <div>
                        <CardTitle className="text-lg">
                          {integration.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {integration.provider}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      {integration.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {integration.pricing}
                      </span>
                      <Button size="sm">Verbinden</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Schließen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={
              selectedCategory === category.value ? 'default' : 'outline'
            }
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.label}
          </Button>
        ))}
      </div>

      {/* Connected Integrations */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getCategoryIcon(integration.category)}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {integration.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      von {integration.provider}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(integration.status)}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={integration.isActive}
                      onCheckedChange={() =>
                        handleToggleIntegration(integration.id)
                      }
                    />
                    <span className="text-sm">
                      {integration.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Integration Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600">Kategorie</p>
                  <p className="font-medium flex items-center gap-1">
                    {getCategoryIcon(integration.category)}
                    {getCategoryLabel(integration.category)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Verbunden seit</p>
                  <p className="font-medium">
                    {integration.connectedAt
                      ? format(integration.connectedAt, 'dd.MM.yyyy', {
                          locale: de,
                        })
                      : 'Nicht verbunden'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Letzte Synchronisation</p>
                  <p className="font-medium">
                    {integration.lastSync
                      ? format(integration.lastSync, 'HH:mm', { locale: de })
                      : 'Nie'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Berechtigungen</p>
                  <p className="font-medium">
                    {integration.permissions.length} Rechte
                  </p>
                </div>
              </div>

              {/* Error Messages */}
              {integration.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Verbindungsfehler</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Die API-Schlüssel sind abgelaufen. Bitte erneuern Sie die
                    Verbindung.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncIntegration(integration.id)}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Synchronisieren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigureIntegration(integration)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Konfigurieren
                  </Button>
                  {integration.webhookUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Webhook testen
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnectIntegration(integration.id)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Trennen
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredIntegrations.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Plug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedCategory === 'all'
                  ? 'Keine Integrationen verbunden'
                  : `Keine ${getCategoryLabel(selectedCategory)}-Integrationen`}
              </h3>
              <p className="text-gray-600 mb-4">
                Verbinden Sie AutoCare mit Ihren bevorzugten Tools und Services.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Erste Integration hinzufügen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedIntegration?.name} konfigurieren</DialogTitle>
          </DialogHeader>

          {selectedIntegration && (
            <div className="space-y-4">
              {/* API Key Configuration */}
              {selectedIntegration.apiKey && (
                <div className="space-y-2">
                  <Label>API-Schlüssel</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={selectedIntegration.apiKey}
                      type="password"
                      readOnly
                    />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Webhook URL */}
              {selectedIntegration.webhookUrl && (
                <div className="space-y-2">
                  <Label>Webhook-URL</Label>
                  <Input value={selectedIntegration.webhookUrl} readOnly />
                </div>
              )}

              {/* Permissions */}
              <div className="space-y-2">
                <Label>Berechtigungen</Label>
                <div className="space-y-2">
                  {selectedIntegration.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Settings */}
              <div className="space-y-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Synchronisation</Label>
                    <p className="text-sm text-gray-600">
                      Daten automatisch synchronisieren
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfigDialog(false)}
            >
              Abbrechen
            </Button>
            <Button>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsIntegrationsPage;
