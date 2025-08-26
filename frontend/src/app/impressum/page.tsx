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
import {
  BuildingOfficeIcon,
  ChevronLeftIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ImpressumPage() {
  const router = useRouter();

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
              <BuildingOfficeIcon className="w-4 h-4 mr-2" />
              Rechtliche Informationen
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">Impressum</h1>
          <p className="text-xl text-slate-300">Angaben gemäß § 5 TMG</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8">
            {/* Anbieter */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <BuildingOfficeIcon className="w-6 h-6 mr-3" />
                  Anbieter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-950 mb-2">
                    CLEANtastic GmbH
                  </h3>
                  <div className="text-slate-600 space-y-1">
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      Musterstraße 123
                    </div>
                    <div className="ml-6">12345 Berlin</div>
                    <div className="ml-6">Deutschland</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kontakt */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <EnvelopeIcon className="w-6 h-6 mr-3" />
                  Kontaktdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center text-slate-600">
                    <PhoneIcon className="w-4 h-4 mr-3" />
                    <div>
                      <div className="font-medium">Telefon:</div>
                      <div>+49 (0) 30 12345678</div>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <EnvelopeIcon className="w-4 h-4 mr-3" />
                    <div>
                      <div className="font-medium">E-Mail:</div>
                      <div>info@cleantastic.de</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rechtliche Angaben */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Rechtliche Angaben
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Registergericht:
                    </h4>
                    <p className="text-slate-600">Amtsgericht Charlottenburg</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Handelsregisternummer:
                    </h4>
                    <p className="text-slate-600">HRB 123456 B</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Umsatzsteuer-ID:
                    </h4>
                    <p className="text-slate-600">DE123456789</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Geschäftsführer:
                    </h4>
                    <p className="text-slate-600">Max Mustermann</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verantwortlich für den Inhalt */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Verantwortlich für den Inhalt
                </CardTitle>
                <CardDescription>nach § 55 Abs. 2 RStV</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  <p className="font-medium">Max Mustermann</p>
                  <div className="mt-2">
                    <div>Musterstraße 123</div>
                    <div>12345 Berlin</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streitschlichtung */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Streitschlichtung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur
                  Online-Streitbeilegung (OS) bereit:
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    className="text-neutral-950 hover:underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p className="text-slate-600 leading-relaxed mt-4">
                  Wir sind nicht bereit oder verpflichtet, an
                  Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </CardContent>
            </Card>

            {/* Haftung für Inhalte */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Haftung für Inhalte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                  Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                  Diensteanbieter jedoch nicht unter der Verpflichtung,
                  übermittelte oder gespeicherte fremde Informationen zu
                  überwachen oder nach Umständen zu forschen, die auf eine
                  rechtswidrige Tätigkeit hinweisen.
                </p>
              </CardContent>
            </Card>

            {/* Haftung für Links */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Haftung für Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf
                  deren Inhalte wir keinen Einfluss haben. Deshalb können wir
                  für diese fremden Inhalte auch keine Gewähr übernehmen. Für
                  die Inhalte der verlinkten Seiten ist stets der jeweilige
                  Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </CardContent>
            </Card>

            {/* Urheberrecht */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">Urheberrecht</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                  diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                  Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                  Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
                  der schriftlichen Zustimmung des jeweiligen Autors bzw.
                  Erstellers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stand */}
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              Stand dieser Angaben: August 2025
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
