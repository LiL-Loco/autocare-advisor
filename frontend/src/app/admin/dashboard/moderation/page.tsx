'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModerationItem {
  id: string;
  productId: string;
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  actionType: string;
  status: string;
  priority: string;
  productData: any;
  changesSummary: string;
  flags: string[];
  createdAt: string;
  updatedAt: string;
  moderatedAt?: string;
  moderationNotes?: string;
  rejectionReason?: string;
}

interface ModerationStats {
  pending: number;
  approved: number;
  rejected: number;
  processing: number;
}

export default function ModerationQueuePage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [stats, setStats] = useState<ModerationStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    processing: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchModerationQueue();
    fetchStats();
  }, [currentTab, page]);

  const fetchModerationQueue = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/queue?status=${currentTab}&page=${page}&limit=20`,
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
        setItems(result.data.items || []);
        setPagination(result.data.pagination);
      } else {
        throw new Error(result.error || 'Failed to fetch moderation queue');
      }
    } catch (err: any) {
      console.error('Error fetching moderation queue:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.moderation) {
          setStats(result.data.moderation);
        }
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleApprove = async (itemId: string, notes?: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/approve/${itemId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (response.ok) {
        await fetchModerationQueue();
        await fetchStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve item');
      }
    } catch (err: any) {
      setError(`Failed to approve: ${err.message}`);
    }
  };

  const handleReject = async (
    itemId: string,
    reason: string,
    notes?: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/reject/${itemId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason, notes }),
        }
      );

      if (response.ok) {
        await fetchModerationQueue();
        await fetchStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reject item');
      }
    } catch (err: any) {
      setError(`Failed to reject: ${err.message}`);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) return;

    try {
      setBulkLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/moderation/bulk-approve`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemIds: Array.from(selectedItems),
            notes: 'Bulk approved by admin',
          }),
        }
      );

      if (response.ok) {
        setSelectedItems(new Set());
        await fetchModerationQueue();
        await fetchStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to bulk approve');
      }
    } catch (err: any) {
      setError(`Bulk approve failed: ${err.message}`);
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: 'destructive',
      high: 'secondary',
      normal: 'outline',
      low: 'secondary',
    } as const;

    return (
      <Badge
        variant={variants[priority as keyof typeof variants] || 'outline'}
        className="text-xs"
      >
        {priority}
      </Badge>
    );
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

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading moderation queue...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Moderation
        </h1>
        <p className="text-gray-600">
          Review and moderate partner product submissions
        </p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Products approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Needs revision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">In review</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedItems.size} items selected
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkApprove}
                  disabled={bulkLoading || currentTab !== 'pending'}
                  size="sm"
                >
                  {bulkLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Bulk Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedItems(new Set())}
                  size="sm"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderation Queue Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Moderation Queue</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchModerationQueue()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({stats.rejected})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({stats.processing})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentTab} className="mt-4">
              {items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No items in {currentTab} status</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {currentTab === 'pending' && (
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={
                              selectedItems.size === items.length &&
                              items.length > 0
                            }
                            onChange={toggleAllSelection}
                            className="rounded border-gray-300"
                          />
                        </TableHead>
                      )}
                      <TableHead>Product</TableHead>
                      <TableHead>Partner</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      {currentTab !== 'pending' && (
                        <TableHead>Moderated</TableHead>
                      )}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        {currentTab === 'pending' && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleItemSelection(item.id)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {item.productData?.name || 'Unknown Product'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.productData?.brand || 'Unknown Brand'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.partnerName}</p>
                            <p className="text-sm text-gray-500">
                              {item.partnerEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.actionType}</Badge>
                        </TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(item.createdAt)}
                        </TableCell>
                        {currentTab !== 'pending' && (
                          <TableCell className="text-sm text-gray-600">
                            {item.moderatedAt
                              ? formatDate(item.moderatedAt)
                              : '-'}
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {currentTab === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(item.id)}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleReject(item.id, 'Quality issues', '')
                                  }
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {(page - 1) * 20 + 1} to{' '}
                    {Math.min(page * 20, pagination.totalCount)} of{' '}
                    {pagination.totalCount} items
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
