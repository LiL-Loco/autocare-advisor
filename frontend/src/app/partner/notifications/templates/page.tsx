'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
  BarChart3,
  Bell,
  CheckCircle2,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Info,
  Mail,
  MessageSquare,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Smartphone,
  Trash2,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push' | 'slack';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  status: 'active' | 'draft' | 'archived';
  isDefault: boolean;
  usageCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  preview?: {
    desktop?: string;
    mobile?: string;
  };
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
}

export default function NotificationTemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('templates');

  // Form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    type: 'email' as NotificationTemplate['type'],
    category: '',
    subject: '',
    content: '',
    variables: [] as string[],
  });

  // Mock template categories
  const templateCategories: TemplateCategory[] = [
    {
      id: 'orders',
      name: 'Bestellungen',
      description: 'Templates für bestellungsbezogene Benachrichtigungen',
      count: 8,
      color: 'blue',
    },
    {
      id: 'customers',
      name: 'Kunden',
      description: 'Templates für Kundenkommunikation',
      count: 12,
      color: 'green',
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Templates für Marketing-Kampagnen',
      count: 15,
      color: 'purple',
    },
    {
      id: 'system',
      name: 'System',
      description: 'Templates für Systembenachrichtigungen',
      count: 6,
      color: 'orange',
    },
    {
      id: 'billing',
      name: 'Abrechnung',
      description: 'Templates für Rechnungen und Zahlungen',
      count: 7,
      color: 'red',
    },
  ];

  // Mock templates
  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Neue Bestellung - Bestätigung',
      description: 'E-Mail-Template für Bestellbestätigungen',
      type: 'email',
      category: 'orders',
      subject: 'Ihre Bestellung {{order_number}} wurde bestätigt',
      content: `Hallo {{customer_name}},

vielen Dank für Ihre Bestellung bei AutoCare Advisor.

Bestellnummer: {{order_number}}
Bestelldatum: {{order_date}}
Gesamtbetrag: {{total_amount}}

Ihre bestellten Artikel:
{{#items}}
- {{name}} ({{quantity}}x) - {{price}}
{{/items}}

Die Lieferung erfolgt an:
{{shipping_address}}

Mit freundlichen Grüßen,
Ihr AutoCare Advisor Team`,
      variables: [
        'customer_name',
        'order_number',
        'order_date',
        'total_amount',
        'items',
        'shipping_address',
      ],
      status: 'active',
      isDefault: true,
      usageCount: 1247,
      openRate: 94.2,
      clickRate: 23.8,
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-08-20T14:30:00Z',
      createdBy: 'system',
    },
    {
      id: '2',
      name: 'Lagerbestand niedrig - Warnung',
      description: 'SMS-Benachrichtigung bei kritischen Lagerbeständen',
      type: 'sms',
      category: 'system',
      content:
        'WARNUNG: Lagerbestand für {{product_name}} ({{sku}}) ist kritisch niedrig: {{current_stock}} Stück verfügbar. Nachbestellung erforderlich.',
      variables: ['product_name', 'sku', 'current_stock'],
      status: 'active',
      isDefault: true,
      usageCount: 89,
      createdAt: '2025-01-15T09:00:00Z',
      updatedAt: '2025-08-15T16:20:00Z',
      createdBy: 'admin@autocare.de',
    },
    {
      id: '3',
      name: 'Willkommen neuer Kunde',
      description: 'Push-Notification für neue Kundenregistrierungen',
      type: 'push',
      category: 'customers',
      content:
        'Willkommen bei AutoCare Advisor, {{customer_name}}! Entdecken Sie unser komplettes Sortiment an Autopflegeprodukten.',
      variables: ['customer_name'],
      status: 'active',
      isDefault: false,
      usageCount: 456,
      openRate: 87.5,
      clickRate: 12.3,
      createdAt: '2025-02-01T12:00:00Z',
      updatedAt: '2025-07-30T11:15:00Z',
      createdBy: 'marketing@autocare.de',
    },
    {
      id: '4',
      name: 'Monatsrechnung verfügbar',
      description: 'E-Mail-Template für monatliche Rechnungen',
      type: 'email',
      category: 'billing',
      subject: 'Ihre Rechnung für {{billing_period}} ist verfügbar',
      content: `Sehr geehrte Damen und Herren,

Ihre Rechnung für den Abrechnungszeitraum {{billing_period}} ist nun verfügbar.

Rechnungsnummer: {{invoice_number}}
Rechnungsdatum: {{invoice_date}}
Fälligkeitsdatum: {{due_date}}
Gesamtbetrag: {{total_amount}}

Sie können Ihre Rechnung hier herunterladen:
{{invoice_download_link}}

Die Zahlung erfolgt automatisch über Ihr hinterlegtes Zahlungsmittel.

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Ihr AutoCare Advisor Team`,
      variables: [
        'billing_period',
        'invoice_number',
        'invoice_date',
        'due_date',
        'total_amount',
        'invoice_download_link',
      ],
      status: 'active',
      isDefault: true,
      usageCount: 234,
      openRate: 98.7,
      clickRate: 45.2,
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-08-25T09:45:00Z',
      createdBy: 'billing@autocare.de',
    },
    {
      id: '5',
      name: 'Sonderangebot - Motoröl',
      description: 'Marketing-E-Mail für spezielle Motoröl-Angebote',
      type: 'email',
      category: 'marketing',
      subject:
        '🚗 Exklusives Angebot: {{discount_percentage}}% Rabatt auf Premium-Motoröle',
      content: `Liebe {{customer_name}},

nutzen Sie unser exklusives Angebot und sparen Sie {{discount_percentage}}% auf alle Premium-Motoröle!

✅ Hochwertige Markenmotoröle
✅ Für alle Fahrzeugtypen
✅ Kostenlose Lieferung ab 50€
✅ Angebot gültig bis {{offer_end_date}}

Entdecken Sie unser Sortiment:
{{shop_link}}

Verwenden Sie den Gutscheincode: {{coupon_code}}

Verpassen Sie nicht diese Gelegenheit!

Ihr AutoCare Advisor Team`,
      variables: [
        'customer_name',
        'discount_percentage',
        'offer_end_date',
        'shop_link',
        'coupon_code',
      ],
      status: 'draft',
      isDefault: false,
      usageCount: 0,
      createdAt: '2025-08-20T14:00:00Z',
      updatedAt: '2025-08-25T16:30:00Z',
      createdBy: 'marketing@autocare.de',
    },
    {
      id: '6',
      name: 'Zahlung fehlgeschlagen',
      description: 'Slack-Notification bei fehlgeschlagenen Zahlungen',
      type: 'slack',
      category: 'billing',
      content:
        '🚨 Zahlungsalarm: Zahlung für Kunde {{customer_name}} ({{customer_id}}) fehlgeschlagen. Betrag: {{amount}}. Grund: {{failure_reason}}. Sofortige Überprüfung erforderlich.',
      variables: ['customer_name', 'customer_id', 'amount', 'failure_reason'],
      status: 'active',
      isDefault: true,
      usageCount: 23,
      createdAt: '2025-03-01T10:30:00Z',
      updatedAt: '2025-08-10T13:20:00Z',
      createdBy: 'system',
    },
  ]);

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

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      email: <Mail className="h-4 w-4" />,
      sms: <Smartphone className="h-4 w-4" />,
      push: <Bell className="h-4 w-4" />,
      slack: <MessageSquare className="h-4 w-4" />,
    };
    return icons[type] || <Bell className="h-4 w-4" />;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      email: 'E-Mail',
      sms: 'SMS',
      push: 'Push',
      slack: 'Slack',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktiv',
      draft: 'Entwurf',
      archived: 'Archiviert',
    };
    return labels[status] || status;
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = templateCategories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const handleCreateTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      name: templateForm.name,
      description: templateForm.description,
      type: templateForm.type,
      category: templateForm.category,
      subject: templateForm.subject,
      content: templateForm.content,
      variables: templateForm.variables,
      status: 'draft',
      isDefault: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.email || 'unknown',
    };

    console.log('Creating template:', newTemplate);
    setIsCreateModalOpen(false);

    // Reset form
    setTemplateForm({
      name: '',
      description: '',
      type: 'email',
      category: '',
      subject: '',
      content: '',
      variables: [],
    });
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      type: template.type,
      category: template.category,
      subject: template.subject || '',
      content: template.content,
      variables: template.variables,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteTemplate = (template: NotificationTemplate) => {
    if (
      window.confirm(
        `Sind Sie sicher, dass Sie das Template "${template.name}" löschen möchten?`
      )
    ) {
      console.log('Deleting template:', template.id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Calculate stats
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.status === 'active').length;
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
  const avgOpenRate = templates
    .filter((t) => t.openRate)
    .reduce((sum, t, _, arr) => sum + (t.openRate || 0) / arr.length, 0);

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Templates werden geladen...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Benachrichtigungs-Templates
            </h1>
            <p className="text-gray-600 mt-1">
              Verwalten Sie E-Mail-, SMS- und Push-Notification-Templates
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              Aktualisieren
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Templates exportieren
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
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Neues Benachrichtigungs-Template erstellen
                  </DialogTitle>
                  <DialogDescription>
                    Erstellen Sie ein neues Template für E-Mail-, SMS- oder
                    Push-Benachrichtigungen.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Name</Label>
                      <Input
                        id="template-name"
                        value={templateForm.name}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="z.B. Bestellbestätigung"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-type">Typ</Label>
                      <Select
                        value={templateForm.type}
                        onValueChange={(value: NotificationTemplate['type']) =>
                          setTemplateForm({ ...templateForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">E-Mail</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">
                            Push-Notification
                          </SelectItem>
                          <SelectItem value="slack">Slack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Kategorie</Label>
                      <Select
                        value={templateForm.category}
                        onValueChange={(value) =>
                          setTemplateForm({ ...templateForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategorie wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {templateCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-description">Beschreibung</Label>
                    <Textarea
                      id="template-description"
                      value={templateForm.description}
                      onChange={(e) =>
                        setTemplateForm({
                          ...templateForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Kurze Beschreibung des Template-Zwecks"
                      rows={2}
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
                        placeholder="E-Mail Betreff (kann Variablen enthalten: {{variable}})"
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
                      placeholder="Template-Inhalt mit Variablen: {{variable_name}}"
                      rows={8}
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Variablen:</strong> Verwenden Sie doppelte
                      geschweifte Klammern für Variablen:{' '}
                      <code>{'{{variable_name}}'}</code>
                    </AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={handleCreateTemplate}
                    disabled={!templateForm.name || !templateForm.content}
                  >
                    Template erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Gesamt Templates
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {totalTemplates}
                    </p>
                    <span className="text-sm text-green-600">
                      +2 diese Woche
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Aktive Templates
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {activeTemplates}
                    </p>
                    <span className="text-sm text-gray-600">
                      von {totalTemplates}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Gesamt-Nutzung
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {totalUsage.toLocaleString('de-DE')}
                    </p>
                    <span className="text-sm text-green-600">+24.5%</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Send className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Ø Öffnungsrate
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {avgOpenRate.toFixed(1)}%
                    </p>
                    <span className="text-sm text-green-600">+3.2%</span>
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Template-Kategorien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {templateCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCategoryFilter(category.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
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
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  {templateCategories.map((category) => (
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
                  <SelectItem value="all">Alle Stati</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="archived">Archiviert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Templates ({filteredTemplates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{template.name}</span>
                          {template.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Standard
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {template.description}
                        </div>
                        {template.subject && (
                          <div className="text-xs text-gray-500 mt-1">
                            Betreff: {template.subject}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <span>{getTypeLabel(template.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{getCategoryLabel(template.category)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(template.status)}
                        variant="secondary"
                      >
                        {getStatusLabel(template.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>
                          {template.usageCount.toLocaleString('de-DE')}{' '}
                          Verwendungen
                        </div>
                        {template.openRate && (
                          <div className="text-green-600">
                            {template.openRate}% Öffnungsrate
                          </div>
                        )}
                        {template.clickRate && (
                          <div className="text-blue-600">
                            {template.clickRate}% Klickrate
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(template.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>

                        {!template.isDefault && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTemplate(template)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Keine Templates gefunden
                </h3>
                <p className="text-gray-500">
                  Erstellen Sie ein neues Template oder passen Sie Ihre Filter
                  an.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(selectedTemplate.type)}
                    <h2 className="text-xl font-bold">
                      {selectedTemplate.name}
                    </h2>
                    <Badge
                      className={getStatusColor(selectedTemplate.status)}
                      variant="secondary"
                    >
                      {getStatusLabel(selectedTemplate.status)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Beschreibung</h3>
                  <p className="text-gray-600">
                    {selectedTemplate.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Kategorie</h3>
                    <p className="text-gray-600">
                      {getCategoryLabel(selectedTemplate.category)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Typ</h3>
                    <p className="text-gray-600">
                      {getTypeLabel(selectedTemplate.type)}
                    </p>
                  </div>
                </div>

                {selectedTemplate.subject && (
                  <div>
                    <h3 className="font-semibold mb-2">Betreff</h3>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                      {selectedTemplate.subject}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Inhalt</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {selectedTemplate.content}
                    </pre>
                  </div>
                </div>

                {selectedTemplate.variables.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Verfügbare Variablen</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <Badge
                          key={variable}
                          variant="outline"
                          className="font-mono"
                        >
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Verwendungen</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedTemplate.usageCount.toLocaleString('de-DE')}
                    </p>
                  </div>
                  {selectedTemplate.openRate && (
                    <div>
                      <h3 className="font-semibold mb-2">Öffnungsrate</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedTemplate.openRate}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Erstellt:</strong>{' '}
                    {new Date(selectedTemplate.createdAt).toLocaleString(
                      'de-DE'
                    )}
                  </div>
                  <div>
                    <strong>Aktualisiert:</strong>{' '}
                    {new Date(selectedTemplate.updatedAt).toLocaleString(
                      'de-DE'
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/notifications/preferences')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Einstellungen
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/notifications/analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>

            <Button variant="outline" className="justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Templates importieren
            </Button>

            <Button variant="outline" className="justify-start">
              <Play className="h-4 w-4 mr-2" />
              Test senden
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
