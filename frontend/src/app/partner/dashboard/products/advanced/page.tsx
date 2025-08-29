'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  BarChart3,
  Edit,
  Package,
  Save,
  Settings,
  Tag,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PartnerLayout from '../../../../../components/partner/layout/PartnerLayout';

interface ProductRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
  lastApplied: string;
  affectedProducts: number;
}

const mockRules: ProductRule[] = [
  {
    id: '1',
    name: 'Niedrige Lagerbestände automatisch deaktivieren',
    condition: 'Lagerbestand < 5',
    action: 'Status auf "Inaktiv" setzen',
    enabled: true,
    lastApplied: '2024-08-28',
    affectedProducts: 3,
  },
  {
    id: '2',
    name: 'Saisonale Preisanpassung Winter',
    condition: 'Kategorie = "Winterprodukte"',
    action: 'Preis um 15% erhöhen',
    enabled: false,
    lastApplied: '2024-01-15',
    affectedProducts: 0,
  },
  {
    id: '3',
    name: 'SEO-Optimierung für neue Produkte',
    condition: 'Erstelldatum < 7 Tage',
    action: 'Meta-Beschreibung generieren',
    enabled: true,
    lastApplied: '2024-08-29',
    affectedProducts: 2,
  },
];

export default function AdvancedProductsPage() {
  const router = useRouter();
  const [rules, setRules] = useState<ProductRule[]>(mockRules);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);

  // Neue Regel Formular
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    action: '',
    enabled: true,
  });

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    setRules(
      rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled } : rule))
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId));
  };

  const handleCreateRule = () => {
    if (newRule.name && newRule.condition && newRule.action) {
      const rule: ProductRule = {
        id: Date.now().toString(),
        ...newRule,
        lastApplied: 'Nie',
        affectedProducts: 0,
      };
      setRules([...rules, rule]);
      setNewRule({ name: '', condition: '', action: '', enabled: true });
      setShowNewRuleForm(false);
    }
  };

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Shopify-Style Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Erweiterte Produktverwaltung
            </h1>
            <p className="text-muted-foreground mt-1">
              Automatisieren Sie Produktoperationen mit benutzerdefinierten
              Regeln
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push('/partner/dashboard/products/analytics')
              }
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowNewRuleForm(true)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Neue Regel
            </Button>
          </div>
        </div>

        {/* Shopify-Style Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktive Regeln</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {rules.filter((r) => r.enabled).length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt Regeln</p>
                  <p className="text-2xl font-semibold">{rules.length}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Betroffene Produkte
                  </p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {rules.reduce(
                      (sum, rule) => sum + rule.affectedProducts,
                      0
                    )}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Letzte Ausführung
                  </p>
                  <p className="text-sm font-semibold">Heute</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Neue Regel erstellen */}
        {showNewRuleForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Neue Automatisierungsregel erstellen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ruleName">Regelname</Label>
                  <Input
                    id="ruleName"
                    placeholder="z.B. Preisanpassung für Sommerprodukte"
                    value={newRule.name}
                    onChange={(e) =>
                      setNewRule({ ...newRule, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ruleCondition">Bedingung</Label>
                  <Select
                    value={newRule.condition}
                    onValueChange={(value) =>
                      setNewRule({ ...newRule, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bedingung auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inventory_low">
                        Lagerbestand niedrig (&lt; 10)
                      </SelectItem>
                      <SelectItem value="category_winter">
                        Kategorie = Winterprodukte
                      </SelectItem>
                      <SelectItem value="category_summer">
                        Kategorie = Sommerprodukte
                      </SelectItem>
                      <SelectItem value="new_product">
                        Produkt &lt; 7 Tage alt
                      </SelectItem>
                      <SelectItem value="no_sales">
                        Keine Verkäufe 30 Tage
                      </SelectItem>
                      <SelectItem value="high_views">
                        Hohe Aufrufe (&gt; 1000)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="ruleAction">Aktion</Label>
                <Select
                  value={newRule.action}
                  onValueChange={(value) =>
                    setNewRule({ ...newRule, action: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Aktion auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deactivate">
                      Produkt deaktivieren
                    </SelectItem>
                    <SelectItem value="price_increase_10">
                      Preis um 10% erhöhen
                    </SelectItem>
                    <SelectItem value="price_decrease_10">
                      Preis um 10% reduzieren
                    </SelectItem>
                    <SelectItem value="add_tag_sale">
                      Tag "Sale" hinzufügen
                    </SelectItem>
                    <SelectItem value="generate_meta">
                      Meta-Beschreibung generieren
                    </SelectItem>
                    <SelectItem value="send_notification">
                      Benachrichtigung senden
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ruleEnabled"
                  checked={newRule.enabled}
                  onCheckedChange={(checked) =>
                    setNewRule({ ...newRule, enabled: checked })
                  }
                />
                <Label htmlFor="ruleEnabled">Regel sofort aktivieren</Label>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreateRule}>
                  <Save className="w-4 h-4 mr-2" />
                  Regel speichern
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewRuleForm(false)}
                >
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regeln Liste */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Automatisierungsregeln
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className={`p-4 ${
                    index !== rules.length - 1 ? 'border-b' : ''
                  } hover:bg-muted/30 transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-foreground">
                          {rule.name}
                        </h3>
                        <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                          {rule.enabled ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                        {rule.affectedProducts > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {rule.affectedProducts} Produkte betroffen
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <strong>Bedingung:</strong> {rule.condition}
                        </p>
                        <p>
                          <strong>Aktion:</strong> {rule.action}
                        </p>
                        <p>
                          <strong>Zuletzt ausgeführt:</strong>{' '}
                          {rule.lastApplied}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) =>
                          handleToggleRule(rule.id, checked)
                        }
                      />
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {rules.length === 0 && (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Noch keine Automatisierungsregeln
                </h3>
                <p className="text-muted-foreground mb-4">
                  Erstellen Sie Ihre erste Regel, um Produktoperationen zu
                  automatisieren.
                </p>
                <Button onClick={() => setShowNewRuleForm(true)}>
                  <Zap className="w-4 h-4 mr-2" />
                  Erste Regel erstellen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Bulk-Operationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/partner/dashboard/products/bulk')}
              >
                <Package className="w-4 h-4 mr-2" />
                Massenoperationen durchführen
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  router.push('/partner/dashboard/products/upload')
                }
              >
                <Upload className="w-4 h-4 mr-2" />
                CSV Import/Export
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Automatisierungs-Tipps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900 mb-1">
                  💡 Inventar automatisieren
                </p>
                <p className="text-blue-700">
                  Setzen Sie Regeln für niedrige Lagerbestände, um automatisch
                  Nachbestellungen auszulösen.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-900 mb-1">
                  🎯 Saisonale Anpassungen
                </p>
                <p className="text-green-700">
                  Automatische Preisanpassungen für saisonale Produkte steigern
                  den Umsatz.
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-medium text-purple-900 mb-1">
                  📈 SEO-Optimierung
                </p>
                <p className="text-purple-700">
                  Automatische Meta-Beschreibungen verbessern die Sichtbarkeit
                  neuer Produkte.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}
