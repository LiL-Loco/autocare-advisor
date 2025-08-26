'use client';

import Footer from '@/components/Footer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BubbleAnimation from '@/components/ui/bubble-animation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BoltIcon,
  BuildingStorefrontIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-neutral-950 text-white overflow-hidden">
        {/* Bubble Animation Background */}
        <BubbleAnimation bubbleCount={30} />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge
                variant="secondary"
                className="mb-6 bg-[#f8de00] text-neutral-950 border-[#f8de00]"
              >
                <TrophyIcon className="w-4 h-4 mr-2" />
                Professionelle Fahrzeugpflege
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">CLEAN</span>
                <span className="text-[#f8de00]">tastic</span>
                <Badge
                  variant="outline"
                  className="ml-4 text-xs bg-transparent border-slate-600 text-slate-400"
                >
                  v2.0
                </Badge>
              </h1>

              <p className="text-xl mb-8 text-slate-300 leading-relaxed">
                Intelligente Fahrzeuganalyse mit{' '}
                <span className="text-white font-semibold">
                  sofortigen Produktempfehlungen
                </span>{' '}
                - vollautomatisch und wissenschaftlich fundiert.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center justify-center lg:justify-start text-slate-400">
                  <div className="w-8 h-8 mr-3 bg-slate-700 rounded-lg flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm">Personalisierte Empfehlungen</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-slate-400">
                  <div className="w-8 h-8 mr-3 bg-slate-700 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm">Preisvergleich</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start text-slate-400">
                  <div className="w-8 h-8 mr-3 bg-slate-700 rounded-lg flex items-center justify-center animate-pulse">
                    <ClockIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm">3 Minuten</span>
                </div>
              </div>
            </div>

            {/* Right Content - CTA Card */}
            <div>
              <Card className="shadow-xl border-slate-200">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-neutral-950 flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-[#f8de00]" />
                    Digitaler Pflegeberater
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-base">
                    Automatische Analyse deines Fahrzeugs für passgenaue
                    Produktempfehlungen
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button
                    onClick={() => router.push('/start-questionnaire')}
                    className="w-full text-lg h-12 bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950"
                    size="lg"
                  >
                    <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                    Fahrzeug analysieren
                    <ChevronRightIcon className="w-5 h-5 ml-2" />
                  </Button>

                  <div className="text-center">
                    <Badge
                      variant="secondary"
                      className="text-sm text-slate-600"
                    >
                      <CheckIcon className="w-3 h-3 mr-1" />
                      Vollautomatisch •
                      <ClockIcon className="w-3 h-3 mx-1" />
                      ~3 Minuten •
                      <SparklesIcon className="w-3 h-3 mx-1" />
                      Sofort verfügbar
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-950 mb-6">
              Profi-Autopflege leicht gemacht
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Von Anfänger bis Profi - wir haben die passende Lösung für deinen
              Lacktyp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-slate-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 transition-colors">
                  <CheckIcon className="w-8 h-8 text-slate-600 animate-pulse" />
                </div>
                <CardTitle className="text-lg mb-2 text-neutral-950">
                  Präzise Diagnostik
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  KI-gestützte Problemanalyse erkennt versteckte Lackschäden
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-slate-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 transition-colors">
                  <BoltIcon className="w-8 h-8 text-slate-600 hover:animate-spin transition-transform" />
                </div>
                <CardTitle className="text-lg mb-2 text-neutral-950">
                  Blitzschnell
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  In nur 3 Minuten zur perfekten Produktempfehlung
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-slate-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 transition-colors">
                  <ShieldCheckIcon className="w-8 h-8 text-slate-600" />
                </div>
                <CardTitle className="text-lg mb-2 text-neutral-950">
                  Premium Marken
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Nur geprüfte Top-Marken wie Meguiar's, Chemical Guys, SONAX
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-slate-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 transition-colors">
                  <SparklesIcon className="w-8 h-8 text-slate-600 animate-pulse" />
                </div>
                <CardTitle className="text-lg mb-2 text-neutral-950">
                  Showroom-Glanz
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Garantierte Profi-Ergebnisse auch für Hobby-Schrauber
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Categories */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-950 mb-6 flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-8 h-8 mr-3" />
              Häufige Probleme die wir lösen
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Egal ob BMW, Audi, Mercedes oder VW - diese Probleme kennt jeder
              Autobesitzer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg hover:bg-white cursor-pointer transition-all border-slate-200">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4 group-hover:bg-slate-300 transition-colors flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-slate-600 group-hover:animate-spin" />
                </div>
                <CardTitle className="text-lg mb-3 text-neutral-950">
                  Schleier & Hologramme
                </CardTitle>
                <CardDescription className="text-sm mb-4 text-slate-600">
                  Besonders auf schwarzem Lack nach der Politur sichtbar
                </CardDescription>
                <Badge
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 text-slate-700"
                >
                  <CheckIcon className="w-3 h-3 mr-1" />
                  Sofort lösen
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:bg-white cursor-pointer transition-all border-slate-200">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4 group-hover:bg-slate-300 transition-colors flex items-center justify-center">
                  <BoltIcon className="w-6 h-6 text-slate-600 group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-lg mb-3 text-neutral-950">
                  Kratzer & Swirls
                </CardTitle>
                <CardDescription className="text-sm mb-4 text-slate-600">
                  Feine Lackschäden durch falsche Waschhandschuhe
                </CardDescription>
                <Badge
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 text-slate-700"
                >
                  <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
                  Reparatur-Guide
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:bg-white cursor-pointer transition-all border-slate-200">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4 group-hover:bg-slate-300 transition-colors flex items-center justify-center">
                  <div className="w-6 h-6 bg-slate-600 rounded-full animate-bounce"></div>
                </div>
                <CardTitle className="text-lg mb-3 text-neutral-950">
                  Wasserflecken
                </CardTitle>
                <CardDescription className="text-sm mb-4 text-slate-600">
                  Hartnäckige Kalkflecken nach der Autowäsche
                </CardDescription>
                <Badge
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 text-slate-700"
                >
                  <CheckIcon className="w-3 h-3 mr-1" />
                  Entfernen lernen
                </Badge>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:bg-white cursor-pointer transition-all border-slate-200">
              <CardContent className="text-center p-6">
                <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4 group-hover:bg-slate-300 transition-colors flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-slate-600 group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-lg mb-3 text-neutral-950">
                  Glanz verloren
                </CardTitle>
                <CardDescription className="text-sm mb-4 text-slate-600">
                  Lack wirkt matt, stumpf und farblos
                </CardDescription>
                <Badge
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 text-slate-700"
                >
                  <SparklesIcon className="w-3 h-3 mr-1" />
                  Glanz zurückholen
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-950 mb-6 flex items-center justify-center">
              <TrophyIcon className="w-8 h-8 mr-3 animate-pulse" />
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Über 10.000 zufriedene Autobesitzer vertrauen bereits auf unsere
              Expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg border-l-4 border-slate-400">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-slate-400 mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    BMW 320d Besitzer
                  </Badge>
                </div>
                <CardDescription className="text-slate-700 mb-4 text-base leading-relaxed">
                  "Endlich eine Seite, die mir genau sagt welches Produkt ich
                  für mein Problem brauche. Die Schleier sind weg und mein
                  schwarzer BMW glänzt wieder wie neu! Der Preisvergleich hat
                  mir auch noch 15€ gespart."
                </CardDescription>
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarFallback className="bg-slate-600 text-white font-bold">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-neutral-950">Michael K.</p>
                    <p className="text-sm text-slate-500">München • BMW 320d</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-slate-400">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-slate-400 mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700"
                  >
                    Audi A3 Besitzerin
                  </Badge>
                </div>
                <CardDescription className="text-slate-700 mb-4 text-base leading-relaxed">
                  "Als Anfänger war ich völlig überfordert. CLEANtastic hat mir
                  Schritt-für-Schritt erklärt wie ich die Kratzer entfernen
                  kann. Super Ergebnis und ich habe richtig Spaß daran
                  gefunden!"
                </CardDescription>
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarFallback className="bg-slate-600 text-white font-bold">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-neutral-950">Sarah M.</p>
                    <p className="text-sm text-slate-500">Hamburg • Audi A3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center border-slate-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-700 mb-2">
                  4.9/5
                </div>
                <div className="flex justify-center mb-2">
                  <div className="flex text-slate-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className="w-4 h-4 fill-current hover:animate-spin transition-transform"
                      />
                    ))}
                  </div>
                </div>
                <CardDescription className="text-sm text-slate-600">
                  Kundenbewertung
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-slate-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-700 mb-2">
                  15,000+
                </div>
                <div className="w-6 h-6 bg-slate-300 rounded mx-auto mb-2 flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-slate-600 animate-pulse" />
                </div>
                <CardDescription className="text-sm text-slate-600">
                  Beratungen
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-slate-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-700 mb-2">
                  500+
                </div>
                <div className="w-6 h-6 bg-slate-300 rounded mx-auto mb-2 flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-4 h-4 text-slate-600" />
                </div>
                <CardDescription className="text-sm text-slate-600">
                  Produkte
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-slate-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-slate-700 mb-2">
                  98%
                </div>
                <div className="w-6 h-6 bg-slate-300 rounded mx-auto mb-2 flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-slate-600 animate-pulse" />
                </div>
                <CardDescription className="text-sm text-slate-600">
                  Erfolgsrate
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Bereit für den perfekten Lack?
          </h2>
          <p className="text-xl mb-8 text-slate-300">
            Lass dich jetzt persönlich beraten und entdecke die Geheimnisse der
            Profi-Autopflege. Dein Auto wird es dir danken!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => router.push('/start-questionnaire')}
              variant="secondary"
              size="lg"
              className="bg-[#f8de00] text-neutral-950 hover:bg-[#e6c700] px-8 py-6 text-lg h-auto group"
            >
              <PlayIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Jetzt kostenlos beraten lassen
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Button>

            <Badge
              variant="secondary"
              className="bg-neutral-900 text-slate-300 border-slate-700 text-base px-4 py-2"
            >
              <ClockIcon className="w-4 h-4 mr-2" />
              Nur 3 Minuten • Völlig kostenlos
            </Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
