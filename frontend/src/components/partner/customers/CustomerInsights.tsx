'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  ChevronDown,
  Download,
  Eye,
  Filter,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  vehicleBrand: string;
  vehicleModel: string;
  joinDate: string;
  totalInteractions: number;
  lastActivity: string;
  topCategories: string[];
  purchaseHistory: {
    total: number;
    lastPurchase: string;
    averageOrderValue: number;
  };
  engagement: {
    viewsLast30Days: number;
    clicksLast30Days: number;
    recommendationsUsed: number;
  };
  location: string;
  preferences: {
    budgetRange: string;
    preferredBrands: string[];
    problems: string[];
  };
  satisfaction: number; // 1-5 rating
  status: 'active' | 'inactive' | 'potential';
}

export default function CustomerInsights() {
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Michael Schmidt',
      email: 'michael.schmidt@email.com',
      vehicleBrand: 'BMW',
      vehicleModel: '320d',
      joinDate: '2024-01-15',
      totalInteractions: 45,
      lastActivity: '2024-06-07',
      topCategories: ['Motoröl', 'Filter', 'Bremsen'],
      purchaseHistory: {
        total: 3,
        lastPurchase: '2024-05-20',
        averageOrderValue: 89.5,
      },
      engagement: {
        viewsLast30Days: 12,
        clicksLast30Days: 8,
        recommendationsUsed: 3,
      },
      location: 'München, Bayern',
      preferences: {
        budgetRange: '50-150€',
        preferredBrands: ['Castrol', 'Bosch'],
        problems: ['Motorgeräusche', 'Ölverlust'],
      },
      satisfaction: 4.5,
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Müller',
      email: 'sarah.mueller@email.com',
      vehicleBrand: 'Audi',
      vehicleModel: 'A4',
      joinDate: '2024-03-02',
      totalInteractions: 28,
      lastActivity: '2024-06-06',
      topCategories: ['Kühlmittel', 'Bremsenreiniger'],
      purchaseHistory: {
        total: 2,
        lastPurchase: '2024-04-15',
        averageOrderValue: 65.0,
      },
      engagement: {
        viewsLast30Days: 8,
        clicksLast30Days: 5,
        recommendationsUsed: 2,
      },
      location: 'Berlin',
      preferences: {
        budgetRange: '30-100€',
        preferredBrands: ['Mann-Filter', 'Liqui Moly'],
        problems: ['Überhitzung', 'Bremsgeräusche'],
      },
      satisfaction: 4.0,
      status: 'active',
    },
    {
      id: '3',
      name: 'Thomas Weber',
      email: 'thomas.weber@email.com',
      vehicleBrand: 'Mercedes',
      vehicleModel: 'C-Klasse',
      joinDate: '2024-02-20',
      totalInteractions: 15,
      lastActivity: '2024-05-28',
      topCategories: ['Luftfilter', 'Zündkerzen'],
      purchaseHistory: {
        total: 1,
        lastPurchase: '2024-03-10',
        averageOrderValue: 120.0,
      },
      engagement: {
        viewsLast30Days: 4,
        clicksLast30Days: 2,
        recommendationsUsed: 1,
      },
      location: 'Hamburg',
      preferences: {
        budgetRange: '80-200€',
        preferredBrands: ['Mercedes-Benz', 'Bosch'],
        problems: ['Leistungsverlust', 'Motorlauf unruhig'],
      },
      satisfaction: 3.5,
      status: 'inactive',
    },
  ]);

  const [filters, setFilters] = useState({
    status: 'all',
    vehicleBrand: 'all',
    engagement: 'all',
    sortBy: 'lastActivity',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const matchesSearch =
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.vehicleBrand
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
          filters.status === 'all' || customer.status === filters.status;
        const matchesBrand =
          filters.vehicleBrand === 'all' ||
          customer.vehicleBrand === filters.vehicleBrand;

        return matchesSearch && matchesStatus && matchesBrand;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'engagement':
            return b.engagement.viewsLast30Days - a.engagement.viewsLast30Days;
          case 'satisfaction':
            return b.satisfaction - a.satisfaction;
          case 'lastActivity':
          default:
            return (
              new Date(b.lastActivity).getTime() -
              new Date(a.lastActivity).getTime()
            );
        }
      });
  }, [customers, filters, searchTerm]);

  const customerStats = useMemo(
    () => ({
      total: customers.length,
      active: customers.filter((c) => c.status === 'active').length,
      totalEngagement: customers.reduce(
        (sum, c) => sum + c.engagement.viewsLast30Days,
        0
      ),
      averageSatisfaction:
        customers.reduce((sum, c) => sum + c.satisfaction, 0) /
        customers.length,
      totalRevenue: customers.reduce(
        (sum, c) =>
          sum + c.purchaseHistory.total * c.purchaseHistory.averageOrderValue,
        0
      ),
    }),
    [customers]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Insights
          </h2>
          <p className="text-gray-600">
            Understand your customers and their preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {customerStats.total}
                </p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {customerStats.active}
                </p>
                <p className="text-sm text-gray-600">Active Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {customerStats.totalEngagement}
                </p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {customerStats.averageSatisfaction.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Avg Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  €{customerStats.totalRevenue.toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, status: 'all' })}
                >
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, status: 'active' })}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, status: 'inactive' })}
                >
                  Inactive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, status: 'potential' })
                  }
                >
                  Potential
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Vehicle Brand
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, vehicleBrand: 'all' })
                  }
                >
                  All Brands
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, vehicleBrand: 'BMW' })
                  }
                >
                  BMW
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, vehicleBrand: 'Audi' })
                  }
                >
                  Audi
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, vehicleBrand: 'Mercedes' })
                  }
                >
                  Mercedes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort by
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, sortBy: 'lastActivity' })
                  }
                >
                  Last Activity
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, sortBy: 'name' })}
                >
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, sortBy: 'engagement' })
                  }
                >
                  Engagement
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setFilters({ ...filters, sortBy: 'satisfaction' })
                  }
                >
                  Satisfaction
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Badge variant="secondary">
            {filteredCustomers.length} customers found
          </Badge>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}

interface CustomerCardProps {
  customer: Customer;
}

function CustomerCard({ customer }: CustomerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'potential':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
              <Badge className={getStatusColor(customer.status)}>
                {customer.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {new Date(customer.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {customer.location}
              </div>
            </div>
          </div>

          {/* Vehicle & Preferences */}
          <div className="lg:col-span-1">
            <h4 className="font-medium text-gray-900 mb-2">Vehicle</h4>
            <p className="text-sm text-gray-600 mb-3">
              {customer.vehicleBrand} {customer.vehicleModel}
            </p>

            <h4 className="font-medium text-gray-900 mb-2">Top Categories</h4>
            <div className="flex flex-wrap gap-1">
              {customer.topCategories.map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="lg:col-span-1">
            <h4 className="font-medium text-gray-900 mb-2">Engagement (30d)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Views:</span>
                <span className="font-medium">
                  {customer.engagement.viewsLast30Days}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Clicks:</span>
                <span className="font-medium">
                  {customer.engagement.clicksLast30Days}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recommendations:</span>
                <span className="font-medium">
                  {customer.engagement.recommendationsUsed}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Satisfaction:</span>
                <div className="flex items-center">
                  <Star
                    className={`h-4 w-4 mr-1 ${getSatisfactionColor(
                      customer.satisfaction
                    )}`}
                  />
                  <span
                    className={`font-medium ${getSatisfactionColor(
                      customer.satisfaction
                    )}`}
                  >
                    {customer.satisfaction.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="lg:col-span-1">
            <h4 className="font-medium text-gray-900 mb-2">Purchase History</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-medium">
                  {customer.purchaseHistory.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Order:</span>
                <span className="font-medium">
                  €{customer.purchaseHistory.averageOrderValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Purchase:</span>
                <span className="font-medium">
                  {new Date(
                    customer.purchaseHistory.lastPurchase
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-gray-500">
                Budget: {customer.preferences.budgetRange}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
