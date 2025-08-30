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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Bell,
  Calendar,
  Copy,
  Download,
  Edit,
  Eye,
  Filter,
  Globe,
  Mail,
  MessageSquare,
  Plus,
  Save,
  Search,
  Send,
  Share,
  Smartphone,
  Target,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EnhancedMetricCard } from '../../../../components/partner/analytics/AdvancedCharts';
import { useAuth } from '../../../../context/AuthContext';

interface MarketingTemplate {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'web' | 'social';
  category:
    | 'promotion'
    | 'retention'
    | 'welcome'
    | 'cart'
    | 'reactivation'
    | 'newsletter'
    | 'event';
  status: 'active' | 'draft' | 'archived' | 'paused';
  subject?: string;
  content: string;
  variables: string[];
  segments: string[];
  performance: {
    sentCount: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    revenue: number;
  };
  scheduling: {
    isScheduled: boolean;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    nextSend?: string;
    timezone: string;
  };
  a_b_testing: {
    enabled: boolean;
    variants?: Array<{
      name: string;
      content: string;
      allocation: number;
    }>;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  color: string;
  count: number;
}

export default function MarketingTemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] =
    useState<MarketingTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Template form data
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    type: 'email' as MarketingTemplate['type'],
    category: 'promotion' as MarketingTemplate['category'],
    subject: '',
    content: '',
    segments: [] as string[],
    scheduling: {
      isScheduled: false,
      frequency: 'once' as 'once' | 'daily' | 'weekly' | 'monthly',
      timezone: 'Europe/Berlin',
    },
    a_b_testing: {
      enabled: false,
    },
  });

  // Mock marketing templates data
  const [templates] = useState<MarketingTemplate[]>([
    {
      id: '1',
      name: 'Willkommens-Kampagne B2B',
      description: 'Automatische Begrüßungsserie für neue Geschäftskunden',
      type: 'email',
      category: 'welcome',
      status: 'active',
      subject: 'Willkommen bei AutoCare - Ihr Partner für Qualität',
      content: `Sehr geehrte Damen und Herren,

herzlich willkommen bei AutoCare! Wir freuen uns, Sie als neuen Geschäftspartner begrüßen zu dürfen.

Als führender Anbieter von Autopflegeprodukten bieten wir Ihnen:
- Hochwertige Produkte von Markenhersteller
- Attraktive Partnerkonditionen  
- Persönliche Beratung durch unser Expertenteam
- Schnelle und zuverlässige Lieferung

Ihr persönlicher Ansprechpartner: {{account_manager_name}}
Telefon: {{account_manager_phone}}
E-Mail: {{account_manager_email}}

Nutzen Sie Ihren Willkommensbonus: 15% Rabatt auf Ihre erste Bestellung mit Code WILLKOMMEN15

Mit freundlichen Grüßen
Ihr AutoCare Team`,
      variables: [
        'account_manager_name',
        'account_manager_phone',
        'account_manager_email',
        'company_name',
      ],
      segments: ['Neue B2B Kunden', 'Premium Partner'],
      performance: {
        sentCount: 234,
        openRate: 78.4,
        clickRate: 23.7,
        conversionRate: 12.3,
        revenue: 45670.8,
      },
      scheduling: {
        isScheduled: true,
        frequency: 'once',
        timezone: 'Europe/Berlin',
      },
      a_b_testing: {
        enabled: false,
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
      createdBy: 'marketing@autocare.de',
    },
    {
      id: '2',
      name: 'Warenkorb-Erinnerung Premium',
      description: 'Personalisierte Erinnerung für abgebrochene Bestellungen',
      type: 'email',
      category: 'cart',
      status: 'active',
      subject: 'Ihre Auswahl wartet auf Sie - {{company_name}}',
      content: `Sehr geehrte Damen und Herren von {{company_name}},

Sie haben qualitativ hochwertige Produkte in Ihrem Warenkorb hinterlegt:

{{cart_items}}

Gesamtwert: {{cart_total}}

Schließen Sie Ihre Bestellung ab und sichern Sie sich:
- Kostenlose Lieferung ab 500€
- 30 Tage Rückgaberecht
- Sofortige Verfügbarkeit

{{checkout_link}}

Bei Fragen erreichen Sie uns unter: 0800 / 123 456 789

Ihr AutoCare Team`,
      variables: ['company_name', 'cart_items', 'cart_total', 'checkout_link'],
      segments: ['Abgebrochene Warenkörbe', 'Premium Partner'],
      performance: {
        sentCount: 892,
        openRate: 65.2,
        clickRate: 31.8,
        conversionRate: 18.7,
        revenue: 127340.5,
      },
      scheduling: {
        isScheduled: true,
        frequency: 'once',
        timezone: 'Europe/Berlin',
      },
      a_b_testing: {
        enabled: true,
        variants: [
          {
            name: 'Variant A - Standard',
            content: 'Standard Warenkorb-Erinnerung',
            allocation: 50,
          },
          {
            name: 'Variant B - Rabatt',
            content: 'Warenkorb-Erinnerung mit 5% Sofortrabatt',
            allocation: 50,
          },
        ],
      },
      createdAt: '2024-01-18T14:30:00Z',
      updatedAt: '2024-01-20T11:20:00Z',
      createdBy: 'marketing@autocare.de',
    },
    {
      id: '3',
      name: 'Produktneuheiten Newsletter',
      description: 'Monatlicher Newsletter mit neuen Produkten und Trends',
      type: 'email',
      category: 'newsletter',
      status: 'active',
      subject: 'Neue AutoCare Produkte - {{month}} {{year}}',
      content: `AutoCare Newsletter {{month}} {{year}}

Liebe Geschäftspartner,

entdecken Sie unsere Neuheiten diesen Monat:

{{new_products}}

Highlight des Monats:
{{featured_product}}

Branchentrends:
- Nachhaltige Autopflege im Fokus
- Elektromotoren benötigen spezielle Pflege
- Winterprodukte stark nachgefragt

Termine:
{{upcoming_events}}

Beste Grüße
Ihr AutoCare Produktteam`,
      variables: [
        'month',
        'year',
        'new_products',
        'featured_product',
        'upcoming_events',
      ],
      segments: ['Newsletter Abonnenten', 'Aktive Partner', 'VIP Kunden'],
      performance: {
        sentCount: 5337,
        openRate: 43.2,
        clickRate: 12.8,
        conversionRate: 4.7,
        revenue: 89230.4,
      },
      scheduling: {
        isScheduled: true,
        frequency: 'monthly',
        nextSend: '2024-02-01T09:00:00Z',
        timezone: 'Europe/Berlin',
      },
      a_b_testing: {
        enabled: false,
      },
      createdAt: '2024-01-10T16:00:00Z',
      updatedAt: '2024-01-19T08:45:00Z',
      createdBy: 'product@autocare.de',
    },
    {
      id: '4',
      name: 'SMS Lieferbestätigung',
      description: 'Kurze SMS-Bestätigung für versendete Bestellungen',
      type: 'sms',
      category: 'event',
      status: 'active',
      content: `AutoCare: Ihre Bestellung #{{order_number}} wurde versendet! 

Sendungsverfolgung: {{tracking_link}}

Erwartete Lieferung: {{delivery_date}}

Service: 0800 123 456`,
      variables: ['order_number', 'tracking_link', 'delivery_date'],
      segments: ['Alle Kunden'],
      performance: {
        sentCount: 1247,
        openRate: 96.8,
        clickRate: 45.3,
        conversionRate: 0,
        revenue: 0,
      },
      scheduling: {
        isScheduled: false,
        timezone: 'Europe/Berlin',
      },
      a_b_testing: {
        enabled: false,
      },
      createdAt: '2024-01-12T09:00:00Z',
      updatedAt: '2024-01-20T13:10:00Z',
      createdBy: 'logistics@autocare.de',
    },
  ]);

  // Template categories
  const categories: TemplateCategory[] = [
    {
      id: 'promotion',
      name: 'Aktionen & Rabatte',
      description: 'Verkaufsfördernde Kampagnen und Sonderangebote',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-red-100 text-red-800',
      count: templates.filter((t) => t.category === 'promotion').length,
    },
    {
      id: 'welcome',
      name: 'Willkommen',
      description: 'Onboarding-Kampagnen für neue Kunden',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-800',
      count: templates.filter((t) => t.category === 'welcome').length,
    },
    {
      id: 'cart',
      name: 'Warenkorb',
      description: 'Erinnerungen für abgebrochene Bestellungen',
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'bg-orange-100 text-orange-800',
      count: templates.filter((t) => t.category === 'cart').length,
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Regelmäßige Informationen und Updates',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-green-100 text-green-800',
      count: templates.filter((t) => t.category === 'newsletter').length,
    },
    {
      id: 'retention',
      name: 'Kundenbindung',
      description: 'Kampagnen zur Kundenreaktivierung',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-800',
      count: templates.filter((t) => t.category === 'retention').length,
    },
    {
      id: 'event',
      name: 'Events & Updates',
      description: 'Ereignisbasierte Kommunikation',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-yellow-100 text-yellow-800',
      count: templates.filter((t) => t.category === 'event').length,
    },
  ];

  const channelIcons = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    whatsapp: <Smartphone className="h-4 w-4" />,
    push: <Bell className="h-4 w-4" />,
    web: <Globe className="h-4 w-4" />,
    social: <Share className="h-4 w-4" />,
  };

  const channelLabels = {
    email: 'E-Mail',
    sms: 'SMS',
    whatsapp: 'WhatsApp',
    push: 'Push',
    web: 'Web',
    social: 'Social Media',
  };

  useEffect(() => {
    if (!user) {
      router.push('/partner/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchData();
  }, [user, router]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesCategory =
      categoryFilter === 'all' || template.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || template.status === statusFilter;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktiv',
      draft: 'Entwurf',
      paused: 'Pausiert',
      archived: 'Archiviert',
    };
    return labels[status] || status;
  };

  const handleCreateTemplate = () => {
    console.log('Creating template:', templateForm);
    setIsCreateModalOpen(false);
    // Reset form
    setTemplateForm({
      name: '',
      description: '',
      type: 'email',
      category: 'promotion',
      subject: '',
      content: '',
      segments: [],
      scheduling: {
        isScheduled: false,
        frequency: 'once',
        timezone: 'Europe/Berlin',
      },
      a_b_testing: {
        enabled: false,
      },
    });
  };

  const handleEditTemplate = (template: MarketingTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      type: template.type,
      category: template.category,
      subject: template.subject || '',
      content: template.content,
      segments: template.segments,
      scheduling: {
        isScheduled: template.scheduling.isScheduled,
        frequency: template.scheduling.frequency || 'once',
        timezone: template.scheduling.timezone,
      },
      a_b_testing: template.a_b_testing,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveTemplate = () => {
    console.log('Saving template:', selectedTemplate?.id, templateForm);
    setIsEditModalOpen(false);
    setSelectedTemplate(null);
  };

  const handlePreviewTemplate = (template: MarketingTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleDuplicateTemplate = (template: MarketingTemplate) => {
    console.log('Duplicating template:', template.id);
  };

  const handleDeleteTemplate = (template: MarketingTemplate) => {
    console.log('Deleting template:', template.id);
  };

  const handleSendTest = (template: MarketingTemplate) => {
    console.log('Sending test:', template.id);
  };

  if (loading) {
    return (
    <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Templates werden geladen...</p>
          </div>
        </div>
  );
  }

  return (
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Marketing Templates
            </h1>
            <p className="text-gray-600 mt-1">
              Erstellen und verwalten Sie professionelle Marketing-Vorlagen für
              alle Kanäle
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Neues Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Neues Marketing Template erstellen</DialogTitle>
                  <DialogDescription>
                    Erstellen Sie eine neue Vorlage für Ihre
                    Marketing-Kampagnen.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        value={templateForm.name}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="z.B. Willkommens-Kampagne"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-type">Kanal</Label>
                      <Select
                        value={templateForm.type}
                        onValueChange={(value: MarketingTemplate['type']) =>
                          setTemplateForm({ ...templateForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">E-Mail</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="push">
                            Push Notification
                          </SelectItem>
                          <SelectItem value="web">Web Banner</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Kategorie</Label>
                      <Select
                        value={templateForm.category}
                        onValueChange={(value: MarketingTemplate['category']) =>
                          setTemplateForm({ ...templateForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="promotion">
                            Aktionen & Rabatte
                          </SelectItem>
                          <SelectItem value="welcome">Willkommen</SelectItem>
                          <SelectItem value="cart">Warenkorb</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="retention">
                            Kundenbindung
                          </SelectItem>
                          <SelectItem value="event">
                            Events & Updates
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-description">Beschreibung</Label>
                    <Input
                      id="template-description"
                      value={templateForm.description}
                      onChange={(e) =>
                        setTemplateForm({
                          ...templateForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Kurze Beschreibung des Templates"
                    />
                  </div>

                  {templateForm.type === 'email' && (
                    <div className="space-y-2">
                      <Label htmlFor="template-subject">Betreff</Label>
                      <Input
                        id="template-subject"
                        value={templateForm.subject}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            subject: e.target.value,
                          })
                        }
                        placeholder="E-Mail Betreff"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="template-content">Inhalt</Label>
                    <Textarea
                      id="template-content"
                      value={templateForm.content}
                      onChange={(e) =>
                        setTemplateForm({
                          ...templateForm,
                          content: e.target.value,
                        })
                      }
                      placeholder="Template Inhalt mit Variablen wie {{company_name}}"
                      rows={8}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable-scheduling"
                        checked={templateForm.scheduling.isScheduled}
                        onCheckedChange={(checked) =>
                          setTemplateForm({
                            ...templateForm,
                            scheduling: {
                              ...templateForm.scheduling,
                              isScheduled: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="enable-scheduling">
                        Automatische Planung aktivieren
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable-ab-testing"
                        checked={templateForm.a_b_testing.enabled}
                        onCheckedChange={(checked) =>
                          setTemplateForm({
                            ...templateForm,
                            a_b_testing: {
                              ...templateForm.a_b_testing,
                              enabled: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="enable-ab-testing">
                        A/B Testing aktivieren
                      </Label>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Template erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedMetricCard
            title="Aktive Templates"
            value={templates
              .filter((t) => t.status === 'active')
              .length.toString()}
            change={{
              value: 2,
              period: 'Neue diese Woche',
              type: 'increase',
            }}
            color="blue"
            icon="Mail"
          />

          <EnhancedMetricCard
            title="Gesendete Nachrichten"
            value={formatNumber(
              templates.reduce((sum, t) => sum + t.performance.sentCount, 0)
            )}
            change={{
              value: 23.7,
              period: 'vs. letzter Monat',
              type: 'increase',
            }}
            color="green"
            icon="Send"
          />

          <EnhancedMetricCard
            title="Durchschn. Öffnungsrate"
            value={`${(
              templates.reduce((sum, t) => sum + t.performance.openRate, 0) /
              templates.length
            ).toFixed(1)}%`}
            change={{
              value: 4.2,
              period: 'Verbesserung',
              type: 'increase',
            }}
            color="purple"
            icon="Eye"
          />

          <EnhancedMetricCard
            title="Generierter Umsatz"
            value={formatCurrency(
              templates.reduce((sum, t) => sum + t.performance.revenue, 0)
            )}
            change={{
              value: 18.9,
              period: 'ROI Steigerung',
              type: 'increase',
            }}
            color="yellow"
            icon="BarChart3"
          />
        </div>

        {/* Category Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Template-Kategorien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setCategoryFilter(category.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {category.icon}
                    </div>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Templates suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kanal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kanäle</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="paused">Pausiert</SelectItem>
                  <SelectItem value="archived">Archiviert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Marketing Templates ({filteredTemplates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Kanal</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Performance</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-600">
                          {template.description}
                        </div>
                        {template.subject && (
                          <div className="text-xs text-gray-500 mt-1 italic">
                            "{template.subject}"
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {channelIcons[template.type]}
                        <span>{channelLabels[template.type]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          categories.find((c) => c.id === template.category)
                            ?.color
                        }
                        variant="secondary"
                      >
                        {
                          categories.find((c) => c.id === template.category)
                            ?.name
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(template.status)}
                        variant="secondary"
                      >
                        {getStatusLabel(template.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-gray-600">Gesendet:</span>{' '}
                          {formatNumber(template.performance.sentCount)}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Öffnungsrate:</span>{' '}
                          {formatPercentage(template.performance.openRate)}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Umsatz:</span>{' '}
                          {formatCurrency(template.performance.revenue)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSendTest(template)}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Keine Templates gefunden
                </h3>
                <p className="text-gray-500">
                  Passen Sie Ihre Filter an oder erstellen Sie ein neues
                  Template.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Preview Modal */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Template Vorschau: {selectedTemplate?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedTemplate && (
              <div className="space-y-6">
                {/* Template Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Kanal</div>
                    <div className="flex items-center gap-2 mt-1">
                      {channelIcons[selectedTemplate.type]}
                      <span>{channelLabels[selectedTemplate.type]}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Kategorie</div>
                    <div className="mt-1">
                      <Badge
                        className={
                          categories.find(
                            (c) => c.id === selectedTemplate.category
                          )?.color
                        }
                        variant="secondary"
                      >
                        {
                          categories.find(
                            (c) => c.id === selectedTemplate.category
                          )?.name
                        }
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="mt-1">
                      <Badge
                        className={getStatusColor(selectedTemplate.status)}
                        variant="secondary"
                      >
                        {getStatusLabel(selectedTemplate.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Zielgruppen</div>
                    <div className="mt-1 space-x-1">
                      {selectedTemplate.segments.map((segment, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {segment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="border rounded-lg p-4">
                  {selectedTemplate.subject && (
                    <div className="border-b pb-3 mb-4">
                      <div className="text-sm text-gray-600 mb-1">Betreff:</div>
                      <div className="font-semibold">
                        {selectedTemplate.subject}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 mb-2">Inhalt:</div>
                  <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-3 rounded">
                    {selectedTemplate.content}
                  </div>
                </div>

                {/* Variables */}
                {selectedTemplate.variables.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      Verfügbare Variablen:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="font-mono"
                        >
                          {'{{' + variable + '}}'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance */}
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-3">
                    Performance-Kennzahlen:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(selectedTemplate.performance.sentCount)}
                      </div>
                      <div className="text-xs text-blue-700">Gesendet</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercentage(
                          selectedTemplate.performance.openRate
                        )}
                      </div>
                      <div className="text-xs text-green-700">Öffnungsrate</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatPercentage(
                          selectedTemplate.performance.clickRate
                        )}
                      </div>
                      <div className="text-xs text-purple-700">Klickrate</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(selectedTemplate.performance.revenue)}
                      </div>
                      <div className="text-xs text-yellow-700">Umsatz</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Schließen
              </Button>
              <Button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  selectedTemplate && handleEditTemplate(selectedTemplate);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Bearbeiten
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Template Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Template bearbeiten: {selectedTemplate?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Same form fields as create modal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-template-name">Template Name</Label>
                  <Input
                    id="edit-template-name"
                    value={templateForm.name}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-template-type">Kanal</Label>
                  <Select
                    value={templateForm.type}
                    onValueChange={(value: MarketingTemplate['type']) =>
                      setTemplateForm({ ...templateForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-Mail</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="web">Web Banner</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-template-description">Beschreibung</Label>
                <Input
                  id="edit-template-description"
                  value={templateForm.description}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {templateForm.type === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-template-subject">Betreff</Label>
                  <Input
                    id="edit-template-subject"
                    value={templateForm.subject}
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-template-content">Inhalt</Label>
                <Textarea
                  id="edit-template-content"
                  value={templateForm.content}
                  onChange={(e) =>
                    setTemplateForm({
                      ...templateForm,
                      content: e.target.value,
                    })
                  }
                  rows={8}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Abbrechen
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}
