'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Package,
  RefreshCw,
  Users,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
  overview: {
    totalPartners: number;
    totalProducts: number;
    pendingModeration: number;
    monthlyRevenue: number;
    averageApprovalTime: number;
  };
  moderation: {
    pending: number;
    approved: number;
    rejected: number;
    processing: number;
  };
  partners: {
    activePartners: number;
    newThisMonth: number;
    topPartnersByProducts: Array<{
      id: string;
      name: string;
      email: string;
      productCount: number;
    }>;
  };
  products: {
    totalProducts: number;
    newThisMonth: number;
    topCategories: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  activity: {
    recentApprovals: Array<{
      id: string;
      productName: string;
      partnerName: string;
      approvedAt: string;
    }>;
    recentRejections: Array<{
      id: string;
      productName: string;
      partnerName: string;
      reason: string;
      rejectedAt: string;
    }>;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard stats');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)} Stunden`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.round(hours % 24);
      return `${days} Tag${days !== 1 ? 'e' : ''}${
        remainingHours > 0 ? `, ${remainingHours}h` : ''
      }`;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Failed to load dashboard data'}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardStats}
              className="ml-4"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">System overview and key metrics</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Partners
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.overview.totalPartners}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats.partners.newThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.overview.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats.products.newThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.moderation.pending}
              </div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.overview.monthlyRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Approval Time
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatDuration(stats.overview.averageApprovalTime)}
              </div>
              <p className="text-xs text-muted-foreground">Processing time</p>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Queue Status</CardTitle>
              <CardDescription>
                Current status of product moderation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-orange-500 mr-2" />
                    <span>Pending Review</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700"
                  >
                    {stats.moderation.pending}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Approved Today</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    {stats.moderation.approved}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span>Rejected</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-700"
                  >
                    {stats.moderation.rejected}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-blue-500 mr-2" />
                    <span>In Processing</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {stats.moderation.processing}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Product Categories</CardTitle>
              <CardDescription>Most popular product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.products.topCategories.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{category.count}</div>
                      <div className="text-xs text-gray-500">
                        {category.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Top Partners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Partners by Products</CardTitle>
              <CardDescription>Most active partners this month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.partners.topPartnersByProducts.map(
                    (partner, index) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-sm text-gray-500">
                              {partner.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {partner.productCount}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest moderation decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="approvals">
                <TabsList className="mb-4">
                  <TabsTrigger value="approvals">Recent Approvals</TabsTrigger>
                  <TabsTrigger value="rejections">
                    Recent Rejections
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="approvals">
                  <div className="space-y-3">
                    {stats.activity.recentApprovals.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No recent approvals
                      </p>
                    ) : (
                      stats.activity.recentApprovals.map((approval) => (
                        <div
                          key={approval.id}
                          className="flex items-center justify-between border-l-4 border-green-500 pl-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {approval.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {approval.partnerName}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(approval.approvedAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rejections">
                  <div className="space-y-3">
                    {stats.activity.recentRejections.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No recent rejections
                      </p>
                    ) : (
                      stats.activity.recentRejections.map((rejection) => (
                        <div
                          key={rejection.id}
                          className="flex items-center justify-between border-l-4 border-red-500 pl-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {rejection.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {rejection.partnerName}
                            </p>
                            <p className="text-xs text-red-600">
                              {rejection.reason}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(rejection.rejectedAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
