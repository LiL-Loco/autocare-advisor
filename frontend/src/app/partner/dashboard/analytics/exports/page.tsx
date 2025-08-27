'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  FileSpreadsheet,
  FileText,
  History,
  Settings,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import PartnerLayout from '../../../../../components/partner/layout/PartnerLayout';

interface ExportJob {
  id: string;
  name: string;
  type: 'analytics' | 'products' | 'customers' | 'orders' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  createdAt: string;
  completedAt?: string;
  fileSize?: string;
  recordCount?: number;
  downloadUrl?: string;
  error?: string;
}

interface ExportConfig {
  name: string;
  type: 'analytics' | 'products' | 'customers' | 'orders' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: {
    start: string;
    end: string;
    preset: '7d' | '30d' | '90d' | '1y' | 'custom';
  };
  fields: string[];
  filters: Record<string, any>;
  includeCharts: boolean;
  includeSummary: boolean;
  compression: boolean;
}

export default function ExportsPage() {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    name: '',
    type: 'analytics',
    format: 'excel',
    dateRange: {
      start: '',
      end: '',
      preset: '30d',
    },
    fields: [],
    filters: {},
    includeCharts: true,
    includeSummary: true,
    compression: false,
  });

  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Monatlicher Umsatzbericht Januar 2024',
      type: 'analytics',
      format: 'pdf',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-20T10:30:00Z',
      completedAt: '2024-01-20T10:32:45Z',
      fileSize: '2.4 MB',
      recordCount: 1523,
      downloadUrl: '/downloads/report-1.pdf',
    },
    {
      id: '2',
      name: 'Produktkatalog Export',
      type: 'products',
      format: 'excel',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-19T14:15:00Z',
      completedAt: '2024-01-19T14:18:23Z',
      fileSize: '8.7 MB',
      recordCount: 234,
      downloadUrl: '/downloads/products-2.xlsx',
    },
    {
      id: '3',
      name: 'Kundenliste Q1 2024',
      type: 'customers',
      format: 'csv',
      status: 'processing',
      progress: 67,
      createdAt: '2024-01-20T16:45:00Z',
      recordCount: 892,
    },
    {
      id: '4',
      name: 'Bestellhistorie Export',
      type: 'orders',
      format: 'json',
      status: 'failed',
      progress: 0,
      createdAt: '2024-01-20T12:00:00Z',
      error: 'Datenbankverbindung unterbrochen',
    },
  ]);

  const [isExporting, setIsExporting] = useState(false);

  const availableFields = {
    analytics: [
      { id: 'revenue', label: 'Umsatz' },
      { id: 'orders', label: 'Bestellungen' },
      { id: 'customers', label: 'Kunden' },
      { id: 'traffic', label: 'Traffic' },
      { id: 'conversions', label: 'Konversionen' },
      { id: 'products_sold', label: 'Verkaufte Produkte' },
    ],
    products: [
      { id: 'name', label: 'Produktname' },
      { id: 'sku', label: 'Artikelnummer (SKU)' },
      { id: 'category', label: 'Kategorie' },
      { id: 'price', label: 'Preis' },
      { id: 'stock', label: 'Lagerbestand' },
      { id: 'views', label: 'Aufrufe' },
      { id: 'sales', label: 'Verkäufe' },
    ],
    customers: [
      { id: 'name', label: 'Kundenname' },
      { id: 'email', label: 'E-Mail' },
      { id: 'registration_date', label: 'Registrierungsdatum' },
      { id: 'total_orders', label: 'Gesamtbestellungen' },
      { id: 'total_spent', label: 'Gesamtumsatz' },
      { id: 'last_order', label: 'Letzte Bestellung' },
    ],
    orders: [
      { id: 'order_id', label: 'Bestell-ID' },
      { id: 'customer', label: 'Kunde' },
      { id: 'date', label: 'Bestelldatum' },
      { id: 'total', label: 'Gesamtbetrag' },
      { id: 'status', label: 'Status' },
      { id: 'items', label: 'Artikel' },
    ],
    custom: [
      { id: 'custom_field_1', label: 'Benutzerdefiniertes Feld 1' },
      { id: 'custom_field_2', label: 'Benutzerdefiniertes Feld 2' },
      { id: 'calculated_field', label: 'Berechnetes Feld' },
    ],
  };

  useEffect(() => {
    // Simuliere Live-Updates für Export-Jobs
    const interval = setInterval(() => {
      setExportJobs((prev: ExportJob[]) =>
        prev.map((job: ExportJob) => {
          if (job.status === 'processing' && job.progress < 100) {
            const newProgress = Math.min(
              job.progress + Math.random() * 10,
              100
            );
            return {
              ...job,
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' : 'processing',
              completedAt:
                newProgress >= 100 ? new Date().toISOString() : undefined,
              fileSize: newProgress >= 100 ? '3.2 MB' : undefined,
            };
          }
          return job;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleFieldToggle = (fieldId: string) => {
    setExportConfig((prev: any) => ({
      ...prev,
      fields: prev.fields.includes(fieldId)
        ? prev.fields.filter((f: string) => f !== fieldId)
        : [...prev.fields, fieldId],
    }));
  };

  const handleExport = async () => {
    if (!exportConfig.name || exportConfig.fields.length === 0) {
      return;
    }

    setIsExporting(true);

    // Simuliere Export-Process
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: exportConfig.name,
      type: exportConfig.type,
      format: exportConfig.format,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString(),
      recordCount: Math.floor(Math.random() * 2000) + 100,
    };

    setExportJobs((prev) => [newJob, ...prev]);

    // Reset config
    setExportConfig((prev) => ({
      ...prev,
      name: '',
      fields: [],
    }));

    setIsExporting(false);
  };

  const cancelExport = (jobId: string) => {
    setExportJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: 'cancelled' } : job
      )
    );
  };

  const retryExport = (jobId: string) => {
    setExportJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: 'processing', progress: 0, error: undefined }
          : job
      )
    );
  };

  const deleteExport = (jobId: string) => {
    setExportJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString));
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'processing':
        return 'Verarbeitung läuft';
      case 'pending':
        return 'Warteschlange';
      case 'failed':
        return 'Fehlgeschlagen';
      case 'cancelled':
        return 'Abgebrochen';
      default:
        return 'Unbekannt';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'json':
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Daten exportieren
            </h1>
            <p className="text-gray-600 mt-1">
              Exportieren Sie Ihre Daten in verschiedene Formate
            </p>
          </div>

          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exportiere...' : 'Neuen Export starten'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Export-Konfiguration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Export Name */}
                <div className="space-y-2">
                  <Label htmlFor="exportName">Export-Name</Label>
                  <Input
                    id="exportName"
                    placeholder="z.B. Monatsbericht Januar"
                    value={exportConfig.name}
                    onChange={(e) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Data Type */}
                <div className="space-y-2">
                  <Label>Datentyp</Label>
                  <Select
                    value={exportConfig.type}
                    onValueChange={(value) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        type: value as any,
                        fields: [], // Reset fields when type changes
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analytics">Auswertungen</SelectItem>
                      <SelectItem value="products">Produkte</SelectItem>
                      <SelectItem value="customers">Kunden</SelectItem>
                      <SelectItem value="orders">Bestellungen</SelectItem>
                      <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Format */}
                <div className="space-y-2">
                  <Label>Dateiformat</Label>
                  <RadioGroup
                    value={exportConfig.format}
                    onValueChange={(value) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        format: value as any,
                      }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excel" id="excel" />
                      <Label
                        htmlFor="excel"
                        className="flex items-center gap-2"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel (.xlsx)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="csv" id="csv" />
                      <Label htmlFor="csv" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        CSV (.csv)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF (.pdf)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="json" id="json" />
                      <Label htmlFor="json" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        JSON (.json)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Zeitraum</Label>
                  <Select
                    value={exportConfig.dateRange.preset}
                    onValueChange={(value) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, preset: value as any },
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
                      <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fields Selection */}
                <div className="space-y-2">
                  <Label>Zu exportierende Felder</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableFields[exportConfig.type]?.map(
                      (field: { id: string; label: string }) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={field.id}
                            checked={exportConfig.fields.includes(field.id)}
                            onCheckedChange={() => handleFieldToggle(field.id)}
                          />
                          <Label
                            htmlFor={field.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {field.label}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Additional Options */}
                {exportConfig.format === 'pdf' && (
                  <div className="space-y-2">
                    <Label>PDF-Optionen</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeCharts"
                          checked={exportConfig.includeCharts}
                          onCheckedChange={(checked) =>
                            setExportConfig((prev) => ({
                              ...prev,
                              includeCharts: !!checked,
                            }))
                          }
                        />
                        <Label htmlFor="includeCharts" className="text-sm">
                          Diagramme einschließen
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeSummary"
                          checked={exportConfig.includeSummary}
                          onCheckedChange={(checked) =>
                            setExportConfig((prev) => ({
                              ...prev,
                              includeSummary: !!checked,
                            }))
                          }
                        />
                        <Label htmlFor="includeSummary" className="text-sm">
                          Zusammenfassung einschließen
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compression"
                    checked={exportConfig.compression}
                    onCheckedChange={(checked) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        compression: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="compression" className="text-sm">
                    Komprimierung aktivieren
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Jobs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Export-Verlauf
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exportJobs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Noch keine Exporte durchgeführt</p>
                  </div>
                ) : (
                  exportJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getFormatIcon(job.format)}
                            <h4 className="font-semibold">{job.name}</h4>
                            <Badge
                              className={getStatusColor(job.status)}
                              variant="secondary"
                            >
                              {getStatusText(job.status)}
                            </Badge>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-4">
                              <span>Typ: {job.type}</span>
                              <span>Format: {job.format.toUpperCase()}</span>
                              {job.recordCount && (
                                <span>
                                  Datensätze:{' '}
                                  {job.recordCount.toLocaleString('de-DE')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span>
                                Erstellt: {formatDateTime(job.createdAt)}
                              </span>
                              {job.completedAt && (
                                <span>
                                  Fertiggestellt:{' '}
                                  {formatDateTime(job.completedAt)}
                                </span>
                              )}
                              {job.fileSize && (
                                <span>Dateigröße: {job.fileSize}</span>
                              )}
                            </div>
                          </div>

                          {job.status === 'processing' && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Fortschritt</span>
                                <span>{Math.round(job.progress)}%</span>
                              </div>
                              <Progress value={job.progress} className="h-2" />
                            </div>
                          )}

                          {job.error && (
                            <Alert className="mt-3">
                              <AlertDescription className="text-red-600">
                                {job.error}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {job.status === 'completed' && job.downloadUrl && (
                            <Button size="sm" asChild>
                              <a href={job.downloadUrl} download>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          )}

                          {job.status === 'processing' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelExport(job.id)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Abbrechen
                            </Button>
                          )}

                          {job.status === 'failed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryExport(job.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Wiederholen
                            </Button>
                          )}

                          {(job.status === 'completed' ||
                            job.status === 'failed' ||
                            job.status === 'cancelled') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteExport(job.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Export Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Schnell-Export Vorlagen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'Vollständiger Geschäftsbericht',
                  description: 'Alle Metriken, Diagramme und Zusammenfassungen',
                  format: 'PDF',
                },
                {
                  name: 'Produktkatalog',
                  description: 'Komplette Produktliste mit Details',
                  format: 'Excel',
                },
                {
                  name: 'Kundendatenbank',
                  description: 'Kundeninformationen für CRM-Import',
                  format: 'CSV',
                },
                {
                  name: 'API-Rohdaten',
                  description: 'Strukturierte Daten für Entwickler',
                  format: 'JSON',
                },
              ].map((template, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getFormatIcon(template.format.toLowerCase())}
                      <Badge variant="outline">{template.format}</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Jetzt exportieren
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PartnerLayout>
  );
}
