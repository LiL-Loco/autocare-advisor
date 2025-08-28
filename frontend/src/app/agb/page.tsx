'use client';

import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronLeftIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function AGBPage() {
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
              <ScaleIcon className="w-4 h-4 mr-2" />
              Rechtliches
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-xl text-slate-300">
            Nutzungsbedingungen für GLANZtastic Services
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8">
            {/* Geltungsbereich */}
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <DocumentTextIcon className="w-6 h-6 mr-3" />§ 1
                  Geltungsbereich
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend
                    "AGB") der GLANZtastic GmbH (nachfolgend "Anbieter") gelten
                    für alle Verträge zwischen dem Anbieter und seinen Kunden
                    (nachfolgend "Nutzer") über die Nutzung der Website und der
                    damit verbundenen Services.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Geschäftsbedingungen des Nutzers werden nicht anerkannt,
                    es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich
                    schriftlich zu.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vertragsschluss */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  § 2 Vertragsschluss
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Die Darstellung der Produkte und Services auf der
                    Website stellt kein rechtlich bindendes Angebot, sondern
                    einen unverbindlichen Online-Katalog dar.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Der Nutzer kann Produkte durch Anklicken des
                    entsprechenden Buttons in den Warenkorb legen und über die
                    Schaltfläche "Zur Kasse" bestellen.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (3) Der Vertrag kommt durch die Annahmebestätigung des
                    Anbieters zustande, die unmittelbar nach dem Absenden der
                    Bestellung per E-Mail an den Nutzer übersandt wird.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Empfehlungsservice */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  § 3 Empfehlungsservice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Der Anbieter stellt einen kostenlosen Empfehlungsservice
                    zur Verfügung, der auf Basis der Nutzerangaben
                    personalisierte Produktempfehlungen erstellt.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Die Empfehlungen erfolgen nach bestem Wissen und
                    Gewissen, jedoch ohne Gewähr für Vollständigkeit,
                    Richtigkeit oder Aktualität.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (3) Der Nutzer ist nicht verpflichtet, die empfohlenen
                    Produkte zu erwerben.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preise und Zahlung */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <CurrencyEuroIcon className="w-6 h-6 mr-3" />§ 4 Preise und
                  Zahlung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Alle Preise verstehen sich inklusive der gesetzlichen
                    Mehrwertsteuer und sonstiger Preisbestandteile.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Die Versandkosten sind nicht im Kaufpreis enthalten. Sie
                    werden im Bestellvorgang gesondert ausgewiesen.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Verfügbare Zahlungsarten:
                    </h4>
                    <ul className="text-slate-600 space-y-1">
                      <li>• PayPal</li>
                      <li>• Kreditkarte (Visa, MasterCard)</li>
                      <li>• SEPA-Lastschrift</li>
                      <li>• Rechnung (nach Bonitätsprüfung)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lieferung */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <TruckIcon className="w-6 h-6 mr-3" />§ 5 Lieferung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Die Lieferung erfolgt ausschließlich innerhalb
                    Deutschlands.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Die Lieferzeit beträgt in der Regel 2-5 Werktage nach
                    Vertragsschluss.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (3) Ist die Lieferung der Ware durch Verschulden des Nutzers
                    nicht möglich, trägt der Nutzer die dem Anbieter
                    entstehenden angemessenen Kosten.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Versandkosten:
                    </h4>
                    <ul className="text-slate-600 space-y-1">
                      <li>• Standardversand: 4,95 €</li>
                      <li>• Expressversand: 9,95 €</li>
                      <li>• Kostenloser Versand ab 50 € Bestellwert</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Widerrufsrecht */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <ShieldCheckIcon className="w-6 h-6 mr-3" />§ 6 Widerrufsrecht
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Widerrufsbelehrung
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
                      Gründen diesen Vertrag zu widerrufen.
                    </p>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    (1) Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an
                    dem Sie oder ein von Ihnen benannter Dritter die Waren in
                    Besitz genommen haben.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels
                    einer eindeutigen Erklärung über Ihren Entschluss
                    informieren.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (3) Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie
                    die Mitteilung über die Ausübung des Widerrufsrechts vor
                    Ablauf der Widerrufsfrist absenden.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Gewährleistung */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  § 7 Gewährleistung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Es gelten die gesetzlichen Gewährleistungsrechte.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Gegenüber Unternehmern beträgt die Gewährleistungsfrist
                    für gelieferte Sachen ein Jahr ab Ablieferung der Ware.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (3) Die Gewährleistungsfrist beginnt bei Verbrauchern nicht
                    erneut, wenn im Rahmen der Gewährleistung eine
                    Ersatzlieferung erfolgt.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Haftung */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  § 8 Haftungsbeschränkung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe
                    Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder
                    Gesundheit.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Bei der leicht fahrlässigen Verletzung von
                    Kardinalpflichten ist die Haftung auf den vorhersehbaren,
                    typischen Schaden begrenzt.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (3) Im Übrigen ist die Haftung ausgeschlossen, soweit
                    gesetzlich zulässig.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Datenschutz */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  § 9 Datenschutz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Der Anbieter behandelt die personenbezogenen Daten des Nutzers
                  vertraulich und entsprechend den gesetzlichen
                  Datenschutzbestimmungen sowie dieser Datenschutzerklärung.
                  Details finden Sie in unserer{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slate-600 underline"
                    onClick={() => router.push('/datenschutz')}
                  >
                    Datenschutzerklärung
                  </Button>
                  .
                </p>
              </CardContent>
            </Card>

            {/* Schlussbestimmungen */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  § 10 Schlussbestimmungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    (1) Auf Verträge zwischen dem Anbieter und den Nutzern
                    findet das Recht der Bundesrepublik Deutschland Anwendung
                    unter Ausschluss des UN-Kaufrechts.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    (2) Sofern es sich beim Nutzer um einen Kaufmann, eine
                    juristische Person des öffentlichen Rechts oder ein
                    öffentlich-rechtliches Sondervermögen handelt, ist
                    Gerichtsstand für alle Streitigkeiten aus
                    Vertragsverhältnissen zwischen dem Nutzer und dem Anbieter
                    der Sitz des Anbieters.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Warnung */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <ExclamationTriangleIcon className="w-6 h-6 mr-3" />
                  Wichtiger Hinweis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 leading-relaxed">
                  Diese AGB können jederzeit geändert werden. Die jeweils
                  aktuelle Fassung ist auf unserer Website einsehbar. Bereits
                  abgeschlossene Verträge bleiben von Änderungen unberührt,
                  soweit der Nutzer den Änderungen nicht ausdrücklich zustimmt.
                </p>
              </CardContent>
            </Card>

            {/* Stand */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                Stand dieser AGB: August 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
