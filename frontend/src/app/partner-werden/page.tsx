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
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    partnerType: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partner application submitted:', formData);
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
              className="text-slate-300 hover:text-white mr-4"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Zurück
            </Button>
            <Badge
              variant="secondary"
              className="bg-[#f8de00] text-neutral-950 border-[#f8de00]"
            >
              <UsersIcon className="w-4 h-4 mr-2" />
              Partnerschaft
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">Partner werden</h1>
          <p className="text-xl text-slate-300">
            Werden Sie Teil des CLEANtastic Netzwerks und profitieren Sie von
            unserem Erfolg
          </p>
        </div>
      </section>

      {/* Hero CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-6">
            <RocketLaunchIcon className="w-12 h-12 text-sky-400 animate-pulse mr-4" />
            <h2 className="text-3xl font-bold text-neutral-950">
              Gemeinsam erfolgreich
            </h2>
          </div>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            CLEANtastic ist Deutschlands führende Plattform für
            Autopflege-Beratung. Schließen Sie sich unserem wachsenden
            Partnernetzwerk an und erschließen Sie neue Umsatzpotentiale über
            unsere zentrale Beratungsplattform.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="font-semibold text-neutral-950 mb-2">15.000+</h3>
              <p className="text-slate-600">Aktive Nutzer monatlich</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f8de00] rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-neutral-950 animate-pulse" />
              </div>
              <h3 className="font-semibold text-neutral-950 mb-2">300%</h3>
              <p className="text-slate-600">Wachstum in 2025</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-sky-400" />
              </div>
              <h3 className="font-semibold text-neutral-950 mb-2">#1</h3>
              <p className="text-slate-600">Autopflege-Beratung Deutschland</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-4">
              Partnerschaftspakete
            </h2>
            <p className="text-xl text-slate-600">
              3-Tier-Modell für optimale Flexibilität und messbare Erfolge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Package */}
            <Card className="border-slate-200 hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <BuildingStorefrontIcon className="w-6 h-6 mr-3" />
                  Basic Package
                </CardTitle>
                <CardDescription>
                  Ideal für kleine bis mittlere Autopflege-Händler und Start-ups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-neutral-950 mb-2">
                    299€
                    <span className="text-lg font-normal text-slate-500">
                      /Monat
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Bis zu 50 Produkte listbar
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Standard-Position in Empfehlungen
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Basis-Analytics (monatliche Reports)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Produktplatzierung auf CLEANtastic.de
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Standard-Support
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="w-full justify-center bg-slate-100 text-slate-700"
                >
                  <CurrencyEuroIcon className="w-4 h-4 mr-2" />
                  0,50€ pro Klick
                </Badge>
              </CardContent>
            </Card>

            {/* Professional Package */}
            <Card className="border-slate-200 hover:shadow-lg transition-all hover:scale-105 ring-2 ring-slate-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-neutral-950">
                      <TrophyIcon className="w-6 h-6 mr-3" />
                      Professional Package
                    </CardTitle>
                    <CardDescription>
                      Für etablierte Autopflege-Unternehmen und mittlere
                      Online-Shops
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#f8de00] text-neutral-950"
                  >
                    Beliebt
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-neutral-950 mb-2">
                    799€
                    <span className="text-lg font-normal text-slate-500">
                      /Monat
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Bis zu 200 Produkte listbar
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Bevorzugte Position in Empfehlungen
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Erweiterte Analytics (wöchentlich)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Premium-Produktplatzierung auf CLEANtastic.de
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Priority-Support & Bewertungsmanagement
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="w-full justify-center bg-neutral-900 text-white"
                >
                  <CurrencyEuroIcon className="w-4 h-4 mr-2" />
                  0,35€ pro Klick
                </Badge>
              </CardContent>
            </Card>

            {/* Enterprise Package */}
            <Card className="border-slate-200 hover:shadow-lg transition-all hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <StarIcon className="w-6 h-6 mr-3" />
                  Enterprise Package
                </CardTitle>
                <CardDescription>
                  Für große Autopflege-Marken, Marktführer und Konzerne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-neutral-950 mb-2">
                    1.999€
                    <span className="text-lg font-normal text-slate-500">
                      /Monat
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Unbegrenzte Produktlistings
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Premium-Position (Top-Empfehlungen)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Real-time Analytics Dashboard
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Exklusive Marken-Präsentation auf CLEANtastic.de
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-slate-600 text-sm">
                      Dedicated Account Manager
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="w-full justify-center bg-slate-100 text-slate-700"
                >
                  <CurrencyEuroIcon className="w-4 h-4 mr-2" />
                  0,25€ pro Klick
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-4">
              Ihre Vorteile als CLEANtastic Partner
            </h2>
            <p className="text-xl text-slate-600">
              Warum über 100 Unternehmen bereits auf uns vertrauen
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <ChartBarIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Zusätzliche Umsatzkanäle
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Erreichen Sie neue Zielgruppen und steigern Sie Ihren
                        Umsatz durch unsere wachsende Nutzerbasis von über
                        15.000 aktiven Kunden monatlich. Profitieren Sie von
                        unserem etablierten Kundenstamm und erweitern Sie Ihre
                        Reichweite nachhaltig.
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
                        Qualifizierte Leads
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Unsere KI-gestützte Beratung sorgt dafür, dass nur
                        passende Kunden zu Ihnen weitergeleitet werden - höhere
                        Conversion-Raten garantiert. Reduzieren Sie
                        Streuverluste und fokussieren Sie sich auf kaufbereite
                        Interessenten mit echtem Bedarf.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <TrophyIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Premium Branding
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Positionieren Sie sich als vertrauensvoller Partner
                        einer etablierten Marke im Autopflege-Segment. Stärken
                        Sie Ihr Markenimage durch die Assoziation mit
                        Deutschlands führender Beratungsplattform und gewinnen
                        Sie das Vertrauen Ihrer Kunden.
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
                      <RocketLaunchIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Einfache Integration
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Schneller Start dank unserer API-Schnittstellen und
                        umfassender technischer Unterstützung durch unser Team.
                        Minimaler Aufwand für maximale Ergebnisse - von der
                        ersten Beratung bis zur erfolgreichen Implementierung
                        begleiten wir Sie.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <ChartBarIcon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-950 mb-2">
                        Detaillierte Analysen
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Transparente Reporting-Tools geben Ihnen vollständigen
                        Überblick über Performance, Verkäufe und
                        Optimierungspotentiale. Datenbasierte Entscheidungen
                        treffen und Ihre Partnerschaft kontinuierlich optimieren
                        für maximalen ROI.
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
                        Persönlicher Support
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Ihr persönlicher Ansprechpartner unterstützt Sie bei
                        allen Fragen rund um die Partnerschaft und
                        Optimierungen. Direkter Draht zu unserem Expertenteam
                        für schnelle Lösungen und proaktive Beratung zu neuen
                        Marktchancen und Trends.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bewerbungsformular */}
      <section className="py-16 px-4 bg-slate-50">
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

          <Card className="border-slate-200">
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
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="">Bitte wählen</option>
                      <option value="basic">Basic Package (299€/Monat)</option>
                      <option value="professional">
                        Professional Package (799€/Monat)
                      </option>
                      <option value="enterprise">
                        Enterprise Package (1.999€/Monat)
                      </option>
                      <option value="beratung">
                        Beratungsgespräch gewünscht
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
                  className="w-full bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950 text-lg py-6"
                >
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Partner-Bewerbung absenden
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-slate-200 bg-slate-50 mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-neutral-950 mb-4">
                So geht es weiter:
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-slate-700 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-neutral-950 font-medium text-sm">
                      Bewerbung prüfen
                    </p>
                    <p className="text-slate-600 text-xs">
                      Innerhalb 24 Stunden
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-slate-700 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-neutral-950 font-medium text-sm">
                      Gespräch vereinbaren
                    </p>
                    <p className="text-slate-600 text-xs">
                      Persönliche Beratung
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-slate-700 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-neutral-950 font-medium text-sm">
                      Partnerschaft starten
                    </p>
                    <p className="text-slate-600 text-xs">
                      Integration & Launch
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
