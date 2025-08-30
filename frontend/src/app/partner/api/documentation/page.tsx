'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Book,
  BookOpen,
  Clock,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  Filter,
  GitBranch,
  Globe,
  HelpCircle,
  Key,
  Lightbulb,
  Link,
  Lock,
  Package,
  Play,
  RefreshCw,
  Rocket,
  Search,
  Shield,
  ShoppingCart,
  Tag,
  Terminal,
  Users,
  Webhook,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EnhancedMetricCard } from '../../../../components/partner/analytics/AdvancedCharts';
import { useAuth } from '../../../../context/AuthContext';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  name: string;
  description: string;
  category: string;
  requiresAuth: boolean;
  rateLimit: {
    requests: number;
    window: string;
  };
  parameters?: ApiParameter[];
  response?: ApiResponse;
  examples?: CodeExample[];
  tags: string[];
  version: string;
  deprecated?: boolean;
}

interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  example?: any;
  enum?: string[];
}

interface ApiResponse {
  statusCode: number;
  description: string;
  schema: Record<string, any>;
  example: Record<string, any>;
}

interface CodeExample {
  language: string;
  title: string;
  code: string;
}

interface ApiCategory {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  endpoints: number;
  color: string;
}

export default function ApiDocumentationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock API categories
  const apiCategories: ApiCategory[] = [
    {
      id: 'authentication',
      name: 'Authentifizierung',
      description: 'API-Schlüssel und OAuth-Token-Verwaltung',
      icon: <Shield className="h-5 w-5" />,
      endpoints: 4,
      color: 'blue',
    },
    {
      id: 'products',
      name: 'Produkte',
      description: 'Produktkatalog, Bestände und Preise verwalten',
      icon: <Package className="h-5 w-5" />,
      endpoints: 12,
      color: 'green',
    },
    {
      id: 'orders',
      name: 'Bestellungen',
      description: 'Bestellungen abrufen, erstellen und aktualisieren',
      icon: <ShoppingCart className="h-5 w-5" />,
      endpoints: 8,
      color: 'purple',
    },
    {
      id: 'customers',
      name: 'Kunden',
      description: 'Kundendaten und Kundenbeziehungen verwalten',
      icon: <Users className="h-5 w-5" />,
      endpoints: 6,
      color: 'orange',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Berichte, Statistiken und Geschäftseinblicke',
      icon: <BarChart3 className="h-5 w-5" />,
      endpoints: 10,
      color: 'yellow',
    },
    {
      id: 'billing',
      name: 'Abrechnung',
      description: 'Rechnungen, Zahlungen und Abonnements',
      icon: <CreditCard className="h-5 w-5" />,
      endpoints: 7,
      color: 'red',
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Event-basierte Integrationen konfigurieren',
      icon: <Webhook className="h-5 w-5" />,
      endpoints: 5,
      color: 'indigo',
    },
  ];

  // Mock API endpoints
  const apiEndpoints: ApiEndpoint[] = [
    {
      id: 'get-products',
      method: 'GET',
      path: '/api/v1/products',
      name: 'Produkte abrufen',
      description: 'Ruft eine paginierte Liste aller Produkte ab',
      category: 'products',
      requiresAuth: true,
      rateLimit: { requests: 100, window: '1m' },
      tags: ['products', 'catalog'],
      version: 'v1',
      parameters: [
        {
          name: 'page',
          type: 'number',
          required: false,
          description: 'Seitennummer für Paginierung',
          example: 1,
        },
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Anzahl der Elemente pro Seite (max. 100)',
          example: 20,
        },
        {
          name: 'category',
          type: 'string',
          required: false,
          description: 'Filter nach Produktkategorie',
          example: 'motoroel',
        },
        {
          name: 'search',
          type: 'string',
          required: false,
          description: 'Suchbegriff für Produktname oder SKU',
          example: 'mobil 1',
        },
      ],
      response: {
        statusCode: 200,
        description: 'Erfolgreiche Antwort mit Produktliste',
        schema: {
          data: 'array',
          pagination: 'object',
          meta: 'object',
        },
        example: {
          data: [
            {
              id: 'PRD-123',
              name: 'Mobil 1 ESP 5W-30',
              sku: 'MOB-ESP-5W30-4L',
              price: 45.99,
              stock: 150,
              category: 'motoroel',
            },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 245,
            pages: 13,
          },
        },
      },
      examples: [
        {
          language: 'curl',
          title: 'cURL',
          code: `curl -X GET "https://api.autocare.de/v1/products?page=1&limit=20" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        },
        {
          language: 'javascript',
          title: 'JavaScript (Fetch)',
          code: `const response = await fetch('https://api.autocare.de/v1/products?page=1&limit=20', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
        },
        {
          language: 'php',
          title: 'PHP',
          code: `<?php
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.autocare.de/v1/products?page=1&limit=20',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
print_r($data);
?>`,
        },
        {
          language: 'python',
          title: 'Python (Requests)',
          code: `import requests

url = "https://api.autocare.de/v1/products"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
params = {
    "page": 1,
    "limit": 20
}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(data)`,
        },
      ],
    },
    {
      id: 'create-order',
      method: 'POST',
      path: '/api/v1/orders',
      name: 'Bestellung erstellen',
      description: 'Erstellt eine neue Bestellung für einen Kunden',
      category: 'orders',
      requiresAuth: true,
      rateLimit: { requests: 50, window: '1m' },
      tags: ['orders', 'create'],
      version: 'v1',
      parameters: [
        {
          name: 'customer_id',
          type: 'string',
          required: true,
          description: 'ID des Kunden',
          example: 'CUST-123',
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          description: 'Array von Produkten in der Bestellung',
          example: [
            {
              product_id: 'PRD-123',
              quantity: 2,
              price: 45.99,
            },
          ],
        },
        {
          name: 'shipping_address',
          type: 'object',
          required: true,
          description: 'Lieferadresse',
          example: {
            street: 'Musterstraße 123',
            city: 'Berlin',
            postal_code: '10115',
            country: 'DE',
          },
        },
      ],
      response: {
        statusCode: 201,
        description: 'Bestellung erfolgreich erstellt',
        schema: {
          id: 'string',
          status: 'string',
          total: 'number',
          created_at: 'string',
        },
        example: {
          id: 'ORD-2024-001234',
          status: 'pending',
          total: 91.98,
          created_at: '2024-01-20T14:30:00Z',
        },
      },
      examples: [
        {
          language: 'curl',
          title: 'cURL',
          code: `curl -X POST "https://api.autocare.de/v1/orders" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "CUST-123",
    "items": [
      {
        "product_id": "PRD-123",
        "quantity": 2,
        "price": 45.99
      }
    ],
    "shipping_address": {
      "street": "Musterstraße 123",
      "city": "Berlin",
      "postal_code": "10115",
      "country": "DE"
    }
  }'`,
        },
      ],
    },
    {
      id: 'get-customer',
      method: 'GET',
      path: '/api/v1/customers/{customer_id}',
      name: 'Kunde abrufen',
      description: 'Ruft Details eines spezifischen Kunden ab',
      category: 'customers',
      requiresAuth: true,
      rateLimit: { requests: 200, window: '1m' },
      tags: ['customers', 'profile'],
      version: 'v1',
      parameters: [
        {
          name: 'customer_id',
          type: 'string',
          required: true,
          description: 'Eindeutige Kunden-ID',
          example: 'CUST-123',
        },
      ],
      response: {
        statusCode: 200,
        description: 'Kundendetails erfolgreich abgerufen',
        schema: {
          id: 'string',
          company_name: 'string',
          email: 'string',
          created_at: 'string',
        },
        example: {
          id: 'CUST-123',
          company_name: 'Mustermann GmbH',
          email: 'contact@mustermann.de',
          created_at: '2024-01-15T10:00:00Z',
        },
      },
      examples: [
        {
          language: 'curl',
          title: 'cURL',
          code: `curl -X GET "https://api.autocare.de/v1/customers/CUST-123" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        },
      ],
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

  const filteredEndpoints = apiEndpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || endpoint.category === selectedCategory;
    const matchesMethod =
      selectedMethod === 'all' || endpoint.method === selectedMethod;

    return matchesSearch && matchesCategory && matchesMethod;
  });

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      PATCH: 'bg-purple-100 text-purple-800',
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryInfo = (categoryId: string) => {
    return apiCategories.find((c) => c.id === categoryId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleTestEndpoint = async (endpoint: ApiEndpoint) => {
    setTestLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setTestResult({
      status: 200,
      statusText: 'OK',
      data: endpoint.response?.example || { message: 'Test erfolgreich' },
      headers: {
        'content-type': 'application/json',
        'x-rate-limit-remaining': '99',
        'x-rate-limit-reset': '3600',
      },
      responseTime: Math.floor(Math.random() * 300) + 100,
    });

    setTestLoading(false);
  };

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      curl: '🌐',
      javascript: '🟨',
      php: '🐘',
      python: '🐍',
      java: '☕',
      csharp: '🔷',
    };
    return icons[language] || '📄';
  };

  // Calculate stats
  const totalEndpoints = apiEndpoints.length;
  const totalCategories = apiCategories.length;
  const avgResponseTime = 245; // Mock value
  const uptime = 99.9; // Mock value

  if (loading) {
    return (
    <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              API-Dokumentation wird geladen...
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
              API-Dokumentation
            </h1>
            <p className="text-gray-600 mt-1">
              Umfassende Referenz für die AutoCare Advisor API mit interaktiven
              Tests und Code-Beispielen
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              OpenAPI Spec
            </Button>

            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Postman Collection
            </Button>

            <Button onClick={() => router.push('/partner/api/keys')}>
              <Key className="h-4 w-4 mr-2" />
              API-Schlüssel
            </Button>
          </div>
        </div>

        {/* API Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="API Endpoints"
            value={totalEndpoints.toString()}
            change={{
              value: 3,
              period: 'Neue diese Woche',
              type: 'increase',
            }}
            color="blue"
            icon="Globe"
          />

          <EnhancedMetricCard
            title="Kategorien"
            value={totalCategories.toString()}
            change={{
              value: 100,
              period: 'Vollständige Abdeckung',
              type: 'neutral',
            }}
            color="green"
            icon="Layers"
          />

          <EnhancedMetricCard
            title="Durchschn. Response"
            value={`${avgResponseTime}ms`}
            change={{
              value: 12,
              period: 'Verbesserung',
              type: 'increase',
            }}
            color="yellow"
            icon="zap"
          />

          <EnhancedMetricCard
            title="API Uptime"
            value={`${uptime}%`}
            change={{
              value: 0.1,
              period: 'Verfügbarkeit',
              type: 'increase',
            }}
            color="purple"
            icon="activity"
          />
        </div>

        {/* Quick Start Alert */}
        <Alert>
          <Rocket className="h-4 w-4" />
          <AlertDescription>
            <strong>Schnellstart:</strong> Erstellen Sie zuerst einen
            API-Schlüssel in den{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push('/partner/api/keys')}
            >
              API-Einstellungen
            </Button>
            , um mit dem Testen der Endpoints zu beginnen.
          </AlertDescription>
        </Alert>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="authentication">Authentifizierung</TabsTrigger>
            <TabsTrigger value="guides">Anleitungen</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* API Categories */}
            <Card>
              <CardHeader>
                <CardTitle>API-Kategorien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {apiCategories.map((category) => (
                    <Card
                      key={category.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedTab('endpoints');
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`p-2 rounded-lg bg-${category.color}-100 text-${category.color}-600`}
                          >
                            {category.icon}
                          </div>
                          <Badge variant="outline">
                            {category.endpoints} Endpoints
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {category.description}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between"
                        >
                          Erkunden
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Erste Schritte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">API-Schlüssel erstellen</h4>
                      <p className="text-sm text-gray-600">
                        Generieren Sie Ihren ersten API-Schlüssel in den
                        Einstellungen
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Erste API-Anfrage</h4>
                      <p className="text-sm text-gray-600">
                        Testen Sie die API mit dem GET /products Endpoint
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Webhooks konfigurieren</h4>
                      <p className="text-sm text-gray-600">
                        Richten Sie Event-Benachrichtigungen für Ihr System ein
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setSelectedTab('guides')}
                  >
                    Detaillierte Anleitung ansehen
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Beispiel-Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                    <div className="text-green-400 mb-2">
                      # Produkte abrufen
                    </div>
                    <div className="text-blue-400">curl</div>
                    <div className="ml-2 text-yellow-400">
                      -X GET "https://api.autocare.de/v1/products" \
                    </div>
                    <div className="ml-2 text-yellow-400">
                      -H "Authorization: Bearer YOUR_API_KEY" \
                    </div>
                    <div className="ml-2 text-yellow-400">
                      -H "Content-Type: application/json"
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          'curl -X GET "https://api.autocare.de/v1/products" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json"'
                        )
                      }
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Kopieren
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Aktuelle Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 border rounded-lg">
                    <Badge className="bg-green-100 text-green-800">
                      v1.2.0
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-medium">Neue Analytics Endpoints</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Erweiterte Berichterstellung und Datenexport-Funktionen
                        hinzugefügt
                      </p>
                      <div className="text-xs text-gray-500">
                        20. Januar 2024
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 border rounded-lg">
                    <Badge className="bg-blue-100 text-blue-800">v1.1.5</Badge>
                    <div className="flex-1">
                      <h4 className="font-medium">Webhook-Verbesserungen</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Verbesserte Retry-Logic und neue Event-Typen verfügbar
                      </p>
                      <div className="text-xs text-gray-500">
                        15. Januar 2024
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 border rounded-lg">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      v1.1.0
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-medium">Rate Limiting Update</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Erhöhte Rate Limits und verbesserte Header-Informationen
                      </p>
                      <div className="text-xs text-gray-500">
                        10. Januar 2024
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Endpoints suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Kategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      {apiCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedMethod}
                    onValueChange={setSelectedMethod}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Methode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Endpoints List */}
            <div className="space-y-4">
              {filteredEndpoints.map((endpoint) => {
                const category = getCategoryInfo(endpoint.category);
                return (
                  <Card
                    key={endpoint.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge
                            className={getMethodColor(endpoint.method)}
                            variant="secondary"
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                            {endpoint.path}
                          </code>
                          {endpoint.deprecated && (
                            <Badge variant="destructive">Veraltet</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {category && (
                            <div
                              className={`p-1 rounded bg-${category.color}-100 text-${category.color}-600`}
                            >
                              {category.icon}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {endpoint.name}
                        </h3>
                        <p className="text-gray-600">{endpoint.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          {endpoint.requiresAuth ? (
                            <>
                              <Lock className="h-4 w-4 text-red-500" />
                              Authentifizierung erforderlich
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 text-green-500" />
                              Öffentlich zugänglich
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {endpoint.rateLimit.requests}/
                          {endpoint.rateLimit.window}
                        </div>

                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {endpoint.tags.join(', ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredEndpoints.length === 0 && (
                <div className="text-center py-12">
                  <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Keine Endpoints gefunden
                  </h3>
                  <p className="text-gray-500">
                    Passen Sie Ihre Suchkriterien an oder durchstöbern Sie alle
                    verfügbaren Endpoints.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="authentication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API-Schlüssel Authentifizierung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Verwenden Sie Ihren API-Schlüssel im Authorization Header
                    für alle Anfragen.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      Header Format:
                    </div>
                    <code className="text-sm">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Sicherheitshinweis:</strong> Bewahren Sie Ihre
                      API-Schlüssel sicher auf und teilen Sie sie niemals
                      öffentlich.
                    </AlertDescription>
                  </Alert>

                  <Button
                    className="w-full"
                    onClick={() => router.push('/partner/api/keys')}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    API-Schlüssel verwalten
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Rate Limiting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Alle API-Endpoints haben individuelle Rate Limits zum Schutz
                    der Servicequalität.
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">
                        Standard Limit
                      </span>
                      <Badge variant="outline">100 Anfragen/Min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">
                        Bulk Operations
                      </span>
                      <Badge variant="outline">20 Anfragen/Min</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Analytics</span>
                      <Badge variant="outline">50 Anfragen/Min</Badge>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      Response Headers:
                    </div>
                    <div className="text-xs font-mono space-y-1">
                      <div>X-RateLimit-Limit: 100</div>
                      <div>X-RateLimit-Remaining: 87</div>
                      <div>X-RateLimit-Reset: 1642680000</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fehlercodes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status Code</TableHead>
                      <TableHead>Bedeutung</TableHead>
                      <TableHead>Beschreibung</TableHead>
                      <TableHead>Lösung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          200
                        </Badge>
                      </TableCell>
                      <TableCell>OK</TableCell>
                      <TableCell>Anfrage erfolgreich verarbeitet</TableCell>
                      <TableCell>Keine Aktion erforderlich</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">401</Badge>
                      </TableCell>
                      <TableCell>Unauthorized</TableCell>
                      <TableCell>
                        Fehlender oder ungültiger API-Schlüssel
                      </TableCell>
                      <TableCell>API-Schlüssel überprüfen</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          429
                        </Badge>
                      </TableCell>
                      <TableCell>Too Many Requests</TableCell>
                      <TableCell>Rate Limit überschritten</TableCell>
                      <TableCell>Anfragerate reduzieren</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">500</Badge>
                      </TableCell>
                      <TableCell>Internal Server Error</TableCell>
                      <TableCell>Serverfehler</TableCell>
                      <TableCell>Support kontaktieren</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Integration Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Integration Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Schritt-für-Schritt Anleitung zur Integration der AutoCare
                    API
                  </p>

                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Schnellstart
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Authentifizierung
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Webhooks Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Empfohlene Vorgehensweisen für optimale API-Nutzung
                  </p>

                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Error Handling
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Pagination
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Caching Strategien
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Troubleshooting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Häufige Probleme und Lösungsansätze
                  </p>

                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Häufige Fehler
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Debug Tools
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Integration Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Detaillierte Integrationsschritte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-blue-700 mb-2">
                      1. API-Schlüssel erstellen
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Navigieren Sie zu den API-Einstellungen und erstellen Sie
                      einen neuen Schlüssel mit den benötigten Berechtigungen.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      GET /partner/api/keys → Neuen Schlüssel erstellen
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-green-700 mb-2">
                      2. Erste API-Anfrage
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Testen Sie Ihre Integration mit einem einfachen
                      GET-Request zu den Produkten.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      curl -H "Authorization: Bearer YOUR_KEY"
                      https://api.autocare.de/v1/products
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-yellow-700 mb-2">
                      3. Error Handling implementieren
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Implementieren Sie robuste Fehlerbehandlung für alle
                      möglichen HTTP-Statuscodes.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      Prüfen Sie Response-Header für Rate Limits und
                      Retry-After-Werte
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-purple-700 mb-2">
                      4. Webhooks konfigurieren
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Richten Sie Webhooks für automatische Benachrichtigungen
                      über wichtige Events ein.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      Konfigurieren Sie Webhook-Endpoints für order.created,
                      customer.updated, etc.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Endpoint Modal */}
        {selectedEndpoint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={getMethodColor(selectedEndpoint.method)}
                      variant="secondary"
                    >
                      {selectedEndpoint.method}
                    </Badge>
                    <h2 className="text-xl font-bold">
                      {selectedEndpoint.name}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedEndpoint(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Endpoint</h3>
                  <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono block">
                    {selectedEndpoint.method} {selectedEndpoint.path}
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Beschreibung</h3>
                  <p className="text-gray-600">
                    {selectedEndpoint.description}
                  </p>
                </div>

                {selectedEndpoint.parameters &&
                  selectedEndpoint.parameters.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Parameter</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Typ</TableHead>
                            <TableHead>Erforderlich</TableHead>
                            <TableHead>Beschreibung</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedEndpoint.parameters.map((param) => (
                            <TableRow key={param.name}>
                              <TableCell className="font-mono text-sm">
                                {param.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{param.type}</Badge>
                              </TableCell>
                              <TableCell>
                                {param.required ? (
                                  <Badge className="bg-red-100 text-red-800">
                                    Ja
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Nein</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm">
                                {param.description}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                {selectedEndpoint.response && (
                  <div>
                    <h3 className="font-semibold mb-2">Response</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-green-100 text-green-800">
                          {selectedEndpoint.response.statusCode}
                        </Badge>
                        <span className="text-sm">
                          {selectedEndpoint.response.description}
                        </span>
                      </div>
                      <pre className="text-xs font-mono overflow-x-auto">
                        {JSON.stringify(
                          selectedEndpoint.response.example,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedEndpoint.examples &&
                  selectedEndpoint.examples.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Code-Beispiele</h3>

                      <div className="flex gap-2 mb-4">
                        {selectedEndpoint.examples.map((example) => (
                          <Button
                            key={example.language}
                            variant={
                              selectedLanguage === example.language
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() =>
                              setSelectedLanguage(example.language)
                            }
                          >
                            {getLanguageIcon(example.language)} {example.title}
                          </Button>
                        ))}
                      </div>

                      {selectedEndpoint.examples.map(
                        (example) =>
                          selectedLanguage === example.language && (
                            <div key={example.language} className="relative">
                              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                <pre>{example.code}</pre>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() => copyToClipboard(example.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                      )}
                    </div>
                  )}

                {/* Test Section */}
                <div>
                  <h3 className="font-semibold mb-2">API-Test</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleTestEndpoint(selectedEndpoint)}
                      disabled={testLoading}
                    >
                      {testLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Test ausführen
                    </Button>
                  </div>

                  {testResult && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            testResult.status < 300
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {testResult.status} {testResult.statusText}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Antwortzeit: {testResult.responseTime}ms
                        </span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded">
                        <div className="text-sm font-medium mb-2">
                          Response:
                        </div>
                        <pre className="text-xs font-mono overflow-x-auto">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
}


