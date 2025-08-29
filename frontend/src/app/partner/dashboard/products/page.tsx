'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';

interface Product {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  inventory: string;
  category: string;
  channels: number;
  image: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Motoröl Premium 5W-30',
    status: 'active',
    inventory: '150 auf Lager für 4 Varianten',
    category: 'Motoröl',
    channels: 5,
    image: '/images/products/motor-oil.jpg',
  },
  {
    id: '2',
    name: 'Bremsflüssigkeit DOT 4',
    status: 'active',
    inventory: '75 auf Lager für 4 Varianten',
    category: 'Bremsflüssigkeit',
    channels: 5,
    image: '/images/products/brake-fluid.jpg',
  },
  {
    id: '3',
    name: 'Kühlmittel Konzentrat',
    status: 'active',
    inventory: '45 auf Lager für 4 Varianten',
    category: 'Kühlmittel',
    channels: 5,
    image: '/images/products/coolant.jpg',
  },
  {
    id: '4',
    name: 'Luftfilter Universal',
    status: 'active',
    inventory: '32 auf Lager für 4 Varianten',
    category: 'Filter',
    channels: 5,
    image: '/images/products/air-filter.jpg',
  },
  {
    id: '5',
    name: 'Scheibenwischerblätter Set',
    status: 'active',
    inventory: '89 auf Lager für 4 Varianten',
    category: 'Wischer',
    channels: 5,
    image: '/images/products/wipers.jpg',
  },
  {
    id: '6',
    name: 'Getriebeöl SAE 75W-90',
    status: 'active',
    inventory: '28 auf Lager für 4 Varianten',
    category: 'Getriebeöl',
    channels: 5,
    image: '/images/products/gear-oil.jpg',
  },
  {
    id: '7',
    name: 'Zündkerzen Platin',
    status: 'active',
    inventory: '156 auf Lager für 4 Varianten',
    category: 'Zündung',
    channels: 5,
    image: '/images/products/spark-plugs.jpg',
  },
  {
    id: '8',
    name: 'Bremsbeläge Keramik',
    status: 'active',
    inventory: '67 auf Lager für 4 Varianten',
    category: 'Bremsen',
    channels: 5,
    image: '/images/products/brake-pads.jpg',
  },
];

export default function ProductsPageShopify() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Alle');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const tabs = ['Alle', 'Aktiv', 'Entwurf', 'Archiviert'];

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = mockProducts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    // Tab filter
    if (activeTab !== 'Alle') {
      const tabStatusMap: { [key: string]: string } = {
        Aktiv: 'active',
        Entwurf: 'draft',
        Archiviert: 'archived',
      };
      const tabStatus = tabStatusMap[activeTab];
      if (tabStatus) {
        filtered = filtered.filter((product) => product.status === tabStatus);
      }
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle navigation if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Don't handle navigation if any modifier keys are pressed (Ctrl, Alt, Shift, Meta)
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
        return;
      }

      // Table navigation with J/K (only without modifiers)
      if (event.key.toLowerCase() === 'j') {
        event.preventDefault();
        setSelectedRowIndex((prev) => {
          const newIndex = Math.min(prev + 1, filteredProducts.length - 1);
          return newIndex;
        });
      } else if (event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSelectedRowIndex((prev) => {
          const newIndex = Math.max(prev - 1, 0);
          return newIndex;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredProducts.length]);

  // Reset selected row when filters change
  useEffect(() => {
    setSelectedRowIndex(-1);
  }, [searchTerm, statusFilter, activeTab]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  return (
    <PartnerLayout>
      <div className="bg-white min-h-screen">
        {/* Compact Header */}
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Produkte</h1>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportieren
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importieren
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300"
              >
                Weitere Aktionen
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Produkt hinzufügen
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Metrics Cards */}
        <div className="px-4 py-4">
          {/* Compact Tabs */}
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <button className="py-2 px-1 text-sm text-gray-500 hover:text-gray-700">
                  <Plus className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>

          {/* Compact Search and Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Suchen"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 w-48"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSortBy('name');
                  setSortOrder('asc');
                }}
              >
                Filter zurücksetzen
              </Button>
            </div>
          </div>

          {/* Shopify-Style Product Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-10 px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                    </th>
                    <th
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Produkt</span>
                        {sortBy === 'name' && (
                          <ArrowUpDown
                            className={`w-3 h-3 ${
                              sortOrder === 'asc' ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {sortBy === 'status' && (
                          <ArrowUpDown
                            className={`w-3 h-3 ${
                              sortOrder === 'asc' ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Kategorie</span>
                        {sortBy === 'category' && (
                          <ArrowUpDown
                            className={`w-3 h-3 ${
                              sortOrder === 'asc' ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className={`transition-colors ${
                          index === selectedRowIndex
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) =>
                              handleSelectProduct(product.id, e.target.checked)
                            }
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                                <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded"></div>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 text-xs font-medium px-1.5 py-0.5">
                            Aktiv
                          </Badge>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-7 h-7 p-0 hover:bg-gray-100"
                              onClick={() =>
                                router.push(
                                  `/partner/dashboard/products/${product.id}/edit`
                                )
                              }
                              title="Produkt bearbeiten"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-7 h-7 p-0 hover:bg-gray-100"
                              onClick={() => {
                                // Weitere Aktionen Dropdown oder Modal öffnen
                                console.log(
                                  'Weitere Aktionen für Produkt:',
                                  product.id
                                );
                              }}
                              title="Weitere Aktionen"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <Search className="w-12 h-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Keine Produkte gefunden
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Versuchen Sie andere Suchbegriffe oder Filter.
                          </p>
                          <Button
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                              setActiveTab('Alle');
                            }}
                            variant="outline"
                          >
                            Filter zurücksetzen
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Keyboard Navigation Help */}
          <div className="mt-4 text-xs text-gray-500 flex items-center space-x-4">
            <span>Tastatur-Navigation:</span>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                Strg+K
              </kbd>
              <span>Suchen</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                J
              </kbd>
              <span>Nächste Zeile</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                K
              </kbd>
              <span>Vorherige Zeile</span>
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
