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
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Headphones,
  Info,
  Mail,
  Phone,
  RefreshCw,
  Settings,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  billingType: 'monthly' | 'yearly';
  features: PlanFeature[];
  limits: PlanLimits;
  isPopular: boolean;
  isEnterprise: boolean;
  color: string;
  icon: string;
}

interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  limit?: number | string;
  highlight?: boolean;
}

interface PlanLimits {
  apiRequests: number | 'unlimited';
  products: number | 'unlimited';
  customers: number | 'unlimited';
  storage: string;
  support: 'email' | 'priority' | '24/7';
  integrations: number | 'unlimited';
  users: number | 'unlimited';
}

interface CurrentSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

export default function BillingPlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Mock current subscription
  const [currentSubscription] = useState<CurrentSubscription>({
    planId: 'professional',
    status: 'active',
    currentPeriodStart: '2025-08-01T00:00:00Z',
    currentPeriodEnd: '2025-09-01T00:00:00Z',
    cancelAtPeriodEnd: false,
  });

  // Mock subscription plans
  const [subscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfekt für kleine Unternehmen und Einzelhändler',
      price: {
        monthly: 29,
        yearly: 290,
      },
      billingType: 'monthly',
      features: [
        {
          id: '1',
          name: 'API-Zugriff',
          included: true,
          limit: '10.000 Requests/Monat',
        },
        {
          id: '2',
          name: 'Produktverwaltung',
          included: true,
          limit: 'bis zu 500 Produkte',
        },
        {
          id: '3',
          name: 'Kundenverwaltung',
          included: true,
          limit: 'bis zu 1.000 Kunden',
        },
        { id: '4', name: 'E-Mail Benachrichtigungen', included: true },
        { id: '5', name: 'Basis Analytics', included: true },
        { id: '6', name: 'E-Mail Support', included: true },
        { id: '7', name: 'SMS Benachrichtigungen', included: false },
        { id: '8', name: 'Priority Support', included: false },
        { id: '9', name: 'Erweiterte Analytics', included: false },
        { id: '10', name: 'Custom Integrationen', included: false },
      ],
      limits: {
        apiRequests: 10000,
        products: 500,
        customers: 1000,
        storage: '5 GB',
        support: 'email',
        integrations: 3,
        users: 2,
      },
      isPopular: false,
      isEnterprise: false,
      color: 'blue',
      icon: 'Zap',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal für wachsende Unternehmen mit mehr Anforderungen',
      price: {
        monthly: 79,
        yearly: 790,
      },
      billingType: 'monthly',
      features: [
        {
          id: '1',
          name: 'API-Zugriff',
          included: true,
          limit: '50.000 Requests/Monat',
        },
        {
          id: '2',
          name: 'Produktverwaltung',
          included: true,
          limit: 'bis zu 2.500 Produkte',
        },
        {
          id: '3',
          name: 'Kundenverwaltung',
          included: true,
          limit: 'bis zu 10.000 Kunden',
        },
        { id: '4', name: 'E-Mail Benachrichtigungen', included: true },
        {
          id: '5',
          name: 'SMS Benachrichtigungen',
          included: true,
          limit: '1.000 SMS/Monat',
        },
        { id: '6', name: 'Push Notifications', included: true },
        {
          id: '7',
          name: 'Erweiterte Analytics',
          included: true,
          highlight: true,
        },
        { id: '8', name: 'Priority Support', included: true, highlight: true },
        { id: '9', name: 'Webhook Integration', included: true },
        { id: '10', name: 'Custom Integrationen', included: false },
      ],
      limits: {
        apiRequests: 50000,
        products: 2500,
        customers: 10000,
        storage: '50 GB',
        support: 'priority',
        integrations: 10,
        users: 5,
      },
      isPopular: true,
      isEnterprise: false,
      color: 'purple',
      icon: 'Star',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Vollständige Lösung für große Unternehmen',
      price: {
        monthly: 199,
        yearly: 1990,
      },
      billingType: 'monthly',
      features: [
        {
          id: '1',
          name: 'Unbegrenzte API-Requests',
          included: true,
          highlight: true,
        },
        { id: '2', name: 'Unbegrenzte Produkte', included: true },
        { id: '3', name: 'Unbegrenzte Kunden', included: true },
        { id: '4', name: 'Alle Benachrichtigungskanäle', included: true },
        { id: '5', name: 'Erweiterte Analytics & Reports', included: true },
        {
          id: '6',
          name: '24/7 Premium Support',
          included: true,
          highlight: true,
        },
        {
          id: '7',
          name: 'Custom Integrationen',
          included: true,
          highlight: true,
        },
        { id: '8', name: 'White-Label Option', included: true },
        { id: '9', name: 'Dedicated Account Manager', included: true },
        { id: '10', name: 'SLA Garantie', included: true },
      ],
      limits: {
        apiRequests: 'unlimited',
        products: 'unlimited',
        customers: 'unlimited',
        storage: '500 GB',
        support: '24/7',
        integrations: 'unlimited',
        users: 'unlimited',
      },
      isPopular: false,
      isEnterprise: true,
      color: 'gold',
      icon: 'Crown',
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

  const currentPlan = subscriptionPlans.find(
    (plan) => plan.id === currentSubscription.planId
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      past_due: 'bg-yellow-100 text-yellow-800',
      trialing: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Aktiv',
      cancelled: 'Gekündigt',
      past_due: 'Überfällig',
      trialing: 'Testphase',
    };
    return labels[status] || status;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getYearlySavings = (monthly: number, yearly: number) => {
    const yearlySavings = monthly * 12 - yearly;
    const percentage = Math.round((yearlySavings / (monthly * 12)) * 100);
    return { amount: yearlySavings, percentage };
  };

  const handlePlanUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setIsUpgradeModalOpen(true);
  };

  const confirmUpgrade = () => {
    console.log('Upgrading to plan:', selectedPlan);
    setIsUpgradeModalOpen(false);
    // Here would be the actual upgrade logic
  };

  const getPlanIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      Zap: <Zap className="h-8 w-8" />,
      Star: <Star className="h-8 w-8" />,
      Crown: <Crown className="h-8 w-8" />,
    };
    return icons[iconName] || <Star className="h-8 w-8" />;
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Abonnement-Pläne werden geladen...
            </p>
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
              Abonnement-Pläne
            </h1>
            <p className="text-gray-600 mt-1">
              Verwalten Sie Ihr Abonnement und erkunden Sie verfügbare Pläne
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

            <Button
              variant="outline"
              onClick={() => router.push('/partner/billing/history')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Rechnungshistorie
            </Button>
          </div>
        </div>

        {/* Current Subscription Status */}
        {currentPlan && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span>Aktuelles Abonnement</span>
                <Badge
                  className={getStatusColor(currentSubscription.status)}
                  variant="secondary"
                >
                  {getStatusLabel(currentSubscription.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPlanIcon(currentPlan.icon)}
                    <span className="font-semibold text-lg">
                      {currentPlan.name}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preis</p>
                  <p className="font-semibold text-lg">
                    {formatPrice(currentPlan.price[billingCycle])}/
                    {billingCycle === 'monthly' ? 'Monat' : 'Jahr'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nächste Zahlung</p>
                  <p className="font-semibold text-lg">
                    {new Date(
                      currentSubscription.currentPeriodEnd
                    ).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">Aktiv</span>
                  </div>
                </div>
              </div>

              {currentSubscription.cancelAtPeriodEnd && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ihr Abonnement wird am{' '}
                    {new Date(
                      currentSubscription.currentPeriodEnd
                    ).toLocaleDateString('de-DE')}{' '}
                    gekündigt. Sie können es jederzeit reaktivieren.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 p-1 bg-gray-100 rounded-lg">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('monthly')}
            >
              Monatlich
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('yearly')}
            >
              Jährlich
              <Badge variant="secondary" className="ml-2 text-xs">
                Bis zu 17% sparen
              </Badge>
            </Button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => {
            const savings = getYearlySavings(
              plan.price.monthly,
              plan.price.yearly
            );
            const isCurrentPlan = currentPlan?.id === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  plan.isPopular ? 'ring-2 ring-purple-500' : ''
                } ${isCurrentPlan ? 'border-blue-500 bg-blue-50/50' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-medium">
                    Beliebt
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium">
                    Aktueller Plan
                  </div>
                )}

                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.color === 'blue'
                        ? 'bg-blue-100 text-blue-600'
                        : plan.color === 'purple'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {getPlanIcon(plan.icon)}
                  </div>

                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-gray-600 mt-2">{plan.description}</p>

                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      {formatPrice(plan.price[billingCycle])}
                    </div>
                    <div className="text-gray-600">
                      /{billingCycle === 'monthly' ? 'Monat' : 'Jahr'}
                    </div>

                    {billingCycle === 'yearly' && savings.amount > 0 && (
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          {formatPrice(savings.amount)} sparen (
                          {savings.percentage}%)
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-start space-x-3"
                      >
                        {feature.included ? (
                          <Check
                            className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              feature.highlight
                                ? 'text-purple-600'
                                : 'text-green-600'
                            }`}
                          />
                        ) : (
                          <X className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span
                            className={`text-sm ${
                              feature.included
                                ? 'text-gray-900'
                                : 'text-gray-500'
                            } ${feature.highlight ? 'font-semibold' : ''}`}
                          >
                            {feature.name}
                          </span>
                          {feature.limit && (
                            <div className="text-xs text-gray-500 mt-1">
                              {feature.limit}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    {isCurrentPlan ? (
                      <Button className="w-full" disabled>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aktueller Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.isPopular ? 'default' : 'outline'}
                        onClick={() => handlePlanUpgrade(plan.id)}
                      >
                        {currentPlan &&
                        plan.price[billingCycle] >
                          currentPlan.price[billingCycle]
                          ? 'Upgraden'
                          : 'Wählen'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Plan Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Detaillierter Planvergleich</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Features</th>
                    {subscriptionPlans.map((plan) => (
                      <th key={plan.id} className="text-center p-4 min-w-32">
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(plan.price[billingCycle])}/
                          {billingCycle === 'monthly' ? 'Monat' : 'Jahr'}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">API Requests</td>
                    {subscriptionPlans.map((plan) => (
                      <td key={plan.id} className="text-center p-4">
                        {typeof plan.limits.apiRequests === 'number'
                          ? plan.limits.apiRequests.toLocaleString('de-DE')
                          : 'Unbegrenzt'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Produkte</td>
                    {subscriptionPlans.map((plan) => (
                      <td key={plan.id} className="text-center p-4">
                        {typeof plan.limits.products === 'number'
                          ? plan.limits.products.toLocaleString('de-DE')
                          : 'Unbegrenzt'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Kunden</td>
                    {subscriptionPlans.map((plan) => (
                      <td key={plan.id} className="text-center p-4">
                        {typeof plan.limits.customers === 'number'
                          ? plan.limits.customers.toLocaleString('de-DE')
                          : 'Unbegrenzt'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Speicherplatz</td>
                    {subscriptionPlans.map((plan) => (
                      <td key={plan.id} className="text-center p-4">
                        {plan.limits.storage}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Support</td>
                    {subscriptionPlans.map((plan) => (
                      <td key={plan.id} className="text-center p-4">
                        <div className="flex items-center justify-center space-x-1">
                          {plan.limits.support === 'email' && (
                            <Mail className="h-4 w-4" />
                          )}
                          {plan.limits.support === 'priority' && (
                            <Headphones className="h-4 w-4" />
                          )}
                          {plan.limits.support === '24/7' && (
                            <Clock className="h-4 w-4" />
                          )}
                          <span className="capitalize">
                            {plan.limits.support}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Benutzer</td>
                    {subscriptionPlans.map((plan) => (
                      <td key={plan.id} className="text-center p-4">
                        {typeof plan.limits.users === 'number'
                          ? plan.limits.users.toString()
                          : 'Unbegrenzt'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Contact */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Brauchen Sie einen individuellen Plan?
            </h3>
            <p className="text-purple-100 mb-6">
              Für große Unternehmen bieten wir maßgeschneiderte Lösungen mit
              individuellen Features und Preisen.
            </p>
            <Button variant="secondary" size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Vertrieb kontaktieren
            </Button>
          </CardContent>
        </Card>

        {/* Upgrade Modal */}
        <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Plan-Upgrade bestätigen</DialogTitle>
              <DialogDescription>
                Möchten Sie zu diesem Plan wechseln?
              </DialogDescription>
            </DialogHeader>

            {selectedPlan && (
              <div className="py-4">
                {(() => {
                  const plan = subscriptionPlans.find(
                    (p) => p.id === selectedPlan
                  );
                  if (!plan) return null;

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        {getPlanIcon(plan.icon)}
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-sm text-gray-600">
                            {plan.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Neuer Preis</p>
                          <p className="font-semibold text-lg">
                            {formatPrice(plan.price[billingCycle])}/
                            {billingCycle === 'monthly' ? 'Monat' : 'Jahr'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Nächste Zahlung
                          </p>
                          <p className="font-semibold text-lg">
                            {new Date(
                              currentSubscription.currentPeriodEnd
                            ).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Die Änderung wird sofort wirksam. Die Abrechnung
                          erfolgt anteilig basierend auf Ihrem aktuellen
                          Abrechnungszyklus.
                        </AlertDescription>
                      </Alert>
                    </div>
                  );
                })()}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpgradeModalOpen(false)}
              >
                Abbrechen
              </Button>
              <Button onClick={confirmUpgrade}>Upgrade bestätigen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/billing/usage')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Nutzung anzeigen
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/billing/payment-methods')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Zahlungsmethoden
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/billing/history')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Rechnungshistorie
            </Button>

            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Abonnement verwalten
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
