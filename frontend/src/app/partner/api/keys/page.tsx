'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import { Tooltip } from '@/components/ui/tooltip';
import {
  BarChart3,
  Clock,
  Code,
  Copy,
  Download,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Key,
  Lock,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  Trash2,
  Unlock,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EnhancedMetricCard } from '../../../../components/partner/analytics/AdvancedCharts';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface ApiKey {
  id: string;
  name: string;
  description: string;
  key: string;
  keyVisible: boolean;
  environment: 'production' | 'staging' | 'development';
  permissions: string[];
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    lastUsed: string;
    averageResponseTime: number;
  };
  restrictions: {
    ipWhitelist: string[];
    allowedDomains: string[];
    timeRestrictions: {
      enabled: boolean;
      allowedHours: string[];
    };
  };
  status: 'active' | 'inactive' | 'revoked' | 'expired';
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
}

export default function ApiKeysPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

  // Form state
  const [keyForm, setKeyForm] = useState({
    name: '',
    description: '',
    environment: 'development' as ApiKey['environment'],
    permissions: [] as string[],
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
    },
    restrictions: {
      ipWhitelist: [] as string[],
      allowedDomains: [] as string[],
      timeRestrictions: {
        enabled: false,
        allowedHours: [] as string[],
      },
    },
    expiresAt: '',
  });

  // Mock API keys data
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      description: 'Hauptschlüssel für Produktionsumgebung',
      key: 'ak_live_1234567890abcdef1234567890abcdef',
      keyVisible: false,
      environment: 'production',
      permissions: [
        'read:products',
        'read:orders',
        'write:orders',
        'read:customers',
      ],
      rateLimits: {
        requestsPerMinute: 1000,
        requestsPerHour: 50000,
        requestsPerDay: 500000,
      },
      usage: {
        totalRequests: 2847392,
        successfulRequests: 2834567,
        failedRequests: 12825,
        lastUsed: '2024-01-20T14:23:45Z',
        averageResponseTime: 245,
      },
      restrictions: {
        ipWhitelist: ['203.0.113.0/24', '198.51.100.0/24'],
        allowedDomains: ['autocare.de', 'api.autocare.de'],
        timeRestrictions: {
          enabled: false,
          allowedHours: [],
        },
      },
      status: 'active',
      createdAt: '2023-12-01T10:00:00Z',
      createdBy: 'admin@autocare.de',
    },
    {
      id: '2',
      name: 'Staging API Key',
      description: 'Entwicklungsschlüssel für Tests und Integration',
      key: 'ak_test_abcdef1234567890abcdef1234567890',
      keyVisible: false,
      environment: 'staging',
      permissions: [
        'read:products',
        'write:products',
        'read:orders',
        'write:orders',
        'read:customers',
        'write:customers',
      ],
      rateLimits: {
        requestsPerMinute: 500,
        requestsPerHour: 10000,
        requestsPerDay: 100000,
      },
      usage: {
        totalRequests: 156743,
        successfulRequests: 154892,
        failedRequests: 1851,
        lastUsed: '2024-01-20T13:45:22Z',
        averageResponseTime: 189,
      },
      restrictions: {
        ipWhitelist: ['192.168.1.0/24'],
        allowedDomains: ['staging.autocare.de', 'dev.autocare.de'],
        timeRestrictions: {
          enabled: true,
          allowedHours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        },
      },
      status: 'active',
      createdAt: '2024-01-05T14:30:00Z',
      createdBy: 'dev@autocare.de',
    },
    {
      id: '3',
      name: 'Mobile App Key',
      description: 'Schlüssel für mobile Anwendung',
      key: 'ak_mobile_567890abcdef1234567890abcdef12',
      keyVisible: false,
      environment: 'production',
      permissions: ['read:products', 'read:orders', 'write:orders'],
      rateLimits: {
        requestsPerMinute: 200,
        requestsPerHour: 5000,
        requestsPerDay: 50000,
      },
      usage: {
        totalRequests: 89234,
        successfulRequests: 87456,
        failedRequests: 1778,
        lastUsed: '2024-01-20T12:15:33Z',
        averageResponseTime: 334,
      },
      restrictions: {
        ipWhitelist: [],
        allowedDomains: ['app.autocare.de'],
        timeRestrictions: {
          enabled: false,
          allowedHours: [],
        },
      },
      status: 'active',
      expiresAt: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-10T09:15:00Z',
      createdBy: 'mobile@autocare.de',
    },
    {
      id: '4',
      name: 'Legacy Integration',
      description: 'Veralteter Schlüssel für Legacy-System',
      key: 'ak_legacy_abcdef567890123456789abcdef123',
      keyVisible: false,
      environment: 'production',
      permissions: ['read:products', 'read:orders'],
      rateLimits: {
        requestsPerMinute: 50,
        requestsPerHour: 1000,
        requestsPerDay: 5000,
      },
      usage: {
        totalRequests: 23456,
        successfulRequests: 22891,
        failedRequests: 565,
        lastUsed: '2024-01-18T08:30:15Z',
        averageResponseTime: 567,
      },
      restrictions: {
        ipWhitelist: ['203.0.113.100'],
        allowedDomains: ['legacy.autocare.de'],
        timeRestrictions: {
          enabled: false,
          allowedHours: [],
        },
      },
      status: 'inactive',
      expiresAt: '2024-03-31T23:59:59Z',
      createdAt: '2023-10-15T16:45:00Z',
      createdBy: 'legacy@autocare.de',
    },
  ]);

  const availablePermissions = [
    {
      id: 'read:products',
      label: 'Produkte lesen',
      description: 'Produktdaten abrufen',
    },
    {
      id: 'write:products',
      label: 'Produkte schreiben',
      description: 'Produktdaten ändern',
    },
    {
      id: 'read:orders',
      label: 'Bestellungen lesen',
      description: 'Bestelldaten abrufen',
    },
    {
      id: 'write:orders',
      label: 'Bestellungen schreiben',
      description: 'Bestellungen erstellen/ändern',
    },
    {
      id: 'read:customers',
      label: 'Kunden lesen',
      description: 'Kundendaten abrufen',
    },
    {
      id: 'write:customers',
      label: 'Kunden schreiben',
      description: 'Kundendaten ändern',
    },
    {
      id: 'read:analytics',
      label: 'Analytics lesen',
      description: 'Analysedaten abrufen',
    },
    {
      id: 'admin:users',
      label: 'Benutzer verwalten',
      description: 'Benutzerverwaltung',
    },
    {
      id: 'admin:system',
      label: 'System verwalten',
      description: 'Systemkonfiguration',
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push('/partner/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchData();
  }, [user, router]);

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const filteredKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment =
      environmentFilter === 'all' || key.environment === environmentFilter;
    const matchesStatus = statusFilter === 'all' || key.status === statusFilter;

    return matchesSearch && matchesEnvironment && matchesStatus;
  });

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      revoked: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktiv',
      inactive: 'Inaktiv',
      revoked: 'Widerrufen',
      expired: 'Abgelaufen',
    };
    return labels[status] || status;
  };

  const getEnvironmentColor = (environment: string) => {
    const colors: Record<string, string> = {
      production: 'bg-red-100 text-red-800',
      staging: 'bg-yellow-100 text-yellow-800',
      development: 'bg-blue-100 text-blue-800',
    };
    return colors[environment] || 'bg-gray-100 text-gray-800';
  };

  const getEnvironmentLabel = (environment: string) => {
    const labels: Record<string, string> = {
      production: 'Produktion',
      staging: 'Staging',
      development: 'Entwicklung',
    };
    return labels[environment] || environment;
  };

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: keyForm.name,
      description: keyForm.description,
      key: `ak_${keyForm.environment}_${Math.random()
        .toString(36)
        .substring(2, 34)}`,
      keyVisible: false,
      environment: keyForm.environment,
      permissions: keyForm.permissions,
      rateLimits: keyForm.rateLimits,
      restrictions: keyForm.restrictions,
      status: 'active',
      expiresAt: keyForm.expiresAt || undefined,
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        lastUsed: '',
        averageResponseTime: 0,
      },
      createdAt: new Date().toISOString(),
      createdBy: user?.email || 'unknown',
    };

    setApiKeys([...apiKeys, newKey]);
    setIsCreateModalOpen(false);

    // Reset form
    setKeyForm({
      name: '',
      description: '',
      environment: 'development',
      permissions: [],
      rateLimits: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 10000,
      },
      restrictions: {
        ipWhitelist: [],
        allowedDomains: [],
        timeRestrictions: {
          enabled: false,
          allowedHours: [],
        },
      },
      expiresAt: '',
    });
  };

  const handleEditKey = (key: ApiKey) => {
    setSelectedKey(key);
    setKeyForm({
      name: key.name,
      description: key.description,
      environment: key.environment,
      permissions: key.permissions,
      rateLimits: key.rateLimits,
      restrictions: key.restrictions,
      expiresAt: key.expiresAt || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveKey = () => {
    if (selectedKey) {
      const updatedKeys = apiKeys.map((key) =>
        key.id === selectedKey.id
          ? {
              ...key,
              name: keyForm.name,
              description: keyForm.description,
              environment: keyForm.environment,
              permissions: keyForm.permissions,
              rateLimits: keyForm.rateLimits,
              restrictions: keyForm.restrictions,
              expiresAt: keyForm.expiresAt || undefined,
            }
          : key
      );
      setApiKeys(updatedKeys);
    }
    setIsEditModalOpen(false);
    setSelectedKey(null);
  };

  const handleDeleteKey = (key: ApiKey) => {
    if (
      window.confirm(
        `Sind Sie sicher, dass Sie den API-Schlüssel "${key.name}" löschen möchten?`
      )
    ) {
      setApiKeys(apiKeys.filter((k) => k.id !== key.id));
    }
  };

  const handleRevokeKey = (key: ApiKey) => {
    const updatedKeys = apiKeys.map((k) =>
      k.id === key.id ? { ...k, status: 'revoked' as const } : k
    );
    setApiKeys(updatedKeys);
  };

  const handleToggleStatus = (key: ApiKey) => {
    const newStatus: ApiKey['status'] =
      key.status === 'active' ? 'inactive' : 'active';
    const updatedKeys = apiKeys.map((k) =>
      k.id === key.id ? { ...k, status: newStatus } : k
    );
    setApiKeys(updatedKeys);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const updatedKeys = apiKeys.map((key) =>
      key.id === keyId ? { ...key, keyVisible: !key.keyVisible } : key
    );
    setApiKeys(updatedKeys);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const generateNewKey = () => {
    if (selectedKey) {
      const newKeyValue = `ak_${selectedKey.environment}_${Math.random()
        .toString(36)
        .substring(2, 34)}`;
      const updatedKeys = apiKeys.map((key) =>
        key.id === selectedKey.id
          ? { ...key, key: newKeyValue, keyVisible: true }
          : key
      );
      setApiKeys(updatedKeys);
    }
  };

  // Calculate stats
  const totalKeys = apiKeys.length;
  const activeKeys = apiKeys.filter((k) => k.status === 'active').length;
  const totalRequests = apiKeys.reduce(
    (sum, k) => sum + k.usage.totalRequests,
    0
  );
  const avgResponseTime =
    apiKeys.reduce((sum, k) => sum + k.usage.averageResponseTime, 0) /
    apiKeys.length;

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              API-Schlüssel werden geladen...
            </p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              API-Schlüssel Verwaltung
            </h1>
            <p className="text-gray-600 mt-1">
              Erstellen und verwalten Sie API-Schlüssel für den sicheren Zugriff
              auf Ihre AutoCare APIs
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
              Dokumentation
            </Button>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer API-Schlüssel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Neuen API-Schlüssel erstellen</DialogTitle>
                  <DialogDescription>
                    Erstellen Sie einen neuen API-Schlüssel mit spezifischen
                    Berechtigungen und Einschränkungen.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-name">Name</Label>
                      <Input
                        id="key-name"
                        value={keyForm.name}
                        onChange={(e) =>
                          setKeyForm({ ...keyForm, name: e.target.value })
                        }
                        placeholder="z.B. Production API Key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="key-environment">Umgebung</Label>
                      <Select
                        value={keyForm.environment}
                        onValueChange={(value: ApiKey['environment']) =>
                          setKeyForm({ ...keyForm, environment: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">
                            Entwicklung
                          </SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Produktion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="key-description">Beschreibung</Label>
                    <Textarea
                      id="key-description"
                      value={keyForm.description}
                      onChange={(e) =>
                        setKeyForm({ ...keyForm, description: e.target.value })
                      }
                      placeholder="Beschreibung des Verwendungszwecks"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Berechtigungen</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                      {availablePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-2"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={keyForm.permissions.includes(
                              permission.id
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setKeyForm({
                                  ...keyForm,
                                  permissions: [
                                    ...keyForm.permissions,
                                    permission.id,
                                  ],
                                });
                              } else {
                                setKeyForm({
                                  ...keyForm,
                                  permissions: keyForm.permissions.filter(
                                    (p) => p !== permission.id
                                  ),
                                });
                              }
                            }}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={permission.id}
                              className="text-sm font-medium"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-xs text-gray-600">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rate Limits</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="rate-minute" className="text-xs">
                          Pro Minute
                        </Label>
                        <Input
                          id="rate-minute"
                          type="number"
                          value={keyForm.rateLimits.requestsPerMinute}
                          onChange={(e) =>
                            setKeyForm({
                              ...keyForm,
                              rateLimits: {
                                ...keyForm.rateLimits,
                                requestsPerMinute:
                                  parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="rate-hour" className="text-xs">
                          Pro Stunde
                        </Label>
                        <Input
                          id="rate-hour"
                          type="number"
                          value={keyForm.rateLimits.requestsPerHour}
                          onChange={(e) =>
                            setKeyForm({
                              ...keyForm,
                              rateLimits: {
                                ...keyForm.rateLimits,
                                requestsPerHour: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="rate-day" className="text-xs">
                          Pro Tag
                        </Label>
                        <Input
                          id="rate-day"
                          type="number"
                          value={keyForm.rateLimits.requestsPerDay}
                          onChange={(e) =>
                            setKeyForm({
                              ...keyForm,
                              rateLimits: {
                                ...keyForm.rateLimits,
                                requestsPerDay: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="key-expires">Ablaufdatum (optional)</Label>
                    <Input
                      id="key-expires"
                      type="datetime-local"
                      value={keyForm.expiresAt}
                      onChange={(e) =>
                        setKeyForm({ ...keyForm, expiresAt: e.target.value })
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={!keyForm.name || keyForm.permissions.length === 0}
                  >
                    Schlüssel erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="Gesamt API-Schlüssel"
            value={totalKeys.toString()}
            change={{
              value: 2,
              period: 'Neue diese Woche',
              type: 'increase',
            }}
            color="blue"
            icon="KeyRound"
          />

          <EnhancedMetricCard
            title="Aktive Schlüssel"
            value={activeKeys.toString()}
            change={{
              value: 100,
              period: 'Verfügbarkeit',
              type: 'neutral',
            }}
            color="green"
            icon="CheckCircle2"
          />

          <EnhancedMetricCard
            title="API-Aufrufe"
            value={formatNumber(totalRequests)}
            change={{
              value: 12.5,
              period: 'vs. letzter Monat',
              type: 'increase',
            }}
            color="purple"
            icon="Activity"
          />

          <EnhancedMetricCard
            title="Ø Antwortzeit"
            value={`${Math.round(avgResponseTime)}ms`}
            change={{
              value: -8.3,
              period: 'Verbesserung',
              type: 'increase',
            }}
            color="yellow"
            icon="Zap"
          />
        </div>

        {/* Security Alert */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Sicherheitshinweis:</strong> Teilen Sie API-Schlüssel
            niemals öffentlich oder in unsicheren Umgebungen. Verwenden Sie
            Umgebungsvariablen und sichere Speicherlösungen für die Produktion.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="API-Schlüssel suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select
                value={environmentFilter}
                onValueChange={setEnvironmentFilter}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Umgebung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Umgebungen</SelectItem>
                  <SelectItem value="production">Produktion</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Entwicklung</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="revoked">Widerrufen</SelectItem>
                  <SelectItem value="expired">Abgelaufen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle>API-Schlüssel ({filteredKeys.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name & Umgebung</TableHead>
                  <TableHead>API-Schlüssel</TableHead>
                  <TableHead>Berechtigungen</TableHead>
                  <TableHead>Rate Limits</TableHead>
                  <TableHead>Nutzung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{key.name}</div>
                        <div className="text-sm text-gray-600">
                          {key.description}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={getEnvironmentColor(key.environment)}
                            variant="secondary"
                          >
                            {getEnvironmentLabel(key.environment)}
                          </Badge>
                          {key.expiresAt && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Läuft ab: {formatDate(key.expiresAt)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {key.keyVisible
                            ? key.key
                            : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <Tooltip
                          content={key.keyVisible ? 'Verbergen' : 'Anzeigen'}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {key.keyVisible ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </Tooltip>
                        <Tooltip content="Kopieren">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {key.permissions.slice(0, 3).map((permission) => (
                          <Badge
                            key={permission}
                            variant="outline"
                            className="text-xs mr-1 mb-1"
                          >
                            {availablePermissions.find(
                              (p) => p.id === permission
                            )?.label || permission}
                          </Badge>
                        ))}
                        {key.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{key.permissions.length - 3} weitere
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>
                          {formatNumber(key.rateLimits.requestsPerMinute)}/min
                        </div>
                        <div>
                          {formatNumber(key.rateLimits.requestsPerHour)}/h
                        </div>
                        <div>
                          {formatNumber(key.rateLimits.requestsPerDay)}/Tag
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">
                          {formatNumber(key.usage.totalRequests)} Aufrufe
                        </div>
                        <div className="text-green-600">
                          {formatNumber(key.usage.successfulRequests)}{' '}
                          erfolgreich
                        </div>
                        <div className="text-red-600">
                          {formatNumber(key.usage.failedRequests)}{' '}
                          fehlgeschlagen
                        </div>
                        {key.usage.lastUsed && (
                          <div className="text-gray-500">
                            Zuletzt: {formatDate(key.usage.lastUsed)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getStatusColor(key.status)}
                          variant="secondary"
                        >
                          {getStatusLabel(key.status)}
                        </Badge>
                        {key.status === 'active' && (
                          <Tooltip content="Aktiv und einsatzbereit">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip
                          content={
                            key.status === 'active'
                              ? 'Deaktivieren'
                              : 'Aktivieren'
                          }
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(key)}
                            disabled={
                              key.status === 'revoked' ||
                              key.status === 'expired'
                            }
                          >
                            {key.status === 'active' ? (
                              <Lock className="h-3 w-3" />
                            ) : (
                              <Unlock className="h-3 w-3" />
                            )}
                          </Button>
                        </Tooltip>

                        <Tooltip content="Bearbeiten">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditKey(key)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Tooltip>

                        <Tooltip content="Neuen Schlüssel generieren">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => generateNewKey()}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </Tooltip>

                        <Tooltip content="Löschen">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteKey(key)}
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

            {filteredKeys.length === 0 && (
              <div className="text-center py-8">
                <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Keine API-Schlüssel gefunden
                </h3>
                <p className="text-gray-500">
                  Erstellen Sie einen neuen API-Schlüssel oder passen Sie Ihre
                  Filter an.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                API-Schlüssel bearbeiten: {selectedKey?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Same form fields as create modal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-key-name">Name</Label>
                  <Input
                    id="edit-key-name"
                    value={keyForm.name}
                    onChange={(e) =>
                      setKeyForm({ ...keyForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-key-environment">Umgebung</Label>
                  <Select
                    value={keyForm.environment}
                    onValueChange={(value: ApiKey['environment']) =>
                      setKeyForm({ ...keyForm, environment: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Entwicklung</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Produktion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-key-description">Beschreibung</Label>
                <Textarea
                  id="edit-key-description"
                  value={keyForm.description}
                  onChange={(e) =>
                    setKeyForm({ ...keyForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {selectedKey && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">
                      Schlüssel erneuern
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    Generieren Sie einen neuen Schlüssel, wenn Sie vermuten,
                    dass der aktuelle kompromittiert wurde.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateNewKey()}
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    Neuen Schlüssel generieren
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Abbrechen
              </Button>
              <Button onClick={handleSaveKey}>Änderungen speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/api/documentation')}
            >
              <Code className="h-4 w-4 mr-2" />
              API-Dokumentation
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/api/webhooks')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Webhooks verwalten
            </Button>

            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              API-Metriken anzeigen
            </Button>

            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Rate Limits konfigurieren
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
