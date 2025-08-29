'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowUpDown,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalViews: number;
  totalClicks: number;
  totalRevenue: number;
}

interface ImportJob {
  id: string;
  original_filename: string;
  status: string;
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  created_at: string;
}

export default function ProductManagementPage() {
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalViews: 0,
    totalClicks: 0,
    totalRevenue: 0,
  });
  const [recentImports, setRecentImports] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductStats();
    fetchRecentImports();
  }, []);

  const fetchProductStats = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockStats = {
        totalProducts: 847,
        activeProducts: 823,
        inactiveProducts: 24,
        totalViews: 12543,
        totalClicks: 2876,
        totalRevenue: 45320.5,
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch product stats:', error);
    }
  };

  const fetchRecentImports = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-management/import/jobs?partnerId=64a12345-6789-4012-9345-678901234567&limit=5`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRecentImports(result.data.jobs || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch recent imports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      processing: 'secondary',
      pending: 'outline',
    } as const;

    const labels = {
      completed: 'Abgeschlossen',
      failed: 'Fehler',
      processing: 'Verarbeitung',
      pending: 'Wartend',
    };

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || 'outline'}
        className="text-xs"
      >
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <PartnerLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Produkt Management
          </h1>
          <p className="text-gray-600">
            Verwalten Sie Ihre Produkte und überwachen Sie die Performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/partner/dashboard/products/upload">
                <Upload className="h-4 w-4 mr-2" />
                CSV Import
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/partner/dashboard/products/add">
                <Plus className="h-4 w-4 mr-2" />
                Produkt hinzufügen
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/partner/dashboard/products/advanced">
                <Package className="h-4 w-4 mr-2" />
                Erweiterte Verwaltung
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/partner/dashboard/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gesamt Produkte
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalProducts.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">
                  {stats.activeProducts} aktiv
                </span>
                {stats.inactiveProducts > 0 && (
                  <span className="text-red-600 ml-2">
                    {stats.inactiveProducts} inaktiv
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gesamtaufrufe
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Letzten 30 Tage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Klicks</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">👆</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalViews > 0 &&
                  `${((stats.totalClicks / stats.totalViews) * 100).toFixed(
                    1
                  )}% CTR`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Provisionen diesen Monat
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Imports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Letzte Imports
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/partner/dashboard/products/import">
                    Alle anzeigen
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>
                Übersicht über die letzten CSV-Uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentImports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm">Noch keine Imports durchgeführt</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/partner/dashboard/products/import">
                      Ersten Import starten
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentImports.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {job.original_filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {job.total_rows > 0 && (
                            <>
                              {job.successful_rows} erfolgreich,{' '}
                              {job.failed_rows} Fehler
                              <span className="mx-2">•</span>
                            </>
                          )}
                          {formatDate(job.created_at)}
                        </p>
                      </div>
                      <div className="ml-3">{getStatusBadge(job.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Schnellzugriff & Tipps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <Upload className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-blue-900">
                        CSV Import optimieren
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Verwenden Sie unsere CSV-Vorlage für optimale Ergebnisse
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        asChild
                        className="text-blue-600 p-0 h-auto mt-1"
                      >
                        <Link href="/partner/dashboard/products/import">
                          Vorlage herunterladen
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <TrendingUp className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-green-900">
                        Performance steigern
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Hochwertige Produktbilder erhöhen die Klickrate um bis
                        zu 40%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500 text-white rounded-full p-1">
                      <AlertCircle className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-amber-900">
                        Qualität sichern
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Detaillierte Produktbeschreibungen verbessern die
                        Conversion-Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <h4 className="font-medium text-sm mb-2">Nützliche Links</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link href="/partner/dashboard/help">
                      📖 Hilfe & Dokumentation
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link href="/partner/dashboard/support">
                      💬 Support kontaktieren
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}
