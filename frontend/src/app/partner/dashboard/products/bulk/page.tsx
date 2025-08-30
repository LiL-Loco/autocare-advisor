'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  Check,
  Download,
  Edit,
  Package,
  Play,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
interface BulkOperation {
  id: string;
  type:
    | 'price_update'
    | 'status_change'
    | 'tag_add'
    | 'category_change'
    | 'delete';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  affectedProducts: number;
  createdAt: string;
  completedAt?: string;
}

const mockOperations: BulkOperation[] = [
  {
    id: '1',
    type: 'price_update',
    description: 'Preise für Winterprodukte um 15% erhöhen',
    status: 'completed',
    progress: 100,
    affectedProducts: 23,
    createdAt: '2024-08-28T10:30:00Z',
    completedAt: '2024-08-28T10:32:15Z',
  },
  {
    id: '2',
    type: 'status_change',
    description: 'Alle Produkte mit niedrigem Lager deaktivieren',
    status: 'running',
    progress: 65,
    affectedProducts: 8,
    createdAt: '2024-08-29T09:15:00Z',
  },
  {
    id: '3',
    type: 'tag_add',
    description: 'Tag "Bestseller" zu Top 10 Produkten hinzufügen',
    status: 'pending',
    progress: 0,
    affectedProducts: 10,
    createdAt: '2024-08-29T11:45:00Z',
  },
];

const mockSelectedProducts = [
  { id: '1', name: 'Motoröl Premium 5W-30', category: 'Motoröl', price: 24.99 },
  {
    id: '2',
    name: 'Bremsflüssigkeit DOT 4',
    category: 'Bremsflüssigkeit',
    price: 12.5,
  },
  {
    id: '3',
    name: 'Kühlmittel Konzentrat',
    category: 'Kühlmittel',
    price: 18.99,
  },
];

export default function BulkOperationsPage() {
  const router = useRouter();
  const [operations] = useState<BulkOperation[]>(mockOperations);
  const [selectedProducts] = useState(mockSelectedProducts);
  const [operationType, setOperationType] = useState<string>('');
  const [operationDetails, setOperationDetails] = useState<any>({});
  const [showNewOperation, setShowNewOperation] = useState(false);

  const getStatusColor = (status: BulkOperation['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: BulkOperation['status']) => {
    switch (status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'running':
        return 'Läuft';
      case 'pending':
        return 'Wartend';
      case 'failed':
        return 'Fehler';
      default:
        return status;
    }
  };

  const getOperationIcon = (type: BulkOperation['type']) => {
    switch (type) {
      case 'price_update':
        return <Tag className="w-4 h-4" />;
      case 'status_change':
        return <Edit className="w-4 h-4" />;
      case 'tag_add':
        return <Plus className="w-4 h-4" />;
      case 'category_change':
        return <Package className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE');
  };

  const handleStartOperation = () => {
    console.log('Starte Operation:', operationType, operationDetails);
    // Hier würde die API aufgerufen werden
    setShowNewOperation(false);
    setOperationType('');
    setOperationDetails({});
  };

  return (
    <div className="space-y-6">
        {/* Shopify-Style Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Massenoperationen
            </h1>
            <p className="text-muted-foreground mt-1">
              Führen Sie Bulk-Aktionen für mehrere Produkte gleichzeitig durch
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/partner/dashboard/products')}
            >
              <Package className="w-4 h-4 mr-2" />
              Zu Produkten
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowNewOperation(true)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Neue Operation
            </Button>
          </div>
        </div>

        {/* Shopify-Style Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Laufende Operationen
                  </p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {operations.filter((op) => op.status === 'running').length}
                  </p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {
                      operations.filter((op) => op.status === 'completed')
                        .length
                    }
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wartend</p>
                  <p className="text-2xl font-semibold text-yellow-600">
                    {operations.filter((op) => op.status === 'pending').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
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
                  <p className="text-2xl font-semibold">
                    {operations.reduce(
                      (sum, op) => sum + op.affectedProducts,
                      0
                    )}
                  </p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Neue Operation erstellen */}
        {showNewOperation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Neue Massenoperation erstellen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Produkt Auswahl */}
              <div>
                <Label>Ausgewählte Produkte ({selectedProducts.length})</Label>
                <Card className="mt-2">
                  <CardContent className="p-3">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span>{product.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            €{product.price}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() =>
                        router.push('/partner/dashboard/products?select=bulk')
                      }
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Produkte auswählen
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Operation Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Operationstyp</Label>
                  <Select
                    value={operationType}
                    onValueChange={setOperationType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Operation auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_update">
                        Preise aktualisieren
                      </SelectItem>
                      <SelectItem value="status_change">
                        Status ändern
                      </SelectItem>
                      <SelectItem value="tag_add">Tags hinzufügen</SelectItem>
                      <SelectItem value="tag_remove">Tags entfernen</SelectItem>
                      <SelectItem value="category_change">
                        Kategorie ändern
                      </SelectItem>
                      <SelectItem value="visibility">
                        Sichtbarkeit ändern
                      </SelectItem>
                      <SelectItem value="delete">Produkte löschen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Options based on operation type */}
                {operationType === 'price_update' && (
                  <div>
                    <Label>Preisanpassung</Label>
                    <div className="flex gap-2">
                      <Select
                        value={operationDetails.priceAction || ''}
                        onValueChange={(value) =>
                          setOperationDetails({
                            ...operationDetails,
                            priceAction: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Aktion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increase">Erhöhen</SelectItem>
                          <SelectItem value="decrease">Reduzieren</SelectItem>
                          <SelectItem value="set">Setzen auf</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Wert/%"
                        value={operationDetails.priceValue || ''}
                        onChange={(e) =>
                          setOperationDetails({
                            ...operationDetails,
                            priceValue: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {operationType === 'status_change' && (
                  <div>
                    <Label>Neuer Status</Label>
                    <Select
                      value={operationDetails.newStatus || ''}
                      onValueChange={(value) =>
                        setOperationDetails({
                          ...operationDetails,
                          newStatus: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktiv</SelectItem>
                        <SelectItem value="inactive">Inaktiv</SelectItem>
                        <SelectItem value="draft">Entwurf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(operationType === 'tag_add' ||
                  operationType === 'tag_remove') && (
                  <div>
                    <Label>Tags (kommagetrennt)</Label>
                    <Input
                      placeholder="z.B. Sale, Neu, Bestseller"
                      value={operationDetails.tags || ''}
                      onChange={(e) =>
                        setOperationDetails({
                          ...operationDetails,
                          tags: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleStartOperation}
                  disabled={!operationType}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Operation starten
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewOperation(false)}
                >
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Operations History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Operationsverlauf
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {operations.map((operation, index) => (
                <div
                  key={operation.id}
                  className={`p-4 ${
                    index !== operations.length - 1 ? 'border-b' : ''
                  } hover:bg-muted/30 transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        {getOperationIcon(operation.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {operation.description}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{operation.affectedProducts} Produkte</span>
                          <span>
                            Erstellt: {formatDate(operation.createdAt)}
                          </span>
                          {operation.completedAt && (
                            <span>
                              Abgeschlossen: {formatDate(operation.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {operation.status === 'running' && (
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${operation.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground min-w-[3rem]">
                            {operation.progress}%
                          </span>
                        </div>
                      )}
                      <Badge className={getStatusColor(operation.status)}>
                        {getStatusText(operation.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {operations.length === 0 && (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Noch keine Operationen durchgeführt
                </h3>
                <p className="text-muted-foreground mb-4">
                  Starten Sie Ihre erste Massenoperation.
                </p>
                <Button onClick={() => setShowNewOperation(true)}>
                  <Zap className="w-4 h-4 mr-2" />
                  Erste Operation erstellen
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
                Import/Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  router.push('/partner/dashboard/products/upload')
                }
              >
                <Upload className="w-4 h-4 mr-2" />
                CSV Import
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Produktdaten exportieren
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Bulk-Operations Tipps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900 mb-1">
                  ⚡ Effizienz steigern
                </p>
                <p className="text-blue-700">
                  Nutzen Sie Filter zur gezielten Produktauswahl vor
                  Bulk-Operationen.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-900 mb-1">
                  ⚠️ Vorsicht bei Löschungen
                </p>
                <p className="text-yellow-700">
                  Erstellen Sie vor Lösch-Operationen ein Backup Ihrer
                  Produktdaten.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-900 mb-1">
                  📊 Performance überwachen
                </p>
                <p className="text-green-700">
                  Überwachen Sie die Auswirkungen von Preisänderungen auf die
                  Verkäufe.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
