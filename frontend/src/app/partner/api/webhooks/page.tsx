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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip } from '@/components/ui/tooltip';
import {
  Activity,
  BarChart3,
  Copy,
  Database,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Globe,
  KeyRound,
  Link,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Trash2,
  User,
  Webhook,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AdvancedChart,
  EnhancedMetricCard,
  TrendAnalysis,
} from '../../../../components/partner/analytics/AdvancedCharts';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface WebhookEndpoint {
  id: string;
  name: string;
  description: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  events: string[];
  status: 'active' | 'inactive' | 'failed' | 'testing';
  lastTriggered?: string;
  statistics: {
    totalAttempts: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    averageResponseTime: number;
    lastStatus: number;
    uptime: number;
  };
  configuration: {
    secret: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    signatureMethod: 'sha256' | 'sha1';
    includeHeaders: string[];
    customHeaders: Record<string, string>;
  };
  security: {
    ipWhitelist: string[];
    requireHttps: boolean;
    verifyTls: boolean;
  };
  createdAt: string;
  createdBy: string;
}

interface WebhookEvent {
  id: string;
  name: string;
  description: string;
  category: 'order' | 'customer' | 'product' | 'payment' | 'system';
  payload: Record<string, any>;
  frequency: 'high' | 'medium' | 'low';
  beta?: boolean;
}

interface WebhookDelivery {
  id: string;
  endpointId: string;
  eventType: string;
  status: 'success' | 'failed' | 'pending' | 'retry';
  statusCode: number;
  responseTime: number;
  attempt: number;
  maxAttempts: number;
  nextRetry?: string;
  payload: any;
  response?: string;
  error?: string;
  timestamp: string;
}

export default function ApiWebhooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<WebhookEndpoint | null>(null);
  const [selectedTab, setSelectedTab] = useState('endpoints');

  // Form state
  const [endpointForm, setEndpointForm] = useState({
    name: '',
    description: '',
    url: '',
    method: 'POST' as WebhookEndpoint['method'],
    events: [] as string[],
    configuration: {
      secret: '',
      timeout: 30,
      retryAttempts: 3,
      retryDelay: 300,
      signatureMethod: 'sha256' as 'sha256' | 'sha1',
      includeHeaders: [] as string[],
      customHeaders: {} as Record<string, string>,
    },
    security: {
      ipWhitelist: [] as string[],
      requireHttps: true,
      verifyTls: true,
    },
  });

  // Mock webhook endpoints
  const [webhookEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Bestellungsverarbeitung',
      description: 'Webhook für neue Bestellungen und Statusupdates',
      url: 'https://api.partner-system.de/webhooks/orders',
      method: 'POST',
      events: [
        'order.created',
        'order.updated',
        'order.shipped',
        'order.completed',
      ],
      status: 'active',
      lastTriggered: '2024-01-20T14:23:45Z',
      statistics: {
        totalAttempts: 2847,
        successfulDeliveries: 2834,
        failedDeliveries: 13,
        averageResponseTime: 245,
        lastStatus: 200,
        uptime: 99.54,
      },
      configuration: {
        secret: 'whsec_1234567890abcdef1234567890abcdef',
        timeout: 30,
        retryAttempts: 3,
        retryDelay: 300,
        signatureMethod: 'sha256',
        includeHeaders: ['User-Agent', 'X-Timestamp'],
        customHeaders: {
          'X-Partner-ID': 'autocare-123',
          'X-Source': 'autocare-api',
        },
      },
      security: {
        ipWhitelist: ['203.0.113.0/24'],
        requireHttps: true,
        verifyTls: true,
      },
      createdAt: '2024-01-01T10:00:00Z',
      createdBy: 'admin@autocare.de',
    },
    {
      id: '2',
      name: 'Kundenaktualisierungen',
      description: 'Benachrichtigungen für Kundenprofile und Kontaktdaten',
      url: 'https://crm.partner-system.de/webhook/customer-updates',
      method: 'POST',
      events: ['customer.created', 'customer.updated', 'customer.deleted'],
      status: 'active',
      lastTriggered: '2024-01-20T13:15:22Z',
      statistics: {
        totalAttempts: 1456,
        successfulDeliveries: 1398,
        failedDeliveries: 58,
        averageResponseTime: 189,
        lastStatus: 200,
        uptime: 96.02,
      },
      configuration: {
        secret: 'whsec_abcdef1234567890abcdef1234567890',
        timeout: 45,
        retryAttempts: 5,
        retryDelay: 600,
        signatureMethod: 'sha256',
        includeHeaders: ['User-Agent'],
        customHeaders: {},
      },
      security: {
        ipWhitelist: [],
        requireHttps: true,
        verifyTls: true,
      },
      createdAt: '2024-01-05T14:30:00Z',
      createdBy: 'integration@autocare.de',
    },
    {
      id: '3',
      name: 'Zahlungsbenachrichtigungen',
      description: 'Webhook für Zahlungsstatus und Transaktionen',
      url: 'https://accounting.partner-system.de/payments/webhook',
      method: 'POST',
      events: ['payment.completed', 'payment.failed', 'payment.refunded'],
      status: 'failed',
      lastTriggered: '2024-01-20T09:45:15Z',
      statistics: {
        totalAttempts: 342,
        successfulDeliveries: 298,
        failedDeliveries: 44,
        averageResponseTime: 567,
        lastStatus: 500,
        uptime: 87.13,
      },
      configuration: {
        secret: 'whsec_567890abcdef1234567890abcdef1234',
        timeout: 20,
        retryAttempts: 2,
        retryDelay: 120,
        signatureMethod: 'sha256',
        includeHeaders: [],
        customHeaders: {
          Authorization: 'Bearer [REDACTED]',
        },
      },
      security: {
        ipWhitelist: ['198.51.100.50'],
        requireHttps: true,
        verifyTls: true,
      },
      createdAt: '2024-01-10T16:20:00Z',
      createdBy: 'finance@autocare.de',
    },
    {
      id: '4',
      name: 'Lagerbestandsystem',
      description:
        'Synchronisation von Lagerbeständen und Produktverfügbarkeit',
      url: 'https://inventory.partner-system.de/api/stock-updates',
      method: 'PUT',
      events: [
        'product.stock_updated',
        'product.out_of_stock',
        'product.restocked',
      ],
      status: 'inactive',
      lastTriggered: '2024-01-19T11:30:33Z',
      statistics: {
        totalAttempts: 1892,
        successfulDeliveries: 1845,
        failedDeliveries: 47,
        averageResponseTime: 334,
        lastStatus: 503,
        uptime: 97.51,
      },
      configuration: {
        secret: 'whsec_fedcba0987654321fedcba0987654321',
        timeout: 60,
        retryAttempts: 4,
        retryDelay: 900,
        signatureMethod: 'sha1',
        includeHeaders: ['Content-Type', 'X-Timestamp'],
        customHeaders: {
          'X-API-Version': 'v2',
          'X-Client-ID': 'autocare-inventory',
        },
      },
      security: {
        ipWhitelist: ['192.168.100.0/24'],
        requireHttps: true,
        verifyTls: false,
      },
      createdAt: '2024-01-12T09:15:00Z',
      createdBy: 'warehouse@autocare.de',
    },
  ]);

  // Mock available events
  const availableEvents: WebhookEvent[] = [
    {
      id: 'order.created',
      name: 'Bestellung erstellt',
      description: 'Wird ausgelöst, wenn eine neue Bestellung eingegangen ist',
      category: 'order',
      frequency: 'high',
      payload: {
        order_id: 'string',
        customer_id: 'string',
        total: 'number',
        items: 'array',
        status: 'string',
      },
    },
    {
      id: 'order.updated',
      name: 'Bestellung aktualisiert',
      description:
        'Wird ausgelöst, wenn sich der Status einer Bestellung ändert',
      category: 'order',
      frequency: 'medium',
      payload: {
        order_id: 'string',
        previous_status: 'string',
        new_status: 'string',
        updated_at: 'timestamp',
      },
    },
    {
      id: 'order.shipped',
      name: 'Bestellung versendet',
      description: 'Wird ausgelöst, wenn eine Bestellung versandt wurde',
      category: 'order',
      frequency: 'medium',
      payload: {
        order_id: 'string',
        tracking_number: 'string',
        carrier: 'string',
        shipped_at: 'timestamp',
      },
    },
    {
      id: 'customer.created',
      name: 'Kunde registriert',
      description: 'Wird ausgelöst, wenn sich ein neuer Kunde registriert',
      category: 'customer',
      frequency: 'medium',
      payload: {
        customer_id: 'string',
        email: 'string',
        company_name: 'string',
        created_at: 'timestamp',
      },
    },
    {
      id: 'customer.updated',
      name: 'Kundendaten geändert',
      description: 'Wird ausgelöst, wenn Kundendaten aktualisiert werden',
      category: 'customer',
      frequency: 'low',
      payload: {
        customer_id: 'string',
        changes: 'object',
        updated_at: 'timestamp',
      },
    },
    {
      id: 'payment.completed',
      name: 'Zahlung abgeschlossen',
      description:
        'Wird ausgelöst, wenn eine Zahlung erfolgreich verarbeitet wurde',
      category: 'payment',
      frequency: 'high',
      payload: {
        payment_id: 'string',
        order_id: 'string',
        amount: 'number',
        method: 'string',
        completed_at: 'timestamp',
      },
    },
    {
      id: 'product.stock_updated',
      name: 'Lagerbestand aktualisiert',
      description:
        'Wird ausgelöst, wenn sich der Lagerbestand eines Produkts ändert',
      category: 'product',
      frequency: 'high',
      payload: {
        product_id: 'string',
        sku: 'string',
        previous_stock: 'number',
        new_stock: 'number',
        updated_at: 'timestamp',
      },
    },
    {
      id: 'system.maintenance',
      name: 'Systemwartung',
      description: 'Benachrichtigungen über geplante Wartungsarbeiten',
      category: 'system',
      frequency: 'low',
      beta: true,
      payload: {
        maintenance_id: 'string',
        start_time: 'timestamp',
        end_time: 'timestamp',
        affected_services: 'array',
      },
    },
  ];

  // Mock recent deliveries
  const [recentDeliveries] = useState<WebhookDelivery[]>([
    {
      id: '1',
      endpointId: '1',
      eventType: 'order.created',
      status: 'success',
      statusCode: 200,
      responseTime: 245,
      attempt: 1,
      maxAttempts: 3,
      payload: {
        order_id: 'ORD-2024-001234',
        customer_id: 'CUST-5678',
        total: 1247.5,
      },
      response: '{"status": "received", "id": "webhook_12345"}',
      timestamp: '2024-01-20T14:23:45Z',
    },
    {
      id: '2',
      endpointId: '2',
      eventType: 'customer.updated',
      status: 'failed',
      statusCode: 500,
      responseTime: 5000,
      attempt: 3,
      maxAttempts: 3,
      payload: {
        customer_id: 'CUST-9012',
        changes: { email: 'new@example.com' },
      },
      error: 'Internal Server Error: Database connection timeout',
      timestamp: '2024-01-20T13:15:22Z',
    },
    {
      id: '3',
      endpointId: '3',
      eventType: 'payment.completed',
      status: 'retry',
      statusCode: 503,
      responseTime: 30000,
      attempt: 2,
      maxAttempts: 3,
      nextRetry: '2024-01-20T15:30:00Z',
      payload: {
        payment_id: 'PAY-2024-5678',
        order_id: 'ORD-2024-001235',
        amount: 890.25,
      },
      error: 'Service Unavailable',
      timestamp: '2024-01-20T12:45:15Z',
    },
  ]);

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

  const filteredEndpoints = webhookEndpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || endpoint.status === statusFilter;
    const matchesEvent =
      eventFilter === 'all' ||
      endpoint.events.some((event) => event.includes(eventFilter));

    return matchesSearch && matchesStatus && matchesEvent;
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
      failed: 'bg-red-100 text-red-800',
      testing: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktiv',
      inactive: 'Inaktiv',
      failed: 'Fehler',
      testing: 'Test',
    };
    return labels[status] || status;
  };

  const getDeliveryStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-blue-100 text-blue-800',
      retry: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDeliveryStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      success: 'Erfolgreich',
      failed: 'Fehlgeschlagen',
      pending: 'Ausstehend',
      retry: 'Wiederholung',
    };
    return labels[status] || status;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      order: <ShoppingCart className="h-4 w-4" />,
      customer: <User className="h-4 w-4" />,
      product: <Database className="h-4 w-4" />,
      payment: <BarChart3 className="h-4 w-4" />,
      system: <Settings className="h-4 w-4" />,
    };
    return icons[category] || <Globe className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      order: 'Bestellung',
      customer: 'Kunde',
      product: 'Produkt',
      payment: 'Zahlung',
      system: 'System',
    };
    return labels[category] || category;
  };

  const handleCreateEndpoint = () => {
    const newEndpoint: WebhookEndpoint = {
      id: Date.now().toString(),
      name: endpointForm.name,
      description: endpointForm.description,
      url: endpointForm.url,
      method: endpointForm.method,
      events: endpointForm.events,
      status: 'inactive',
      statistics: {
        totalAttempts: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        averageResponseTime: 0,
        lastStatus: 0,
        uptime: 0,
      },
      configuration: {
        ...endpointForm.configuration,
        secret: `whsec_${Math.random().toString(36).substring(2, 34)}`,
      },
      security: endpointForm.security,
      createdAt: new Date().toISOString(),
      createdBy: user?.email || 'unknown',
    };

    // Add to endpoints list (would normally be an API call)
    console.log('Creating webhook endpoint:', newEndpoint);
    setIsCreateModalOpen(false);

    // Reset form
    setEndpointForm({
      name: '',
      description: '',
      url: '',
      method: 'POST',
      events: [],
      configuration: {
        secret: '',
        timeout: 30,
        retryAttempts: 3,
        retryDelay: 300,
        signatureMethod: 'sha256',
        includeHeaders: [],
        customHeaders: {},
      },
      security: {
        ipWhitelist: [],
        requireHttps: true,
        verifyTls: true,
      },
    });
  };

  const handleEditEndpoint = (endpoint: WebhookEndpoint) => {
    setSelectedEndpoint(endpoint);
    setEndpointForm({
      name: endpoint.name,
      description: endpoint.description,
      url: endpoint.url,
      method: endpoint.method,
      events: endpoint.events,
      configuration: endpoint.configuration,
      security: endpoint.security,
    });
    setIsEditModalOpen(true);
  };

  const handleTestEndpoint = async (endpoint: WebhookEndpoint) => {
    console.log('Testing webhook endpoint:', endpoint.id);
    // Simulate test webhook delivery
  };

  const handleToggleEndpoint = (endpoint: WebhookEndpoint) => {
    const newStatus = endpoint.status === 'active' ? 'inactive' : 'active';
    console.log(`Toggling endpoint ${endpoint.id} to ${newStatus}`);
  };

  const handleDeleteEndpoint = (endpoint: WebhookEndpoint) => {
    if (
      window.confirm(
        `Sind Sie sicher, dass Sie den Webhook "${endpoint.name}" löschen möchten?`
      )
    ) {
      console.log('Deleting endpoint:', endpoint.id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate stats
  const totalEndpoints = webhookEndpoints.length;
  const activeEndpoints = webhookEndpoints.filter(
    (e) => e.status === 'active'
  ).length;
  const totalDeliveries = webhookEndpoints.reduce(
    (sum, e) => sum + e.statistics.totalAttempts,
    0
  );
  const successRate =
    (webhookEndpoints.reduce(
      (sum, e) => sum + e.statistics.successfulDeliveries,
      0
    ) /
      Math.max(totalDeliveries, 1)) *
    100;

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Webhooks werden geladen...</p>
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
              Webhook-Verwaltung
            </h1>
            <p className="text-gray-600 mt-1">
              Konfigurieren Sie Event-basierte Integrationen für automatische
              Datenübertragung
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
              Webhook-Guide
            </Button>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Neuen Webhook erstellen</DialogTitle>
                  <DialogDescription>
                    Erstellen Sie einen neuen Webhook-Endpoint für automatische
                    Event-Benachrichtigungen.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-name">Name</Label>
                      <Input
                        id="webhook-name"
                        value={endpointForm.name}
                        onChange={(e) =>
                          setEndpointForm({
                            ...endpointForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="z.B. Bestellungsverarbeitung"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-method">HTTP-Methode</Label>
                      <Select
                        value={endpointForm.method}
                        onValueChange={(value: WebhookEndpoint['method']) =>
                          setEndpointForm({ ...endpointForm, method: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-description">Beschreibung</Label>
                    <Textarea
                      id="webhook-description"
                      value={endpointForm.description}
                      onChange={(e) =>
                        setEndpointForm({
                          ...endpointForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Beschreibung des Webhook-Zwecks"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Endpoint URL</Label>
                    <Input
                      id="webhook-url"
                      type="url"
                      value={endpointForm.url}
                      onChange={(e) =>
                        setEndpointForm({
                          ...endpointForm,
                          url: e.target.value,
                        })
                      }
                      placeholder="https://ihr-system.de/webhook/endpoint"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Events auswählen</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border rounded">
                      {availableEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start space-x-2"
                        >
                          <Checkbox
                            id={event.id}
                            checked={endpointForm.events.includes(event.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setEndpointForm({
                                  ...endpointForm,
                                  events: [...endpointForm.events, event.id],
                                });
                              } else {
                                setEndpointForm({
                                  ...endpointForm,
                                  events: endpointForm.events.filter(
                                    (e) => e !== event.id
                                  ),
                                });
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(event.category)}
                              <Label
                                htmlFor={event.id}
                                className="text-sm font-medium"
                              >
                                {event.name}
                              </Label>
                              {event.beta && (
                                <Badge variant="outline" className="text-xs">
                                  Beta
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Konfiguration</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeout" className="text-xs">
                          Timeout (Sekunden)
                        </Label>
                        <Input
                          id="timeout"
                          type="number"
                          value={endpointForm.configuration.timeout}
                          onChange={(e) =>
                            setEndpointForm({
                              ...endpointForm,
                              configuration: {
                                ...endpointForm.configuration,
                                timeout: parseInt(e.target.value) || 30,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="retry-attempts" className="text-xs">
                          Wiederholungen
                        </Label>
                        <Input
                          id="retry-attempts"
                          type="number"
                          value={endpointForm.configuration.retryAttempts}
                          onChange={(e) =>
                            setEndpointForm({
                              ...endpointForm,
                              configuration: {
                                ...endpointForm.configuration,
                                retryAttempts: parseInt(e.target.value) || 3,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-https"
                        checked={endpointForm.security.requireHttps}
                        onCheckedChange={(checked) =>
                          setEndpointForm({
                            ...endpointForm,
                            security: {
                              ...endpointForm.security,
                              requireHttps: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="require-https">HTTPS erforderlich</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verify-tls"
                        checked={endpointForm.security.verifyTls}
                        onCheckedChange={(checked) =>
                          setEndpointForm({
                            ...endpointForm,
                            security: {
                              ...endpointForm.security,
                              verifyTls: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="verify-tls">
                        TLS-Zertifikat überprüfen
                      </Label>
                    </div>
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
                    onClick={handleCreateEndpoint}
                    disabled={
                      !endpointForm.name ||
                      !endpointForm.url ||
                      endpointForm.events.length === 0
                    }
                  >
                    Webhook erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="Webhook-Endpoints"
            value={totalEndpoints.toString()}
            change={{
              value: 1,
              period: 'Neuer diese Woche',
              type: 'increase',
            }}
            color="blue"
            icon="Webhook"
          />

          <EnhancedMetricCard
            title="Aktive Endpoints"
            value={activeEndpoints.toString()}
            change={{
              value: 75,
              period: 'Aktiv von Gesamt',
              type: 'neutral',
            }}
            color="green"
            icon="CheckCircle2"
          />

          <EnhancedMetricCard
            title="Auslieferungen"
            value={formatNumber(totalDeliveries)}
            change={{
              value: 18.3,
              period: 'vs. letzter Monat',
              type: 'increase',
            }}
            color="purple"
            icon="Send"
          />

          <EnhancedMetricCard
            title="Erfolgsrate"
            value={`${successRate.toFixed(1)}%`}
            change={{
              value: 2.1,
              period: 'Verbesserung',
              type: 'increase',
            }}
            color="yellow"
            icon="TrendingUp"
          />
        </div>

        {/* Security Information */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Sicherheit:</strong> Alle Webhook-Payloads werden mit
            HMAC-Signaturen signiert. Verwenden Sie das bereitgestellte Secret
            zur Verifizierung der Authentizität.
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Webhooks suchen..."
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
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="failed">Fehler</SelectItem>
                  <SelectItem value="testing">Test</SelectItem>
                </SelectContent>
              </Select>

              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Event-Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Events</SelectItem>
                  <SelectItem value="order">Bestellungen</SelectItem>
                  <SelectItem value="customer">Kunden</SelectItem>
                  <SelectItem value="payment">Zahlungen</SelectItem>
                  <SelectItem value="product">Produkte</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="deliveries">Auslieferungen</TabsTrigger>
          </TabsList>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Webhook-Endpoints ({filteredEndpoints.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Statistiken</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEndpoints.map((endpoint) => (
                      <TableRow key={endpoint.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{endpoint.name}</div>
                            <div className="text-sm text-gray-600">
                              {endpoint.description}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {endpoint.method}
                              </Badge>
                              {endpoint.lastTriggered && (
                                <span className="text-xs text-gray-500">
                                  Zuletzt: {formatDate(endpoint.lastTriggered)}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                              {endpoint.url}
                            </code>
                            <Tooltip content="URL kopieren">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(endpoint.url)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </Tooltip>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Link className="h-3 w-3 text-gray-400" />
                            {endpoint.security.requireHttps && (
                              <Shield className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {endpoint.events.slice(0, 2).map((event) => (
                              <Badge
                                key={event}
                                variant="outline"
                                className="text-xs mr-1 mb-1"
                              >
                                {availableEvents.find((e) => e.id === event)
                                  ?.name || event}
                              </Badge>
                            ))}
                            {endpoint.events.length > 2 && (
                              <div className="text-xs text-gray-600">
                                +{endpoint.events.length - 2} weitere
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getStatusColor(endpoint.status)}
                              variant="secondary"
                            >
                              {getStatusLabel(endpoint.status)}
                            </Badge>
                            {endpoint.status === 'active' && (
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Uptime: {endpoint.statistics.uptime.toFixed(1)}%
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1 text-sm">
                            <div className="font-medium">
                              {formatNumber(endpoint.statistics.totalAttempts)}{' '}
                              Versuche
                            </div>
                            <div className="text-green-600">
                              {formatNumber(
                                endpoint.statistics.successfulDeliveries
                              )}{' '}
                              erfolgreich
                            </div>
                            <div className="text-red-600">
                              {formatNumber(
                                endpoint.statistics.failedDeliveries
                              )}{' '}
                              fehlgeschlagen
                            </div>
                            <div className="text-gray-500">
                              Ø {endpoint.statistics.averageResponseTime}ms
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip content="Test senden">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTestEndpoint(endpoint)}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            </Tooltip>

                            <Tooltip
                              content={
                                endpoint.status === 'active'
                                  ? 'Pausieren'
                                  : 'Aktivieren'
                              }
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleEndpoint(endpoint)}
                              >
                                {endpoint.status === 'active' ? (
                                  <Pause className="h-3 w-3" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                              </Button>
                            </Tooltip>

                            <Tooltip content="Bearbeiten">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditEndpoint(endpoint)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Tooltip>

                            <Tooltip content="Löschen">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteEndpoint(endpoint)}
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

                {filteredEndpoints.length === 0 && (
                  <div className="text-center py-8">
                    <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Keine Webhooks gefunden
                    </h3>
                    <p className="text-gray-500">
                      Erstellen Sie einen neuen Webhook-Endpoint oder passen Sie
                      Ihre Filter an.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(event.category)}
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(event.category)}
                        </Badge>
                        {event.beta && (
                          <Badge
                            className="bg-purple-100 text-purple-800"
                            variant="secondary"
                          >
                            Beta
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{event.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Häufigkeit:</span>
                      <Badge
                        className={
                          event.frequency === 'high'
                            ? 'bg-red-100 text-red-800'
                            : event.frequency === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }
                        variant="secondary"
                      >
                        {event.frequency === 'high'
                          ? 'Hoch'
                          : event.frequency === 'medium'
                          ? 'Mittel'
                          : 'Niedrig'}
                      </Badge>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Payload-Struktur:
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                        <pre>{JSON.stringify(event.payload, null, 2)}</pre>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Event-ID: <code>{event.id}</code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Deliveries Tab */}
          <TabsContent value="deliveries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Letzte Auslieferungen</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event & Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Versuch</TableHead>
                      <TableHead>Response</TableHead>
                      <TableHead>Zeitstempel</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDeliveries.map((delivery) => {
                      const endpoint = webhookEndpoints.find(
                        (e) => e.id === delivery.endpointId
                      );
                      const event = availableEvents.find(
                        (e) => e.id === delivery.eventType
                      );

                      return (
                        <TableRow key={delivery.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {event && getCategoryIcon(event.category)}
                                {event?.name || delivery.eventType}
                              </div>
                              <div className="text-sm text-gray-600">
                                → {endpoint?.name || 'Unbekannter Endpoint'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={getDeliveryStatusColor(
                                  delivery.status
                                )}
                                variant="secondary"
                              >
                                {getDeliveryStatusLabel(delivery.status)}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {delivery.statusCode}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {delivery.attempt} / {delivery.maxAttempts}
                              {delivery.nextRetry && (
                                <div className="text-xs text-gray-500">
                                  Nächster Versuch:{' '}
                                  {formatDate(delivery.nextRetry)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">
                                {delivery.responseTime}ms
                              </div>
                              {delivery.response && (
                                <div className="text-xs text-green-600 truncate max-w-xs">
                                  {delivery.response}
                                </div>
                              )}
                              {delivery.error && (
                                <div className="text-xs text-red-600 truncate max-w-xs">
                                  {delivery.error}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(delivery.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Tooltip content="Details anzeigen">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </Tooltip>

                              {delivery.status === 'failed' && (
                                <Tooltip content="Erneut versuchen">
                                  <Button size="sm" variant="ghost">
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Delivery Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auslieferungs-Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendAnalysis
                    data={[
                      {
                        date: '15.01',
                        revenue: 245,
                        clicks: 98,
                        views: 2,
                      },
                      {
                        date: '16.01',
                        revenue: 289,
                        clicks: 98,
                        views: 2,
                      },
                      {
                        date: '17.01',
                        revenue: 234,
                        clicks: 99,
                        views: 1,
                      },
                      {
                        date: '18.01',
                        revenue: 267,
                        clicks: 97,
                        views: 4,
                      },
                      {
                        date: '19.01',
                        revenue: 298,
                        clicks: 99,
                        views: 1,
                      },
                      {
                        date: '20.01',
                        revenue: 312,
                        clicks: 99,
                        views: 1,
                      },
                    ]}
                    title="Erfolgsrate und Fehlschläge"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response-Zeiten</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedChart
                    data={[
                      { name: 'Bestellungen', value: 245 },
                      { name: 'Kunden', value: 189 },
                      { name: 'Zahlungen', value: 567 },
                      { name: 'Produkte', value: 334 },
                    ]}
                    title="Durchschnittliche Response-Zeit (ms)"
                    height={300}
                    type="bar"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/api/keys')}
            >
              <KeyRound className="h-4 w-4 mr-2" />
              API-Schlüssel
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/api/documentation')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Dokumentation
            </Button>

            <Button variant="outline" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Webhook-Logs
            </Button>

            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Global Settings
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
