'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  LineChart,
  PieChart,
  Plus,
  Save,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { AdvancedChart } from '../../../../../components/partner/analytics/AdvancedCharts';
interface ReportConfig {
  name: string;
  description: string;
  type: 'revenue' | 'products' | 'customers' | 'traffic' | 'custom';
  timeRange: string;
  metrics: string[];
  filters: Record<string, any>;
  chartType: 'line' | 'bar' | 'pie' | 'area';
  groupBy: 'day' | 'week' | 'month' | 'quarter';
}

interface SavedReport {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  lastRun: string;
  status: 'active' | 'archived';
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    type: 'revenue',
    timeRange: '30d',
    metrics: [],
    filters: {},
    chartType: 'line',
    groupBy: 'day',
  });

  const [savedReports] = useState<SavedReport[]>([
    {
      id: '1',
      name: 'Monatlicher Umsatzbericht',
      description: 'Detaillierte Umsatzanalyse mit Produktaufschlüsselung',
      type: 'Umsatz',
      createdAt: '2024-01-15',
      lastRun: '2024-01-20',
      status: 'active',
    },
    {
      id: '2',
      name: 'Produkt-Performance Dashboard',
      description: 'Top-Produkte nach Kategorien und Konversionsraten',
      type: 'Produkte',
      createdAt: '2024-01-10',
      lastRun: '2024-01-19',
      status: 'active',
    },
    {
      id: '3',
      name: 'Kundenakquisitions-Analyse',
      description: 'Neue Kunden, Traffic-Quellen und Bindungsraten',
      type: 'Kunden',
      createdAt: '2024-01-05',
      lastRun: '2024-01-18',
      status: 'active',
    },
    {
      id: '4',
      name: 'Quartalsbericht Q1 2024',
      description: 'Umfassende Leistungsübersicht für das erste Quartal',
      type: 'Übersicht',
      createdAt: '2024-01-01',
      lastRun: '2024-01-15',
      status: 'archived',
    },
  ]);

  const availableMetrics = {
    revenue: [
      { id: 'total_revenue', label: 'Gesamtumsatz' },
      { id: 'avg_order_value', label: 'Durchschnittlicher Bestellwert' },
      { id: 'commission_earned', label: 'Verdiente Provision' },
      { id: 'refunds', label: 'Rückerstattungen' },
    ],
    products: [
      { id: 'product_views', label: 'Produktaufrufe' },
      { id: 'conversion_rate', label: 'Konversionsrate' },
      { id: 'inventory_turnover', label: 'Lagerumschlag' },
      { id: 'price_performance', label: 'Preis-Leistungs-Verhältnis' },
    ],
    customers: [
      { id: 'new_customers', label: 'Neue Kunden' },
      { id: 'returning_customers', label: 'Wiederkehrende Kunden' },
      { id: 'customer_lifetime_value', label: 'Customer Lifetime Value' },
      { id: 'retention_rate', label: 'Kundenbindungsrate' },
    ],
    traffic: [
      { id: 'page_views', label: 'Seitenaufrufe' },
      { id: 'unique_visitors', label: 'Eindeutige Besucher' },
      { id: 'bounce_rate', label: 'Absprungrate' },
      { id: 'session_duration', label: 'Sitzungsdauer' },
    ],
    custom: [
      { id: 'custom_metric_1', label: 'Benutzerdefinierte Metrik 1' },
      { id: 'custom_metric_2', label: 'Benutzerdefinierte Metrik 2' },
      { id: 'custom_formula', label: 'Benutzerdefinierte Formel' },
    ],
  };

  // Mock chart data für Preview
  const previewData = [
    { name: 'Jan', value: 32000 },
    { name: 'Feb', value: 28000 },
    { name: 'Mär', value: 35000 },
    { name: 'Apr', value: 31000 },
    { name: 'Mai', value: 42000 },
    { name: 'Jun', value: 45678 },
  ];

  const handleMetricToggle = (metricId: string) => {
    setReportConfig((prev) => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter((m) => m !== metricId)
        : [...prev.metrics, metricId],
    }));
  };

  const generateReport = () => {
    console.log('Generating report with config:', reportConfig);
    // Hier würde die API-Logik für die Berichtsgenerierung stehen
  };

  const exportReport = (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report ${reportId} as ${format}`);
    // Hier würde die Export-Logik stehen
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('de-DE').format(new Date(dateString));
  };

  return (
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Benutzerdefinierte Berichte
            </h1>
            <p className="text-gray-600 mt-1">
              Erstellen Sie maßgeschneiderte Analyseberichte für Ihr Unternehmen
            </p>
          </div>

          <Button onClick={() => setActiveTab('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Neuen Bericht erstellen
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Bericht erstellen</TabsTrigger>
            <TabsTrigger value="saved">Gespeicherte Berichte</TabsTrigger>
            <TabsTrigger value="templates">Vorlagen</TabsTrigger>
          </TabsList>

          {/* Create Report Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Berichtskonfiguration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Berichtsname</Label>
                    <Input
                      id="reportName"
                      placeholder="z.B. Monatlicher Umsatzbericht"
                      value={reportConfig.name}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportDescription">Beschreibung</Label>
                    <Textarea
                      id="reportDescription"
                      placeholder="Kurze Beschreibung des Berichts..."
                      value={reportConfig.description}
                      onChange={(e) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Report Type */}
                  <div className="space-y-2">
                    <Label>Berichtstyp</Label>
                    <Select
                      value={reportConfig.type}
                      onValueChange={(value) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          type: value as any,
                          metrics: [], // Reset metrics when type changes
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Umsatz</SelectItem>
                        <SelectItem value="products">Produkte</SelectItem>
                        <SelectItem value="customers">Kunden</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                        <SelectItem value="custom">
                          Benutzerdefiniert
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Range */}
                  <div className="space-y-2">
                    <Label>Zeitraum</Label>
                    <Select
                      value={reportConfig.timeRange}
                      onValueChange={(value) =>
                        setReportConfig((prev) => ({
                          ...prev,
                          timeRange: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                        <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                        <SelectItem value="90d">Letzte 90 Tage</SelectItem>
                        <SelectItem value="1y">Letztes Jahr</SelectItem>
                        <SelectItem value="custom">
                          Benutzerdefiniert
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Chart Configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Diagrammtyp</Label>
                      <Select
                        value={reportConfig.chartType}
                        onValueChange={(value) =>
                          setReportConfig((prev) => ({
                            ...prev,
                            chartType: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Liniendiagramm</SelectItem>
                          <SelectItem value="bar">Balkendiagramm</SelectItem>
                          <SelectItem value="area">Flächendiagramm</SelectItem>
                          <SelectItem value="pie">Kreisdiagramm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Gruppierung</Label>
                      <Select
                        value={reportConfig.groupBy}
                        onValueChange={(value) =>
                          setReportConfig((prev) => ({
                            ...prev,
                            groupBy: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Täglich</SelectItem>
                          <SelectItem value="week">Wöchentlich</SelectItem>
                          <SelectItem value="month">Monatlich</SelectItem>
                          <SelectItem value="quarter">Quartalsweise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Metrics Selection */}
                  <div className="space-y-2">
                    <Label>Metriken auswählen</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {availableMetrics[reportConfig.type]?.map(
                        (metric: { id: string; label: string }) => (
                          <label
                            key={metric.id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={reportConfig.metrics.includes(metric.id)}
                              onChange={() => handleMetricToggle(metric.id)}
                              className="rounded"
                            />
                            <span className="text-sm">{metric.label}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={generateReport}
                      disabled={
                        !reportConfig.name || reportConfig.metrics.length === 0
                      }
                      className="flex-1"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Bericht generieren
                    </Button>
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Speichern
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Vorschau
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reportConfig.name ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{reportConfig.name}</h3>
                        {reportConfig.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {reportConfig.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{reportConfig.type}</Badge>
                        <Badge variant="outline">
                          {reportConfig.timeRange}
                        </Badge>
                        <Badge variant="outline">
                          {reportConfig.chartType}
                        </Badge>
                      </div>

                      {reportConfig.metrics.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Ausgewählte Metriken:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {reportConfig.metrics.map((metricId) => {
                              const metric = availableMetrics[
                                reportConfig.type
                              ]?.find(
                                (m: { id: string; label: string }) =>
                                  m.id === metricId
                              );
                              return (
                                <Badge
                                  key={metricId}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {metric?.label}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <AdvancedChart
                          data={previewData}
                          title="Vorschau-Diagramm"
                          type={reportConfig.chartType}
                          height={200}
                          colorScheme="primary"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        Konfigurieren Sie Ihren Bericht, um eine Vorschau zu
                        sehen
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Saved Reports Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {savedReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {report.name}
                          </h3>
                          <Badge
                            variant={
                              report.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {report.status === 'active'
                              ? 'Aktiv'
                              : 'Archiviert'}
                          </Badge>
                          <Badge variant="outline">{report.type}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {report.description}
                        </p>
                        <div className="text-sm text-gray-500">
                          Erstellt: {formatDate(report.createdAt)} • Zuletzt
                          ausgeführt: {formatDate(report.lastRun)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Ausführen
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Bearbeiten
                        </Button>
                        <Select>
                          <SelectTrigger className="w-32">
                            <Download className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Export" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="pdf"
                              onClick={() => exportReport(report.id, 'pdf')}
                            >
                              PDF
                            </SelectItem>
                            <SelectItem
                              value="excel"
                              onClick={() => exportReport(report.id, 'excel')}
                            >
                              Excel
                            </SelectItem>
                            <SelectItem
                              value="csv"
                              onClick={() => exportReport(report.id, 'csv')}
                            >
                              CSV
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Monatlicher Geschäftsbericht',
                  description:
                    'Umfassende Übersicht über alle wichtigen Geschäftsmetriken',
                  type: 'Übersicht',
                  icon: <TrendingUp className="h-8 w-8" />,
                },
                {
                  name: 'Produkt-Performance Analyse',
                  description:
                    'Detaillierte Analyse der besten und schwächsten Produkte',
                  type: 'Produkte',
                  icon: <BarChart3 className="h-8 w-8" />,
                },
                {
                  name: 'Kundenakquisition Dashboard',
                  description:
                    'Traffic-Quellen, Konversionen und Kundenverhalten',
                  type: 'Kunden',
                  icon: <PieChart className="h-8 w-8" />,
                },
                {
                  name: 'Finanzübersicht',
                  description: 'Umsatz, Provisionen und finanzielle KPIs',
                  type: 'Finanzen',
                  icon: <LineChart className="h-8 w-8" />,
                },
                {
                  name: 'Saisonale Trends',
                  description:
                    'Analyse saisonaler Verkaufsmuster und Prognosen',
                  type: 'Trends',
                  icon: <Calendar className="h-8 w-8" />,
                },
                {
                  name: 'Wettbewerbsanalyse',
                  description:
                    'Vergleich mit Branchenbenchmarks und Konkurrenten',
                  type: 'Markt',
                  icon: <Filter className="h-8 w-8" />,
                },
              ].map((template, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-blue-600 mb-4 flex justify-center">
                      {template.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description}
                    </p>
                    <Badge variant="outline" className="mb-4">
                      {template.type}
                    </Badge>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Vorlage verwenden
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}


