'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  AlertCircle,
  Check,
  CreditCard,
  Edit,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Plus,
  Shield,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account' | 'paypal';
  isDefault: boolean;
  isActive: boolean;
  // Credit Card specific
  last4?: string;
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover';
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  // Bank Account specific
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  // PayPal specific
  email?: string;
  // Common
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  addedDate: Date;
  lastUsed?: Date;
}

const BillingPaymentMethodsPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [showCardDetails, setShowCardDetails] = useState<{
    [key: string]: boolean;
  }>({});
  const [newMethodType, setNewMethodType] = useState<
    'credit_card' | 'bank_account' | 'paypal'
  >('credit_card');

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'credit_card',
      isDefault: true,
      isActive: true,
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      holderName: 'Max Mustermann',
      billingAddress: {
        street: 'Musterstraße 123',
        city: 'München',
        postalCode: '80331',
        country: 'Deutschland',
      },
      addedDate: new Date('2024-01-15'),
      lastUsed: new Date('2024-03-15'),
    },
    {
      id: '2',
      type: 'bank_account',
      isDefault: false,
      isActive: true,
      bankName: 'Deutsche Bank',
      iban: 'DE89370400440532013000',
      billingAddress: {
        street: 'Hauptstraße 456',
        city: 'Berlin',
        postalCode: '10115',
        country: 'Deutschland',
      },
      addedDate: new Date('2024-02-01'),
    },
    {
      id: '3',
      type: 'credit_card',
      isDefault: false,
      isActive: false,
      last4: '8888',
      brand: 'mastercard',
      expiryMonth: 6,
      expiryYear: 2024,
      holderName: 'Max Mustermann',
      billingAddress: {
        street: 'Musterstraße 123',
        city: 'München',
        postalCode: '80331',
        country: 'Deutschland',
      },
      addedDate: new Date('2023-12-10'),
      lastUsed: new Date('2024-01-20'),
    },
  ];

  const getPaymentMethodIcon = (type: string, brand?: string) => {
    if (type === 'credit_card') {
      switch (brand) {
        case 'visa':
          return (
            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
          );
        case 'mastercard':
          return (
            <div className="h-8 w-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
              MC
            </div>
          );
        case 'amex':
          return (
            <div className="h-8 w-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
              AMEX
            </div>
          );
        default:
          return <CreditCard className="h-8 w-8 text-gray-400" />;
      }
    } else if (type === 'bank_account') {
      return (
        <div className="h-8 w-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">
          BANK
        </div>
      );
    } else if (type === 'paypal') {
      return (
        <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
          PP
        </div>
      );
    }
    return <CreditCard className="h-8 w-8 text-gray-400" />;
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    if (method.type === 'credit_card') {
      return `${method.brand?.toUpperCase()} ****${method.last4}`;
    } else if (method.type === 'bank_account') {
      return `${method.bankName} (${method.iban?.slice(-4)})`;
    } else if (method.type === 'paypal') {
      return `PayPal (${method.email})`;
    }
    return 'Unbekannt';
  };

  const getMethodTypeLabel = (type: string) => {
    switch (type) {
      case 'credit_card':
        return 'Kreditkarte';
      case 'bank_account':
        return 'Bankkonto';
      case 'paypal':
        return 'PayPal';
      default:
        return type;
    }
  };

  const toggleCardDetails = (methodId: string) => {
    setShowCardDetails((prev) => ({
      ...prev,
      [methodId]: !prev[methodId],
    }));
  };

  const handleSetDefault = (methodId: string) => {
    console.log('Set default:', methodId);
    // Hier würde die API-Logik implementiert
  };

  const handleToggleActive = (methodId: string) => {
    console.log('Toggle active:', methodId);
    // Hier würde die API-Logik implementiert
  };

  const handleDeleteMethod = (methodId: string) => {
    console.log('Delete method:', methodId);
    // Hier würde die API-Logik implementiert
  };

  const isExpiringSoon = (method: PaymentMethod) => {
    if (
      method.type !== 'credit_card' ||
      !method.expiryMonth ||
      !method.expiryYear
    )
      return false;

    const now = new Date();
    const expiry = new Date(method.expiryYear, method.expiryMonth - 1);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    return expiry <= threeMonthsFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zahlungsmethoden</h1>
          <p className="text-gray-600 mt-1">
            Verwalten Sie Ihre Kreditkarten und Bankkonten
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Zahlungsmethode hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Neue Zahlungsmethode hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Zahlungstyp</Label>
                <Select
                  value={newMethodType}
                  onValueChange={(value: any) => setNewMethodType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Kreditkarte</SelectItem>
                    <SelectItem value="bank_account">Bankkonto</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newMethodType === 'credit_card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Karteninhaber</Label>
                    <Input placeholder="Max Mustermann" />
                  </div>
                  <div className="space-y-2">
                    <Label>Kartennummer</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ablaufdatum</Label>
                      <Input placeholder="MM/JJ" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              {newMethodType === 'bank_account' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bank</Label>
                    <Input placeholder="Deutsche Bank" />
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <Input placeholder="DE89 3704 0044 0532 0130 00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Kontoinhaber</Label>
                    <Input placeholder="Max Mustermann" />
                  </div>
                </div>
              )}

              {newMethodType === 'paypal' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>PayPal E-Mail</Label>
                    <Input placeholder="max@beispiel.de" type="email" />
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Rechnungsadresse</h4>
                <div className="space-y-2">
                  <Label>Straße</Label>
                  <Input placeholder="Musterstraße 123" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>PLZ</Label>
                    <Input placeholder="80331" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stadt</Label>
                    <Input placeholder="München" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Land</Label>
                  <Select defaultValue="de">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutschland</SelectItem>
                      <SelectItem value="at">Österreich</SelectItem>
                      <SelectItem value="ch">Schweiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="default-method" />
                <Label htmlFor="default-method">
                  Als Standard-Zahlungsmethode festlegen
                </Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Abbrechen
                </Button>
                <Button onClick={() => setShowAddDialog(false)}>
                  Hinzufügen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">
                Sichere Zahlungsverarbeitung
              </h3>
              <p className="text-sm text-blue-700">
                Alle Zahlungsinformationen werden verschlüsselt gespeichert und
                entsprechen den PCI DSS Standards. Ihre Daten sind sicher
                geschützt.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`${method.isDefault ? 'ring-2 ring-blue-500' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getPaymentMethodIcon(method.type, method.brand)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">
                        {getPaymentMethodLabel(method)}
                      </h3>
                      {method.isDefault && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Standard
                        </Badge>
                      )}
                      {!method.isActive && (
                        <Badge variant="outline" className="text-gray-600">
                          Inaktiv
                        </Badge>
                      )}
                      {isExpiringSoon(method) && (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Läuft bald ab
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {getMethodTypeLabel(method.type)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCardDetails(method.id)}
                    className="flex items-center gap-2"
                  >
                    {showCardDetails[method.id] ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Ausblenden
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Details
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Hinzugefügt am</p>
                  <p className="font-medium">
                    {format(method.addedDate, 'dd.MM.yyyy', { locale: de })}
                  </p>
                </div>
                {method.lastUsed && (
                  <div>
                    <p className="text-gray-600">Zuletzt verwendet</p>
                    <p className="font-medium">
                      {format(method.lastUsed, 'dd.MM.yyyy', { locale: de })}
                    </p>
                  </div>
                )}
                {method.type === 'credit_card' &&
                  method.expiryMonth &&
                  method.expiryYear && (
                    <div>
                      <p className="text-gray-600">Gültig bis</p>
                      <p className="font-medium">
                        {String(method.expiryMonth).padStart(2, '0')}/
                        {method.expiryYear}
                      </p>
                    </div>
                  )}
                <div>
                  <p className="text-gray-600">Status</p>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={method.isActive}
                      onCheckedChange={() => handleToggleActive(method.id)}
                    />
                    <span className="font-medium">
                      {method.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              {showCardDetails[method.id] && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    {/* Payment Method Specific Details */}
                    {method.type === 'credit_card' && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Karteninhaber</p>
                          <p className="font-medium">{method.holderName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Kartentyp</p>
                          <p className="font-medium">
                            {method.brand?.toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Letzte 4 Ziffern</p>
                          <p className="font-medium">****{method.last4}</p>
                        </div>
                      </div>
                    )}

                    {method.type === 'bank_account' && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Bank</p>
                          <p className="font-medium">{method.bankName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">IBAN</p>
                          <p className="font-medium">
                            {method.iban?.replace(/(.{4})/g, '$1 ')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Billing Address */}
                    {method.billingAddress && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Rechnungsadresse
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <p>{method.billingAddress.street}</p>
                          <p>
                            {method.billingAddress.postalCode}{' '}
                            {method.billingAddress.city}
                          </p>
                          <p>{method.billingAddress.country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center space-x-4">
                  {!method.isDefault && method.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Als Standard festlegen
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMethod(method.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={method.isDefault}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Löschen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {paymentMethods.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Keine Zahlungsmethoden
              </h3>
              <p className="text-gray-600 mb-4">
                Fügen Sie eine Kreditkarte oder ein Bankkonto hinzu, um Ihre
                Rechnungen zu begleichen.
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Zahlungsmethode hinzufügen
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sicherheitsfeatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">256-Bit SSL Verschlüsselung</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">PCI DSS Level 1 Compliance</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Fraud Detection & Monitoring</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">3D Secure Authentifizierung</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Tokenisierte Kartendaten</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">DSGVO-konformer Datenschutz</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPaymentMethodsPage;
