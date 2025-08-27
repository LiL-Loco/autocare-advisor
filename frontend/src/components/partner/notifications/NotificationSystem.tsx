'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  TrendingUp,
  ShoppingCart,
  MessageSquare,
  Users,
  Clock,
  Filter,
  MoreHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'sales' | 'engagement' | 'system';
type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  data?: any;
  category: string;
}

interface NotificationSystemProps {
  partnerId: string;
}

export default function NotificationSystem({ partnerId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'sales',
      priority: 'high',
      title: 'New Sale!',
      message: 'Your Castrol GTX 5W-40 product received a purchase. Customer: Michael S.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      read: false,
      actionRequired: false,
      category: 'Sales',
      data: { productId: 'p123', customerId: 'c456', amount: 45.90 }
    },
    {
      id: '2',
      type: 'engagement',
      priority: 'medium',
      title: 'High Interest Product',
      message: 'Your Bosch Oil Filter has received 25+ views today. Consider increasing stock.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      actionRequired: true,
      category: 'Marketing',
      data: { productId: 'p789', views: 27 }
    },
    {
      id: '3',
      type: 'warning',
      priority: 'medium',
      title: 'Low Stock Alert',
      message: 'Mann-Filter C 25 114/1 is running low (3 units left). Restock recommended.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionRequired: true,
      category: 'Inventory',
      data: { productId: 'p456', stock: 3 }
    },
    {
      id: '4',
      type: 'info',
      priority: 'low',
      title: 'Weekly Performance Summary',
      message: 'Your weekly performance report is ready. Total views: 456, Sales: €234.50',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      read: true,
      actionRequired: false,
      category: 'Reports',
      data: { views: 456, sales: 234.50 }
    },
    {
      id: '5',
      type: 'system',
      priority: 'urgent',
      title: 'Product Data Import Failed',
      message: 'CSV import failed for brake_products_2024.csv. Please check file format and try again.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      read: false,
      actionRequired: true,
      category: 'System',
      data: { fileName: 'brake_products_2024.csv', error: 'Invalid format' }
    },
    {
      id: '6',
      type: 'success',
      priority: 'low',
      title: 'Product Update Successful',
      message: '15 products successfully updated with new pricing and availability.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      actionRequired: false,
      category: 'Products',
      data: { updatedCount: 15 }
    }
  ]);

  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    salesAlerts: true,
    engagementAlerts: true,
    systemAlerts: true,
    inventoryAlerts: true,
    frequency: 'immediate' as 'immediate' | 'hourly' | 'daily'
  });

  // Real-time notification simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random notification
      if (Math.random() > 0.7) {
        const randomNotifications = [
          {
            id: Date.now().toString(),
            type: 'engagement' as NotificationType,
            priority: 'medium' as NotificationPriority,
            title: 'Product Interest Spike',
            message: 'Your air filter products are getting increased attention.',
            timestamp: new Date(),
            read: false,
            actionRequired: false,
            category: 'Marketing'
          },
          {
            id: Date.now().toString(),
            type: 'sales' as NotificationType,
            priority: 'high' as NotificationPriority,
            title: 'New Sale Alert',
            message: 'Another customer purchased your brake fluid.',
            timestamp: new Date(),
            read: false,
            actionRequired: false,
            category: 'Sales'
          }
        ];

        const randomIndex = Math.floor(Math.random() * randomNotifications.length);
        setNotifications(prev => [randomNotifications[randomIndex], ...prev]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      case 'sales': return <ShoppingCart className="h-5 w-5 text-emerald-600" />;
      case 'engagement': return <TrendingUp className="h-5 w-5 text-purple-600" />;
      case 'system': return <Settings className="h-5 w-5 text-gray-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-200 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-gray-100 border-gray-200 text-gray-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-8 w-8 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600">
              {unreadCount} unread{actionRequiredCount > 0 && `, ${actionRequiredCount} need action`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                <p className="text-sm text-gray-600">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{actionRequiredCount}</p>
                <p className="text-sm text-gray-600">Action Needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'sales').length}
                </p>
                <p className="text-sm text-gray-600">Sales Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-600" />
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'sales', label: 'Sales', count: notifications.filter(n => n.type === 'sales').length },
            { key: 'engagement', label: 'Engagement', count: notifications.filter(n => n.type === 'engagement').length },
            { key: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
            { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key as NotificationType | 'all')}
            >
              {label} ({count})
            </Button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Delivery Preferences</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Browser Push Notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Alert Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.salesAlerts}
                      onChange={(e) => setSettings({...settings, salesAlerts: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Sales Alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.engagementAlerts}
                      onChange={(e) => setSettings({...settings, engagementAlerts: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Engagement Alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.systemAlerts}
                      onChange={(e) => setSettings({...settings, systemAlerts: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">System Alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.inventoryAlerts}
                      onChange={(e) => setSettings({...settings, inventoryAlerts: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inventory Alerts</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              getIcon={getNotificationIcon}
              getPriorityColor={getPriorityColor}
              formatTimeAgo={formatTimeAgo}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getIcon: (type: NotificationType) => JSX.Element;
  getPriorityColor: (priority: NotificationPriority) => string;
  formatTimeAgo: (date: Date) => string;
}

function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  getIcon, 
  getPriorityColor, 
  formatTimeAgo 
}: NotificationCardProps) {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h4>
                <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                  {notification.priority}
                </Badge>
                {notification.actionRequired && (
                  <Badge variant="outline" className="bg-red-100 border-red-200 text-red-800">
                    Action Required
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatTimeAgo(notification.timestamp)}</span>
                <span>•</span>
                <span>{notification.category}</span>
                {!notification.read && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">Unread</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!notification.read && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark Read
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.read && (
                  <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Read
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(notification.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}