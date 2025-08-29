'use client';

import EmailAnalyticsDashboard from '@/components/admin/EmailAnalyticsDashboard';
import EmailCampaignManager from '@/components/admin/EmailCampaignManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Mail, Send } from 'lucide-react';
import React, { useState } from 'react';

const AdminEmailManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                E-Mail Marketing Verwaltung
              </h1>
              <p className="text-gray-600">
                Zentrale Verwaltung für alle E-Mail-Kampagnen und Analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Kampagnen-Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <EmailAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="campaigns">
            <EmailCampaignManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminEmailManagementPage;
