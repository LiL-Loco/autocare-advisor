'use client';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Globe,
  Mail,
  Monitor,
  MousePointer,
  RefreshCw,
  Smartphone,
  Tablet,
  TrendingUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface AnalyticsData {
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSent: number;
    avgOpenRate: number;
    avgClickRate: number;
    totalRevenue: number;
    totalConversions: number;
  };
  campaignPerformance: {
    campaignId: string;
    name: string;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    revenue: number;
    roi: number;
  }[];
  timeSeriesData: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  }[];
  demographicData: {
    devices: { mobile: number; desktop: number; tablet: number };
    locations: { [country: string]: number };
    timeOfDay: { [hour: string]: number };
  };
  compareData?: {
    previousPeriod: {
      totalSent: number;
      avgOpenRate: number;
      avgClickRate: number;
      totalRevenue: number;
    };
    change: {
      totalSent: number;
      avgOpenRate: number;
      avgClickRate: number;
      totalRevenue: number;
    };
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  format?: 'number' | 'percentage' | 'currency';
}

const EmailAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    loadAnalyticsData();
  }, [timeframe]);

  const loadAnalyticsData = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setAnalyticsData({
        summary: {
          totalCampaigns: 42,
          activeCampaigns: 8,
          totalSent: 127843,
          avgOpenRate: 78.3,
          avgClickRate: 23.7,
          totalRevenue: 89450,
          totalConversions: 1789,
        },
        campaignPerformance: [
          {
            campaignId: '1',
            name: 'Partner Onboarding Sequence',
            sent: 1247,
            opened: 1054,
            clicked: 342,
            converted: 156,
            openRate: 84.5,
            clickRate: 27.4,
            conversionRate: 12.5,
            revenue: 7800,
            roi: 340,
          },
          {
            campaignId: '2',
            name: 'Winter Special Campaign',
            sent: 8930,
            opened: 6845,
            clicked: 1876,
            converted: 892,
            openRate: 76.6,
            clickRate: 21.0,
            conversionRate: 10.0,
            revenue: 44600,
            roi: 287,
          },
          {
            campaignId: '3',
            name: 'Re-engagement Campaign',
            sent: 2156,
            opened: 1295,
            clicked: 387,
            converted: 89,
            openRate: 60.1,
            clickRate: 17.9,
            conversionRate: 4.1,
            revenue: 4450,
            roi: 156,
          },
        ],
        timeSeriesData: [
          {
            date: '2024-11-01',
            sent: 4250,
            opened: 3315,
            clicked: 892,
            converted: 178,
          },
          {
            date: '2024-11-02',
            sent: 3890,
            opened: 3041,
            clicked: 823,
            converted: 164,
          },
          {
            date: '2024-11-03',
            sent: 5120,
            opened: 4096,
            clicked: 1126,
            converted: 225,
          },
          {
            date: '2024-11-04',
            sent: 4680,
            opened: 3744,
            clicked: 1032,
            converted: 187,
          },
          {
            date: '2024-11-05',
            sent: 3950,
            opened: 3160,
            clicked: 869,
            converted: 158,
          },
        ],
        demographicData: {
          devices: { mobile: 56, desktop: 32, tablet: 12 },
          locations: {
            Deutschland: 62,
            Österreich: 18,
            Schweiz: 15,
            Andere: 5,
          },
          timeOfDay: {
            '09': 18,
            '10': 24,
            '11': 19,
            '12': 12,
            '13': 8,
            '14': 15,
            '15': 22,
            '16': 28,
            '17': 19,
            '18': 14,
            '19': 12,
            '20': 8,
          },
        },
        compareData: {
          previousPeriod: {
            totalSent: 98750,
            avgOpenRate: 74.8,
            avgClickRate: 21.2,
            totalRevenue: 76300,
          },
          change: {
            totalSent: +29.5,
            avgOpenRate: +4.7,
            avgClickRate: +11.8,
            totalRevenue: +17.2,
          },
        },
      });
      setLoading(false);
    }, 1000);
  };

  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon,
    format = 'number',
  }) => {
    const formatValue = (val: string | number) => {
      if (format === 'percentage') return `${val}%`;
      if (format === 'currency') return `€${Number(val).toLocaleString()}`;
      return Number(val).toLocaleString();
    };

    const getChangeColor = (change: number) => {
      return change > 0
        ? 'text-green-600'
        : change < 0
        ? 'text-red-600'
        : 'text-gray-600';
    };

    const getChangeIcon = (change: number) => {
      return change > 0 ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      );
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(value)}
              </p>
              {change !== undefined && (
                <div
                  className={`flex items-center mt-1 text-sm ${getChangeColor(
                    change
                  )}`}
                >
                  {getChangeIcon(change)}
                  <span className="ml-1">
                    {Math.abs(change)}% vs. Vorperiode
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CampaignPerformanceChart: React.FC<{
    data: AnalyticsData['campaignPerformance'];
  }> = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.openRate));

    return (
      <div className="space-y-4">
        {data.map((campaign, index) => (
          <div key={campaign.campaignId} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-gray-600">
                  {campaign.sent.toLocaleString()} E-Mails versendet
                </p>
              </div>
              <Badge variant="outline">ROI: {campaign.roi}%</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {campaign.openRate}%
                </p>
                <p className="text-xs text-gray-500">Öffnungsrate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {campaign.clickRate}%
                </p>
                <p className="text-xs text-gray-500">Klickrate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">
                  {campaign.conversionRate}%
                </p>
                <p className="text-xs text-gray-500">Conversion</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Öffnungsrate</span>
                <span>{campaign.openRate}%</span>
              </div>
              <Progress
                value={(campaign.openRate / maxValue) * 100}
                className="h-2"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const DeviceBreakdown: React.FC<{
    data: { mobile: number; desktop: number; tablet: number };
  }> = ({ data }) => {
    const total = data.mobile + data.desktop + data.tablet;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Mobile</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{data.mobile}%</p>
            <Progress value={data.mobile} className="w-20 h-2 mt-1" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Desktop</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{data.desktop}%</p>
            <Progress value={data.desktop} className="w-20 h-2 mt-1" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tablet className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Tablet</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{data.tablet}%</p>
            <Progress value={data.tablet} className="w-20 h-2 mt-1" />
          </div>
        </div>
      </div>
    );
  };

  const LocationBreakdown: React.FC<{
    data: { [country: string]: number };
  }> = ({ data }) => {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([country, percentage]) => (
          <div key={country} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{country}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{percentage}%</p>
              <Progress value={percentage} className="w-16 h-2 mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const exportReport = () => {
    // Implementation for report export
    console.log('Exporting analytics report...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Lade Analytics-Daten...</span>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            E-Mail Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Detaillierte Performance-Analysen Ihrer E-Mail-Kampagnen
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Letzte 7 Tage</SelectItem>
              <SelectItem value="30d">Letzte 30 Tage</SelectItem>
              <SelectItem value="90d">Letzte 90 Tage</SelectItem>
              <SelectItem value="custom">Benutzerdefiniert</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Report exportieren
          </Button>

          <Button onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Gesendete E-Mails"
          value={analyticsData.summary.totalSent}
          change={analyticsData.compareData?.change.totalSent}
          icon={<Mail className="h-6 w-6 text-blue-600" />}
          format="number"
        />
        <MetricCard
          title="Durchschnittliche Öffnungsrate"
          value={analyticsData.summary.avgOpenRate}
          change={analyticsData.compareData?.change.avgOpenRate}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
          format="percentage"
        />
        <MetricCard
          title="Durchschnittliche Klickrate"
          value={analyticsData.summary.avgClickRate}
          change={analyticsData.compareData?.change.avgClickRate}
          icon={<MousePointer className="h-6 w-6 text-purple-600" />}
          format="percentage"
        />
        <MetricCard
          title="Gesamtumsatz"
          value={analyticsData.summary.totalRevenue}
          change={analyticsData.compareData?.change.totalRevenue}
          icon={<DollarSign className="h-6 w-6 text-orange-600" />}
          format="currency"
        />
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Kampagnen Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demografische Daten</TabsTrigger>
          <TabsTrigger value="trends">Zeitliche Trends</TabsTrigger>
          <TabsTrigger value="reports">Reports & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Kampagnen Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignPerformanceChart
                data={analyticsData.campaignPerformance}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Geräte-Aufschlüsselung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceBreakdown data={analyticsData.demographicData.devices} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geografische Verteilung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationBreakdown
                  data={analyticsData.demographicData.locations}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Aktivität nach Tageszeit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(analyticsData.demographicData.timeOfDay).map(
                  ([hour, percentage]) => (
                    <div key={hour} className="text-center p-2 border rounded">
                      <p className="text-xs font-medium text-gray-600">
                        {hour}:00
                      </p>
                      <p className="text-sm font-bold">{percentage}%</p>
                      <Progress value={percentage} className="h-1 mt-1" />
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Zeitliche Entwicklung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.timeSeriesData.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(data.date).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Gesendet</p>
                        <p className="font-semibold">
                          {data.sent.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Geöffnet</p>
                        <p className="font-semibold text-green-600">
                          {data.opened.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Geklickt</p>
                        <p className="font-semibold text-blue-600">
                          {data.clicked.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Konvertiert</p>
                        <p className="font-semibold text-purple-600">
                          {data.converted}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automatisierte Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      Wöchentlicher Performance Report
                    </p>
                    <p className="text-sm text-gray-600">
                      Jeden Montag um 9:00 Uhr
                    </p>
                  </div>
                  <Badge variant="outline">Aktiv</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Monatlicher ROI Report</p>
                    <p className="text-sm text-gray-600">Am 1. jedes Monats</p>
                  </div>
                  <Badge variant="outline">Aktiv</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manuelle Exports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" onClick={exportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Vollständiger Analytics Report (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Kampagnen-Daten (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Demografische Daten (Excel)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailAnalyticsDashboard;
