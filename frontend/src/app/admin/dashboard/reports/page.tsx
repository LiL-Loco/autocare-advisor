'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Mail,
  Settings
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Report {
  id: string
  name: string
  description: string
  type: 'revenue' | 'users' | 'products' | 'partners' | 'custom'
  status: 'draft' | 'scheduled' | 'completed' | 'error'
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  lastRun: string | null
  nextRun: string | null
  recipients: string[]
  createdBy: string
  createdAt: string
  parameters: {
    dateRange: string
    filters: Record<string, any>
    format: 'pdf' | 'excel' | 'csv'
  }
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  icon: React.ReactNode
  fields: Array<{
    name: string
    label: string
    type: string
    required: boolean
    options?: string[]
  }>
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewReport, setShowNewReport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Comprehensive revenue analysis with trends and breakdowns',
      type: 'financial',
      icon: <DollarSign className="h-6 w-6" />,
      fields: [
        { name: 'dateRange', label: 'Date Range', type: 'select', required: true, options: ['7d', '30d', '90d', '1y'] },
        { name: 'groupBy', label: 'Group By', type: 'select', required: true, options: ['day', 'week', 'month'] },
        { name: 'includePartners', label: 'Include Partner Breakdown', type: 'checkbox', required: false },
        { name: 'includeCategories', label: 'Include Category Analysis', type: 'checkbox', required: false }
      ]
    },
    {
      id: 'users',
      name: 'User Analytics Report',
      description: 'User behavior, acquisition, and engagement metrics',
      type: 'analytics',
      icon: <Users className="h-6 w-6" />,
      fields: [
        { name: 'dateRange', label: 'Date Range', type: 'select', required: true, options: ['7d', '30d', '90d', '1y'] },
        { name: 'userSegment', label: 'User Segment', type: 'select', required: false, options: ['all', 'new', 'returning', 'premium'] },
        { name: 'includeGeography', label: 'Include Geographic Data', type: 'checkbox', required: false },
        { name: 'includeDeviceInfo', label: 'Include Device Information', type: 'checkbox', required: false }
      ]
    },
    {
      id: 'products',
      name: 'Product Performance Report',
      description: 'Product sales, trends, and inventory analytics',
      type: 'inventory',
      icon: <Package className="h-6 w-6" />,
      fields: [
        { name: 'dateRange', label: 'Date Range', type: 'select', required: true, options: ['7d', '30d', '90d', '1y'] },
        { name: 'category', label: 'Product Category', type: 'select', required: false, options: ['all', 'autowachs', 'reiniger', 'politur'] },
        { name: 'minSales', label: 'Minimum Sales', type: 'number', required: false },
        { name: 'includeInventory', label: 'Include Inventory Data', type: 'checkbox', required: false }
      ]
    },
    {
      id: 'partners',
      name: 'Partner Performance Report',
      description: 'Partner activity, commissions, and relationship analytics',
      type: 'partners',
      icon: <TrendingUp className="h-6 w-6" />,
      fields: [
        { name: 'dateRange', label: 'Date Range', type: 'select', required: true, options: ['7d', '30d', '90d', '1y'] },
        { name: 'partnerStatus', label: 'Partner Status', type: 'select', required: false, options: ['all', 'active', 'inactive', 'pending'] },
        { name: 'minRevenue', label: 'Minimum Revenue', type: 'number', required: false },
        { name: 'includeCommissions', label: 'Include Commission Details', type: 'checkbox', required: false }
      ]
    }
  ]

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)

      // Simulierte Reports-Daten
      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Monthly Revenue Report',
          description: 'Comprehensive monthly revenue analysis',
          type: 'revenue',
          status: 'completed',
          frequency: 'monthly',
          lastRun: new Date(Date.now() - 86400000).toISOString(),
          nextRun: new Date(Date.now() + 30 * 86400000).toISOString(),
          recipients: ['admin@autocare.com', 'finance@autocare.com'],
          createdBy: 'Admin User',
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          parameters: {
            dateRange: '30d',
            filters: {},
            format: 'pdf'
          }
        },
        {
          id: '2',
          name: 'Weekly User Activity',
          description: 'Weekly user engagement and activity metrics',
          type: 'users',
          status: 'scheduled',
          frequency: 'weekly',
          lastRun: new Date(Date.now() - 7 * 86400000).toISOString(),
          nextRun: new Date(Date.now() + 86400000).toISOString(),
          recipients: ['marketing@autocare.com'],
          createdBy: 'Marketing Team',
          createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
          parameters: {
            dateRange: '7d',
            filters: { userSegment: 'all' },
            format: 'excel'
          }
        },
        {
          id: '3',
          name: 'Partner Commission Report',
          description: 'Quarterly partner commission and performance analysis',
          type: 'partners',
          status: 'draft',
          frequency: 'monthly',
          lastRun: null,
          nextRun: null,
          recipients: ['partners@autocare.com'],
          createdBy: 'Partner Manager',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          parameters: {
            dateRange: '90d',
            filters: { includeCommissions: true },
            format: 'pdf'
          }
        }
      ]

      setReports(mockReports)
    } catch (err) {
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'scheduled':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    setShowNewReport(true)
  }

  const handleRunReport = async (reportId: string) => {
    try {
      // Implement report generation logic
      console.log('Running report:', reportId)
    } catch (err) {
      console.error('Error running report:', err)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      setReports(reports.filter(r => r.id !== reportId))
    } catch (err) {
      console.error('Error deleting report:', err)
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Generate, schedule, and manage custom reports</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button onClick={() => setShowNewReport(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading reports...</p>
                </div>
              ) : filteredReports.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                    <p className="text-gray-600 mb-4">Create your first report to get started</p>
                    <Button onClick={() => setShowNewReport(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(report.status)}
                          <div>
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                            <CardDescription>{report.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleRunReport(report.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Frequency</p>
                          <p className="font-medium capitalize">{report.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Last Run</p>
                          <p className="font-medium">{formatDate(report.lastRun)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Next Run</p>
                          <p className="font-medium">{formatDate(report.nextRun)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Recipients</p>
                          <p className="font-medium">{report.recipients.length} recipients</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>Created by {report.createdBy}</span>
                        <span>•</span>
                        <span>{formatDate(report.createdAt)}</span>
                        <span>•</span>
                        <span className="uppercase">{report.parameters.format} format</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">Includes:</p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        {template.fields.slice(0, 3).map((field) => (
                          <li key={field.name}>• {field.label}</li>
                        ))}
                        {template.fields.length > 3 && (
                          <li>• And {template.fields.length - 3} more options</li>
                        )}
                      </ul>
                    </div>
                    <Button onClick={() => handleCreateReport(template)} className="w-full">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <div className="space-y-4">
              {reports.filter(r => r.status === 'scheduled').map((report) => (
                <Card key={report.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-500">Next run: {formatDate(report.nextRun)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Scheduled</Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">€125,840</p>
                    <p className="text-sm text-green-600">+12.5% from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">8,932</p>
                    <p className="text-sm text-green-600">+8.3% from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">2,451</p>
                    <p className="text-sm text-green-600">+15.2% from last month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* New Report Modal would go here */}
        {showNewReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Report</CardTitle>
                <CardDescription>
                  {selectedTemplate ? `Configure your ${selectedTemplate.name}` : 'Choose a template to get started'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Report Name</label>
                      <Input placeholder={`My ${selectedTemplate.name}`} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Describe what this report will cover..." />
                    </div>
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.name}>
                        <label className="text-sm font-medium">{field.label}</label>
                        {field.type === 'select' && field.options ? (
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'number' ? (
                          <Input type="number" placeholder={`Enter ${field.label.toLowerCase()}`} />
                        ) : (
                          <Input placeholder={`Enter ${field.label.toLowerCase()}`} />
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="text-sm font-medium">Recipients (comma separated)</label>
                      <Input placeholder="email1@example.com, email2@example.com" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Please select a template first</p>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setShowNewReport(false)
                    setSelectedTemplate(null)
                  }}>
                    Cancel
                  </Button>
                  <Button disabled={!selectedTemplate}>
                    Create Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}