'use client';

import Footer from '@/components/Footer';
import FoamIcon from '@/components/icons/FoamIcon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BubbleAnimation from '@/components/ui/bubble-animation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 bg-neutral-950 text-white overflow-hidden">
        <BubbleAnimation />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 sm:mb-8 bg-[#f8de00]/10 border-[#f8de00]/20 text-[#f8de00] hover:bg-[#f8de00]/20"
            >
              <FoamIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Schluss mit Produktwahl-Verwirrung
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="text-[#f8de00]">GLANZtastic</span> findet die
              richtige Autopflege für{' '}
              <span className="text-[#f8de00]">DEIN</span> Auto
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-10 max-w-3xl mx-auto px-4 sm:px-0">
              Nie wieder stundenlang recherchieren oder teure Fehlkäufe bereuen.
              Unser intelligentes System erstellt dir in 3 Minuten die perfekte
              Produktliste für dein Auto.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 text-sm sm:text-base">
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
                <span className="text-slate-200">Fahrzeugspezifisch</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
                <span className="text-slate-200">Keine Recherche</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
                <span className="text-slate-200">3 Minuten</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => router.push('/wizard')}
              className="bg-[#f8de00] hover:bg-[#e5c800] text-neutral-950 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg mb-6 sm:mb-8 button-one overflow-hidden relative"
            >
              Meine Produktliste erstellen
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <div className="flex -space-x-2">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white">
                  <AvatarFallback className="text-xs bg-[#f8de00] text-neutral-950">
                    S
                  </AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white">
                  <AvatarFallback className="text-xs bg-[#f8de00] text-neutral-950">
                    M
                  </AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white">
                  <AvatarFallback className="text-xs bg-[#f8de00] text-neutral-950">
                    T
                  </AvatarFallback>
                </Avatar>
              </div>
              <span>Über 2.500 zufriedene Autoliebhaber</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Identification Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6 flex items-center justify-center flex-wrap">
              <ExclamationTriangleIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-orange-500" />
              <span className="text-center">Kennst du diese Probleme?</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              Diese Frustrationen kennt jeder Autoliebhaber - du bist nicht
              allein!
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-900 mb-3">
                  Stundenlange Recherche
                </h3>
                <p className="text-red-800 text-sm">
                  "Welche Politur für meinen BMW? Was ist der Unterschied
                  zwischen Wachs und Versiegelung? Ich verliere mich in endlosen
                  Foren..."
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-orange-900 mb-3">
                  Teure Fehlkäufe
                </h3>
                <p className="text-orange-800 text-sm">
                  "Schon wieder 80€ für Produkte ausgegeben, die nicht zu meinem
                  Auto passen. Der Lack sieht noch schlechter aus als vorher..."
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-yellow-900 mb-3">
                  Angst vor Schäden
                </h3>
                <p className="text-yellow-800 text-sm">
                  "Was wenn ich den Lack beschädige? Welches Produkt ist zu
                  aggressiv? Ich trau mich gar nicht mehr ran..."
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-neutral-950 mb-4">
              Es gibt eine bessere Lösung!
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              Lass uns das für dich lösen. Professionell, schnell und garantiert
              richtig.
            </p>
            <ChevronRightIcon className="w-6 h-6 text-[#f8de00] mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Solution Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6 flex items-center justify-center flex-wrap">
              <ShieldCheckIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-green-500" />
              <span className="text-center">So lösen wir deine Probleme</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              Professionelle Autopflege war noch nie so einfach
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BoltIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-3">
                  Fahrzeugspezifische Empfehlungen
                </h3>
                <p className="text-green-800 text-sm">
                  Unser Expertensystem kennt die Besonderheiten von über 15.000
                  Fahrzeugmodellen. BMW E90? Audi A4? Wir wissen genau, was dein
                  Auto braucht.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-3">
                  3 Minuten statt 3 Stunden
                </h3>
                <p className="text-green-800 text-sm">
                  Keine endlose Recherche mehr. Beantworte ein paar Fragen zu
                  deinem Auto und erhalte sofort die perfekte Produktliste.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-3">
                  Geprüfte Sicherheit
                </h3>
                <p className="text-green-800 text-sm">
                  Alle empfohlenen Produkte sind von Profis getestet und für
                  deinen Lacktyp geeignet. Schritt-für-Schritt Anleitung
                  inklusive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6">
              Echte Ergebnisse von echten Autoliebhabern
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              Über 2.500 Nutzer haben durchschnittlich 4,8 Stunden Recherche und
              127€ Fehlkäufe gespart
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mb-2">
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-green-100 text-green-800"
                  >
                    Gespart: 240€
                  </Badge>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "Nach 2 Jahren Fehlkäufen endlich die richtigen Produkte! Mein
                  E90 glänzt wie am ersten Tag. Die Keramikversiegelung war
                  perfekt für meinen Alltag."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-slate-600">
                      SW
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Stefan W.</p>
                    <p className="text-sm text-slate-600">
                      BMW 3er E90, München • vor 3 Monaten
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mb-2">
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-green-100 text-green-800"
                  >
                    Gespart: 6h
                  </Badge>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "Wahnsinn! Statt wochenlang zu googeln hatte ich in 5 Minuten
                  meine Liste. Die Kratzer sind komplett weg - mein Audi sieht
                  aus wie neu!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-slate-600">
                      MK
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Marco K.</p>
                    <p className="text-sm text-slate-600">
                      Audi A4 B9, Hamburg • vor 1 Monat
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mb-2">
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-green-100 text-green-800"
                  >
                    Anfänger → Profi
                  </Badge>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "Als totaler Neuling war ich überfordert. Die
                  Schritt-für-Schritt Anleitung war perfekt. Jetzt machen mir
                  sogar Freunde Komplimente!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-slate-600">
                      TM
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Thomas M.</p>
                    <p className="text-sm text-slate-600">
                      VW Golf 8, Berlin • vor 2 Wochen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-slate-50 rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-neutral-950">
                  4.8h
                </div>
                <div className="text-sm text-slate-600">Ø Zeitersparnis</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-neutral-950">
                  127€
                </div>
                <div className="text-sm text-slate-600">Ø Geld gespart</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-neutral-950">
                  94%
                </div>
                <div className="text-sm text-slate-600">Zufriedenheit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6">
              So einfach funktioniert's
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              In nur 3 Schritten zur perfekten Produktliste für dein Auto
            </p>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f8de00] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-neutral-950">1</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-950 mb-4">
                Fahrzeug eingeben
              </h3>
              <p className="text-slate-600">
                Marke, Modell, Baujahr und Lackzustand - wir erfassen alle
                relevanten Details deines Autos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#f8de00] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-neutral-950">2</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-950 mb-4">
                Probleme beschreiben
              </h3>
              <p className="text-slate-600">
                Kratzer, Wasserflecken, matte Stellen? Unser Expertensystem
                analysiert deine spezifischen Herausforderungen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#f8de00] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-neutral-950">3</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-950 mb-4">
                Produktliste erhalten
              </h3>
              <p className="text-slate-600">
                Fertig! Du erhältst eine personalisierte Liste mit den besten
                Produkten für dein Auto - mit Kauflinks und Anleitung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 sm:mb-6">
              Häufige Fragen
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              Alles was du wissen musst, bevor du startest
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-neutral-950 mb-3">
                  Wie genau sind die Empfehlungen für mein Auto?
                </h3>
                <p className="text-slate-600">
                  Unsere Expertendatenbank enthält über 15.000 Fahrzeugmodelle
                  mit spezifischen Lackeigenschaften, Materialien und
                  Besonderheiten. Die Empfehlungen werden exakt auf dein Auto
                  und dessen Zustand abgestimmt.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-neutral-950 mb-3">
                  Was passiert, wenn ich mit den Produkten nicht zufrieden bin?
                </h3>
                <p className="text-slate-600">
                  Alle empfohlenen Produkte sind von Profis getestet und kommen
                  mit einer detaillierten Anleitung. Falls du trotzdem nicht
                  zufrieden bist, helfen wir dir gerne bei einer alternativen
                  Produktauswahl.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-neutral-950 mb-3">
                  Wie lange dauert die Produktlisten-Erstellung?
                </h3>
                <p className="text-slate-600">
                  Der gesamte Prozess dauert nur 3-5 Minuten. Du beantwortest
                  ein paar Fragen zu deinem Auto und erhältst sofort deine
                  personalisierte Produktliste mit Kauflinks und
                  Anwendungsanleitung.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-neutral-950 mb-3">
                  Kostet die Beratung etwas?
                </h3>
                <p className="text-slate-600">
                  Die Produktlisten-Erstellung ist komplett kostenlos. Du zahlst
                  nur für die Produkte, die du tatsächlich kaufen möchtest -
                  ohne versteckte Kosten oder Aufschläge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <Badge
              variant="secondary"
              className="mb-6 bg-[#f8de00]/10 border-[#f8de00]/20 text-[#f8de00] inline-flex"
            >
              ⚡ Starte jetzt - dauert nur 3 Minuten
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Nie wieder Zeit verschwenden oder Geld verschenken
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Schließe dich über 2.500 zufriedenen Autoliebhabern an und erhalte
              sofort deine persönliche Produktliste.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
              <div className="flex items-center text-green-400 text-sm sm:text-base">
                <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Komplett kostenlos</span>
              </div>
              <div className="flex items-center text-green-400 text-sm sm:text-base">
                <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Keine Anmeldung nötig</span>
              </div>
              <div className="flex items-center text-green-400 text-sm sm:text-base">
                <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Sofortige Ergebnisse</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Button
                size="lg"
                onClick={() => router.push('/wizard')}
                className="bg-[#f8de00] hover:bg-[#e5c800] text-neutral-950 font-semibold px-8 py-4 text-lg button-one overflow-hidden relative mb-4"
              >
                Jetzt meine Produktliste erstellen
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-sm text-slate-400 text-center max-w-md">
                💡 Durchschnittliche Ersparnis: 4,8 Stunden Recherche + 127€
                Fehlkäufe
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
