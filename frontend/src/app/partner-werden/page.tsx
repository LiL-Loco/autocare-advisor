'use client';

import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronLeftIcon,
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  RocketLaunchIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PartnerWerdenPage() {
  const router = useRouter();

  // ROI Calculator State
  const [monthlyVisitors, setMonthlyVisitors] = useState(15000);
  const [currentConversion, setCurrentConversion] = useState(2.1);
  const [avgOrderValue, setAvgOrderValue] = useState(67);
  const [returnRate, setReturnRate] = useState(28);

  // Berechnung der ROI-Werte
  const conversionImprovement = 47; // +47%
  const returnReduction = 62; // -62%

  const newConversion = currentConversion * (1 + conversionImprovement / 100);
  const newReturnRate = returnRate * (1 - returnReduction / 100);

  const currentSales = (monthlyVisitors * currentConversion) / 100;
  const newSales = (monthlyVisitors * newConversion) / 100;
  const additionalSales = newSales - currentSales;

  const currentRevenue = currentSales * avgOrderValue;
  const newRevenue = newSales * avgOrderValue;
  const additionalRevenue = newRevenue - currentRevenue;

  const monthlyCost = 997; // Professional Package
  const yearlyAdditionalRevenue = additionalRevenue * 12;
  const yearlyInvestment = monthlyCost * 12;
  const netGain = yearlyAdditionalRevenue - yearlyInvestment;
  const roi = yearlyInvestment > 0 ? (netGain / yearlyInvestment) * 100 : 0;

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    partnerType: '',
    message: '',
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/partner-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'partner-werden-page',
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(
          'Vielen Dank für Ihre Bewerbung! Wir melden uns binnen 24 Stunden bei Ihnen.'
        );

        // Reset form
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          partnerType: '',
          message: '',
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Partner application submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-slate-300 hover:text-white hover:bg-slate-800 mr-4"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Zurück
            </Button>
            <Badge
              variant="secondary"
              className="bg-[#f8de00] text-neutral-950 border-[#f8de00] hover:bg-[#f8de00] hover:text-neutral-950"
            >
              <ChartBarIcon className="w-4 h-4 mr-2" />
              B2B Integration
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Steigern Sie Ihre Conversion-Rate um bis zu 47%
          </h1>
          <p className="text-xl text-slate-300">
            Integrieren Sie CLEANtastic's professionelle Produktberatung in
            Ihren Automotive E-Commerce und reduzieren Sie Retourenquoten
            drastisch
          </p>
        </div>
      </section>

      {/* Problem Awareness Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-6">
              Kennen Sie diese E-Commerce Probleme?
            </h2>
            <p className="text-xl text-slate-600 mb-12">
              Marcus, E-Commerce Manager bei einem führenden
              Automotive-Retailer, kannte diese Frustrationen nur zu gut...
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3">
                  Sinkende Conversion-Raten
                </h3>
                <p className="text-slate-600 text-sm">
                  "Trotz steigendem Traffic kaufen nur 2,1% unserer Besucher.
                  Kunden browsen 15+ Produkte, verlassen aber ohne Kauf. Das
                  Management fragt jeden Tag nach besseren Zahlen..."
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3">
                  Hohe Retourenquoten
                </h3>
                <p className="text-slate-600 text-sm">
                  "28% unserer Autopflege-Bestellungen kommen zurück. 'Passt
                  nicht zu meinem Auto', 'Falsche Wahl' - das kostet uns
                  monatlich über €15.000 in Rücksendekosten und verlorener
                  Marge."
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950 mb-3">
                  Überforderte Kunden
                </h3>
                <p className="text-slate-600 text-sm">
                  "Unser Katalog hat 847 Autopflege-Produkte. Kunden wissen
                  nicht, was zu ihrem BMW E90 oder Audi A4 passt. Sie geben auf
                  oder kaufen das Falsche - beides kostet uns Umsatz."
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-neutral-950 mb-4">
              Die Lösung: Professionelle Produktberatung
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              CLEANtastic's White-Label Integration löst genau diese Probleme
              für Automotive E-Commerce Shops wie Ihren.
            </p>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">+47%</div>
                <div className="text-sm text-slate-600">Conversion-Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">-62%</div>
                <div className="text-sm text-slate-600">Retourenquote</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">+€127k</div>
                <div className="text-sm text-slate-600">Jahresumsatz Ø</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Packages */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-4">
              ROI-optimierte Integrationspakete
            </h2>
            <p className="text-xl text-slate-600">
              Wählen Sie die Integration, die zu Ihrem Traffic-Volumen passt
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter Package */}
            <Card className="border-slate-200 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <RocketLaunchIcon className="w-6 h-6 mr-3" />
                  Starter Integration
                </CardTitle>
                <CardDescription>
                  Ideal für Shops mit 1.000-5.000 monatlichen Besuchern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-neutral-950 mb-2">
                    €497
                    <span className="text-lg font-normal text-slate-500">
                      /Monat
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    ROI: 340% nach 6 Monaten
                  </Badge>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      White-Label Widget Integration
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Bis zu 200 Produkte im Beratungsystem
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Monatliche Performance-Reports
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Email-Support & Setup-Hilfe
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Erwartete Conversion-Steigerung: +25-35%
                    </span>
                  </div>
                </div>
                <div className="bg-slate-100 rounded p-3 text-center">
                  <div className="text-sm text-slate-600">
                    Geschätzte monatliche Zusatzumsätze:
                  </div>
                  <div className="font-bold text-neutral-950">
                    €12.500 - €18.000
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Package */}
            <Card className="border-slate-200 hover:shadow-lg transition-all ring-2 ring-[#f8de00]">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-neutral-950">
                      <ChartBarIcon className="w-6 h-6 mr-3" />
                      Professional API
                    </CardTitle>
                    <CardDescription>
                      Für E-Commerce Shops mit 5.000-20.000 monatlichen
                      Besuchern
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#f8de00] text-neutral-950"
                  >
                    Empfohlen
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-neutral-950 mb-2">
                    €997
                    <span className="text-lg font-normal text-slate-500">
                      /Monat
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    ROI: 580% nach 6 Monaten
                  </Badge>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Vollständige API-Integration
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Unbegrenzte Produkte im System
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Wöchentliche Analytics & A/B-Tests
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Dedicated Success Manager
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Erwartete Conversion-Steigerung: +40-50%
                    </span>
                  </div>
                </div>
                <div className="bg-slate-100 rounded p-3 text-center">
                  <div className="text-sm text-slate-600">
                    Geschätzte monatliche Zusatzumsätze:
                  </div>
                  <div className="font-bold text-neutral-950">
                    €47.000 - €68.000
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Package */}
            <Card className="border-slate-200 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <StarIcon className="w-6 h-6 mr-3" />
                  Enterprise Solution
                </CardTitle>
                <CardDescription>
                  Für große E-Commerce Plattformen mit 20.000+ Besuchern/Monat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-neutral-950 mb-2">
                    €2.497
                    <span className="text-lg font-normal text-slate-500">
                      /Monat
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    ROI: 890% nach 6 Monaten
                  </Badge>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Custom Integration & Branding
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Multi-Brand & Multi-Shop Support
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Real-time Analytics Dashboard
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Priority Support & SLA-Garantie
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Erwartete Conversion-Steigerung: +55-70%
                    </span>
                  </div>
                </div>
                <div className="bg-slate-100 rounded p-3 text-center">
                  <div className="text-sm text-slate-600">
                    Geschätzte monatliche Zusatzumsätze:
                  </div>
                  <div className="font-bold text-neutral-950">
                    €127.000 - €230.000
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-4">
              Messbare Business-Impacts für E-Commerce Manager
            </h2>
            <p className="text-xl text-slate-600">
              Diese KPIs verbessern sich durchschnittlich nach 3 Monaten
              Integration
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <ChartBarIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Conversion-Rate Optimierung
                      </h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        Von 2,1% auf 3,4% (+47%)
                      </div>
                      <p className="text-slate-600 text-sm">
                        Kunden finden schneller die richtigen Produkte und
                        kaufen mit höherer Wahrscheinlichkeit. Weniger
                        Absprünge, mehr qualifizierte Conversions durch
                        zielgerichtete Produktführung.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <BuildingStorefrontIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Retourenquote Reduktion
                      </h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        Von 28% auf 11% (-62%)
                      </div>
                      <p className="text-slate-600 text-sm">
                        Dramatische Senkung der Rücksendekosten durch präzise
                        Produktempfehlungen. Kunden erhalten genau das, was zu
                        ihrem Fahrzeug und ihren Bedürfnissen passt.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <CurrencyEuroIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Average Order Value
                      </h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        Von €47 auf €73 (+55%)
                      </div>
                      <p className="text-slate-600 text-sm">
                        Gezielte Cross-Selling Empfehlungen steigern den
                        Warenkorbwert. Kunden kaufen komplementäre Produkte für
                        ein vollständiges Autopflege-Set.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <TrophyIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Customer Lifetime Value
                      </h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        Von €127 auf €234 (+84%)
                      </div>
                      <p className="text-slate-600 text-sm">
                        Zufriedene Kunden kommen zurück. Durch richtige
                        Erstberatung entsteht Vertrauen und wiederkehrende Käufe
                        mit höherer Frequenz und größeren Bestellwerten.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <UsersIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Support-Aufwand Reduktion
                      </h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        -68% Support-Anfragen
                      </div>
                      <p className="text-slate-600 text-sm">
                        Weniger "Welches Produkt passt?"-Anfragen, weniger
                        Reklamationen. Ihr Support-Team kann sich auf wichtigere
                        Aufgaben konzentrieren statt Produktberatung zu leisten.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <RocketLaunchIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Time-to-Market Beschleunigung
                      </h3>
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        Nur 14 Tage Integration
                      </div>
                      <p className="text-slate-600 text-sm">
                        Schnelle Implementierung ohne langwierige Entwicklung.
                        Unsere API und Widgets sind in wenigen Tagen
                        einsatzbereit und verbessern sofort Ihre E-Commerce
                        Performance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="mt-12 bg-neutral-950 rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Interaktiver ROI-Kalkulator
              </h3>
              <p className="text-slate-300">
                Berechnen Sie Ihren individuellen Return on Investment basierend
                auf Ihren Shop-Daten
              </p>
            </div>

            {/* Input Fields */}
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              <div className="space-y-2">
                <Label
                  htmlFor="visitors"
                  className="text-sm font-medium text-slate-300"
                >
                  Monatliche Besucher
                </Label>
                <Input
                  id="visitors"
                  type="number"
                  value={monthlyVisitors}
                  onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                  className="text-center bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="conversion"
                  className="text-sm font-medium text-slate-300"
                >
                  Conversion-Rate (%)
                </Label>
                <Input
                  id="conversion"
                  type="number"
                  step="0.1"
                  value={currentConversion}
                  onChange={(e) => setCurrentConversion(Number(e.target.value))}
                  className="text-center bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="aov"
                  className="text-sm font-medium text-slate-300"
                >
                  Ø Bestellwert (€)
                </Label>
                <Input
                  id="aov"
                  type="number"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="text-center bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="returns"
                  className="text-sm font-medium text-slate-300"
                >
                  Retourenquote (%)
                </Label>
                <Input
                  id="returns"
                  type="number"
                  step="0.1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="text-center bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            </div>

            {/* Results */}
            <div className="grid lg:grid-cols-4 gap-6 text-center mb-8">
              <Card className="border-neutral-700 bg-neutral-800">
                <CardContent className="p-4">
                  <div className="text-sm text-slate-400 mb-2">
                    Neue Conversion-Rate
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {newConversion.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">
                    (+{conversionImprovement}%)
                  </div>
                </CardContent>
              </Card>
              <Card className="border-neutral-700 bg-neutral-800">
                <CardContent className="p-4">
                  <div className="text-sm text-slate-400 mb-2">
                    Zusätzliche Verkäufe
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    +{Math.round(additionalSales)}/Monat
                  </div>
                  <div className="text-xs text-slate-500">
                    durch CLEANtastic
                  </div>
                </CardContent>
              </Card>
              <Card className="border-neutral-700 bg-neutral-800">
                <CardContent className="p-4">
                  <div className="text-sm text-slate-400 mb-2">
                    Neue Retourenquote
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {newReturnRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">
                    (-{returnReduction}%)
                  </div>
                </CardContent>
              </Card>
              <Card className="border-neutral-700 bg-neutral-800">
                <CardContent className="p-4">
                  <div className="text-sm text-slate-400 mb-2">
                    Zusatzumsatz
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    €{Math.round(additionalRevenue).toLocaleString()}/Monat
                  </div>
                  <div className="text-xs text-slate-500">monatlich mehr</div>
                </CardContent>
              </Card>
            </div>

            {/* Final ROI Result */}
            <div className="text-center p-6 bg-neutral-800 rounded-lg border border-neutral-700">
              <div className="text-lg text-slate-300 mb-2">
                ROI nach 12 Monaten:
              </div>
              <div className="text-4xl font-bold text-[#f8de00] mb-4">
                {Math.round(roi).toLocaleString()}%
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <div>
                  Jährliche Investition: €{yearlyInvestment.toLocaleString()}
                </div>
                <div>
                  Zusätzlicher Jahresumsatz: €
                  {Math.round(yearlyAdditionalRevenue).toLocaleString()}
                </div>
                <div className="font-semibold text-green-400">
                  Netto-Gewinn: €{Math.round(netGain).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bewerbungsformular */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-4">
              Werden Sie jetzt Partner
            </h2>
            <p className="text-xl text-slate-600">
              Füllen Sie das Formular aus und wir melden uns binnen 24 Stunden
              bei Ihnen
            </p>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-neutral-950">
                <PaperAirplaneIcon className="w-6 h-6 mr-3" />
                Partner-Bewerbung
              </CardTitle>
              <CardDescription>
                Teilen Sie uns mit, wie wir gemeinsam erfolgreich werden können
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-medium">
                      {submitMessage}
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800 font-medium">{submitMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Firmenname *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="border-slate-200"
                      placeholder="Ihre Firma GmbH"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Ansprechpartner *</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="border-slate-200"
                      placeholder="Ihr vollständiger Name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-slate-200"
                      placeholder="kontakt@ihre-firma.de"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonnummer</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-slate-200"
                      placeholder="+49 (0) 30 12345678"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="border-slate-200"
                      placeholder="https://www.ihre-website.de"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerType">Partnerschaftstyp *</Label>
                    <select
                      id="partnerType"
                      name="partnerType"
                      required
                      value={formData.partnerType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="starter">
                        Starter Integration (€497/Monat)
                      </option>
                      <option value="professional">
                        Professional API (€997/Monat) - Empfohlen
                      </option>
                      <option value="enterprise">
                        Enterprise Solution (€2.497/Monat)
                      </option>
                      <option value="beratung">
                        Kostenloses Beratungsgespräch gewünscht
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-slate-200 resize-none"
                    placeholder="Beschreiben Sie kurz Ihr Unternehmen und warum Sie Partner von CLEANtastic werden möchten..."
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1"
                  />
                  <Label htmlFor="privacy" className="text-sm text-slate-600">
                    Ich habe die{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-slate-600 underline"
                      onClick={() => router.push('/datenschutz')}
                    >
                      Datenschutzerklärung
                    </Button>{' '}
                    gelesen und stimme der Verarbeitung meiner Daten zu. *
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <UsersIcon className="w-5 h-5 mr-2" />
                      Partner-Bewerbung absenden
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-slate-200 bg-slate-50 mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-neutral-950 mb-4 flex items-center">
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                So geht es weiter:
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-yellow-800 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-neutral-950 font-semibold text-sm">
                      Bewerbung prüfen
                    </p>
                    <p className="text-slate-600 text-xs">
                      Innerhalb 24 Stunden
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-800 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-neutral-950 font-semibold text-sm">
                      ROI-Gespräch vereinbaren
                    </p>
                    <p className="text-slate-600 text-xs">
                      Persönliche Beratung & Demo
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-green-800 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-neutral-950 font-semibold text-sm">
                      Integration & Launch
                    </p>
                    <p className="text-slate-600 text-xs">
                      14 Tage bis Go-Live
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
