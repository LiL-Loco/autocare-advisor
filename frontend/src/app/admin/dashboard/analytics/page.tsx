'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  PieChart,
  LineChart,
  Activity,
  Target,
  Zap,
  Clock
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    revenueGrowth: number
    totalUsers: number
    userGrowth: number
    totalOrders: number
    orderGrowth: number
    avgOrderValue: number
    aovGrowth: number
  }
  chartData: {
    revenue: Array<{ month: string; amount: number }>
    users: Array<{ month: string; count: number }>
    products: Array<{ category: string; count: number; revenue: number }>
    partners: Array<{ name: string; revenue: number; products: number }>
  }
  performance: {
    topProducts: Array<{
      id: string
      name: string
      brand: string
      clicks: number
      conversions: number
      revenue: number
    }>
    topPartners: Array<{
      id: string
      name: string
      company: string
      revenue: number
      growth: number
    }>
    categories: Array<{
      name: string
      share: number
      growth: number
    }>
  }
  realtime: {
    activeUsers: number
    currentOrders: number
    recentActivity: Array<{
      type: string
      description: string
      timestamp: string
      value?: number
    }>
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Simulierte Analytics-Daten
      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 125840.50,
          revenueGrowth: 12.5,
          totalUsers: 8932,
          userGrowth: 8.3,
          totalOrders: 2451,
          orderGrowth: 15.2,
          avgOrderValue: 51.35,
          aovGrowth: -2.1
        },
        chartData: {
          revenue: [
            { month: 'Jan', amount: 98500 },
            { month: 'Feb', amount: 105200 },
            { month: 'Mar', amount: 112800 },
            { month: 'Apr', amount: 119600 },
            { month: 'May', amount: 125840 },
          ],
          users: [
            { month: 'Jan', count: 7200 },
            { month: 'Feb', count: 7680 },
            { month: 'Mar', count: 8150 },
            { month: 'Apr', count: 8540 },
            { month: 'May', count: 8932 },
          ],
          products: [
            { category: 'Autowachs', count: 145, revenue: 25600 },
            { category: 'Reiniger', count: 189, revenue: 31200 },
            { category: 'Politur', count: 98, revenue: 18900 },
            { category: 'Felgenreiniger', count: 76, revenue: 15400 },
            { category: 'Innenreiniger', count: 67, revenue: 12100 },
          ],
          partners: [
            { name: 'AutoWash Pro', revenue: 25840, products: 45 },
            { name: 'CarCleaning Experts', revenue: 18960, products: 32 },
            { name: 'Detailing Masters', revenue: 22150, products: 38 },
          ]
        },
        performance: {
          topProducts: [
            {
              id: '1',
              name: 'Premium Carnauba Wachs',
              brand: 'Chemical Guys',
              clicks: 1520,
              conversions: 48,
              revenue: 4320.00
            },
            {
              id: '2',
              name: 'Profi Felgenreiniger',
              brand: 'Gyeon',
              clicks: 1180,
              conversions: 35,
              revenue: 2450.00
            },
          ],
          topPartners: [
            {
              id: '1',
              name: 'Max Mustermann',
              company: 'AutoWash Pro GmbH',
              revenue: 25840,
              growth: 15.2
            },
            {
              id: '2',
              name: 'Sarah Wagner',
              company: 'CarCleaning Experts',
              revenue: 18960,
              growth: 12.8
            },
          ],
          categories: [
            { name: 'Autowachs', share: 32.5, growth: 8.2 },
            { name: 'Reiniger', share: 28.1, growth: 12.4 },
            { name: 'Politur', share: 19.8, growth: -2.1 },
          ]
        },
        realtime: {
          activeUsers: 127,
          currentOrders: 23,
          recentActivity: [
            {
              type: 'order',
              description: 'Neue Bestellung über €89.50',
              timestamp: new Date().toISOString(),
              value: 89.50
            },
            {
              type: 'product',
              description: 'Neues Produkt hinzugefügt von AutoWash Pro',
              timestamp: new Date(Date.now() - 300000).toISOString()
            },
            {
              type: 'partner',
              description: 'Neuer Partner registriert: Detailing Studio München',
              timestamp: new Date(Date.now() - 600000).toISOString()
            },
          ]
        }
      }

      setData(mockData)
    } catch (err) {
      console.error('Error fetching analytics data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading || !data) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">System performance and business insights</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" onClick={fetchAnalyticsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.overview.totalRevenue)}
              </div>
              <p className={`text-xs flex items-center gap-1 ${getGrowthColor(data.overview.revenueGrowth)}`}>
                {getGrowthIcon(data.overview.revenueGrowth)}
                {formatPercentage(data.overview.revenueGrowth)} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview.totalUsers.toLocaleString()}
              </div>
              <p className={`text-xs flex items-center gap-1 ${getGrowthColor(data.overview.userGrowth)}`}>
                {getGrowthIcon(data.overview.userGrowth)}
                {formatPercentage(data.overview.userGrowth)} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview.totalOrders.toLocaleString()}
              </div>
              <p className={`text-xs flex items-center gap-1 ${getGrowthColor(data.overview.orderGrowth)}`}>
                {getGrowthIcon(data.overview.orderGrowth)}
                {formatPercentage(data.overview.orderGrowth)} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.overview.avgOrderValue)}
              </div>
              <p className={`text-xs flex items-center gap-1 ${getGrowthColor(data.overview.aovGrowth)}`}>
                {getGrowthIcon(data.overview.aovGrowth)}
                {formatPercentage(data.overview.aovGrowth)} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Top Products
                  </CardTitle>
                  <CardDescription>Best performing products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.performance.topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.brand}</p>
                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                              <span>{product.clicks} clicks</span>
                              <span>{product.conversions} conversions</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(product.revenue)}</div>
                          <div className="text-xs text-gray-500">
                            {((product.conversions / product.clicks) * 100).toFixed(1)}% CVR
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Partners */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Partners
                  </CardTitle>
                  <CardDescription>Highest revenue generating partners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.performance.topPartners.map((partner, index) => (
                      <div key={partner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-sm text-gray-500">{partner.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(partner.revenue)}</div>
                          <div className={`text-xs flex items-center gap-1 ${getGrowthColor(partner.growth)}`}>
                            {getGrowthIcon(partner.growth)}
                            {formatPercentage(partner.growth)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Category Performance
                  </CardTitle>
                  <CardDescription>Revenue distribution by product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.performance.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{category.share}%</div>
                          <div className={`text-xs flex items-center gap-1 ${getGrowthColor(category.growth)}`}>
                            {getGrowthIcon(category.growth)}
                            {formatPercentage(category.growth)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Partner Performance Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Partner Revenue Chart
                  </CardTitle>
                  <CardDescription>Monthly revenue comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Revenue Chart</p>
                      <p className="text-sm">Interactive chart would be here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly revenue development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <LineChart className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Interactive Chart</p>
                    <p className="text-sm">Revenue trends over time would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.realtime.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">Currently browsing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Orders</CardTitle>
                  <Package className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.realtime.currentOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders in progress</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Activity Feed
                </CardTitle>
                <CardDescription>Real-time system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.realtime.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleTimeString('de-DE')}
                        </p>
                      </div>
                      {activity.value && (
                        <Badge variant="outline">{formatCurrency(activity.value)}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>Generate and schedule custom analytics reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2" />
                    <p>Report Builder</p>
                    <p className="text-sm">Custom report generation interface</p>
                    <Button className="mt-4">Create Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}