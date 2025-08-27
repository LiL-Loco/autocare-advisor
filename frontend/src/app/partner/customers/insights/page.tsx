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
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Euro,
  Eye,
  Filter,
  Lightbulb,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  ShoppingCart,
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
  EnhancedMetricCard,
  TrendAnalysis,
} from '../../../../components/partner/analytics/AdvancedCharts';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'opportunity' | 'risk' | 'optimization' | 'prediction' | 'alert';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  impact: {
    revenue: number;
    customers: number;
    conversion: number;
  };
  timeframe: string;
  actionable: boolean;
  actions: string[];
  dataPoints: string[];
  createdAt: string;
}

interface CustomerInsight {
  customerId: string;
  companyName: string;
  insights: {
    churnRisk: number;
    upsellPotential: number;
    nextPurchaseProbability: number;
    preferredProducts: string[];
    optimalContactTime: string;
    communicationPreference: string;
    lifetimeValuePrediction: number;
  };
  recommendations: Array<{
    type: 'retention' | 'upsell' | 'engagement' | 'support';
    action: string;
    priority: number;
    expectedImpact: string;
  }>;
}

interface PredictiveModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastUpdated: string;
  predictions: Array<{
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    timeframe: string;
  }>;
}

export default function CustomerInsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock AI insights data
  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      title: 'Kritisches Churn-Risiko bei Premium-Kunden',
      description:
        'KI-Algorithmus identifiziert 23 Premium-Kunden mit 78% Wahrscheinlichkeit für Abwanderung in den nächsten 30 Tagen. Hauptfaktoren: Sinkende Bestellfrequenz und reduzierte Engagement-Rate.',
      category: 'risk',
      priority: 'high',
      confidence: 78.4,
      impact: {
        revenue: -145000,
        customers: 23,
        conversion: -12.3,
      },
      timeframe: '30 Tage',
      actionable: true,
      actions: [
        'Persönliche Account-Manager Anrufe',
        'Exklusive Rabattangebote versenden',
        'Produktempfehlungen basierend auf Historie',
        'Kundenzufriedenheits-Survey durchführen',
      ],
      dataPoints: [
        'Letzte Bestellung > 45 Tage',
        'Email-Open-Rate < 15%',
        'Produktseiten-Aufrufe -60%',
        'Support-Anfragen +40%',
      ],
      createdAt: '2024-01-20T09:15:00Z',
    },
    {
      id: '2',
      title: 'Cross-Selling Goldmine bei Wachstumskunden',
      description:
        'Maschinelles Lernen identifiziert 156 Wachstumskunden mit hohem Potenzial für Produkterweiterungen. Durchschnittliches Upselling-Potenzial: €2.340 pro Kunde.',
      category: 'opportunity',
      priority: 'high',
      confidence: 85.2,
      impact: {
        revenue: 365040,
        customers: 156,
        conversion: 23.7,
      },
      timeframe: '60 Tage',
      actionable: true,
      actions: [
        'Automatisierte Produktempfehlungen aktivieren',
        'Bundle-Angebote für komplementäre Produkte',
        'Zielgerichtete Email-Kampagnen',
        'Rabatt-Incentives für Zweitbestellungen',
      ],
      dataPoints: [
        'Ähnliche Kunden kauften zusätzlich',
        'Warenkorb-Analyse zeigt Muster',
        'Saisonale Kauftrends erkannt',
        'Komplementäre Produktnutzung',
      ],
      createdAt: '2024-01-20T10:30:00Z',
    },
    {
      id: '3',
      title: 'Mobile Checkout Optimierung kritisch',
      description:
        'Predictive Analytics zeigt 31% Konversions-Steigerung durch Mobile-UX Verbesserungen. 67% der Warenkorbabbrüche passieren auf mobilen Geräten im Bezahlschritt.',
      category: 'optimization',
      priority: 'medium',
      confidence: 92.1,
      impact: {
        revenue: 89450,
        customers: 0,
        conversion: 31.2,
      },
      timeframe: '90 Tage',
      actionable: true,
      actions: [
        'One-Click-Bezahlung implementieren',
        'Mobile Checkout-Flow vereinfachen',
        'Payment-Optionen erweitern',
        'Progressive Web App entwickeln',
      ],
      dataPoints: [
        'Mobile Bounce-Rate 45%',
        'Checkout-Abbruch Schritt 3: 67%',
        'Ladezeit Mobile > 3.2s',
        'Touch-Optimierung unzureichend',
      ],
      createdAt: '2024-01-20T11:45:00Z',
    },
    {
      id: '4',
      title: 'Saisonaler Nachfrage-Peak vorhergesagt',
      description:
        'Predictive Model prognostiziert 47% Nachfrage-Steigerung für Winterprodukte in 6-8 Wochen. Lagerbestände und Marketing-Budget entsprechend anpassen.',
      category: 'prediction',
      priority: 'medium',
      confidence: 73.6,
      impact: {
        revenue: 234000,
        customers: 0,
        conversion: 0,
      },
      timeframe: '6-8 Wochen',
      actionable: true,
      actions: [
        'Lagerbestände für Winterprodukte erhöhen',
        'Seasonal Marketing Kampagne vorbereiten',
        'Lieferanten-Kapazitäten sichern',
        'Preisstrategien für Peak-Season',
      ],
      dataPoints: [
        'Historische Saisonmuster',
        'Wetterdaten-Korrelation',
        'Branchentrends Analyse',
        'Konkurrenz-Monitoring',
      ],
      createdAt: '2024-01-20T08:20:00Z',
    },
  ]);

  // Mock customer insights
  const [customerInsights] = useState<CustomerInsight[]>([
    {
      customerId: '1',
      companyName: 'AutoTech Bayern GmbH',
      insights: {
        churnRisk: 15.2,
        upsellPotential: 87.3,
        nextPurchaseProbability: 92.4,
        preferredProducts: [
          'Premium-Motoröl 5W-30',
          'Hochleistungs-Bremsflüssigkeit',
        ],
        optimalContactTime: 'Dienstag 10:00-12:00',
        communicationPreference: 'E-Mail',
        lifetimeValuePrediction: 45670.8,
      },
      recommendations: [
        {
          type: 'upsell',
          action: 'Spezial-Schmierstoffe Bundle anbieten',
          priority: 1,
          expectedImpact: '+€2.340 Umsatz',
        },
        {
          type: 'engagement',
          action: 'Technische Webinar-Einladung versenden',
          priority: 2,
          expectedImpact: '+15% Engagement',
        },
      ],
    },
    {
      customerId: '2',
      companyName: 'Maschinenbau Schmidt',
      insights: {
        churnRisk: 67.8,
        upsellPotential: 23.4,
        nextPurchaseProbability: 34.1,
        preferredProducts: ['Standard-Getriebeöl', 'Kühlmittel-Konzentrat'],
        optimalContactTime: 'Freitag 14:00-16:00',
        communicationPreference: 'Telefon',
        lifetimeValuePrediction: 12450.3,
      },
      recommendations: [
        {
          type: 'retention',
          action: 'Persönlicher Account-Manager Anruf',
          priority: 1,
          expectedImpact: '-45% Churn-Risiko',
        },
        {
          type: 'support',
          action: 'Technische Beratung zu Produktalternativen',
          priority: 2,
          expectedImpact: '+€890 Bestellwert',
        },
      ],
    },
  ]);

  // Mock predictive models
  const [predictiveModels] = useState<PredictiveModel[]>([
    {
      id: '1',
      name: 'Churn Prediction Model',
      description:
        'Vorhersage von Kundenabwanderung basierend auf Verhaltensindikatoren',
      accuracy: 84.7,
      lastUpdated: '2024-01-20T12:00:00Z',
      predictions: [
        {
          metric: 'Monatliche Churn-Rate',
          currentValue: 8.4,
          predictedValue: 6.7,
          confidence: 82.3,
          timeframe: 'Nächste 30 Tage',
        },
        {
          metric: 'Risiko-Kunden',
          currentValue: 89,
          predictedValue: 134,
          confidence: 78.9,
          timeframe: 'Nächste 60 Tage',
        },
      ],
    },
    {
      id: '2',
      name: 'Revenue Forecasting Model',
      description:
        'Umsatzprognose basierend auf Kundensegmenten und Markttrends',
      accuracy: 91.2,
      lastUpdated: '2024-01-20T11:30:00Z',
      predictions: [
        {
          metric: 'Monatsumsatz',
          currentValue: 890000,
          predictedValue: 1240000,
          confidence: 89.4,
          timeframe: 'Nächste 30 Tage',
        },
        {
          metric: 'Durchschn. Bestellwert',
          currentValue: 1247,
          predictedValue: 1389,
          confidence: 76.1,
          timeframe: 'Nächste 45 Tage',
        },
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const filteredInsights = aiInsights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || insight.category === categoryFilter;
    const matchesPriority =
      priorityFilter === 'all' || insight.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      opportunity: 'bg-green-100 text-green-800',
      risk: 'bg-red-100 text-red-800',
      optimization: 'bg-blue-100 text-blue-800',
      prediction: 'bg-purple-100 text-purple-800',
      alert: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      opportunity: 'Chance',
      risk: 'Risiko',
      optimization: 'Optimierung',
      prediction: 'Vorhersage',
      alert: 'Warnung',
    };
    return labels[category] || category;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      high: 'Hoch',
      medium: 'Mittel',
      low: 'Niedrig',
    };
    return labels[priority] || priority;
  };

  const getRecommendationTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      retention: <Users className="h-4 w-4" />,
      upsell: <TrendingUp className="h-4 w-4" />,
      engagement: <Activity className="h-4 w-4" />,
      support: <MessageSquare className="h-4 w-4" />,
    };
    return icons[type] || <Target className="h-4 w-4" />;
  };

  const getRecommendationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      retention: 'Bindung',
      upsell: 'Upselling',
      engagement: 'Engagement',
      support: 'Support',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              KI-Insights werden generiert...
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
              KI-Kunden-Insights & Empfehlungen
            </h1>
            <p className="text-gray-600 mt-1">
              Intelligente Kundenanalysen mit maschinellem Lernen und
              prädiktiven Modellen
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
              {refreshing ? 'KI analysiert...' : 'Neu analysieren'}
            </Button>

            <Button>
              <Download className="h-4 w-4 mr-2" />
              Insights-Report
            </Button>
          </div>
        </div>

        {/* AI Insights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="Aktive Insights"
            value={aiInsights.length.toString()}
            change={{
              value: 3,
              period: 'Neue heute',
              type: 'increase',
            }}
            color="blue"
            icon="Brain"
          />

          <EnhancedMetricCard
            title="Umsetzbare Empfehlungen"
            value={aiInsights.filter((i) => i.actionable).length.toString()}
            change={{
              value: 85.7,
              period: 'Erfolgsrate',
              type: 'increase',
            }}
            color="green"
            icon="Lightbulb"
          />

          <EnhancedMetricCard
            title="Potenzielle Umsatzsteigerung"
            value={formatCurrency(
              aiInsights.reduce(
                (sum, i) => sum + (i.impact.revenue > 0 ? i.impact.revenue : 0),
                0
              )
            )}
            change={{
              value: 12.4,
              period: 'vs. Vorprognose',
              type: 'increase',
            }}
            color="purple"
            icon="Euro"
          />

          <EnhancedMetricCard
            title="Durchschnittliche Konfidenz"
            value={`${(
              aiInsights.reduce((sum, i) => sum + i.confidence, 0) /
              aiInsights.length
            ).toFixed(1)}%`}
            change={{
              value: 3.2,
              period: 'Modell-Verbesserung',
              type: 'increase',
            }}
            color="yellow"
            icon="Sparkles"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Insights suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  <SelectItem value="opportunity">Chancen</SelectItem>
                  <SelectItem value="risk">Risiken</SelectItem>
                  <SelectItem value="optimization">Optimierungen</SelectItem>
                  <SelectItem value="prediction">Vorhersagen</SelectItem>
                  <SelectItem value="alert">Warnungen</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priorität" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="low">Niedrig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">KI-Insights</TabsTrigger>
            <TabsTrigger value="customers">Kunden-Insights</TabsTrigger>
            <TabsTrigger value="predictions">Prognosen</TabsTrigger>
            <TabsTrigger value="models">Modelle</TabsTrigger>
          </TabsList>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {filteredInsights.map((insight) => (
                <Card
                  key={insight.id}
                  className={`border-l-4 ${
                    insight.category === 'risk'
                      ? 'border-l-red-500'
                      : insight.category === 'opportunity'
                      ? 'border-l-green-500'
                      : insight.category === 'optimization'
                      ? 'border-l-blue-500'
                      : insight.category === 'prediction'
                      ? 'border-l-purple-500'
                      : 'border-l-yellow-500'
                  } hover:shadow-lg transition-shadow`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">
                            {insight.title}
                          </CardTitle>
                          <Badge
                            className={getCategoryColor(insight.category)}
                            variant="secondary"
                          >
                            {getCategoryLabel(insight.category)}
                          </Badge>
                          <Badge
                            className={getPriorityColor(insight.priority)}
                            variant="outline"
                          >
                            {getPriorityLabel(insight.priority)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {insight.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              Konfidenz
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              {insight.confidence.toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              Zeitrahmen
                            </div>
                            <div className="text-lg font-semibold">
                              {insight.timeframe}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              Umsatz-Impact
                            </div>
                            <div
                              className={`text-lg font-bold ${
                                insight.impact.revenue > 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {insight.impact.revenue > 0 ? '+' : ''}
                              {formatCurrency(insight.impact.revenue)}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              Betroffene Kunden
                            </div>
                            <div className="text-lg font-bold text-purple-600">
                              {insight.impact.customers > 0
                                ? formatNumber(insight.impact.customers)
                                : '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {insight.actionable && (
                      <div>
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Empfohlene Maßnahmen
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {insight.actions.map((action, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                            >
                              <ArrowRight className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-green-800">
                                {action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Zugrunde liegende Datenpunkte
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.dataPoints.map((point, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Generiert:{' '}
                        {new Intl.DateTimeFormat('de-DE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(insight.createdAt))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        {insight.actionable && (
                          <Button size="sm">
                            <Zap className="h-3 w-3 mr-1" />
                            Aktion starten
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredInsights.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Keine Insights gefunden
                  </h3>
                  <p className="text-gray-500">
                    Passen Sie Ihre Filter an oder warten Sie auf neue
                    KI-Analysen.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Customer Insights Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="space-y-6">
              {customerInsights.map((customer) => (
                <Card
                  key={customer.customerId}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{customer.companyName}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            customer.insights.churnRisk > 60
                              ? 'bg-red-100 text-red-800'
                              : customer.insights.churnRisk > 30
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }
                          variant="secondary"
                        >
                          {customer.insights.churnRisk > 60
                            ? 'Hohes Risiko'
                            : customer.insights.churnRisk > 30
                            ? 'Mittleres Risiko'
                            : 'Niedriges Risiko'}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* KI-Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Churn-Risiko
                          </span>
                          <AlertTriangle
                            className={`h-4 w-4 ${
                              customer.insights.churnRisk > 60
                                ? 'text-red-500'
                                : customer.insights.churnRisk > 30
                                ? 'text-yellow-500'
                                : 'text-green-500'
                            }`}
                          />
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            customer.insights.churnRisk > 60
                              ? 'text-red-600'
                              : customer.insights.churnRisk > 30
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {customer.insights.churnRisk.toFixed(1)}%
                        </div>
                        <Progress
                          value={customer.insights.churnRisk}
                          className="h-2 mt-2"
                        />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Upsell-Potenzial
                          </span>
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {customer.insights.upsellPotential.toFixed(1)}%
                        </div>
                        <Progress
                          value={customer.insights.upsellPotential}
                          className="h-2 mt-2"
                        />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Kaufwahrscheinlichkeit
                          </span>
                          <ShoppingCart className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {customer.insights.nextPurchaseProbability.toFixed(1)}
                          %
                        </div>
                        <Progress
                          value={customer.insights.nextPurchaseProbability}
                          className="h-2 mt-2"
                        />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Progn. Lifetime Value
                          </span>
                          <Euro className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="text-lg font-bold text-purple-600">
                          {formatCurrency(
                            customer.insights.lifetimeValuePrediction
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Customer Preferences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Produktpräferenzen
                        </h4>
                        <div className="space-y-2">
                          {customer.insights.preferredProducts.map(
                            (product, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="mr-2 mb-2"
                              >
                                {product}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">
                          Kommunikations-Insights
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Optimale Kontaktzeit:</span>
                            <Badge variant="outline">
                              {customer.insights.optimalContactTime}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Bevorzugter Kanal:</span>
                            <div className="flex items-center gap-1">
                              {customer.insights.communicationPreference ===
                                'E-Mail' && <Mail className="h-4 w-4" />}
                              {customer.insights.communicationPreference ===
                                'Telefon' && <Phone className="h-4 w-4" />}
                              {customer.insights.communicationPreference ===
                                'Chat' && <MessageSquare className="h-4 w-4" />}
                              <Badge variant="outline">
                                {customer.insights.communicationPreference}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        KI-Empfehlungen
                      </h4>
                      <div className="space-y-3">
                        {customer.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-blue-600">
                                {getRecommendationTypeIcon(rec.type)}
                              </div>
                              <div>
                                <div className="font-medium">{rec.action}</div>
                                <div className="text-sm text-gray-600">
                                  {getRecommendationTypeLabel(rec.type)} •
                                  Erwarteter Effekt: {rec.expectedImpact}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={
                                rec.priority === 1
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                              variant="secondary"
                            >
                              Priorität {rec.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Umsatz-Prognose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendAnalysis
                    data={[
                      {
                        date: 'Jan',
                        revenue: 890000,
                        clicks: 950000,
                        views: 850000,
                      },
                      {
                        date: 'Feb',
                        revenue: 920000,
                        clicks: 1020000,
                        views: 920000,
                      },
                      {
                        date: 'Mar',
                        revenue: 1050000,
                        clicks: 1150000,
                        views: 1050000,
                      },
                      {
                        date: 'Apr',
                        revenue: 1240000,
                        clicks: 1240000,
                        views: 1200000,
                      },
                    ]}
                    title="Prognostizierte Umsatzentwicklung"
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Kundenwachstum-Prognose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedChart
                    data={[
                      { name: 'Aktuell', value: 5337 },
                      { name: '30 Tage', value: 5520 },
                      { name: '60 Tage', value: 5734 },
                      { name: '90 Tage', value: 5982 },
                    ]}
                    title="Prognostizierte Kundenanzahl"
                    height={300}
                    type="line"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Prediction Alerts */}
            <div className="space-y-4">
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Umsatz-Boost erwartet:</strong> KI prognostiziert 39%
                  Umsatzsteigerung in den nächsten 60 Tagen durch optimierte
                  Produktempfehlungen und saisonale Trends.
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Churn-Welle vorhergesagt:</strong> Modell
                  identifiziert potenzielle Abwanderung von 89 Kunden in den
                  nächsten 45 Tagen. Präventive Maßnahmen empfohlen.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="space-y-6">
              {predictiveModels.map((model) => (
                <Card
                  key={model.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{model.name}</CardTitle>
                        <p className="text-gray-600 mt-1">
                          {model.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {model.accuracy.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Genauigkeit</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500">
                        Zuletzt aktualisiert:{' '}
                        {new Intl.DateTimeFormat('de-DE', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(model.lastUpdated))}
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metrik</TableHead>
                            <TableHead className="text-right">
                              Aktuell
                            </TableHead>
                            <TableHead className="text-right">
                              Prognose
                            </TableHead>
                            <TableHead className="text-right">
                              Konfidenz
                            </TableHead>
                            <TableHead>Zeitrahmen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {model.predictions.map((prediction, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {prediction.metric}
                              </TableCell>
                              <TableCell className="text-right">
                                {prediction.metric.includes('Umsatz')
                                  ? formatCurrency(prediction.currentValue)
                                  : formatNumber(prediction.currentValue)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div
                                  className={`font-semibold ${
                                    prediction.predictedValue >
                                    prediction.currentValue
                                      ? 'text-green-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {prediction.metric.includes('Umsatz')
                                    ? formatCurrency(prediction.predictedValue)
                                    : formatNumber(prediction.predictedValue)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline">
                                  {prediction.confidence.toFixed(1)}%
                                </Badge>
                              </TableCell>
                              <TableCell>{prediction.timeframe}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
              onClick={() => router.push('/partner/customers/behavior')}
            >
              <Activity className="h-4 w-4 mr-2" />
              Verhalten analysieren
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/customers/segments')}
            >
              <Users className="h-4 w-4 mr-2" />
              Segmente verwalten
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
              KI-Report exportieren
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
