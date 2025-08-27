'use client';

import { Button } from '@/components/ui/button';
import { Upload, Plus, BarChart3, Users, Bell } from 'lucide-react';
import CSVUpload from '../../../components/partner/csv/CSVUpload';
import ProductManagementInterface from '../../../components/partner/products/ProductManagementInterface';
import BulkOperations from '../../../components/partner/products/BulkOperations';
import CustomerInsights from '../../../components/partner/customers/CustomerInsights';
import NotificationSystem from '../../../components/partner/notifications/NotificationSystem';
import PartnerLayout from '../../../components/partner/layout/PartnerLayout';
import { useState } from 'react';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'upload' | 'customers' | 'notifications'>('products');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleBulkDelete = async (productIds: string[]) => {
    console.log('Bulk delete:', productIds);
    // Implement API call
    setSelectedProducts([]);
  };

  const handleBulkEdit = async (productIds: string[], updates: any) => {
    console.log('Bulk edit:', productIds, updates);
    // Implement API call
    setSelectedProducts([]);
  };

  const handleBulkExport = async (productIds: string[]) => {
    console.log('Bulk export:', productIds);
    // Implement export functionality
  };

  const handleBulkToggleVisibility = async (productIds: string[], visible: boolean) => {
    console.log('Bulk visibility toggle:', productIds, visible);
    // Implement API call
    setSelectedProducts([]);
  };

  const handleSelectAll = () => {
    // Get all product IDs - this would come from your product data
    // setSelectedProducts(allProductIds);
    console.log('Select all products');
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handleDuplicateProducts = async (productIds: string[]) => {
    console.log('Duplicate products:', productIds);
    // Implement duplication logic
    setSelectedProducts([]);
  };

  const mockPartnerId = '64a123456789012345678902';

  return (
    <PartnerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'upload' && 'Product Upload'}
              {activeTab === 'customers' && 'Customer Insights'}
              {activeTab === 'notifications' && 'Notifications'}
            </h1>
            <p className="text-gray-600 mt-1">
              {activeTab === 'products' && 'Manage your automotive products and inventory'}
              {activeTab === 'upload' && 'Upload your product catalog via CSV'}
              {activeTab === 'customers' && 'Understand your customer base and preferences'}
              {activeTab === 'notifications' && 'Stay updated with real-time alerts'}
            </p>
          </div>
          
          {activeTab === 'products' && (
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'products', label: 'Products', icon: BarChart3 },
              { key: 'upload', label: 'Upload', icon: Upload },
              { key: 'customers', label: 'Customers', icon: Users },
              { key: 'notifications', label: 'Notifications', icon: Bell },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <>
            {/* Bulk Operations */}
            <BulkOperations
              selectedProducts={selectedProducts}
              totalProducts={100} // This would come from your data
              onBulkDelete={handleBulkDelete}
              onBulkEdit={handleBulkEdit}
              onBulkExport={handleBulkExport}
              onBulkToggleVisibility={handleBulkToggleVisibility}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onDuplicateProducts={handleDuplicateProducts}
            />
            
            {/* Product Management */}
            <ProductManagementInterface />
          </>
        )}

        {activeTab === 'upload' && <CSVUpload partnerId={mockPartnerId} />}
        
        {activeTab === 'customers' && <CustomerInsights />}
        
        {activeTab === 'notifications' && <NotificationSystem partnerId={mockPartnerId} />}
      </div>
    </PartnerLayout>
  );
}