'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Copy,
  Edit2,
  Eye,
  Filter,
  Plus,
  Search,
  Send,
  Settings,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  type: 'onboarding' | 'marketing' | 'transactional' | 'broadcast';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';
  template: string;
  subject: string;
  recipients: number;
  scheduledDate?: Date;
  createdAt: Date;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  abTestVariants?: number;
}

interface Template {
  id: string;
  name: string;
  category: string;
  type: 'onboarding' | 'marketing' | 'transactional';
  subject: string;
  previewText: string;
  isActive: boolean;
}

interface Audience {
  id: string;
  name: string;
  description: string;
  criteria: {
    partnerType?: string[];
    location?: string[];
    registrationDate?: { from?: Date; to?: Date };
    revenue?: { min?: number; max?: number };
    activity?: 'active' | 'inactive' | 'new';
  };
  size: number;
}

const EmailCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    setCampaigns([
      {
        id: '1',
        name: 'Partner Onboarding Sequence',
        type: 'onboarding',
        status: 'running',
        template: 'Partner Onboarding - Step 1: Welcome',
        subject: '🚀 Willkommen bei AutoCare Advisor!',
        recipients: 127,
        scheduledDate: new Date(),
        createdAt: new Date('2024-01-15'),
        openRate: 84.5,
        clickRate: 23.1,
        conversionRate: 12.8,
        abTestVariants: 2,
      },
      {
        id: '2',
        name: 'Winter Special Campaign',
        type: 'marketing',
        status: 'scheduled',
        template: 'Seasonal Campaign - Winter Special',
        subject: '❄️ Winter-Aktion: Bis zu 40% mehr Umsatz!',
        recipients: 2843,
        scheduledDate: new Date('2024-12-01'),
        createdAt: new Date('2024-11-20'),
        abTestVariants: 3,
      },
      {
        id: '3',
        name: 'Re-engagement Campaign',
        type: 'marketing',
        status: 'completed',
        template: 'Re-engagement - We Miss You',
        subject: '😢 Wir vermissen Sie bei AutoCare Advisor',
        recipients: 156,
        scheduledDate: new Date('2024-11-15'),
        createdAt: new Date('2024-11-10'),
        openRate: 62.3,
        clickRate: 18.7,
        conversionRate: 8.9,
      },
    ]);

    setTemplates([
      {
        id: '1',
        name: 'Partner Onboarding - Step 1: Welcome',
        category: 'partner_welcome',
        type: 'onboarding',
        subject: '🚀 Willkommen bei AutoCare Advisor!',
        previewText: 'Herzlich willkommen! Starten Sie jetzt durch...',
        isActive: true,
      },
      {
        id: '2',
        name: 'Demo Follow-up - Next Steps',
        category: 'follow_up',
        type: 'marketing',
        subject: '🚀 Ihre nächsten Schritte zur Partnerschaft',
        previewText: 'Vielen Dank für das tolle Gespräch...',
        isActive: true,
      },
      {
        id: '3',
        name: 'Invoice Confirmation',
        category: 'billing',
        type: 'transactional',
        subject: '📄 Rechnung {{invoice.number}} - AutoCare Advisor',
        previewText: 'Ihre Rechnung ist bereit...',
        isActive: true,
      },
    ]);

    setAudiences([
      {
        id: '1',
        name: 'Neue Partner (30 Tage)',
        description:
          'Partner, die sich in den letzten 30 Tagen registriert haben',
        criteria: {
          registrationDate: {
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          activity: 'new',
        },
        size: 89,
      },
      {
        id: '2',
        name: 'Premium Partner',
        description: 'Partner mit hohem monatlichen Umsatz',
        criteria: {
          revenue: { min: 1000 },
          activity: 'active',
        },
        size: 234,
      },
      {
        id: '3',
        name: 'Inaktive Partner',
        description: 'Partner ohne Aktivität in den letzten 60 Tagen',
        criteria: {
          activity: 'inactive',
        },
        size: 156,
      },
    ]);
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Campaign['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      running: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
    };
    return colors[status];
  };

  const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedCampaign(campaign)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold mb-1">
              {campaign.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Empfänger</p>
            <p className="font-semibold">
              {campaign.recipients.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Template</p>
            <p className="font-semibold truncate">{campaign.template}</p>
          </div>
          {campaign.openRate !== undefined && (
            <>
              <div>
                <p className="text-gray-500">Öffnungsrate</p>
                <p className="font-semibold text-green-600">
                  {campaign.openRate}%
                </p>
              </div>
              <div>
                <p className="text-gray-500">Klickrate</p>
                <p className="font-semibold text-blue-600">
                  {campaign.clickRate}%
                </p>
              </div>
            </>
          )}
          {campaign.scheduledDate && (
            <div className="col-span-2">
              <p className="text-gray-500">Geplant für</p>
              <p className="font-semibold">
                {campaign.scheduledDate.toLocaleDateString('de-DE')}{' '}
                {campaign.scheduledDate.toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>
        {campaign.abTestVariants && campaign.abTestVariants > 1 && (
          <div className="mt-3">
            <Badge variant="outline">
              A/B Test ({campaign.abTestVariants} Varianten)
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CreateCampaignDialog: React.FC = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'marketing' as Campaign['type'],
      template: '',
      audience: '',
      scheduledDate: undefined as Date | undefined,
      abTest: false,
      variants: 2,
    });

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            <Plus className="h-4 w-4 mr-2" />
            Neue Kampagne erstellen
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neue E-Mail Kampagne erstellen</DialogTitle>
            <DialogDescription>
              Erstellen Sie eine neue E-Mail Kampagne mit unserem
              Kampagnen-Wizard.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Kampagnenname
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
                placeholder="z.B. Winter Special 2024"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Kampagnentyp
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: Campaign['type']) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="transactional">Transaktional</SelectItem>
                  <SelectItem value="broadcast">Broadcast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-right">
                E-Mail Template
              </Label>
              <Select
                value={formData.template}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, template: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Template auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {templates
                    .filter((t) => t.type === formData.type)
                    .map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="audience" className="text-right">
                Zielgruppe
              </Label>
              <Select
                value={formData.audience}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, audience: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Zielgruppe auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience.id} value={audience.id}>
                      {audience.name} ({audience.size} Empfänger)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduledDate" className="text-right">
                Versanddatum
              </Label>
              <Input
                type="datetime-local"
                value={
                  formData.scheduledDate
                    ? formData.scheduledDate.toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  }))
                }
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                // Create campaign logic here
                setIsCreateDialogOpen(false);
              }}
            >
              Kampagne erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-Mail Kampagnen</h1>
          <p className="text-gray-600">
            Verwalten Sie alle E-Mail Kampagnen zentral
          </p>
        </div>
        <CreateCampaignDialog />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Kampagnen
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="audiences" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Zielgruppen
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Kampagnen durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="draft">Entwurf</SelectItem>
                <SelectItem value="scheduled">Geplant</SelectItem>
                <SelectItem value="running">Laufend</SelectItem>
                <SelectItem value="paused">Pausiert</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Keine Kampagnen gefunden
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Keine Kampagnen entsprechen Ihren Filterkriterien.'
                  : 'Erstellen Sie Ihre erste E-Mail Kampagne.'}
              </p>
              <CreateCampaignDialog />
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail Templates</CardTitle>
              <p className="text-gray-600">
                Verwalten Sie Ihre E-Mail Templates und erstellen Sie neue.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-600">
                        {template.subject}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          template.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {template.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audiences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zielgruppen</CardTitle>
              <p className="text-gray-600">
                Definieren und verwalten Sie Ihre E-Mail Zielgruppen.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {audiences.map((audience) => (
                  <div
                    key={audience.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{audience.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {audience.description}
                      </p>
                      <Badge variant="outline">{audience.size} Empfänger</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gesamte Kampagnen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {campaigns.length}
                </div>
                <p className="text-sm text-gray-600">
                  Davon {campaigns.filter((c) => c.status === 'running').length}{' '}
                  aktiv
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Durchschnittliche Öffnungsrate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">78.3%</div>
                <p className="text-sm text-gray-600">+5.2% zum Vormonat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gesamte Empfänger</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {campaigns
                    .reduce((sum, c) => sum + c.recipients, 0)
                    .toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Über alle Kampagnen</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Kampagnen Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns
                  .filter((c) => c.openRate !== undefined)
                  .map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">
                          {campaign.recipients.toLocaleString()} Empfänger
                        </p>
                      </div>
                      <div className="flex space-x-8 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500">Öffnungsrate</p>
                          <p className="font-semibold text-green-600">
                            {campaign.openRate}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Klickrate</p>
                          <p className="font-semibold text-blue-600">
                            {campaign.clickRate}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Conversion</p>
                          <p className="font-semibold text-purple-600">
                            {campaign.conversionRate}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailCampaignManager;
