'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import {
  Download,
  Edit,
  Eye,
  Filter,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'oauth' | 'api' | 'webhook' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync?: string;
  logoUrl?: string;
  categories: string[];
  health: {
    uptime: number;
    lastError?: string;
    lastChecked: string;
  };
  configuration: {
    clientId?: string;
    clientSecret?: string;
    apiKey?: string;
    webhookUrl?: string;
    customSettings?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Salesforce',
    description: 'CRM-Integration für Kunden- und Leadmanagement',
    type: 'oauth',
    status: 'connected',
    lastSync: '2025-08-26T14:23:45Z',
    logoUrl:
      'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/salesforce.svg',
    categories: ['crm', 'customer'],
    health: {
      uptime: 99.98,
      lastChecked: '2025-08-27T09:00:00Z',
    },
    configuration: {
      clientId: 'sf-client-123',
      clientSecret: 'sf-secret-456',
    },
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-08-26T14:23:45Z',
  },
  {
    id: '2',
    name: 'Google Analytics',
    description: 'Integration für Website- und Kampagnen-Tracking',
    type: 'oauth',
    status: 'connected',
    lastSync: '2025-08-27T08:45:00Z',
    logoUrl:
      'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googleanalytics.svg',
    categories: ['analytics', 'marketing'],
    health: {
      uptime: 99.92,
      lastChecked: '2025-08-27T09:00:00Z',
    },
    configuration: {
      clientId: 'ga-client-789',
      clientSecret: 'ga-secret-012',
    },
    createdAt: '2025-08-10T12:00:00Z',
    updatedAt: '2025-08-27T08:45:00Z',
  },
  {
    id: '3',
    name: 'Mailchimp',
    description: 'E-Mail-Marketing und Newsletter-Integration',
    type: 'api',
    status: 'disconnected',
    lastSync: '2025-08-20T11:30:00Z',
    logoUrl:
      'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mailchimp.svg',
    categories: ['marketing', 'email'],
    health: {
      uptime: 97.85,
      lastError: 'API-Key ungültig',
      lastChecked: '2025-08-27T09:00:00Z',
    },
    configuration: {
      apiKey: 'mc-key-345',
    },
    createdAt: '2025-08-15T09:00:00Z',
    updatedAt: '2025-08-20T11:30:00Z',
  },
  {
    id: '4',
    name: 'Slack',
    description: 'Benachrichtigungen und Team-Kommunikation',
    type: 'webhook',
    status: 'pending',
    lastSync: undefined,
    logoUrl:
      'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg',
    categories: ['communication', 'notification'],
    health: {
      uptime: 100.0,
      lastChecked: '2025-08-27T09:00:00Z',
    },
    configuration: {
      webhookUrl: 'https://hooks.slack.com/services/abc/xyz',
    },
    createdAt: '2025-08-25T16:00:00Z',
    updatedAt: '2025-08-25T16:00:00Z',
  },
];

export default function ApiIntegrationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/partner/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredIntegrations = mockIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || integration.status === statusFilter;
    const matchesType = typeFilter === 'all' || integration.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      connected: 'bg-green-100 text-green-800',
      disconnected: 'bg-red-100 text-red-800',
      error: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      connected: 'Verbunden',
      disconnected: 'Getrennt',
      error: 'Fehler',
      pending: 'Ausstehend',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      oauth: 'OAuth',
      api: 'API-Key',
      webhook: 'Webhook',
      custom: 'Benutzerdefiniert',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
    <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Integrationen werden geladen...
            </p>
          </div>
        </div>
  );
  }

  return (
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              API-Integrationen
            </h1>
            <p className="text-gray-600 mt-1">
              Verwalten Sie Ihre Drittanbieter-Integrationen und
              OAuth-Verbindungen
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              Aktualisieren
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Integrations-Guide
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Neue Integration
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Integrationen suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="connected">Verbunden</SelectItem>
                  <SelectItem value="disconnected">Getrennt</SelectItem>
                  <SelectItem value="error">Fehler</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                  <SelectItem value="api">API-Key</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Integrations List */}
        <Card>
          <CardHeader>
            <CardTitle>Integrationen ({filteredIntegrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Integration</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Letzter Sync</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIntegrations.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {integration.logoUrl && (
                          <img
                            src={integration.logoUrl}
                            alt={integration.name}
                            className="h-6 w-6 rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-xs text-gray-600">
                            {integration.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTypeLabel(integration.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(integration.status)}
                        variant="secondary"
                      >
                        {getStatusLabel(integration.status)}
                      </Badge>
                      {integration.health.lastError && (
                        <div className="text-xs text-red-600 mt-1">
                          {integration.health.lastError}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {integration.lastSync
                          ? new Date(integration.lastSync).toLocaleString(
                              'de-DE'
                            )
                          : '—'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {integration.health.uptime.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip content="Details anzeigen">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedIntegration(integration)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Bearbeiten">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Löschen">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredIntegrations.length === 0 && (
              <div className="text-center py-8">
                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Keine Integrationen gefunden
                </h3>
                <p className="text-gray-500">
                  Erstellen Sie eine neue Integration oder passen Sie Ihre
                  Filter an.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Integration Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedIntegration.logoUrl && (
                      <img
                        src={selectedIntegration.logoUrl}
                        alt={selectedIntegration.name}
                        className="h-8 w-8 rounded"
                      />
                    )}
                    <h2 className="text-xl font-bold">
                      {selectedIntegration.name}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedIntegration(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Beschreibung</h3>
                  <p className="text-gray-600">
                    {selectedIntegration.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Typ</h3>
                  <Badge variant="outline">
                    {getTypeLabel(selectedIntegration.type)}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Badge
                    className={getStatusColor(selectedIntegration.status)}
                    variant="secondary"
                  >
                    {getStatusLabel(selectedIntegration.status)}
                  </Badge>
                  {selectedIntegration.health.lastError && (
                    <div className="text-xs text-red-600 mt-1">
                      {selectedIntegration.health.lastError}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Letzter Sync</h3>
                  <div className="text-xs">
                    {selectedIntegration.lastSync
                      ? new Date(selectedIntegration.lastSync).toLocaleString(
                          'de-DE'
                        )
                      : '—'}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Uptime</h3>
                  <div className="text-xs">
                    {selectedIntegration.health.uptime.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Konfiguration</h3>
                  <div className="bg-gray-50 p-4 rounded text-xs font-mono">
                    {JSON.stringify(selectedIntegration.configuration, null, 2)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Kategorien</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedIntegration.categories.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Erstellt</h3>
                  <div className="text-xs">
                    {new Date(selectedIntegration.createdAt).toLocaleString(
                      'de-DE'
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Zuletzt aktualisiert</h3>
                  <div className="text-xs">
                    {new Date(selectedIntegration.updatedAt).toLocaleString(
                      'de-DE'
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
}


