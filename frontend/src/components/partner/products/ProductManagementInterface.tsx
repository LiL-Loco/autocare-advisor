'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

// Types for Product Management
interface Product {
  _id: string;
  name: string;
  description?: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  features: string[];
  isActive: boolean;
  inStock: boolean;
  availabilityStatus: string;
  partnerId: string;
  partnerShopName: string;
  partnerShopUrl: string;
  tier?: 'basic' | 'professional' | 'enterprise';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

interface PaginationResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasMore: boolean;
    limit: number;
  };
  filters: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
  };
}

interface ProductAnalytics {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  categories: Array<{ name: string; count: number }>;
  brands: Array<{ name: string; count: number }>;
  averagePrice: number;
  totalValue: number;
}

interface ProductFilters {
  status?: string;
  category?: string;
  priceRange?: [number, number];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface BulkAction {
  type: 'status' | 'category' | 'pricing' | 'delete';
  value?: any;
}

const ProductManagementInterface: React.FC = () => {
  const router = useRouter();
  const [paginationData, setPaginationData] =
    useState<PaginationResponse | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(true);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);

  // Get current user's partner ID from localStorage/context
  const getPartnerId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('partnerId') || 'demo-partner-id';
    }
    return 'demo-partner-id';
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && {
          isActive: filters.status === 'active' ? 'true' : 'false',
        }),
        ...(filters.category && { category: filters.category }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data: PaginationResponse = await response.json();
      setPaginationData(data);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      setError(error.message);
      // Fallback to empty data
      setPaginationData({
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasMore: false,
          limit: itemsPerPage,
        },
        filters: {
          categories: [],
          brands: [],
          priceRange: { min: 0, max: 1000 },
        },
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const partnerId = getPartnerId();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/analytics/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data: ProductAnalytics = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
  }, [fetchProducts, fetchAnalytics]);

  // Get products and pagination from API response
  const products = paginationData?.products || [];
  const pagination = paginationData?.pagination || {
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    hasMore: false,
    limit: itemsPerPage,
  };
  const availableFilters = paginationData?.filters || {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length
        ? []
        : products.map((p) => p._id)
    );
  };

  const handleBulkAction = async (action: BulkAction) => {
    try {
      setLoading(true);
      const partnerId = getPartnerId();

      switch (action.type) {
        case 'status':
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/bulk-update`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productIds: selectedProducts,
                updateData: { isActive: action.value === 'active' },
                partnerId,
              }),
            }
          );
          break;
        case 'delete':
          await Promise.all(
            selectedProducts.map((id) =>
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              })
            )
          );
          break;
      }

      // Refresh products after bulk action
      await fetchProducts();
      await fetchAnalytics();
      setSelectedProducts([]);
      setShowBulkModal(false);
      setBulkActionMode(false);
    } catch (error) {
      console.error('Bulk action failed:', error);
      setError('Bulk action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        await fetchProducts();
        await fetchAnalytics();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product failed:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const getStatusColor = (isActive: boolean, inStock: boolean) => {
    if (isActive && inStock) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (isActive && !inStock) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = (isActive: boolean, inStock: boolean) => {
    if (isActive && inStock) return 'Active';
    if (isActive && !inStock) return 'Out of Stock';
    return 'Inactive';
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('de-DE');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Error loading products</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">
            {pagination.totalProducts} products • {selectedProducts.length}{' '}
            selected
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {selectedProducts.length > 0 && (
            <button
              onClick={() => setBulkActionMode(!bulkActionMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Bulk Actions ({selectedProducts.length})
            </button>
          )}
          <button
            onClick={() => router.push('/partner/products/upload')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Import CSV
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Product
          </button>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {bulkActionMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-blue-900">Bulk Actions:</span>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Change Status
            </button>
            <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
              Update Category
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              Price Adjustment
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
              Delete Selected
            </button>
            <button
              onClick={() => setBulkActionMode(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                handleFilterChange({
                  status: e.target.value || undefined,
                })
              }
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                handleFilterChange({
                  category: e.target.value || undefined,
                })
              }
            >
              <option value="">All Categories</option>
              {availableFilters.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange({
                  sortBy: sortBy || undefined,
                  sortOrder: (sortOrder as 'asc' | 'desc') || 'asc',
                });
              }}
            >
              <option value="">Sort by...</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="performance.revenue-desc">
                Revenue (High-Low)
              </option>
              <option value="lastUpdated-desc">Recently Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Brand: {product.brand}
                      </div>
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        product.isActive,
                        product.inStock
                      )}`}
                    >
                      {getStatusText(product.isActive, product.inStock)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div>Tier: {product.tier || 'Basic'}</div>
                      <div>Updated: {formatDate(product.updatedAt)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/partner/products/edit/${product._id}`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(pagination.currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(
            pagination.currentPage * itemsPerPage,
            pagination.totalProducts
          )}{' '}
          of {pagination.totalProducts} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              handlePageChange(Math.max(pagination.currentPage - 1, 1))
            }
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              handlePageChange(
                Math.min(pagination.currentPage + 1, pagination.totalPages)
              )
            }
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Bulk Action Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Bulk Status Change
            </h3>
            <div className="space-y-3">
              <button
                onClick={() =>
                  handleBulkAction({ type: 'status', value: 'active' })
                }
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Set to Active
              </button>
              <button
                onClick={() =>
                  handleBulkAction({ type: 'status', value: 'inactive' })
                }
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Set to Inactive
              </button>
              <button
                onClick={() =>
                  handleBulkAction({ type: 'status', value: 'draft' })
                }
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Set to Draft
              </button>
              <button
                onClick={() => setShowBulkModal(false)}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementInterface;
