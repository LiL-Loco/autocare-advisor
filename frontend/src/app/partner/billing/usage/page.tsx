'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  CreditCard,
  Database,
  Download,
  Gauge,
  Info,
  Mail,
  RefreshCw,
  Settings,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface UsageMetric {
  id: string;
  name: string;
  current: number;
  limit: number | 'unlimited';
  percentage: number;
  unit: string;
  description: string;
  category: 'api' | 'storage' | 'communication' | 'features';
  status: 'normal' | 'warning' | 'critical';
  resetDate: string;
}

interface UsageHistory {
  date: string;
  apiRequests: number;
  storage: number;
  emails: number;
  sms: number;
  pushNotifications: number;
}

interface UsageAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export default function BillingUsagePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock usage data
  const [usageMetrics] = useState<UsageMetric[]>([
    {
      id: 'api-requests',
      name: 'API Requests',
      current: 38742,
      limit: 50000,
      percentage: 77.5,
      unit: 'Requests',
      description: 'Anzahl der API-Aufrufe in diesem Abrechnungszeitraum',
      category: 'api',
      status: 'warning',
      resetDate: '2025-09-01T00:00:00Z',
    },
    {
      id: 'storage',
      name: 'Datenspeicher',
      current: 23.7,
      limit: 50,
      percentage: 47.4,
      unit: 'GB',
      description:
        'Genutzter Speicherplatz für Produktdaten, Bilder und Dokumente',
      category: 'storage',
      status: 'normal',
      resetDate: '2025-09-01T00:00:00Z',
    },
    {
      id: 'products',
      name: 'Produkte',
      current: 1847,
      limit: 2500,
      percentage: 73.9,
      unit: 'Produkte',
      description: 'Anzahl der verwalteten Produkte in Ihrem Katalog',
      category: 'features',
      status: 'normal',
      resetDate: '2025-09-01T00:00:00Z',
    },
    {
      id: 'customers',
      name: 'Kunden',
      current: 5623,
      limit: 10000,
      percentage: 56.2,
      unit: 'Kunden',
      description: 'Anzahl der registrierten Kunden in Ihrer Datenbank',
      category: 'features',
      status: 'normal',
      resetDate: '2025-09-01T00:00:00Z',
    },
    {
      id: 'emails',
      name: 'E-Mail Versand',
      current: 12456,
      limit: 'unlimited',
      percentage: 0,
      unit: 'E-Mails',
      description: 'Gesendete E-Mail-Benachrichtigungen in diesem Monat',
      category: 'communication',
      status: 'normal',
      resetDate: '2025-09-01T00:00:00Z',
    },
    {
      id: 'sms',
      name: 'SMS Versand',
      current: 687,
      limit: 1000,
      percentage: 68.7,
      unit: 'SMS',
      description: 'Gesendete SMS-Nachrichten in diesem Monat',
      category: 'communication',
      status: 'normal',
      resetDate: '2025-09-01T00:00:00Z',
    },
    {
      id: 'push-notifications',
      name: 'Push Notifications',
      current: 3421,
      limit: 'unlimited',
      percentage: 0,
      unit: 'Push-Nachrichten',
      description: 'Gesendete Push-Benachrichtigungen in diesem Monat',
      category: 'communication',
      status: 'normal',
      resetDate: '2025-09-01T00:00:00Z',
    },
    {
      id: 'integrations',
      name: 'Aktive Integrationen',
      current: 7,
      limit: 10,
      percentage: 70.0,
      unit: 'Integrationen',
      description: 'Anzahl der konfigurierten Drittanbieter-Integrationen',
      category: 'features',
      status: 'normal',
      resetDate: '2025-09-01T00:00:00Z',
    },
  ]);

  const [usageHistory] = useState<UsageHistory[]>([
    {
      date: '01.08',
      apiRequests: 1234,
      storage: 23.1,
      emails: 456,
      sms: 23,
      pushNotifications: 123,
    },
    {
      date: '02.08',
      apiRequests: 1456,
      storage: 23.2,
      emails: 567,
      sms: 34,
      pushNotifications: 145,
    },
    {
      date: '03.08',
      apiRequests: 1678,
      storage: 23.3,
      emails: 678,
      sms: 45,
      pushNotifications: 167,
    },
    {
      date: '04.08',
      apiRequests: 1345,
      storage: 23.4,
      emails: 456,
      sms: 28,
      pushNotifications: 134,
    },
    {
      date: '05.08',
      apiRequests: 1567,
      storage: 23.5,
      emails: 589,
      sms: 67,
      pushNotifications: 156,
    },
    {
      date: '06.08',
      apiRequests: 1789,
      storage: 23.6,
      emails: 612,
      sms: 45,
      pushNotifications: 178,
    },
    {
      date: '07.08',
      apiRequests: 1456,
      storage: 23.7,
      emails: 534,
      sms: 56,
      pushNotifications: 145,
    },
    {
      date: '08.08',
      apiRequests: 1623,
      storage: 23.7,
      emails: 645,
      sms: 43,
      pushNotifications: 162,
    },
    {
      date: '09.08',
      apiRequests: 1534,
      storage: 23.7,
      emails: 567,
      sms: 38,
      pushNotifications: 153,
    },
    {
      date: '10.08',
      apiRequests: 1345,
      storage: 23.7,
      emails: 489,
      sms: 52,
      pushNotifications: 134,
    },
    {
      date: '11.08',
      apiRequests: 1789,
      storage: 23.7,
      emails: 678,
      sms: 67,
      pushNotifications: 178,
    },
    {
      date: '12.08',
      apiRequests: 1567,
      storage: 23.7,
      emails: 567,
      sms: 34,
      pushNotifications: 156,
    },
    {
      date: '13.08',
      apiRequests: 1234,
      storage: 23.7,
      emails: 456,
      sms: 45,
      pushNotifications: 123,
    },
    {
      date: '14.08',
      apiRequests: 1456,
      storage: 23.7,
      emails: 589,
      sms: 56,
      pushNotifications: 145,
    },
  ]);

  const [usageAlerts] = useState<UsageAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'API-Nutzung bei 77%',
      message:
        'Sie haben 77% Ihrer monatlichen API-Requests verbraucht. Erwägen Sie ein Upgrade.',
      timestamp: '2025-08-27T08:30:00Z',
      isRead: false,
      action: {
        label: 'Plan upgraden',
        url: '/partner/billing/plans',
      },
    },
    {
      id: '2',
      type: 'info',
      title: 'Nutzung zurückgesetzt',
      message:
        'Ihr monatliches Nutzungskontingent wurde für August zurückgesetzt.',
      timestamp: '2025-08-01T00:00:00Z',
      isRead: true,
    },
    {
      id: '3',
      type: 'critical',
      title: 'SMS-Limit erreicht',
      message:
        'Sie haben Ihr SMS-Limit erreicht. Weitere SMS werden kostenpflichtig abgerechnet.',
      timestamp: '2025-07-28T16:45:00Z',
      isRead: true,
      action: {
        label: 'SMS-Pakete anzeigen',
        url: '/partner/billing/plans',
      },
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-green-500',
      warning: 'bg-yellow-500',
      critical: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAlertIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      warning: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      critical: <AlertTriangle className="h-4 w-4 text-red-600" />,
      info: <Info className="h-4 w-4 text-blue-600" />,
    };
    return icons[type] || <Info className="h-4 w-4" />;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      api: <Zap className="h-5 w-5" />,
      storage: <Database className="h-5 w-5" />,
      communication: <Mail className="h-5 w-5" />,
      features: <Settings className="h-5 w-5" />,
    };
    return icons[category] || <Activity className="h-5 w-5" />;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('de-DE');
  };

  const formatLimit = (limit: number | 'unlimited') => {
    return limit === 'unlimited' ? 'Unbegrenzt' : formatNumber(limit);
  };

  const filteredMetrics =
    selectedMetric === 'all'
      ? usageMetrics
      : usageMetrics.filter((metric) => metric.category === selectedMetric);

  // Calculate overall usage score
  const overallUsage =
    usageMetrics
      .filter((metric) => metric.limit !== 'unlimited')
      .reduce((sum, metric) => sum + metric.percentage, 0) /
    usageMetrics.filter((metric) => metric.limit !== 'unlimited').length;

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Nutzungsdaten werden geladen...
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
              Nutzung & Kontingente
            </h1>
            <p className="text-gray-600 mt-1">
              Überwachen Sie Ihre Ressourcennutzung und verfügbare Kontingente
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                <SelectItem value="90d">Letzte 90 Tage</SelectItem>
                <SelectItem value="1y">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>

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
              Nutzungsreport
            </Button>
          </div>
        </div>

        {/* Overall Usage Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Gesamtnutzung
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {overallUsage.toFixed(1)}%
                    </p>
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Normal
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Gauge className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={overallUsage} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    API Requests
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(
                        usageMetrics.find((m) => m.id === 'api-requests')
                          ?.current || 0
                      )}
                    </p>
                    <span className="text-sm text-yellow-600 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      77%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <Progress value={77.5} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Speicher</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {usageMetrics.find((m) => m.id === 'storage')?.current} GB
                    </p>
                    <span className="text-sm text-green-600 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      47%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Progress value={47.4} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Benachrichtigungen
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(
                        (usageMetrics.find((m) => m.id === 'emails')?.current ||
                          0) +
                          (usageMetrics.find((m) => m.id === 'sms')?.current ||
                            0) +
                          (usageMetrics.find(
                            (m) => m.id === 'push-notifications'
                          )?.current || 0)
                      )}
                    </p>
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Bell className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Alerts */}
        {usageAlerts.filter((alert) => !alert.isRead).length > 0 && (
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Nutzungswarnungen</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {usageAlerts
                .filter((alert) => !alert.isRead)
                .map((alert) => (
                  <Alert key={alert.id}>
                    {getAlertIcon(alert.type)}
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {alert.message}
                        </div>
                      </div>
                      {alert.action && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(alert.action!.url)}
                        >
                          {alert.action.label}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="flex items-center space-x-4">
          <span className="font-medium">Kategorie:</span>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kategorien</SelectItem>
              <SelectItem value="api">API & Requests</SelectItem>
              <SelectItem value="storage">Speicher & Daten</SelectItem>
              <SelectItem value="communication">Kommunikation</SelectItem>
              <SelectItem value="features">Features & Limits</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Usage Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMetrics.map((metric) => (
            <Card key={metric.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(metric.category)}
                    <div>
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={getStatusBadgeColor(metric.status)}
                    variant="secondary"
                  >
                    {metric.status === 'normal' && 'Normal'}
                    {metric.status === 'warning' && 'Warnung'}
                    {metric.status === 'critical' && 'Kritisch'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      {formatNumber(metric.current)}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      / {formatLimit(metric.limit)} {metric.unit}
                    </span>
                  </div>
                  {metric.limit !== 'unlimited' && (
                    <span className="text-sm font-medium">
                      {metric.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>

                {metric.limit !== 'unlimited' && (
                  <div className="space-y-2">
                    <Progress
                      value={metric.percentage}
                      className={`h-2 ${
                        metric.status === 'critical'
                          ? '[&>div]:bg-red-500'
                          : metric.status === 'warning'
                          ? '[&>div]:bg-yellow-500'
                          : '[&>div]:bg-green-500'
                      }`}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Zurücksetzung:</span>
                  <span>
                    {new Date(metric.resetDate).toLocaleDateString('de-DE')}
                  </span>
                </div>

                {metric.status !== 'normal' && (
                  <Alert>
                    {getAlertIcon(metric.status)}
                    <AlertDescription className="text-sm">
                      {metric.status === 'warning' &&
                        'Sie nähern sich dem Limit. Überwachen Sie Ihre Nutzung.'}
                      {metric.status === 'critical' &&
                        'Limit erreicht! Upgrade erforderlich für weitere Nutzung.'}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Nutzungshistorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={usageHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="apiRequests"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="API Requests"
                />
                <Area
                  type="monotone"
                  dataKey="emails"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  name="E-Mails"
                />
                <Area
                  type="monotone"
                  dataKey="sms"
                  stackId="3"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.6}
                  name="SMS"
                />
                <Area
                  type="monotone"
                  dataKey="pushNotifications"
                  stackId="4"
                  stroke="#ff7300"
                  fill="#ff7300"
                  fillOpacity={0.6}
                  name="Push Notifications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Recommendation */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Optimierung empfohlen</h3>
            <p className="text-blue-100 mb-6">
              Basierend auf Ihrer Nutzung könnte ein Upgrade Ihre Kosten senken
              und mehr Features freischalten.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/partner/billing/plans')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Pläne vergleichen
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/billing/plans')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Plan upgraden
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/billing/history')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Rechnungshistorie
            </Button>

            <Button variant="outline" className="justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Warnungen konfigurieren
            </Button>

            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Detailreport herunterladen
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
