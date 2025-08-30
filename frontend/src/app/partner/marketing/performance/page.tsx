'use client';

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
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Globe,
  Mail,
  MessageSquare,
  Minus,
  RefreshCw,
  Search,
  Share,
  Smartphone,
  Star,
  Target,
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
import { useAuth } from '../../../../context/AuthContext';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'web' | 'social';
  status: 'running' | 'paused' | 'completed' | 'draft' | 'scheduled';
  template: string;
  segment: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    unsubscribed: number;
    bounced: number;
    spam: number;
    revenue: number;
  };
  performance: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    unsubscribeRate: number;
    bounceRate: number;
    spamRate: number;
    roas: number;
    cpm: number;
    cpc: number;
    cpa: number;
  };
  goals: {
    targetOpenRate: number;
    targetClickRate: number;
    targetRevenue: number;
  };
}

interface PerformanceTrend {
  date: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface ChannelPerformance {
  channel: string;
  campaigns: number;
  sent: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
  roas: number;
  avgCpc: number;
}

export default function MarketingPerformancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock campaigns data
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Frühjahrs-Aktion 2024',
      type: 'email',
      status: 'running',
      template: 'Saisonale Promotion',
      segment: 'Aktive B2B Kunden',
      startDate: '2024-01-15T09:00:00Z',
      endDate: '2024-02-15T23:59:59Z',
      budget: 5000,
      spent: 3240,
      metrics: {
        sent: 15420,
        delivered: 14987,
        opened: 11840,
        clicked: 3256,
        converted: 892,
        unsubscribed: 23,
        bounced: 433,
        spam: 12,
        revenue: 178450.8,
      },
      performance: {
        deliveryRate: 97.2,
        openRate: 78.9,
        clickRate: 27.5,
        conversionRate: 27.4,
        unsubscribeRate: 0.15,
        bounceRate: 2.8,
        spamRate: 0.08,
        roas: 55.1,
        cpm: 21.02,
        cpc: 0.99,
        cpa: 3.63,
      },
      goals: {
        targetOpenRate: 75.0,
        targetClickRate: 25.0,
        targetRevenue: 150000,
      },
    },
    {
      id: '2',
      name: 'Neue Kunden Onboarding',
      type: 'email',
      status: 'completed',
      template: 'Willkommens-Serie',
      segment: 'Neue B2B Kunden',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      budget: 2500,
      spent: 2450,
      metrics: {
        sent: 8934,
        delivered: 8756,
        opened: 7205,
        clicked: 2161,
        converted: 1034,
        unsubscribed: 12,
        bounced: 178,
        spam: 5,
        revenue: 89230.4,
      },
      performance: {
        deliveryRate: 98.0,
        openRate: 82.3,
        clickRate: 30.0,
        conversionRate: 47.8,
        unsubscribeRate: 0.13,
        bounceRate: 2.0,
        spamRate: 0.06,
        roas: 36.4,
        cpm: 27.42,
        cpc: 1.13,
        cpa: 2.37,
      },
      goals: {
        targetOpenRate: 80.0,
        targetClickRate: 28.0,
        targetRevenue: 80000,
      },
    },
    {
      id: '3',
      name: 'Warenkorb Erinnerung',
      type: 'email',
      status: 'running',
      template: 'Abandoned Cart Recovery',
      segment: 'Warenkorb-Abbrecher',
      startDate: '2024-01-10T00:00:00Z',
      budget: 1500,
      spent: 890,
      metrics: {
        sent: 12456,
        delivered: 12102,
        opened: 7902,
        clicked: 2839,
        converted: 1247,
        unsubscribed: 8,
        bounced: 354,
        spam: 7,
        revenue: 234560.9,
      },
      performance: {
        deliveryRate: 97.2,
        openRate: 65.3,
        clickRate: 35.9,
        conversionRate: 43.9,
        unsubscribeRate: 0.06,
        bounceRate: 2.8,
        spamRate: 0.06,
        roas: 263.4,
        cpm: 7.14,
        cpc: 0.31,
        cpa: 0.71,
      },
      goals: {
        targetOpenRate: 60.0,
        targetClickRate: 30.0,
        targetRevenue: 200000,
      },
    },
    {
      id: '4',
      name: 'SMS Lieferbenachrichtigung',
      type: 'sms',
      status: 'running',
      template: 'Lieferstatus Update',
      segment: 'Alle Besteller',
      startDate: '2024-01-01T00:00:00Z',
      budget: 800,
      spent: 567,
      metrics: {
        sent: 18923,
        delivered: 18745,
        opened: 18320,
        clicked: 8567,
        converted: 0,
        unsubscribed: 23,
        bounced: 178,
        spam: 0,
        revenue: 0,
      },
      performance: {
        deliveryRate: 99.1,
        openRate: 97.8,
        clickRate: 46.8,
        conversionRate: 0,
        unsubscribeRate: 0.12,
        bounceRate: 0.9,
        spamRate: 0,
        roas: 0,
        cpm: 2.99,
        cpc: 0.07,
        cpa: 0,
      },
      goals: {
        targetOpenRate: 95.0,
        targetClickRate: 40.0,
        targetRevenue: 0,
      },
    },
  ]);

  // Mock performance trends
  const [performanceTrends] = useState<PerformanceTrend[]>([
    {
      date: '2024-01-15',
      sent: 12450,
      opened: 9563,
      clicked: 2874,
      converted: 1247,
      revenue: 45670.8,
      openRate: 76.8,
      clickRate: 30.1,
      conversionRate: 43.4,
    },
    {
      date: '2024-01-16',
      sent: 13890,
      opened: 10823,
      clicked: 3256,
      converted: 1389,
      revenue: 52340.3,
      openRate: 77.9,
      clickRate: 30.1,
      conversionRate: 42.7,
    },
    {
      date: '2024-01-17',
      sent: 15234,
      opened: 11987,
      clicked: 3567,
      converted: 1456,
      revenue: 58920.6,
      openRate: 78.7,
      clickRate: 29.8,
      conversionRate: 40.8,
    },
    {
      date: '2024-01-18',
      sent: 14567,
      opened: 11234,
      clicked: 3189,
      converted: 1334,
      revenue: 49780.4,
      openRate: 77.1,
      clickRate: 28.4,
      conversionRate: 41.8,
    },
    {
      date: '2024-01-19',
      sent: 16789,
      opened: 13245,
      clicked: 3934,
      converted: 1567,
      revenue: 67890.2,
      openRate: 78.9,
      clickRate: 29.7,
      conversionRate: 39.8,
    },
    {
      date: '2024-01-20',
      sent: 18234,
      opened: 14567,
      clicked: 4234,
      converted: 1789,
      revenue: 73450.9,
      openRate: 79.9,
      clickRate: 29.1,
      conversionRate: 42.3,
    },
  ]);

  // Mock channel performance
  const [channelPerformance] = useState<ChannelPerformance[]>([
    {
      channel: 'email',
      campaigns: 8,
      sent: 45890,
      openRate: 74.2,
      clickRate: 28.9,
      conversionRate: 35.4,
      revenue: 456780.3,
      roas: 45.7,
      avgCpc: 0.89,
    },
    {
      channel: 'sms',
      campaigns: 3,
      sent: 23456,
      openRate: 96.8,
      clickRate: 42.3,
      conversionRate: 12.7,
      revenue: 89230.4,
      roas: 15.8,
      avgCpc: 0.12,
    },
    {
      channel: 'whatsapp',
      campaigns: 2,
      sent: 8934,
      openRate: 98.2,
      clickRate: 67.4,
      conversionRate: 28.9,
      revenue: 67890.2,
      roas: 28.4,
      avgCpc: 0.08,
    },
    {
      channel: 'push',
      campaigns: 5,
      sent: 67234,
      openRate: 23.4,
      clickRate: 8.7,
      conversionRate: 2.1,
      revenue: 23450.6,
      roas: 8.9,
      avgCpc: 0.45,
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel =
      channelFilter === 'all' || campaign.type === channelFilter;
    const matchesStatus =
      statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesChannel && matchesStatus;
  });

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      running: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      running: 'Aktiv',
      paused: 'Pausiert',
      completed: 'Abgeschlossen',
      draft: 'Entwurf',
      scheduled: 'Geplant',
    };
    return labels[status] || status;
  };

  const getChannelIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      email: <Mail className="h-4 w-4" />,
      sms: <MessageSquare className="h-4 w-4" />,
      whatsapp: <Smartphone className="h-4 w-4" />,
      push: <Bell className="h-4 w-4" />,
      web: <Globe className="h-4 w-4" />,
      social: <Share className="h-4 w-4" />,
    };
    return icons[type] || <Target className="h-4 w-4" />;
  };

  const getChannelLabel = (type: string) => {
    const labels: Record<string, string> = {
      email: 'E-Mail',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      push: 'Push',
      web: 'Web',
      social: 'Social Media',
    };
    return labels[type] || type;
  };

  const getTrendIcon = (current: number, target: number) => {
    if (current > target * 1.1)
      return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (current < target * 0.9)
      return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-yellow-600" />;
  };

  const getPerformanceColor = (current: number, target: number) => {
    if (current > target * 1.1) return 'text-green-600';
    if (current < target * 0.9) return 'text-red-600';
    return 'text-yellow-600';
  };

  // Calculate overall metrics
  const totalSent = campaigns.reduce((sum, c) => sum + c.metrics.sent, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.metrics.revenue, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const overallOpenRate =
    campaigns.reduce(
      (sum, c) => sum + c.performance.openRate * c.metrics.sent,
      0
    ) / totalSent;
  const overallClickRate =
    campaigns.reduce(
      (sum, c) => sum + c.performance.clickRate * c.metrics.sent,
      0
    ) / totalSent;
  const overallConversionRate =
    campaigns.reduce(
      (sum, c) => sum + c.performance.conversionRate * c.metrics.sent,
      0
    ) / totalSent;
  const overallRoas = totalRevenue / totalSpent;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Performance-Daten werden geladen...
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
              Marketing Performance
            </h1>
            <p className="text-gray-600 mt-1">
              Detaillierte Analyse und Optimierung Ihrer Marketing-Kampagnen
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
              Aktualisieren
            </Button>

            <Button>
              <Download className="h-4 w-4 mr-2" />
              Performance Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="Gesendete Nachrichten"
            value={formatNumber(totalSent)}
            change={{
              value: 23.7,
              period: 'vs. Vormonat',
              type: 'increase',
            }}
            color="blue"
            icon="Send"
          />

          <EnhancedMetricCard
            title="Öffnungsrate"
            value={formatPercentage(overallOpenRate)}
            change={{
              value: 4.2,
              period: 'Verbesserung',
              type: 'increase',
            }}
            color="green"
            icon="Eye"
          />

          <EnhancedMetricCard
            title="Klickrate"
            value={formatPercentage(overallClickRate)}
            change={{
              value: 2.8,
              period: 'Steigerung',
              type: 'increase',
            }}
            color="purple"
            icon="MousePointer"
          />

          <EnhancedMetricCard
            title="ROAS"
            value={`${overallRoas.toFixed(1)}:1`}
            change={{
              value: 15.6,
              period: 'ROI Steigerung',
              type: 'increase',
            }}
            color="yellow"
            icon="Euro"
          />
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance-Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrendAnalysis
                data={performanceTrends.map((trend) => ({
                  date: trend.date,
                  revenue: trend.revenue,
                  clicks: trend.clicked,
                  views: trend.opened,
                }))}
                title="Umsatz und Engagement-Raten"
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Kanal-Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonChart
                data={channelPerformance.map((channel) => ({
                  name: getChannelLabel(channel.channel),
                  current: channel.openRate,
                  previous: channel.clickRate,
                }))}
                title="Öffnungs-, Klick- und Konversionsraten"
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Kampagnen suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kanal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kanäle</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="running">Aktiv</SelectItem>
                  <SelectItem value="paused">Pausiert</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="scheduled">Geplant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Kampagnen</TabsTrigger>
            <TabsTrigger value="channels">Kanäle</TabsTrigger>
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="optimization">Optimierung</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Kampagnen-Performance ({filteredCampaigns.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kampagne</TableHead>
                      <TableHead>Kanal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Gesendet</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                      <TableHead className="text-right">Umsatz</TableHead>
                      <TableHead className="text-right">ROAS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-gray-600">
                              {campaign.template} • {campaign.segment}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(campaign.startDate).toLocaleDateString(
                                'de-DE'
                              )}
                              {campaign.endDate &&
                                ` - ${new Date(
                                  campaign.endDate
                                ).toLocaleDateString('de-DE')}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getChannelIcon(campaign.type)}
                            <span>{getChannelLabel(campaign.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(campaign.status)}
                            variant="secondary"
                          >
                            {getStatusLabel(campaign.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {formatNumber(campaign.metrics.sent)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatPercentage(
                                campaign.performance.deliveryRate
                              )}{' '}
                              zugestellt
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <div className="flex items-center justify-end gap-1">
                              {getTrendIcon(
                                campaign.performance.openRate,
                                campaign.goals.targetOpenRate
                              )}
                              <span
                                className={`text-sm ${getPerformanceColor(
                                  campaign.performance.openRate,
                                  campaign.goals.targetOpenRate
                                )}`}
                              >
                                {formatPercentage(
                                  campaign.performance.openRate
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-end gap-1">
                              {getTrendIcon(
                                campaign.performance.clickRate,
                                campaign.goals.targetClickRate
                              )}
                              <span
                                className={`text-sm ${getPerformanceColor(
                                  campaign.performance.clickRate,
                                  campaign.goals.targetClickRate
                                )}`}
                              >
                                {formatPercentage(
                                  campaign.performance.clickRate
                                )}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatPercentage(
                                campaign.performance.conversionRate
                              )}{' '}
                              Konv.
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {formatCurrency(campaign.metrics.revenue)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Ausgaben: {formatCurrency(campaign.spent)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              campaign.performance.roas > 10
                                ? 'text-green-600'
                                : campaign.performance.roas > 5
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {campaign.performance.roas.toFixed(1)}:1
                          </div>
                          <div className="text-xs text-gray-600">
                            CPA: {formatCurrency(campaign.performance.cpa)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {channelPerformance.map((channel) => (
                <Card
                  key={channel.channel}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getChannelIcon(channel.channel)}
                      {getChannelLabel(channel.channel)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {channel.campaigns}
                        </div>
                        <div className="text-xs text-gray-600">Kampagnen</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(channel.sent)}
                        </div>
                        <div className="text-xs text-gray-600">Gesendet</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            Öffnungsrate
                          </span>
                          <span className="text-sm font-medium">
                            {formatPercentage(channel.openRate)}
                          </span>
                        </div>
                        <Progress value={channel.openRate} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            Klickrate
                          </span>
                          <span className="text-sm font-medium">
                            {formatPercentage(channel.clickRate)}
                          </span>
                        </div>
                        <Progress value={channel.clickRate} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            Konversionsrate
                          </span>
                          <span className="text-sm font-medium">
                            {formatPercentage(channel.conversionRate)}
                          </span>
                        </div>
                        <Progress
                          value={channel.conversionRate}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Umsatz:</span>
                        <span className="font-semibold">
                          {formatCurrency(channel.revenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ROAS:</span>
                        <span
                          className={`font-bold ${
                            channel.roas > 15
                              ? 'text-green-600'
                              : channel.roas > 8
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {channel.roas.toFixed(1)}:1
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">CPC:</span>
                        <span className="font-medium">
                          {formatCurrency(channel.avgCpc)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Kanal-Vergleich</CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedChart
                  data={channelPerformance.map((channel) => ({
                    name: getChannelLabel(channel.channel),
                    value: channel.roas,
                  }))}
                  title="ROAS nach Marketing-Kanal"
                  height={300}
                  type="bar"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funnel Tab */}
          <TabsContent value="funnel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        step: 'Gesendet',
                        value: totalSent,
                        percentage: 100,
                        color: 'bg-blue-500',
                      },
                      {
                        step: 'Zugestellt',
                        value: campaigns.reduce(
                          (sum, c) => sum + c.metrics.delivered,
                          0
                        ),
                        percentage: 97.2,
                        color: 'bg-green-500',
                      },
                      {
                        step: 'Geöffnet',
                        value: campaigns.reduce(
                          (sum, c) => sum + c.metrics.opened,
                          0
                        ),
                        percentage: 74.2,
                        color: 'bg-yellow-500',
                      },
                      {
                        step: 'Geklickt',
                        value: campaigns.reduce(
                          (sum, c) => sum + c.metrics.clicked,
                          0
                        ),
                        percentage: 28.9,
                        color: 'bg-purple-500',
                      },
                      {
                        step: 'Konvertiert',
                        value: campaigns.reduce(
                          (sum, c) => sum + c.metrics.converted,
                          0
                        ),
                        percentage: 35.4,
                        color: 'bg-red-500',
                      },
                    ].map((item, index) => (
                      <div
                        key={item.step}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-24 text-sm font-medium text-right">
                          {item.step}
                        </div>
                        <div className="flex-1 relative">
                          <div
                            className={`h-12 ${item.color} rounded-r-lg flex items-center px-4 text-white font-semibold shadow-sm`}
                            style={{ width: `${item.percentage}%` }}
                          >
                            <span className="text-sm">
                              {formatNumber(item.value)}
                            </span>
                          </div>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-600">
                            {item.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Engagement Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-600">
                      <Activity className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">Engagement Heatmap</p>
                      <p className="text-sm">
                        E-Mail Öffnungsraten nach Wochentag und Zeit
                      </p>
                      <p className="text-xs mt-2">
                        Heatmap-Visualisierung wird geladen...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Funnel Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="text-center p-4">
                <div className="text-3xl font-bold text-blue-600">
                  {formatNumber(totalSent)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Gesendet</div>
              </Card>

              <Card className="text-center p-4">
                <div className="text-3xl font-bold text-green-600">97,2%</div>
                <div className="text-sm text-gray-600 mt-1">Zugestellt</div>
              </Card>

              <Card className="text-center p-4">
                <div className="text-3xl font-bold text-yellow-600">
                  {formatPercentage(overallOpenRate)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Geöffnet</div>
              </Card>

              <Card className="text-center p-4">
                <div className="text-3xl font-bold text-purple-600">
                  {formatPercentage(overallClickRate)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Geklickt</div>
              </Card>

              <Card className="text-center p-4">
                <div className="text-3xl font-bold text-red-600">
                  {formatPercentage(overallConversionRate)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Konvertiert</div>
              </Card>
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Optimierungsempfehlungen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-l-4 border-l-green-500 bg-green-50 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Starke Performance
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Warenkorb-Erinnerungen zeigen exzellente ROAS von 263,4:1.
                      Erhöhen Sie das Budget für diese Kampagne.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Verbesserungspotenzial
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Push-Benachrichtigungen haben niedrige Öffnungsraten
                      (23,4%). Überprüfen Sie Timing und Personalisierung.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        A/B Test Empfehlung
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Testen Sie verschiedene E-Mail-Betreffs für die
                      Frühjahrs-Aktion. Aktuelle Öffnungsrate liegt 5% über dem
                      Ziel.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Timing-Optimierung
                      </span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Dienstag 10-12 Uhr zeigt höchste Engagement-Raten. Planen
                      Sie wichtige Kampagnen in diesem Zeitfenster.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top-Performer Analyse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategorie</TableHead>
                        <TableHead>Champion</TableHead>
                        <TableHead className="text-right">Wert</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Höchste ROAS</TableCell>
                        <TableCell>Warenkorb-Erinnerung</TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          263,4:1
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Beste Öffnungsrate</TableCell>
                        <TableCell>SMS Lieferbenachrichtigung</TableCell>
                        <TableCell className="text-right font-bold text-blue-600">
                          97,8%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Höchste Klickrate</TableCell>
                        <TableCell>WhatsApp Support</TableCell>
                        <TableCell className="text-right font-bold text-purple-600">
                          67,4%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Beste Konversionsrate</TableCell>
                        <TableCell>Neue Kunden Onboarding</TableCell>
                        <TableCell className="text-right font-bold text-yellow-600">
                          47,8%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Niedrigste CPA</TableCell>
                        <TableCell>Warenkorb-Erinnerung</TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          {formatCurrency(0.71)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Optimization Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Empfohlene Aktionen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => router.push('/partner/marketing/templates')}
                  >
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-semibold">Template optimieren</div>
                        <div className="text-sm text-gray-600">
                          Erfolgreiche Warenkorb-Vorlage duplizieren
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-semibold">Budget anpassen</div>
                        <div className="text-sm text-gray-600">
                          Mehr Budget für Top-Performer zuweisen
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-semibold">Timing anpassen</div>
                        <div className="text-sm text-gray-600">
                          Versendzeit zu Peak-Stunden verschieben
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-semibold">Segmente verfeinern</div>
                        <div className="text-sm text-gray-600">
                          Zielgruppen basierend auf Performance segmentieren
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-semibold">A/B Tests starten</div>
                        <div className="text-sm text-gray-600">
                          Neue Varianten für schwächste Kampagnen testen
                        </div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                  >
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-left">
                        <div className="font-semibold">Detailanalyse</div>
                        <div className="text-sm text-gray-600">
                          Kampagnen-spezifische Berichte erstellen
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


