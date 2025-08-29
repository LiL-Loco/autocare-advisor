'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
  ChevronDown,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';

interface Product {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  price: number;
  inventory: number;
  views: number;
  sales: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Motoröl Premium 5W-30',
    category: 'Motoröl',
    status: 'active',
    price: 24.99,
    inventory: 150,
    views: 2400,
    sales: 89,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-25',
  },
  {
    id: '2',
    name: 'Bremsflüssigkeit DOT 4',
    category: 'Bremsflüssigkeit',
    status: 'active',
    price: 12.50,
    inventory: 75,
    views: 1800,
    sales: 67,
    createdAt: '2024-02-10',
    updatedAt: '2024-08-20',
  },
  {
    id: '3',
    name: 'Kühlmittel Konzentrat',
    category: 'Kühlmittel',
    status: 'inactive',
    price: 18.99,
    inventory: 0,
    views: 1200,
    sales: 23,
    createdAt: '2024-01-08',
    updatedAt: '2024-07-15',
  },
  {
    id: '4',
    name: 'Luftfilter Universal',
    category: 'Filter',
    status: 'draft',
    price: 15.99,
    inventory: 45,
    views: 0,
    sales: 0,
    createdAt: '2024-08-28',
    updatedAt: '2024-08-28',
  },
  {
    id: '5',
    name: 'Scheibenwischerblätter Set',
    category: 'Wischer',
    status: 'active',
    price: 29.99,
    inventory: 85,
    views: 3200,
    sales: 145,
    createdAt: '2024-03-22',
    updatedAt: '2024-08-27',
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const getStatusBadgeVariant = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'inactive':
        return 'Inaktiv';
      case 'draft':
        return 'Entwurf';
      default:
        return status;
    }
  };

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Shopify-Style Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Produkte
            </h1>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Ihre {filteredProducts.length} Produkte
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/partner/dashboard/products/bulk')}
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Aktionen
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => router.push('/partner/dashboard/products/upload')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Produkt hinzufügen
            </Button>
          </div>
        </div>

        {/* Shopify-Style Filters */}
        <Card className="border-0 shadow-none bg-background">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Produkte durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="draft">Entwurf</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sortieren" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Preis</SelectItem>
                  <SelectItem value="inventory">Lager</SelectItem>
                  <SelectItem value="sales">Verkäufe</SelectItem>
                  <SelectItem value="views">Aufrufe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shopify-Style Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt Produkte</p>
                  <p className="text-2xl font-semibold">{mockProducts.length}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktive Produkte</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {mockProducts.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Niedrig Lager</p>
                  <p className="text-2xl font-semibold text-orange-600">
                    {mockProducts.filter(p => p.inventory < 50).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Entwürfe</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {mockProducts.filter(p => p.status === 'draft').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopify-Style Product Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Produktliste</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr className="border-b">
                    <th className="w-12 p-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-border"
                      />
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Produkt</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Lager</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Preis</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Aufrufe</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Verkäufe</th>
                    <th className="w-12 p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant={getStatusBadgeVariant(product.status)}
                          className={getStatusColor(product.status)}
                        >
                          {getStatusText(product.status)}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <span className={product.inventory < 50 ? 'text-orange-600 font-medium' : ''}>
                          {product.inventory}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">
                        €{product.price.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-muted-foreground">
                        {product.views.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {product.sales}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => router.push(`/partner/dashboard/products/${product.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => router.push(`/partner/dashboard/products/${product.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Keine Produkte gefunden
                </h3>
                <p className="text-muted-foreground mb-4">
                  Versuchen Sie andere Suchbegriffe oder Filter.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}>
                  Filter zurücksetzen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions Bar - wenn Produkte ausgewählt */}
        {selectedProducts.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-foreground text-background rounded-lg shadow-lg p-4 flex items-center space-x-4">
            <span className="text-sm font-medium">
              {selectedProducts.length} Produkte ausgewählt
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-background border-background hover:bg-background/10">
                Status ändern
              </Button>
              <Button variant="outline" size="sm" className="text-background border-background hover:bg-background/10">
                <Trash2 className="w-4 h-4 mr-1" />
                Löschen
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedProducts([])}
              className="text-background hover:bg-background/10 p-1"
            >
              ✕
            </Button>
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}