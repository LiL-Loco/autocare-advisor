'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckSquare,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  MoreHorizontal,
  Square,
  Tag,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface BulkOperationsProps {
  selectedProducts: string[];
  totalProducts: number;
  onBulkDelete: (productIds: string[]) => void;
  onBulkEdit: (productIds: string[], updates: any) => void;
  onBulkExport: (productIds: string[]) => void;
  onBulkToggleVisibility: (productIds: string[], visible: boolean) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDuplicateProducts: (productIds: string[]) => void;
}

export default function BulkOperations({
  selectedProducts,
  totalProducts,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
  onBulkToggleVisibility,
  onSelectAll,
  onClearSelection,
  onDuplicateProducts,
}: BulkOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  const handleBulkAction = async (action: () => Promise<void> | void) => {
    setIsProcessing(true);
    try {
      await action();
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {selectedProducts.length === totalProducts ? (
              <CheckSquare className="h-5 w-5 text-blue-600" />
            ) : (
              <Square className="h-5 w-5 text-blue-600" />
            )}
            <span className="text-sm font-medium text-blue-900">
              {selectedProducts.length} of {totalProducts} products selected
            </span>
          </div>

          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Bulk Actions Available
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-600 border-gray-200 hover:bg-gray-100"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center space-x-2">
          {/* Primary Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleBulkAction(() => onBulkExport(selectedProducts))
            }
            disabled={isProcessing}
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export ({selectedProducts.length})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkEditModal(true)}
            disabled={isProcessing}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Bulk Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleBulkAction(() =>
                onBulkToggleVisibility(selectedProducts, true)
              )
            }
            disabled={isProcessing}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Show
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleBulkAction(() =>
                onBulkToggleVisibility(selectedProducts, false)
              )
            }
            disabled={isProcessing}
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Hide
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={() =>
                  handleBulkAction(() => onDuplicateProducts(selectedProducts))
                }
                disabled={isProcessing}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Products
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleBulkAction(() =>
                    onBulkEdit(selectedProducts, { featured: true })
                  )
                }
                disabled={isProcessing}
              >
                <Tag className="h-4 w-4 mr-2" />
                Mark as Featured
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleBulkAction(() => onBulkDelete(selectedProducts))
                }
                disabled={isProcessing}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Products
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isProcessing && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-600">Processing...</span>
          </div>
        )}
      </div>

      {/* Bulk Edit Modal */}
      {showBulkEditModal && (
        <BulkEditModal
          selectedCount={selectedProducts.length}
          onClose={() => setShowBulkEditModal(false)}
          onApply={(updates) => {
            handleBulkAction(() => onBulkEdit(selectedProducts, updates));
            setShowBulkEditModal(false);
          }}
        />
      )}
    </div>
  );
}

interface BulkEditModalProps {
  selectedCount: number;
  onClose: () => void;
  onApply: (updates: any) => void;
}

function BulkEditModal({
  selectedCount,
  onClose,
  onApply,
}: BulkEditModalProps) {
  const [updates, setUpdates] = useState({
    category: '',
    price: '',
    discount: '',
    featured: false,
    tags: '',
  });

  const handleApply = () => {
    const filteredUpdates = Object.entries(updates)
      .filter(([key, value]) => {
        if (key === 'featured') return true;
        return value !== '' && value !== false;
      })
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]:
            key === 'price' || key === 'discount'
              ? parseFloat(value as string)
              : value,
        }),
        {}
      );

    onApply(filteredUpdates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Bulk Edit {selectedCount} Products
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={updates.category}
              onChange={(e) =>
                setUpdates({ ...updates, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Keep existing</option>
              <option value="motoroel">Motoröl</option>
              <option value="bremsen">Bremsen</option>
              <option value="kuehlmittel">Kühlmittel</option>
              <option value="filter">Filter</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (€)
              </label>
              <input
                type="number"
                value={updates.price}
                onChange={(e) =>
                  setUpdates({ ...updates, price: e.target.value })
                }
                placeholder="Keep existing"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                value={updates.discount}
                onChange={(e) =>
                  setUpdates({ ...updates, discount: e.target.value })
                }
                placeholder="Keep existing"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={updates.tags}
              onChange={(e) => setUpdates({ ...updates, tags: e.target.value })}
              placeholder="Add tags..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={updates.featured}
              onChange={(e) =>
                setUpdates({ ...updates, featured: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="featured"
              className="ml-2 block text-sm text-gray-700"
            >
              Mark as Featured Product
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Changes</Button>
        </div>
      </div>
    </div>
  );
}
