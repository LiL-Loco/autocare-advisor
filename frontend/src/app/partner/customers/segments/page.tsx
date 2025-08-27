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
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  MapPin,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  AdvancedChart,
  ComparisonChart,
  EnhancedMetricCard,
} from '../../../../components/partner/analytics/AdvancedCharts';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  color: string;
  type: 'automatic' | 'manual' | 'rfm' | 'behavioral';
  criteria: {
    minOrderValue?: number;
    maxOrderValue?: number;
    minOrders?: number;
    maxOrders?: number;
    minRecency?: number;
    maxRecency?: number;
    categories?: string[];
    regions?: string[];
    customRules?: string[];
  };
  metrics: {
    customerCount: number;
    totalRevenue: number;
    averageOrderValue: number;
    orderFrequency: number;
    customerLifetimeValue: number;
    churnRate: number;
    growthRate: number;
    profitMargin: number;
  };
  demographics: {
    averageAge: number;
    topRegions: Array<{ name: string; percentage: number }>;
    topIndustries: Array<{ name: string; percentage: number }>;
    companySize: {
      small: number;
      medium: number;
      large: number;
      enterprise: number;
    };
  };
  trends: {
    revenueTrend: 'up' | 'down' | 'stable';
    countTrend: 'up' | 'down' | 'stable';
    engagementTrend: 'up' | 'down' | 'stable';
  };
  status: 'active' | 'inactive' | 'archived';
  lastUpdated: string;
  createdAt: string;
}

interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  industry: string;
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  segments: string[];
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    lastOrderDate: string;
    registrationDate: string;
    lifetimeValue: number;
    rfmScore: {
      recency: number;
      frequency: number;
      monetary: number;
      overall: string;
    };
  };
  status: 'active' | 'inactive' | 'potential' | 'churned';
}

export default function CustomerSegmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Mock customer segments data
  const [customerSegments] = useState<CustomerSegment[]>([
    {
      id: '1',
      name: 'Premium-Kunden',
      description:
        'Hochwertige B2B-Kunden mit regelmäßigen Großbestellungen und hoher Loyalität',
      color: '#10B981',
      type: 'automatic',
      criteria: {
        minOrderValue: 1000,
        minOrders: 12,
        categories: ['Premium-Motoröle', 'Spezialschmierstoffe'],
      },
      metrics: {
        customerCount: 147,
        totalRevenue: 2456789.5,
        averageOrderValue: 1847.2,
        orderFrequency: 8.4,
        customerLifetimeValue: 18450.3,
        churnRate: 2.1,
        growthRate: 15.7,
        profitMargin: 42.3,
      },
      demographics: {
        averageAge: 12.5,
        topRegions: [
          { name: 'Bayern', percentage: 28.6 },
          { name: 'Baden-Württemberg', percentage: 22.4 },
          { name: 'Nordrhein-Westfalen', percentage: 18.9 },
        ],
        topIndustries: [
          { name: 'Automobilzulieferer', percentage: 34.7 },
          { name: 'Industrielle Fertigung', percentage: 28.2 },
          { name: 'Logistik & Transport', percentage: 15.6 },
        ],
        companySize: {
          small: 12.2,
          medium: 35.4,
          large: 38.8,
          enterprise: 13.6,
        },
      },
      trends: {
        revenueTrend: 'up',
        countTrend: 'up',
        engagementTrend: 'up',
      },
      status: 'active',
      lastUpdated: '2024-01-20T10:30:00Z',
      createdAt: '2023-06-15T08:00:00Z',
    },
    {
      id: '2',
      name: 'Wachstumskunden',
      description:
        'Mittelständische Unternehmen mit steigendem Bedarf und Potenzial für Upselling',
      color: '#3B82F6',
      type: 'rfm',
      criteria: {
        minOrderValue: 300,
        maxOrderValue: 1000,
        minOrders: 5,
        maxOrders: 12,
      },
      metrics: {
        customerCount: 298,
        totalRevenue: 1234567.8,
        averageOrderValue: 654.3,
        orderFrequency: 6.2,
        customerLifetimeValue: 8920.5,
        churnRate: 8.7,
        growthRate: 22.1,
        profitMargin: 35.8,
      },
      demographics: {
        averageAge: 8.2,
        topRegions: [
          { name: 'Nordrhein-Westfalen', percentage: 32.2 },
          { name: 'Bayern', percentage: 26.5 },
          { name: 'Hessen', percentage: 18.1 },
        ],
        topIndustries: [
          { name: 'Mittelständische Fertigung', percentage: 42.3 },
          { name: 'Handwerk & Service', percentage: 28.9 },
          { name: 'Regional Transport', percentage: 16.4 },
        ],
        companySize: {
          small: 28.5,
          medium: 51.3,
          large: 18.1,
          enterprise: 2.1,
        },
      },
      trends: {
        revenueTrend: 'up',
        countTrend: 'up',
        engagementTrend: 'stable',
      },
      status: 'active',
      lastUpdated: '2024-01-20T11:15:00Z',
      createdAt: '2023-08-22T14:30:00Z',
    },
    {
      id: '3',
      name: 'Risiko-Kunden',
      description:
        'Kunden mit sinkender Aktivität und erhöhtem Churn-Risiko - benötigen Aufmerksamkeit',
      color: '#F59E0B',
      type: 'behavioral',
      criteria: {
        maxRecency: 90,
        minOrders: 3,
        customRules: [
          'Sinkende Bestellfrequenz',
          'Reduzierte Bestellwerte',
          'Keine Reaktion auf Angebote',
        ],
      },
      metrics: {
        customerCount: 89,
        totalRevenue: 234567.4,
        averageOrderValue: 423.1,
        orderFrequency: 2.8,
        customerLifetimeValue: 3450.6,
        churnRate: 28.7,
        growthRate: -12.4,
        profitMargin: 28.9,
      },
      demographics: {
        averageAge: 15.8,
        topRegions: [
          { name: 'Sachsen', percentage: 25.8 },
          { name: 'Thüringen', percentage: 22.5 },
          { name: 'Brandenburg', percentage: 19.1 },
        ],
        topIndustries: [
          { name: 'Traditionelle Fertigung', percentage: 38.2 },
          { name: 'Landwirtschaft', percentage: 24.7 },
          { name: 'Kleinbetriebe', percentage: 18.0 },
        ],
        companySize: {
          small: 47.2,
          medium: 38.2,
          large: 12.4,
          enterprise: 2.2,
        },
      },
      trends: {
        revenueTrend: 'down',
        countTrend: 'down',
        engagementTrend: 'down',
      },
      status: 'active',
      lastUpdated: '2024-01-20T09:45:00Z',
      createdAt: '2023-11-10T16:20:00Z',
    },
    {
      id: '4',
      name: 'Neukunden',
      description:
        'Kürzlich gewonnene Kunden in der Onboarding-Phase - hohes Potenzial',
      color: '#8B5CF6',
      type: 'manual',
      criteria: {
        minRecency: 0,
        maxRecency: 30,
        maxOrders: 3,
      },
      metrics: {
        customerCount: 156,
        totalRevenue: 187432.9,
        averageOrderValue: 298.5,
        orderFrequency: 1.8,
        customerLifetimeValue: 1240.8,
        churnRate: 15.4,
        growthRate: 45.2,
        profitMargin: 31.2,
      },
      demographics: {
        averageAge: 2.1,
        topRegions: [
          { name: 'Berlin', percentage: 18.6 },
          { name: 'Hamburg', percentage: 16.7 },
          { name: 'München', percentage: 14.1 },
        ],
        topIndustries: [
          { name: 'Tech-Startups', percentage: 28.2 },
          { name: 'E-Commerce', percentage: 24.4 },
          { name: 'Neue Fertigung', percentage: 18.6 },
        ],
        companySize: {
          small: 64.1,
          medium: 28.2,
          large: 6.4,
          enterprise: 1.3,
        },
      },
      trends: {
        revenueTrend: 'up',
        countTrend: 'up',
        engagementTrend: 'up',
      },
      status: 'active',
      lastUpdated: '2024-01-20T12:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]);

  // Mock customers data
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      companyName: 'AutoTech Bayern GmbH',
      contactPerson: 'Klaus Müller',
      email: 'k.mueller@autotech-bayern.de',
      phone: '+49 89 1234567',
      region: 'Bayern',
      industry: 'Automobilzulieferer',
      companySize: 'large',
      segments: ['1'], // Premium-Kunden
      metrics: {
        totalOrders: 24,
        totalRevenue: 34567.8,
        averageOrderValue: 1440.33,
        lastOrderDate: '2024-01-18',
        registrationDate: '2022-03-15',
        lifetimeValue: 34567.8,
        rfmScore: {
          recency: 5,
          frequency: 5,
          monetary: 5,
          overall: 'Champion',
        },
      },
      status: 'active',
    },
    {
      id: '2',
      companyName: 'Maschinenbau Schmidt',
      contactPerson: 'Andrea Weber',
      email: 'weber@maschinenbau-schmidt.de',
      phone: '+49 711 9876543',
      region: 'Baden-Württemberg',
      industry: 'Mittelständische Fertigung',
      companySize: 'medium',
      segments: ['2'], // Wachstumskunden
      metrics: {
        totalOrders: 8,
        totalRevenue: 5432.1,
        averageOrderValue: 679.01,
        lastOrderDate: '2024-01-15',
        registrationDate: '2023-05-20',
        lifetimeValue: 5432.1,
        rfmScore: {
          recency: 4,
          frequency: 3,
          monetary: 3,
          overall: 'Potential Loyalist',
        },
      },
      status: 'active',
    },
    {
      id: '3',
      companyName: 'Logistik Ost e.K.',
      contactPerson: 'Michael Fischer',
      email: 'fischer@logistik-ost.de',
      phone: '+49 351 5555123',
      region: 'Sachsen',
      industry: 'Traditionelle Fertigung',
      companySize: 'small',
      segments: ['3'], // Risiko-Kunden
      metrics: {
        totalOrders: 3,
        totalRevenue: 1234.5,
        averageOrderValue: 411.5,
        lastOrderDate: '2023-10-22',
        registrationDate: '2021-08-10',
        lifetimeValue: 1234.5,
        rfmScore: {
          recency: 1,
          frequency: 2,
          monetary: 2,
          overall: 'At Risk',
        },
      },
      status: 'inactive',
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
  }, [user, router, timeRange]);

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredSegments = customerSegments.filter((segment) => {
    const matchesSearch =
      segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      segmentFilter === 'all' || segment.type === segmentFilter;

    return matchesSearch && matchesFilter;
  });

  const selectedSegmentData =
    selectedSegment !== 'all'
      ? customerSegments.find((s) => s.id === selectedSegment)
      : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const getSegmentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      automatic: 'Automatisch',
      manual: 'Manuell',
      rfm: 'RFM-Analyse',
      behavioral: 'Verhaltensbasiert',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      active: 'Aktiv',
      inactive: 'Inaktiv',
      archived: 'Archiviert',
    };
    return texts[status] || status;
  };

  const getCompanySizeLabel = (size: string) => {
    const labels: Record<string, string> = {
      small: 'Klein (1-49)',
      medium: 'Mittel (50-249)',
      large: 'Groß (250-999)',
      enterprise: 'Konzern (1000+)',
    };
    return labels[size] || size;
  };

  const getRfmScoreColor = (score: string) => {
    const colors: Record<string, string> = {
      Champion: 'bg-green-100 text-green-800',
      'Loyal Customer': 'bg-blue-100 text-blue-800',
      'Potential Loyalist': 'bg-purple-100 text-purple-800',
      'New Customer': 'bg-yellow-100 text-yellow-800',
      'At Risk': 'bg-orange-100 text-orange-800',
      'Cannot Lose Them': 'bg-red-100 text-red-800',
    };
    return colors[score] || 'bg-gray-100 text-gray-800';
  };

  const totalCustomers = customerSegments.reduce(
    (sum, segment) => sum + segment.metrics.customerCount,
    0
  );
  const totalRevenue = customerSegments.reduce(
    (sum, segment) => sum + segment.metrics.totalRevenue,
    0
  );
  const averageCLV =
    customerSegments.reduce(
      (sum, segment) =>
        sum +
        segment.metrics.customerLifetimeValue * segment.metrics.customerCount,
      0
    ) / totalCustomers;

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Kundensegmente werden geladen...
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
              Kundensegmentierung & Analyse
            </h1>
            <p className="text-gray-600 mt-1">
              Intelligente B2B-Kundensegmentierung mit RFM-Analyse und
              Verhaltensindikatoren
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
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
              {refreshing ? 'Aktualisiere...' : 'Aktualisieren'}
            </Button>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neues Segment
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="Gesamtkunden"
            value={formatNumber(totalCustomers)}
            change={{
              value: 8.7,
              period: 'vs. Vormonat',
              type: 'increase',
            }}
            color="blue"
            icon="Users"
          />

          <EnhancedMetricCard
            title="Gesamtumsatz"
            value={formatCurrency(totalRevenue)}
            change={{
              value: 12.3,
              period: 'vs. Vormonat',
              type: 'increase',
            }}
            color="green"
            icon="Euro"
          />

          <EnhancedMetricCard
            title="Ø Customer Lifetime Value"
            value={formatCurrency(averageCLV)}
            change={{
              value: 5.1,
              period: 'vs. Vormonat',
              type: 'increase',
            }}
            color="purple"
            icon="Crown"
          />

          <EnhancedMetricCard
            title="Aktive Segmente"
            value={customerSegments
              .filter((s) => s.status === 'active')
              .length.toString()}
            change={{
              value: 1,
              period: 'Neue diese Woche',
              type: 'increase',
            }}
            color="yellow"
            icon="Target"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Segmente suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Segment-Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="automatic">Automatisch</SelectItem>
                  <SelectItem value="manual">Manuell</SelectItem>
                  <SelectItem value="rfm">RFM-Analyse</SelectItem>
                  <SelectItem value="behavioral">Verhaltensbasiert</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedSegment}
                onValueChange={setSelectedSegment}
              >
                <SelectTrigger className="w-64">
                  <Eye className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Segment für Details wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Segmente</SelectItem>
                  {filteredSegments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        ></div>
                        {segment.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="segments" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="segments">Segment-Übersicht</TabsTrigger>
            <TabsTrigger value="details">Segment-Details</TabsTrigger>
            <TabsTrigger value="customers">Kunden-Liste</TabsTrigger>
            <TabsTrigger value="analytics">Performance-Analyse</TabsTrigger>
            <TabsTrigger value="recommendations">Empfehlungen</TabsTrigger>
          </TabsList>

          {/* Segments Overview */}
          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {filteredSegments.map((segment) => (
                <Card
                  key={segment.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        ></div>
                        <CardTitle className="text-lg">
                          {segment.name}
                        </CardTitle>
                      </div>
                      <Badge
                        className={getStatusColor(segment.status)}
                        variant="secondary"
                      >
                        {getStatusText(segment.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {segment.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(segment.metrics.customerCount)}
                        </div>
                        <div className="text-xs text-gray-500">Kunden</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(segment.metrics.totalRevenue)}
                        </div>
                        <div className="text-xs text-gray-500">Umsatz</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ø Bestellwert:</span>
                        <span className="font-medium">
                          {formatCurrency(segment.metrics.averageOrderValue)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Churn-Rate:</span>
                        <span
                          className={`font-medium ${
                            segment.metrics.churnRate > 15
                              ? 'text-red-600'
                              : segment.metrics.churnRate > 8
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {formatPercentage(segment.metrics.churnRate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Wachstumsrate:</span>
                        <span
                          className={`font-medium ${
                            segment.metrics.growthRate > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {segment.metrics.growthRate > 0 ? '+' : ''}
                          {segment.metrics.growthRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">
                        {getSegmentTypeLabel(segment.type)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {segment.trends.revenueTrend === 'up' && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {segment.trends.revenueTrend === 'down' && (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSegment(segment.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Bearbeiten
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Segment Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Segment-Verteilung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ComparisonChart
                  data={customerSegments.map((segment) => ({
                    name: segment.name,
                    current: segment.metrics.customerCount,
                    previous: Math.floor(
                      segment.metrics.customerCount *
                        (1 - segment.metrics.growthRate / 100)
                    ),
                  }))}
                  title="Kundenverteilung nach Segmenten"
                  height={300}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segment Details */}
          <TabsContent value="details" className="space-y-6">
            {selectedSegmentData ? (
              <>
                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <EnhancedMetricCard
                    title="Customer Lifetime Value"
                    value={formatCurrency(
                      selectedSegmentData.metrics.customerLifetimeValue
                    )}
                    color="purple"
                    icon="Crown"
                  />
                  <EnhancedMetricCard
                    title="Bestellfrequenz"
                    value={`${selectedSegmentData.metrics.orderFrequency.toFixed(
                      1
                    )}x`}
                    color="blue"
                    icon="RefreshCw"
                  />
                  <EnhancedMetricCard
                    title="Gewinnmarge"
                    value={formatPercentage(
                      selectedSegmentData.metrics.profitMargin
                    )}
                    color="green"
                    icon="Euro"
                  />
                  <EnhancedMetricCard
                    title="Churn-Risiko"
                    value={formatPercentage(
                      selectedSegmentData.metrics.churnRate
                    )}
                    color={
                      selectedSegmentData.metrics.churnRate > 15
                        ? 'red'
                        : 'yellow'
                    }
                    icon="AlertTriangle"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Demographics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Demografische Verteilung
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Top Regionen</h4>
                        <div className="space-y-2">
                          {selectedSegmentData.demographics.topRegions.map(
                            (region, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm">{region.name}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${region.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium w-12 text-right">
                                    {region.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Top Branchen</h4>
                        <div className="space-y-2">
                          {selectedSegmentData.demographics.topIndustries.map(
                            (industry, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm">{industry.name}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full"
                                      style={{
                                        width: `${industry.percentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium w-12 text-right">
                                    {industry.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Size Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Unternehmensgrößen-Verteilung
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(
                          selectedSegmentData.demographics.companySize
                        ).map(([size, percentage]) => (
                          <div
                            key={size}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              {getCompanySizeLabel(size)}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-purple-600 h-3 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">
                          Segment-Charakteristika:
                        </div>
                        <div className="text-sm">
                          <strong>Durchschnittliches Unternehmensalter:</strong>{' '}
                          {selectedSegmentData.demographics.averageAge.toFixed(
                            1
                          )}{' '}
                          Jahre
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Segment-Typ:</strong>{' '}
                          {getSegmentTypeLabel(selectedSegmentData.type)}
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Zuletzt aktualisiert:</strong>{' '}
                          {new Intl.DateTimeFormat('de-DE', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }).format(new Date(selectedSegmentData.lastUpdated))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Criteria */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Segment-Kriterien
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedSegmentData.criteria.minOrderValue && (
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-600">
                            Min. Bestellwert
                          </div>
                          <div className="font-semibold">
                            {formatCurrency(
                              selectedSegmentData.criteria.minOrderValue
                            )}
                          </div>
                        </div>
                      )}
                      {selectedSegmentData.criteria.maxOrderValue && (
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-600">
                            Max. Bestellwert
                          </div>
                          <div className="font-semibold">
                            {formatCurrency(
                              selectedSegmentData.criteria.maxOrderValue
                            )}
                          </div>
                        </div>
                      )}
                      {selectedSegmentData.criteria.minOrders && (
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-600">
                            Min. Anzahl Bestellungen
                          </div>
                          <div className="font-semibold">
                            {selectedSegmentData.criteria.minOrders}
                          </div>
                        </div>
                      )}
                      {selectedSegmentData.criteria.categories && (
                        <div className="p-3 border rounded-lg">
                          <div className="text-sm text-gray-600">
                            Kategorien
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedSegmentData.criteria.categories.map(
                              (category, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {category}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Kein Segment ausgewählt
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Wählen Sie ein Segment aus der Dropdown-Liste, um
                    detaillierte Informationen zu sehen.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Customer List */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kunden-Übersicht
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unternehmen</TableHead>
                      <TableHead>Kontaktperson</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead className="text-right">Bestellungen</TableHead>
                      <TableHead className="text-right">Umsatz</TableHead>
                      <TableHead className="text-right">CLV</TableHead>
                      <TableHead>RFM-Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => {
                      const segment = customerSegments.find(
                        (s) => s.id === customer.segments[0]
                      );
                      return (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {customer.companyName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {customer.industry}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {customer.contactPerson}
                              </div>
                              <div className="text-sm text-gray-500">
                                {customer.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.region}</TableCell>
                          <TableCell>
                            {segment && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: segment.color }}
                                ></div>
                                <span className="text-sm">{segment.name}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(customer.metrics.totalOrders)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(customer.metrics.totalRevenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(customer.metrics.lifetimeValue)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getRfmScoreColor(
                                customer.metrics.rfmScore.overall
                              )}
                              variant="secondary"
                            >
                              {customer.metrics.rfmScore.overall}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(customer.status)}
                              variant="secondary"
                            >
                              {getStatusText(customer.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue-Performance nach Segment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedChart
                    data={customerSegments.map((segment) => ({
                      name: segment.name,
                      value: segment.metrics.totalRevenue,
                      kunden: segment.metrics.customerCount,
                    }))}
                    title="Umsatz-Verteilung"
                    height={300}
                    type="bar"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    CLV vs. Churn-Rate Analyse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegments.map((segment) => (
                      <div key={segment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: segment.color }}
                            ></div>
                            <span className="font-medium">{segment.name}</span>
                          </div>
                          <Badge variant="outline">
                            {formatNumber(segment.metrics.customerCount)} Kunden
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">
                              Customer Lifetime Value
                            </div>
                            <div className="text-lg font-semibold text-green-600">
                              {formatCurrency(
                                segment.metrics.customerLifetimeValue
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">
                              Churn-Rate
                            </div>
                            <div
                              className={`text-lg font-semibold ${
                                segment.metrics.churnRate > 15
                                  ? 'text-red-600'
                                  : segment.metrics.churnRate > 8
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {formatPercentage(segment.metrics.churnRate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommendations */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {customerSegments.map((segment) => (
                <Card
                  key={segment.id}
                  className="border-l-4"
                  style={{ borderLeftColor: segment.color }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      {segment.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* High Priority Recommendation */}
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="font-semibold text-red-800">
                            Kritisch
                          </span>
                        </div>
                        <p className="text-sm text-red-700">
                          {segment.metrics.churnRate > 20
                            ? 'Sofortmaßnahmen zur Churn-Prävention erforderlich'
                            : segment.metrics.growthRate < 0
                            ? 'Negative Wachstumsrate - Segment-Strategie überdenken'
                            : 'Regelmäßige Überwachung der Key Metrics empfohlen'}
                        </p>
                      </div>

                      {/* Medium Priority Recommendation */}
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">
                            Optimierung
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          {segment.metrics.averageOrderValue < 500
                            ? 'Cross-Selling Potential durch Produktbündelung nutzen'
                            : 'Personalisierte Marketing-Kampagnen zur Steigerung der Engagement-Rate'}
                        </p>
                      </div>

                      {/* Success Opportunity */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-800">
                            Chance
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          {segment.metrics.growthRate > 20
                            ? 'Starkes Wachstum - Ressourcen für weitere Expansion bereitstellen'
                            : segment.metrics.profitMargin > 40
                            ? 'Hohe Marge - Als Referenzsegment für andere nutzen'
                            : 'Loyalitätsprogramme zur langfristigen Kundenbindung implementieren'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Overall Strategic Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Strategische Gesamtempfehlungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Segment-Balance optimieren:</strong> Das
                      Premium-Segment zeigt starke Performance, während
                      Risiko-Kunden verstärkte Aufmerksamkeit benötigen.
                      Implementieren Sie automatisierte Frühwarnsysteme für
                      gefährdete Kunden.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Cross-Segment Migration:</strong> Entwickeln Sie
                      gezielte Programme, um Wachstumskunden in das
                      Premium-Segment zu überführen. Durchschnittliches
                      Upselling-Potenzial: +{formatCurrency(1200)} pro Kunde.
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Neukunden-Onboarding:</strong> Die hohe Anzahl
                      neuer Kunden bietet großes Potenzial. Optimieren Sie das
                      Onboarding, um die Konversionsrate von Neukunden zu
                      Premium-Kunden zu steigern.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/customers/behavior')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Verhalten analysieren
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/customers/insights')}
            >
              <Target className="h-4 w-4 mr-2" />
              KI-Insights
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/marketing/templates')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Zielgruppen-Kampagne
            </Button>

            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Segment-Export
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
