'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { 
  Users,
  UserPlus,
  Mail,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Partner {
  id: string
  name: string
  email: string
  company: string
  status: string
  tier: string
  productsCount: number
  monthlyRevenue: number
  lastActive: string
  joinedAt: string
  avatar?: string
  phone?: string
  website?: string
  address?: string
  billingStatus: string
  analytics: {
    totalClicks: number
    conversionRate: number
    avgOrderValue: number
    lifetimeValue: number
  }
}

interface PartnerStats {
  totalPartners: number
  activePartners: number
  newThisMonth: number
  pendingApproval: number
  totalRevenue: number
  avgRevenuePerPartner: number
  topPerformers: Array<{
    id: string
    name: string
    revenue: number
    growth: number
  }>
  recentActivity: Array<{
    id: string
    partnerName: string
    action: string
    timestamp: string
  }>
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [stats, setStats] = useState<PartnerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentTab, setCurrentTab] = useState('overview')

  useEffect(() => {
    fetchPartnersData()
  }, [])

  const fetchPartnersData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulierte Daten - später durch echte API-Aufrufe ersetzen
      const mockPartners: Partner[] = [
        {
          id: '1',
          name: 'Max Mustermann',
          email: 'max@autowash-pro.de',
          company: 'AutoWash Pro GmbH',
          status: 'active',
          tier: 'premium',
          productsCount: 45,
          monthlyRevenue: 2850.00,
          lastActive: '2025-08-27T10:30:00Z',
          joinedAt: '2024-12-15T14:22:00Z',
          phone: '+49 176 12345678',
          website: 'https://autowash-pro.de',
          billingStatus: 'current',
          analytics: {
            totalClicks: 12540,
            conversionRate: 3.2,
            avgOrderValue: 89.50,
            lifetimeValue: 15420.00
          }
        },
        {
          id: '2',
          name: 'Sarah Wagner',
          email: 'sarah@carcleaning-experts.com',
          company: 'CarCleaning Experts',
          status: 'active',
          tier: 'standard',
          productsCount: 28,
          monthlyRevenue: 1580.00,
          lastActive: '2025-08-27T09:15:00Z',
          joinedAt: '2025-01-20T11:45:00Z',
          phone: '+49 171 98765432',
          website: 'https://carcleaning-experts.com',
          billingStatus: 'current',
          analytics: {
            totalClicks: 8920,
            conversionRate: 2.8,
            avgOrderValue: 67.30,
            lifetimeValue: 9480.00
          }
        },
        {
          id: '3',
          name: 'Thomas Schneider',
          email: 'thomas@autopflege-nord.de',
          company: 'Autopflege Nord',
          status: 'pending',
          tier: 'basic',
          productsCount: 12,
          monthlyRevenue: 450.00,
          lastActive: '2025-08-26T16:20:00Z',
          joinedAt: '2025-08-25T09:30:00Z',
          billingStatus: 'pending_setup',
          analytics: {
            totalClicks: 1240,
            conversionRate: 1.9,
            avgOrderValue: 45.20,
            lifetimeValue: 560.00
          }
        }
      ]

      const mockStats: PartnerStats = {
        totalPartners: 248,
        activePartners: 185,
        newThisMonth: 23,
        pendingApproval: 12,
        totalRevenue: 125840.50,
        avgRevenuePerPartner: 507.42,
        topPerformers: [
          { id: '1', name: 'AutoWash Pro GmbH', revenue: 2850.00, growth: 15.2 },
          { id: '2', name: 'CarCleaning Experts', revenue: 1580.00, growth: 8.7 },
          { id: '4', name: 'Detailing Masters', revenue: 3240.00, growth: 22.1 }
        ],
        recentActivity: [
          { id: '1', partnerName: 'AutoWash Pro GmbH', action: 'Product uploaded', timestamp: '2025-08-27T10:30:00Z' },
          { id: '2', partnerName: 'CarCleaning Experts', action: 'Profile updated', timestamp: '2025-08-27T09:15:00Z' },
          { id: '3', partnerName: 'Autopflege Nord', action: 'Registration completed', timestamp: '2025-08-26T16:20:00Z' }
        ]
      }

      setPartners(mockPartners)
      setStats(mockStats)
    } catch (err: any) {
      console.error('Error fetching partners data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTierBadge = (tier: string) => {
    const variants = {
      'premium': 'default',
      'standard': 'secondary',
      'basic': 'outline'
    } as const

    return (
      <Badge variant={variants[tier as keyof typeof variants] || 'outline'} className="text-xs">
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Loading partners data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Management</h1>
            <p className="text-gray-600">Manage and monitor all B2B partners</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchPartnersData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Partner
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPartners}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.activePartners}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.activePartners / stats.totalPartners) * 100)}% active rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingApproval}
                </div>
                <p className="text-xs text-muted-foreground">
                  Need review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ø {formatCurrency(stats.avgRevenuePerPartner)} per partner
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Partners Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Partner Directory</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-sm text-gray-500">{partner.company}</p>
                            <p className="text-sm text-gray-500">{partner.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(partner.status)}
                            <span className="text-sm capitalize">{partner.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTierBadge(partner.tier)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span>{partner.productsCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatCurrency(partner.monthlyRevenue)}
                          </span>
                          <p className="text-xs text-gray-500">monthly</p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(partner.lastActive)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Highest revenue generating partners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.topPerformers.map((performer, index) => (
                      <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{performer.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(performer.revenue)} monthly
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">+{performer.growth}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partner Performance</CardTitle>
                  <CardDescription>Key metrics across all partners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Conversion Rate</span>
                      <span className="font-medium">2.6%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Order Value</span>
                      <span className="font-medium">€67.33</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Products</span>
                      <span className="font-medium">5,432</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Partners</span>
                      <span className="font-medium">{stats?.activePartners}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Partner Activity</CardTitle>
                <CardDescription>Latest actions and updates from partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.partnerName}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}