'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ArrowDown,
  ArrowUp,
  Bell,
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  Mail,
  MessageSquare,
  Minus,
  MousePointer,
  RefreshCw,
  Send,
  Smartphone,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../../../../context/AuthContext';

interface NotificationStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  bounced: number;
  unsubscribed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}

interface ChannelStats {
  channel: 'email' | 'sms' | 'push' | 'slack';
  stats: NotificationStats;
}

interface TimeSeriesData {
  date: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

interface TemplatePerformance {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'slack';
  category: string;
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  averageEngagement: number;
  lastUsed: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export default function NotificationsAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data
  const [overallStats] = useState<NotificationStats>({
    totalSent: 156432,
    delivered: 149876,
    opened: 89325,
    clicked: 23847,
    failed: 4231,
    bounced: 2325,
    unsubscribed: 456,
    deliveryRate: 95.8,
    openRate: 59.6,
    clickRate: 26.7,
    bounceRate: 1.5,
    unsubscribeRate: 0.3,
  });

  const [channelStats] = useState<ChannelStats[]>([
    {
      channel: 'email',
      stats: {
        totalSent: 89234,
        delivered: 85432,
        opened: 52345,
        clicked: 15678,
        failed: 2456,
        bounced: 1346,
        unsubscribed: 278,
        deliveryRate: 95.7,
        openRate: 61.3,
        clickRate: 29.9,
        bounceRate: 1.5,
        unsubscribeRate: 0.3,
      },
    },
    {
      channel: 'sms',
      stats: {
        totalSent: 34567,
        delivered: 33789,
        opened: 20456,
        clicked: 4567,
        failed: 567,
        bounced: 211,
        unsubscribed: 89,
        deliveryRate: 97.7,
        openRate: 60.5,
        clickRate: 22.3,
        bounceRate: 0.6,
        unsubscribeRate: 0.3,
      },
    },
    {
      channel: 'push',
      stats: {
        totalSent: 23456,
        delivered: 22134,
        opened: 12345,
        clicked: 2891,
        failed: 987,
        bounced: 335,
        unsubscribed: 67,
        deliveryRate: 94.4,
        openRate: 55.8,
        clickRate: 23.4,
        bounceRate: 1.4,
        unsubscribeRate: 0.3,
      },
    },
    {
      channel: 'slack',
      stats: {
        totalSent: 9175,
        delivered: 8521,
        opened: 4179,
        clicked: 711,
        failed: 221,
        bounced: 433,
        unsubscribed: 22,
        deliveryRate: 92.9,
        openRate: 49.0,
        clickRate: 17.0,
        bounceRate: 4.7,
        unsubscribeRate: 0.2,
      },
    },
  ]);

  const [timeSeriesData] = useState<TimeSeriesData[]>([
    {
      date: '27.07',
      sent: 4567,
      delivered: 4234,
      opened: 2890,
      clicked: 756,
      failed: 156,
    },
    {
      date: '28.07',
      sent: 5234,
      delivered: 4987,
      opened: 3456,
      clicked: 891,
      failed: 123,
    },
    {
      date: '29.07',
      sent: 4891,
      delivered: 4623,
      opened: 3123,
      clicked: 834,
      failed: 198,
    },
    {
      date: '30.07',
      sent: 5678,
      delivered: 5456,
      opened: 3789,
      clicked: 945,
      failed: 89,
    },
    {
      date: '31.07',
      sent: 6234,
      delivered: 5987,
      opened: 4123,
      clicked: 1056,
      failed: 156,
    },
    {
      date: '01.08',
      sent: 5891,
      delivered: 5634,
      opened: 3891,
      clicked: 978,
      failed: 134,
    },
    {
      date: '02.08',
      sent: 6456,
      delivered: 6234,
      opened: 4567,
      clicked: 1123,
      failed: 98,
    },
    {
      date: '03.08',
      sent: 7234,
      delivered: 6987,
      opened: 5123,
      clicked: 1234,
      failed: 145,
    },
    {
      date: '04.08',
      sent: 6789,
      delivered: 6456,
      opened: 4789,
      clicked: 1167,
      failed: 176,
    },
    {
      date: '05.08',
      sent: 7456,
      delivered: 7123,
      opened: 5234,
      clicked: 1289,
      failed: 123,
    },
    {
      date: '06.08',
      sent: 8123,
      delivered: 7789,
      opened: 5789,
      clicked: 1456,
      failed: 189,
    },
    {
      date: '07.08',
      sent: 7891,
      delivered: 7534,
      opened: 5456,
      clicked: 1378,
      failed: 167,
    },
    {
      date: '08.08',
      sent: 8234,
      delivered: 7987,
      opened: 5891,
      clicked: 1534,
      failed: 145,
    },
    {
      date: '09.08',
      sent: 7567,
      delivered: 7234,
      opened: 5234,
      clicked: 1345,
      failed: 198,
    },
  ]);

  const [templatePerformance] = useState<TemplatePerformance[]>([
    {
      id: '1',
      name: 'Neue Bestellung - Bestätigung',
      type: 'email',
      category: 'Bestellungen',
      totalSent: 23456,
      deliveryRate: 97.8,
      openRate: 94.2,
      clickRate: 23.8,
      conversionRate: 18.5,
      averageEngagement: 8.2,
      lastUsed: '2025-08-27T08:30:00Z',
      trend: 'up',
      trendValue: 5.3,
    },
    {
      id: '2',
      name: 'Monatsrechnung verfügbar',
      type: 'email',
      category: 'Abrechnung',
      totalSent: 12789,
      deliveryRate: 98.7,
      openRate: 98.7,
      clickRate: 45.2,
      conversionRate: 42.1,
      averageEngagement: 9.1,
      lastUsed: '2025-08-26T15:20:00Z',
      trend: 'up',
      trendValue: 2.8,
    },
    {
      id: '3',
      name: 'Willkommen neuer Kunde',
      type: 'push',
      category: 'Kunden',
      totalSent: 8945,
      deliveryRate: 94.4,
      openRate: 87.5,
      clickRate: 12.3,
      conversionRate: 8.7,
      averageEngagement: 6.8,
      lastUsed: '2025-08-27T12:45:00Z',
      trend: 'stable',
      trendValue: 0.2,
    },
    {
      id: '4',
      name: 'Lagerbestand niedrig - Warnung',
      type: 'sms',
      category: 'System',
      totalSent: 456,
      deliveryRate: 98.2,
      openRate: 95.6,
      clickRate: 67.8,
      conversionRate: 89.2,
      averageEngagement: 9.5,
      lastUsed: '2025-08-27T14:15:00Z',
      trend: 'up',
      trendValue: 12.4,
    },
    {
      id: '5',
      name: 'Sonderangebot - Motoröl',
      type: 'email',
      category: 'Marketing',
      totalSent: 15678,
      deliveryRate: 96.3,
      openRate: 73.8,
      clickRate: 15.6,
      conversionRate: 4.2,
      averageEngagement: 5.1,
      lastUsed: '2025-08-25T10:00:00Z',
      trend: 'down',
      trendValue: -3.7,
    },
    {
      id: '6',
      name: 'Zahlung fehlgeschlagen',
      type: 'slack',
      category: 'Abrechnung',
      totalSent: 89,
      deliveryRate: 100.0,
      openRate: 100.0,
      clickRate: 78.6,
      conversionRate: 95.5,
      averageEngagement: 9.8,
      lastUsed: '2025-08-26T16:30:00Z',
      trend: 'up',
      trendValue: 8.9,
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

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, JSX.Element> = {
      email: <Mail className="h-4 w-4" />,
      sms: <Smartphone className="h-4 w-4" />,
      push: <Bell className="h-4 w-4" />,
      slack: <MessageSquare className="h-4 w-4" />,
    };
    return icons[channel] || <Bell className="h-4 w-4" />;
  };

  const getChannelLabel = (channel: string) => {
    const labels: Record<string, string> = {
      email: 'E-Mail',
      sms: 'SMS',
      push: 'Push',
      slack: 'Slack',
    };
    return labels[channel] || channel;
  };

  const getTrendIcon = (trend: string) => {
    const icons: Record<string, JSX.Element> = {
      up: <ArrowUp className="h-3 w-3 text-green-600" />,
      down: <ArrowDown className="h-3 w-3 text-red-600" />,
      stable: <Minus className="h-3 w-3 text-gray-600" />,
    };
    return icons[trend] || <Minus className="h-3 w-3 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    const colors: Record<string, string> = {
      up: 'text-green-600',
      down: 'text-red-600',
      stable: 'text-gray-600',
    };
    return colors[trend] || 'text-gray-600';
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('de-DE');
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const pieChartData = [
    { name: 'Zugestellt', value: overallStats.delivered, color: '#10b981' },
    { name: 'Geöffnet', value: overallStats.opened, color: '#3b82f6' },
    { name: 'Geklickt', value: overallStats.clicked, color: '#8b5cf6' },
    { name: 'Fehlgeschlagen', value: overallStats.failed, color: '#ef4444' },
  ];

  if (loading) {
    return (
    <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analytics werden geladen...</p>
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
              Benachrichtigungs-Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Detaillierte Performance-Analyse Ihrer Benachrichtigungen
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
                <SelectItem value="custom">Benutzerdefiniert</SelectItem>
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
              Bericht exportieren
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Gesamt gesendet
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(overallStats.totalSent)}
                    </p>
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Zustellrate
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(overallStats.deliveryRate)}
                    </p>
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2.1%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Öffnungsrate
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(overallStats.openRate)}
                    </p>
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5.3%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Klickrate</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(overallStats.clickRate)}
                    </p>
                    <span className="text-sm text-red-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -1.2%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MousePointer className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="channels">Kanäle</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Delivery Overview Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Zustellungs-Übersicht</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatNumber(Number(value))}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance-Metriken</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Zugestellt</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(overallStats.delivered)} Nachrichten
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatPercentage(overallStats.deliveryRate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Geöffnet</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(overallStats.opened)} Nachrichten
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {formatPercentage(overallStats.openRate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded">
                        <MousePointer className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Geklickt</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(overallStats.clicked)} Nachrichten
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        {formatPercentage(overallStats.clickRate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Fehlgeschlagen</p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(overallStats.failed)} Nachrichten
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        {formatPercentage(
                          (overallStats.failed / overallStats.totalSent) * 100
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Aktuelle Aktivität (letzte 14 Tage)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sent"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Gesendet"
                    />
                    <Area
                      type="monotone"
                      dataKey="delivered"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Zugestellt"
                    />
                    <Area
                      type="monotone"
                      dataKey="opened"
                      stackId="3"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.6}
                      name="Geöffnet"
                    />
                    <Area
                      type="monotone"
                      dataKey="clicked"
                      stackId="4"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      name="Geklickt"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {channelStats.map((channelStat) => (
                <Card key={channelStat.channel}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {getChannelIcon(channelStat.channel)}
                      <span>{getChannelLabel(channelStat.channel)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Gesamt gesendet</p>
                        <p className="text-xl font-bold">
                          {formatNumber(channelStat.stats.totalSent)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Zugestellt</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatPercentage(channelStat.stats.deliveryRate)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Öffnungsrate</p>
                        <p className="text-xl font-bold text-blue-600">
                          {formatPercentage(channelStat.stats.openRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Klickrate</p>
                        <p className="text-xl font-bold text-purple-600">
                          {formatPercentage(channelStat.stats.clickRate)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Bounce Rate
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {formatPercentage(channelStat.stats.bounceRate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Abmelderate
                        </span>
                        <span className="text-sm font-medium text-orange-600">
                          {formatPercentage(channelStat.stats.unsubscribeRate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template-Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead>Gesendet</TableHead>
                      <TableHead>Zustellrate</TableHead>
                      <TableHead>Öffnungsrate</TableHead>
                      <TableHead>Klickrate</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templatePerformance.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-gray-600">
                              {template.category}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(template.type)}
                            <span>{getChannelLabel(template.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatNumber(template.totalSent)}
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">
                            {formatPercentage(template.deliveryRate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600 font-medium">
                            {formatPercentage(template.openRate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-purple-600 font-medium">
                            {formatPercentage(template.clickRate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center space-x-1 ${getTrendColor(
                              template.trend
                            )}`}
                          >
                            {getTrendIcon(template.trend)}
                            <span className="text-sm font-medium">
                              {template.trend !== 'stable'
                                ? `${
                                    template.trendValue > 0 ? '+' : ''
                                  }${template.trendValue.toFixed(1)}%`
                                : 'Stabil'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance-Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sent"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Gesendet"
                    />
                    <Line
                      type="monotone"
                      dataKey="delivered"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Zugestellt"
                    />
                    <Line
                      type="monotone"
                      dataKey="opened"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Geöffnet"
                    />
                    <Line
                      type="monotone"
                      dataKey="clicked"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Geklickt"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Beste Öffnungszeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        09:00 - 11:00
                      </span>
                      <span className="font-medium text-green-600">78.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        14:00 - 16:00
                      </span>
                      <span className="font-medium text-blue-600">65.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        19:00 - 21:00
                      </span>
                      <span className="font-medium text-purple-600">59.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Wochentage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dienstag</span>
                      <span className="font-medium text-green-600">71.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mittwoch</span>
                      <span className="font-medium text-blue-600">68.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Donnerstag</span>
                      <span className="font-medium text-purple-600">66.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verbesserungstipps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        SMS-Templates zeigen 23% höhere Öffnungsraten
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Personalisierte Betreffzeilen steigern Klicks um 14%
                      </AlertDescription>
                    </Alert>
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
              onClick={() => router.push('/partner/notifications/templates')}
            >
              <Activity className="h-4 w-4 mr-2" />
              Templates verwalten
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/notifications/preferences')}
            >
              <Bell className="h-4 w-4 mr-2" />
              Einstellungen
            </Button>

            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Vollständiger Report
            </Button>

            <Button variant="outline" className="justify-start">
              <Filter className="h-4 w-4 mr-2" />
              Erweiterte Filter
            </Button>
          </div>
        </div>
      </div>
  );
}


