'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  Check,
  CreditCard,
  Crown,
  Database,
  Globe,
  Mail,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular?: boolean;
  isEnterprise?: boolean;
  features: string[];
  limits: {
    apiRequests: number;
    storage: string;
    products: number;
    customers: number;
    emailsPerMonth: number;
    smsPerMonth: number;
    pushNotifications: number;
    integrations: number;
  };
}

const BillingUpgradePage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('credit_card');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const currentPlan = 'professional'; // Current user's plan

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfekt für kleine Unternehmen und Einzelhändler',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Bis zu 1.000 Produkte',
        '5.000 API-Aufrufe/Monat',
        'Basis-Support per E-Mail',
        'Standard-Templates',
        'Grundlegende Analytik',
        'SSL-Verschlüsselung',
      ],
      limits: {
        apiRequests: 5000,
        storage: '5 GB',
        products: 1000,
        customers: 2500,
        emailsPerMonth: 1000,
        smsPerMonth: 100,
        pushNotifications: 5000,
        integrations: 3,
      },
    },
    {
      id: 'professional',
      name: 'Professional',
      description:
        'Ideal für wachsende Unternehmen mit erweiterten Anforderungen',
      monthlyPrice: 79,
      yearlyPrice: 790,
      isPopular: true,
      features: [
        'Bis zu 10.000 Produkte',
        '25.000 API-Aufrufe/Monat',
        'Priority Support (24/7)',
        'Erweiterte Templates',
        'Detaillierte Analytik & Reports',
        'Erweiterte Integrationen',
        'Custom Branding',
        'Erweiterte Sicherheitsfeatures',
      ],
      limits: {
        apiRequests: 25000,
        storage: '50 GB',
        products: 10000,
        customers: 25000,
        emailsPerMonth: 10000,
        smsPerMonth: 1000,
        pushNotifications: 50000,
        integrations: 10,
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Maßgeschneiderte Lösung für große Unternehmen',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      isEnterprise: true,
      features: [
        'Unbegrenzte Produkte',
        'Unbegrenzte API-Aufrufe',
        'Dedicated Account Manager',
        'Custom Templates & Development',
        'White-Label Lösungen',
        'Premium-Integrationen',
        'Advanced Security & Compliance',
        'SLA-Garantien',
        'On-Premise Deployment Option',
      ],
      limits: {
        apiRequests: -1, // Unlimited
        storage: 'Unbegrenzt',
        products: -1,
        customers: -1,
        emailsPerMonth: -1,
        smsPerMonth: -1,
        pushNotifications: -1,
        integrations: -1,
      },
    },
  ];

  const getCurrentPlanData = () => {
    return plans.find((p) => p.id === currentPlan);
  };

  const getSelectedPlanData = () => {
    return plans.find((p) => p.id === selectedPlan);
  };

  const calculateSavings = (plan: PricingPlan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyTotal = plan.yearlyPrice;
    const savings = monthlyTotal - yearlyTotal;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  const handlePlanUpgrade = () => {
    const selectedPlanData = getSelectedPlanData();
    if (selectedPlanData) {
      setShowConfirmDialog(true);
    }
  };

  const confirmUpgrade = () => {
    console.log(
      'Upgrading to:',
      selectedPlan,
      'with billing cycle:',
      billingCycle
    );
    setShowConfirmDialog(false);
    // Hier würde die API-Logik implementiert
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome20') {
      setIsPromoApplied(true);
    }
  };

  const formatLimit = (value: number, unit?: string) => {
    if (value === -1) return 'Unbegrenzt';
    if (value >= 1000000)
      return `${(value / 1000000).toFixed(1)}M${unit || ''}`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k${unit || ''}`;
    return `${value.toLocaleString('de-DE')}${unit || ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan upgraden</h1>
        <p className="text-gray-600">
          Wählen Sie den perfekten Plan für Ihr Unternehmen
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monatlich
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Jährlich
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
              Sparen Sie bis zu 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Current Plan Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">
                  Ihr aktueller Plan
                </h3>
                <p className="text-sm text-blue-700">
                  {getCurrentPlanData()?.name} -{' '}
                  {billingCycle === 'monthly' ? 'Monatlich' : 'Jährlich'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">
                {billingCycle === 'monthly'
                  ? `${getCurrentPlanData()?.monthlyPrice}€`
                  : `${getCurrentPlanData()?.yearlyPrice}€`}
              </p>
              <p className="text-sm text-blue-700">
                {billingCycle === 'monthly' ? 'pro Monat' : 'pro Jahr'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const savings = calculateSavings(plan);
          const price =
            billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const isCurrentPlan = plan.id === currentPlan;
          const isUpgrade =
            !isCurrentPlan &&
            plans.findIndex((p) => p.id === plan.id) >
              plans.findIndex((p) => p.id === currentPlan);
          const isDowngrade =
            !isCurrentPlan &&
            plans.findIndex((p) => p.id === plan.id) <
              plans.findIndex((p) => p.id === currentPlan);

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : ''
              } ${selectedPlan === plan.id ? 'ring-2 ring-green-500' : ''} ${
                isCurrentPlan ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Beliebt
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-600 text-white px-3 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Aktuell
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  {plan.isEnterprise ? (
                    <Shield className="h-8 w-8 text-purple-600" />
                  ) : plan.isPopular ? (
                    <Zap className="h-8 w-8 text-blue-600" />
                  ) : (
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  )}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent>
                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{price}€</span>
                    <span className="text-gray-600 ml-1">
                      /{billingCycle === 'monthly' ? 'Monat' : 'Jahr'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && savings.percentage > 0 && (
                    <p className="text-green-600 text-sm mt-1">
                      Sparen Sie {savings.savings}€ ({savings.percentage}%)
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <div className="text-sm text-gray-600">
                      + {plan.features.length - 6} weitere Features
                    </div>
                  )}
                </div>

                {/* Key Limits */}
                <div className="bg-gray-50 p-3 rounded-md mb-6">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">
                    Wichtige Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Database className="h-3 w-3" />
                      <span>{formatLimit(plan.limits.products)} Produkte</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{formatLimit(plan.limits.customers)} Kunden</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>
                        {formatLimit(plan.limits.emailsPerMonth)} E-Mails
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-3 w-3" />
                      <span>
                        {formatLimit(plan.limits.apiRequests)} API-Aufrufe
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="space-y-2">
                  {isCurrentPlan ? (
                    <Button disabled className="w-full">
                      <Crown className="h-4 w-4 mr-2" />
                      Aktueller Plan
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        handlePlanUpgrade();
                      }}
                      className="w-full"
                      variant={selectedPlan === plan.id ? 'default' : 'outline'}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Auf {plan.name} upgraden
                    </Button>
                  ) : isDowngrade ? (
                    <Button
                      onClick={() => setSelectedPlan(plan.id)}
                      variant="outline"
                      className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      Auf {plan.name} wechseln
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSelectedPlan(plan.id)}
                      variant="outline"
                      className="w-full"
                    >
                      {plan.name} wählen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Detaillierter Vergleich
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Features</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="text-center py-3 font-medium min-w-[120px]"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3 font-medium">Produkte</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-3">
                      {formatLimit(plan.limits.products)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">API-Aufrufe/Monat</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-3">
                      {formatLimit(plan.limits.apiRequests)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">Speicher</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-3">
                      {plan.limits.storage}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">E-Mails/Monat</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-3">
                      {formatLimit(plan.limits.emailsPerMonth)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">SMS/Monat</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-3">
                      {formatLimit(plan.limits.smsPerMonth)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">Push-Nachrichten</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-3">
                      {formatLimit(plan.limits.pushNotifications)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Integrationen</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-3">
                      {formatLimit(plan.limits.integrations)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Plan-Upgrade bestätigen</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium text-blue-900 mb-2">
                Upgrade-Details
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  Von:{' '}
                  <span className="font-medium">
                    {getCurrentPlanData()?.name}
                  </span>
                </p>
                <p>
                  Zu:{' '}
                  <span className="font-medium">
                    {getSelectedPlanData()?.name}
                  </span>
                </p>
                <p>
                  Abrechnung:{' '}
                  <span className="font-medium">
                    {billingCycle === 'monthly' ? 'Monatlich' : 'Jährlich'}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Plan-Preis:</span>
                <span className="font-medium">
                  {billingCycle === 'monthly'
                    ? `${getSelectedPlanData()?.monthlyPrice}€/Monat`
                    : `${getSelectedPlanData()?.yearlyPrice}€/Jahr`}
                </span>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <Label>Promo-Code (optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Code eingeben"
                    disabled={isPromoApplied}
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromoCode}
                    disabled={isPromoApplied || !promoCode}
                    size="sm"
                  >
                    {isPromoApplied ? 'Angewendet' : 'Anwenden'}
                  </Button>
                </div>
                {isPromoApplied && (
                  <p className="text-green-600 text-sm">
                    20% Rabatt angewendet!
                  </p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <Label>Zahlungsmethode</Label>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label
                      htmlFor="credit_card"
                      className="flex items-center space-x-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Kreditkarte (****4242)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label
                      htmlFor="bank_transfer"
                      className="flex items-center space-x-2"
                    >
                      <div className="h-4 w-4 bg-gray-600 rounded"></div>
                      <span>Banküberweisung</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="flex justify-between font-medium text-lg">
                <span>Gesamtbetrag:</span>
                <span>
                  {isPromoApplied
                    ? Math.round(
                        billingCycle === 'monthly'
                          ? getSelectedPlanData()?.monthlyPrice! * 0.8
                          : getSelectedPlanData()?.yearlyPrice! * 0.8
                      )
                    : billingCycle === 'monthly'
                    ? getSelectedPlanData()?.monthlyPrice
                    : getSelectedPlanData()?.yearlyPrice}
                  €
                </span>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">Wichtige Hinweise:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Das Upgrade wird sofort wirksam</li>
                    <li>Anteilige Berechnung für den aktuellen Monat</li>
                    <li>30 Tage Geld-zurück-Garantie</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={confirmUpgrade}>Upgrade bestätigen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingUpgradePage;
