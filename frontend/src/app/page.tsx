'use client';

import Footer from '@/components/Footer';
import FoamIcon from '@/components/icons/FoamIcon';
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
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 bg-neutral-950 text-white overflow-hidden">
        {/* Bubble Animation Background */}
        <BubbleAnimation bubbleCount={20} />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge
                variant="secondary"
                className="mb-4 sm:mb-6 bg-[#f8de00] text-neutral-950 border-[#f8de00] text-sm sm:text-base"
              >
                <TrophyIcon className="w-4 h-4 mr-2" />
                Professionelle Fahrzeugpflege
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                <span className="text-white">CLEAN</span>
                <span className="text-[#f8de00]">tastic</span>
                <Badge
                  variant="outline"
                  className="ml-2 sm:ml-4 text-xs bg-transparent border-slate-600 text-slate-400"
                >
                  v2.0
                </Badge>
              </h1>

              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-slate-300 leading-relaxed px-2 sm:px-0">
                Intelligente Fahrzeuganalyse mit{' '}
                <span className="text-white font-semibold">
                  sofortigen Produktempfehlungen
                </span>{' '}
                - vollautomatisch und wissenschaftlich fundiert.
              </p>

              <div className="hidden sm:flex sm:flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-center text-slate-400 justify-center lg:justify-start">
                  <div className="w-8 h-8 mr-3 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    Maßgeschneidert
                  </span>
                </div>
                <div className="flex items-center text-slate-400 justify-center lg:justify-start">
                  <div className="w-8 h-8 mr-3 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CurrencyDollarIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    Preisvergleich
                  </span>
                </div>
                <div className="flex items-center text-slate-400 justify-center lg:justify-start">
                  <div className="w-8 h-8 mr-3 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm whitespace-nowrap">3 Minuten</span>
                </div>
              </div>
            </div>

            {/* Right Content - CTA Card */}
            <div className="mt-8 lg:mt-0">
              <Card className="shadow-xl border-slate-200 mx-auto max-w-md lg:max-w-none">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-neutral-950 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#f8de00]" />
                    Digitaler Pflegeberater
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm sm:text-base">
                    Automatische Analyse deines Fahrzeugs für passgenaue
                    Produktempfehlungen
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 px-4 sm:px-6">
                  <Button
                    onClick={() => router.push('/start-questionnaire')}
                    className="w-full text-base sm:text-lg h-12 sm:h-14 bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950 touch-manipulation"
                    size="lg"
                  >
                    <WrenchScrewdriverIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Fahrzeug analysieren
                    <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>

                  <div className="hidden sm:flex justify-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="text-xs text-slate-600 px-2 py-1"
                    >
                      <CheckIcon className="w-3 h-3 mr-1" />
                      Vollautomatisch
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs text-slate-600 px-2 py-1"
                    >
                      <ClockIcon className="w-3 h-3 mr-1" />
                      ~3 Minuten
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs text-slate-600 px-2 py-1"
                    >
                      <SparklesIcon className="w-3 h-3 mr-1" />
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6">
              Profi-Autopflege leicht gemacht
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              Von Anfänger bis Profi - wir haben die passende Lösung für deinen
              Lacktyp
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-slate-200">
              <CardContent className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-slate-200 transition-colors">
                  <CheckIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 animate-pulse" />
                </div>
                <CardTitle className="text-base sm:text-lg mb-2 text-neutral-950">
                  Präzise Diagnostik
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-600">
                  KI-gestützte Problemanalyse erkennt versteckte Lackschäden
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-slate-200">
              <CardContent className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-slate-200 transition-colors">
                  <BoltIcon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 hover:animate-spin transition-transform" />
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6 flex items-center justify-center flex-wrap">
              <WrenchScrewdriverIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              <span className="text-center">
                Häufige Probleme die wir lösen
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              Egal ob BMW, Audi, Mercedes oder VW - diese Probleme kennt jeder
              Autobesitzer
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="group hover:shadow-lg hover:bg-white cursor-pointer transition-all border-slate-200 touch-manipulation">
              <CardContent className="text-center p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-full mx-auto mb-3 sm:mb-4 group-hover:bg-slate-300 transition-colors flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:animate-spin" />
                </div>
                <CardTitle className="text-base sm:text-lg mb-2 sm:mb-3 text-neutral-950">
                  Schleier & Hologramme
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mb-3 sm:mb-4 text-slate-600">
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
                  <FoamIcon
                    className="w-6 h-6 text-slate-600 group-hover:text-slate-800"
                    size={24}
                  />
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6 flex items-center justify-center flex-wrap">
              <TrophyIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 animate-pulse" />
              <span>Was unsere Kunden sagen</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              Über 10.000 zufriedene Autobesitzer vertrauen bereits auf unsere
              Expertise
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-12">
            <Card className="shadow-lg border-l-4 border-slate-400">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                  <div className="flex text-slate-400 mr-0 sm:mr-3 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 text-xs sm:text-sm self-center sm:self-auto"
                  >
                    BMW 320d Besitzer
                  </Badge>
                </div>
                <CardDescription className="text-slate-700 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                  "Endlich eine Seite, die mir genau sagt welches Produkt ich
                  für mein Problem brauche. Die Schleier sind weg und mein
                  schwarzer BMW glänzt wieder wie neu! Der Preisvergleich hat
                  mir auch noch 15€ gespart."
                </CardDescription>
                <div className="flex items-center justify-center sm:justify-start">
                  <Avatar className="mr-3">
                    <AvatarFallback className="bg-slate-600 text-white font-bold text-sm">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-neutral-950 text-sm sm:text-base">
                      Michael K.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">
                      München • BMW 320d
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-slate-400">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
                  <div className="flex text-slate-400 mr-0 sm:mr-3 justify-center sm:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-700 text-xs sm:text-sm self-center sm:self-auto"
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="text-center border-slate-200">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="text-2xl sm:text-3xl font-bold text-slate-700 mb-1 sm:mb-2">
                  4.9/5
                </div>
                <div className="flex justify-center mb-1 sm:mb-2">
                  <div className="flex text-slate-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className="w-3 h-3 sm:w-4 sm:h-4 fill-current hover:animate-spin transition-transform"
                      />
                    ))}
                  </div>
                </div>
                <CardDescription className="text-xs sm:text-sm text-slate-600">
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
            Bereit für den perfekten Lack?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-slate-300 px-4 sm:px-0">
            Starte jetzt die Fahrzeuganalyse und finde die passenden Produkte
            für dein Auto.
          </p>

          <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center">
            <Button
              onClick={() => router.push('/start-questionnaire')}
              variant="secondary"
              size="lg"
              className="bg-[#f8de00] text-neutral-950 hover:bg-[#e6c700] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg h-auto group w-full sm:w-auto max-w-md touch-manipulation"
            >
              <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
              Fahrzeug analysieren
              <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
