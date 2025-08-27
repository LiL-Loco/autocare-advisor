'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  BarChart3,
  Brain,
  Calendar,
  Clock,
  Download,
  Filter,
  Globe,
  LineChart,
  Mail,
  MessageSquare,
  Monitor,
  Navigation,
  Phone,
  PieChart,
  RefreshCw,
  Search,
  Smartphone,
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
  TrendAnalysis,
} from '../../../../components/partner/analytics/AdvancedCharts';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface BehaviorMetric {
  id: string;
  name: string;
  category:
    | 'engagement'
    | 'navigation'
    | 'purchase'
    | 'communication'
    | 'retention';
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  benchmark: number;
  description: string;
}

interface CustomerJourney {
  stage: string;
  customers: number;
  conversionRate: number;
  avgTimeSpent: number;
  dropOffRate: number;
  topActions: string[];
}

interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  customerCount: number;
  avgOrderValue: number;
  conversionRate: number;
  retentionRate: number;
  characteristics: string[];
}

export default function CustomerBehaviorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [behaviorFilter, setBehaviorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock behavior metrics
  const [behaviorMetrics] = useState<BehaviorMetric[]>([
    {
      id: '1',
      name: 'Sitzungsdauer',
      category: 'engagement',
      value: 8.5,
      change: 12.3,
      trend: 'up',
      benchmark: 7.2,
      description: 'Durchschnittliche Zeit pro Besuch in Minuten',
    },
    {
      id: '2',
      name: 'Seitenaufrufe pro Sitzung',
      category: 'engagement',
      value: 4.8,
      change: -5.2,
      trend: 'down',
      benchmark: 5.1,
      description: 'Anzahl aufgerufener Seiten pro Besuch',
    },
    {
      id: '3',
      name: 'Absprungrate',
      category: 'engagement',
      value: 28.4,
      change: -8.7,
      trend: 'up',
      benchmark: 32.1,
      description: 'Prozentsatz der Besucher, die nach einer Seite abspringen',
    },
    {
      id: '4',
      name: 'Warenkorbabbruchrate',
      category: 'purchase',
      value: 34.2,
      change: -12.1,
      trend: 'up',
      benchmark: 39.5,
      description: 'Prozentsatz abgebrochener Warenkörbe',
    },
    {
      id: '5',
      name: 'Wiederkehrerrate',
      category: 'retention',
      value: 67.8,
      change: 15.4,
      trend: 'up',
      benchmark: 58.3,
      description: 'Prozentsatz wiederkehrender Kunden',
    },
  ]);

  // Mock customer journey data
  const [customerJourney] = useState<CustomerJourney[]>([
    {
      stage: 'Bewusstsein',
      customers: 10000,
      conversionRate: 100,
      avgTimeSpent: 2.3,
      dropOffRate: 0,
      topActions: [
        'Landingpage besucht',
        'Produktkatalog durchsucht',
        'Über uns gelesen',
      ],
    },
    {
      stage: 'Interesse',
      customers: 6800,
      conversionRate: 68,
      avgTimeSpent: 5.7,
      dropOffRate: 32,
      topActions: [
        'Produktdetails angesehen',
        'Preise verglichen',
        'Spezifikationen geprüft',
      ],
    },
    {
      stage: 'Überlegung',
      customers: 3400,
      conversionRate: 34,
      avgTimeSpent: 12.4,
      dropOffRate: 50,
      topActions: [
        'Warenkorb befüllt',
        'Versandkosten geprüft',
        'Support kontaktiert',
      ],
    },
    {
      stage: 'Kauf',
      customers: 1700,
      conversionRate: 17,
      avgTimeSpent: 8.2,
      dropOffRate: 50,
      topActions: [
        'Bestellung abgeschlossen',
        'Zahlung durchgeführt',
        'Bestätigung erhalten',
      ],
    },
    {
      stage: 'Nachkauf',
      customers: 1190,
      conversionRate: 70,
      avgTimeSpent: 3.1,
      dropOffRate: 30,
      topActions: [
        'Bewertung abgegeben',
        'Support kontaktiert',
        'Nachbestellung getätigt',
      ],
    },
  ]);

  // Mock behavior patterns
  const [behaviorPatterns] = useState<BehaviorPattern[]>([
    {
      id: '1',
      name: 'Impulsive Käufer',
      description:
        'Kunden mit schnellen Kaufentscheidungen und kurzen Recherchephasen',
      frequency: 23.4,
      customerCount: 1247,
      avgOrderValue: 1850.3,
      conversionRate: 45.7,
      retentionRate: 62.8,
      characteristics: [
        'Kurze Sitzungsdauer',
        'Wenige Seitenaufrufe',
        'Hohe Konversionsrate',
        'Mobile Präferenz',
      ],
    },
    {
      id: '2',
      name: 'Recherchierer',
      description:
        'Gründliche Kunden mit ausführlicher Produktrecherche vor dem Kauf',
      frequency: 34.7,
      customerCount: 1854,
      avgOrderValue: 2340.75,
      conversionRate: 28.3,
      retentionRate: 78.2,
      characteristics: [
        'Lange Sitzungsdauer',
        'Viele Seitenaufrufe',
        'Mehrfachbesuche',
        'Desktop Präferenz',
      ],
    },
    {
      id: '3',
      name: 'Preisbewusste',
      description:
        'Kunden, die primär nach günstigen Angeboten und Rabatten suchen',
      frequency: 28.9,
      customerCount: 1543,
      avgOrderValue: 890.45,
      conversionRate: 35.1,
      retentionRate: 45.6,
      characteristics: [
        'Rabatt-fokussiert',
        'Preisvergleiche',
        'Newsletter-Abonnenten',
        'Saisonale Käufe',
      ],
    },
    {
      id: '4',
      name: 'Loyale Stammkunden',
      description: 'Regelmäßige Kunden mit etablierten Kaufgewohnheiten',
      frequency: 13.0,
      customerCount: 694,
      avgOrderValue: 3240.9,
      conversionRate: 72.4,
      retentionRate: 91.3,
      characteristics: [
        'Direkte Website-Aufrufe',
        'Bekannte Produktpfade',
        'Account-Login',
        'Regelmäßige Bestellungen',
      ],
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

  const filteredMetrics = behaviorMetrics.filter((metric) => {
    const matchesSearch = metric.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      behaviorFilter === 'all' || metric.category === behaviorFilter;
    return matchesSearch && matchesFilter;
  });

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes.toFixed(1)} Min.`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes.toFixed(0)}m`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      engagement: 'Engagement',
      navigation: 'Navigation',
      purchase: 'Kaufverhalten',
      communication: 'Kommunikation',
      retention: 'Kundenbindung',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      engagement: 'bg-blue-100 text-blue-800',
      navigation: 'bg-green-100 text-green-800',
      purchase: 'bg-purple-100 text-purple-800',
      communication: 'bg-yellow-100 text-yellow-800',
      retention: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Verhaltensanalyse wird geladen...
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
              Kundenverhalten-Analyse
            </h1>
            <p className="text-gray-600 mt-1">
              Detaillierte Analyse von Kundeninteraktionen, Journeys und
              Verhaltensmustern
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
              <Download className="h-4 w-4 mr-2" />
              Verhaltensbericht
            </Button>
          </div>
        </div>

        {/* Key Behavior Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="Ø Sitzungsdauer"
            value={formatDuration(8.5)}
            change={{
              value: 12.3,
              period: 'vs. Vorperiode',
              type: 'increase',
            }}
            color="blue"
            icon="Clock"
          />

          <EnhancedMetricCard
            title="Engagement-Rate"
            value="72.4%"
            change={{
              value: 5.7,
              period: 'vs. Vorperiode',
              type: 'increase',
            }}
            color="green"
            icon="Activity"
          />

          <EnhancedMetricCard
            title="Konversionsrate"
            value="17.0%"
            change={{
              value: 2.3,
              period: 'vs. Vorperiode',
              type: 'increase',
            }}
            color="purple"
            icon="Target"
          />

          <EnhancedMetricCard
            title="Wiederkehrerrate"
            value="67.8%"
            change={{
              value: 15.4,
              period: 'vs. Vorperiode',
              type: 'increase',
            }}
            color="yellow"
            icon="Users"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Metriken suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={behaviorFilter} onValueChange={setBehaviorFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="navigation">Navigation</SelectItem>
                  <SelectItem value="purchase">Kaufverhalten</SelectItem>
                  <SelectItem value="communication">Kommunikation</SelectItem>
                  <SelectItem value="retention">Kundenbindung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="metrics">Verhaltenmetriken</TabsTrigger>
            <TabsTrigger value="journey">Customer Journey</TabsTrigger>
            <TabsTrigger value="patterns">Verhaltensmuster</TabsTrigger>
            <TabsTrigger value="heatmaps">Heatmaps</TabsTrigger>
            <TabsTrigger value="insights">KI-Insights</TabsTrigger>
          </TabsList>

          {/* Behavior Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMetrics.map((metric) => (
                <Card
                  key={metric.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                      <Badge
                        className={getCategoryColor(metric.category)}
                        variant="secondary"
                      >
                        {getCategoryLabel(metric.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {metric.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-blue-600">
                        {metric.name.includes('rate') ||
                        metric.name.includes('Rate')
                          ? formatPercentage(metric.value)
                          : metric.name.includes('Dauer')
                          ? formatDuration(metric.value)
                          : formatNumber(metric.value)}
                      </div>
                      <div className="text-right">
                        <div
                          className={`flex items-center gap-1 ${
                            metric.trend === 'up'
                              ? 'text-green-600'
                              : metric.trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {metric.trend === 'up' && (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          {metric.trend === 'down' && (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {metric.change > 0 ? '+' : ''}
                          {metric.change.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          vs. Vorperiode
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Benchmark:</span>
                        <span className="font-medium">
                          {metric.name.includes('rate') ||
                          metric.name.includes('Rate')
                            ? formatPercentage(metric.benchmark)
                            : metric.name.includes('Dauer')
                            ? formatDuration(metric.benchmark)
                            : formatNumber(metric.benchmark)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          (metric.value / metric.benchmark) * 100,
                          100
                        )}
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500 text-center">
                        {metric.value > metric.benchmark
                          ? `${(
                              (metric.value / metric.benchmark - 1) *
                              100
                            ).toFixed(1)}% über Benchmark`
                          : `${(
                              (1 - metric.value / metric.benchmark) *
                              100
                            ).toFixed(1)}% unter Benchmark`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Metrics Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Verhaltensmetriken Trend-Übersicht
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendAnalysis
                  data={[
                    {
                      date: 'Woche 1',
                      revenue: 8.2,
                      clicks: 68.5,
                      views: 15.8,
                    },
                    {
                      date: 'Woche 2',
                      revenue: 8.0,
                      clicks: 70.1,
                      views: 16.2,
                    },
                    {
                      date: 'Woche 3',
                      revenue: 8.3,
                      clicks: 71.8,
                      views: 16.8,
                    },
                    {
                      date: 'Woche 4',
                      revenue: 8.5,
                      clicks: 72.4,
                      views: 17.0,
                    },
                  ]}
                  title="4-Wochen Verhaltens-Trends"
                  height={400}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Customer Journey Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerJourney.map((stage, index) => (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {stage.stage}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            <div>
                              <div className="text-sm text-gray-600">
                                Kunden
                              </div>
                              <div className="text-xl font-bold text-blue-600">
                                {formatNumber(stage.customers)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">
                                Konversionsrate
                              </div>
                              <div className="text-xl font-bold text-green-600">
                                {formatPercentage(stage.conversionRate)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">
                                Ø Zeit
                              </div>
                              <div className="text-xl font-bold text-purple-600">
                                {formatDuration(stage.avgTimeSpent)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">
                                Absprungrate
                              </div>
                              <div className="text-xl font-bold text-red-600">
                                {formatPercentage(stage.dropOffRate)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Top Aktionen:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {stage.topActions.map((action, actionIndex) => (
                            <Badge
                              key={actionIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {index < customerJourney.length - 1 && (
                        <div className="flex justify-center my-2">
                          <div className="w-0.5 h-6 bg-gray-300"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Journey Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Konversions-Trichter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ComparisonChart
                    data={customerJourney.map((stage) => ({
                      name: stage.stage,
                      current: stage.customers,
                      previous:
                        (stage.customers / customerJourney[0].customers) * 100,
                    }))}
                    title="Customer Journey Verteilung"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Durchschnittliche Verweildauer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedChart
                    data={customerJourney.map((stage) => ({
                      name: stage.stage,
                      value: stage.avgTimeSpent,
                    }))}
                    title="Zeit pro Journey-Phase"
                    height={300}
                    type="bar"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Behavior Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {behaviorPatterns.map((pattern) => (
                <Card
                  key={pattern.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{pattern.name}</span>
                      <Badge variant="outline">
                        {formatPercentage(pattern.frequency)} der Kunden
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {pattern.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(pattern.customerCount)}
                        </div>
                        <div className="text-sm text-gray-600">Kunden</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(pattern.avgOrderValue)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Ø Bestellwert
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between text-sm">
                        <span>Konversionsrate:</span>
                        <span className="font-semibold text-purple-600">
                          {formatPercentage(pattern.conversionRate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bindungsrate:</span>
                        <span className="font-semibold text-yellow-600">
                          {formatPercentage(pattern.retentionRate)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        Charakteristika:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {pattern.characteristics.map((char, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pattern Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Verhaltensmuster Vergleich
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Muster</TableHead>
                      <TableHead className="text-right">Häufigkeit</TableHead>
                      <TableHead className="text-right">
                        Ø Bestellwert
                      </TableHead>
                      <TableHead className="text-right">Konversion</TableHead>
                      <TableHead className="text-right">Bindung</TableHead>
                      <TableHead>Hauptmerkmal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {behaviorPatterns.map((pattern) => (
                      <TableRow key={pattern.id}>
                        <TableCell className="font-medium">
                          {pattern.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(pattern.frequency)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(pattern.avgOrderValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(pattern.conversionRate)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(pattern.retentionRate)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {pattern.characteristics[0]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Heatmaps Tab */}
          <TabsContent value="heatmaps" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Geräte-Verteilung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        device: 'Desktop',
                        percentage: 45.6,
                        icon: <Monitor className="h-5 w-5" />,
                      },
                      {
                        device: 'Mobile',
                        percentage: 38.2,
                        icon: <Smartphone className="h-5 w-5" />,
                      },
                      {
                        device: 'Tablet',
                        percentage: 16.2,
                        icon: <Globe className="h-5 w-5" />,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-gray-500">{item.icon}</div>
                          <span className="font-medium">{item.device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Communication Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Bevorzugte Kontaktkanäle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        channel: 'E-Mail',
                        percentage: 52.3,
                        icon: <Mail className="h-5 w-5" />,
                      },
                      {
                        channel: 'Telefon',
                        percentage: 28.7,
                        icon: <Phone className="h-5 w-5" />,
                      },
                      {
                        channel: 'Live Chat',
                        percentage: 19.0,
                        icon: <MessageSquare className="h-5 w-5" />,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-gray-500">{item.icon}</div>
                          <span className="font-medium">{item.channel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time-based Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Aktivitäts-Heatmap nach Tageszeit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-24 gap-1">
                  {Array.from({ length: 24 }, (_, i) => {
                    const activity = Math.random() * 100;
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded text-xs flex items-center justify-center text-white font-semibold"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${
                            activity / 100
                          })`,
                        }}
                        title={`${i}:00 - ${activity.toFixed(1)}% Aktivität`}
                      >
                        {i}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>0% Aktivität</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <div className="w-4 h-4 bg-blue-800 rounded"></div>
                  </div>
                  <span>100% Aktivität</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Critical Insights */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Zap className="h-5 w-5" />
                    Kritische Erkenntnisse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertDescription>
                      <strong>
                        Hohe Warenkorbabbruchrate bei Mobile-Nutzern:
                      </strong>{' '}
                      42% der mobilen Besucher brechen den Kaufprozess im
                      Checkout ab. Hauptgrund: Komplexer Bezahlvorgang auf
                      kleinen Bildschirmen. Empfehlung: Mobile-optimierte
                      One-Click-Zahlung implementieren.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Opportunity Insights */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Wachstumschancen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        <strong>Starke Desktop-Performance:</strong>{' '}
                        Desktop-Nutzer zeigen 67% höhere Konversionsraten und
                        2,3x längere Sitzungsdauer. Potenzial für gezielte
                        Desktop-Kampagnen mit komplexeren Produktdarstellungen
                        und detaillierten Spezifikationen.
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertDescription>
                        <strong>Loyalitäts-Segment untererschlossen:</strong>{' '}
                        Nur 13% der Kunden sind Stammkunden, aber sie generieren
                        3,2x höhere Bestellwerte. Implementierung eines
                        strukturierten Loyalty-Programms könnte weitere 15% der
                        Wachstumskunden konvertieren.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              {/* Behavioral Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    KI-Verhaltensvorhersagen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Nächste 7 Tage
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• 247 potenzielle Neukunden</li>
                        <li>• 89 Risiko-Kunden reaktivierbar</li>
                        <li>• 156 Upselling-Chancen</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Optimierungspotenzial
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• +23% Konversion durch A/B-Tests</li>
                        <li>• +18% AOV durch Cross-Selling</li>
                        <li>• +31% Retention durch Personalisierung</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Empfohlene Aktionen
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Mobile Checkout optimieren</li>
                        <li>• Retargeting-Kampagnen starten</li>
                        <li>• Personalisierte Produktempfehlungen</li>
                      </ul>
                    </div>
                  </div>
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
              onClick={() => router.push('/partner/customers/insights')}
            >
              <Brain className="h-4 w-4 mr-2" />
              KI-Insights
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/customers/segments')}
            >
              <Users className="h-4 w-4 mr-2" />
              Segment-Analyse
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/marketing/templates')}
            >
              <Target className="h-4 w-4 mr-2" />
              Zielgruppen-Kampagne
            </Button>

            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Verhalten-Export
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
