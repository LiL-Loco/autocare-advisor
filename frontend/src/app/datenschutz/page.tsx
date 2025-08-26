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
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ServerIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function DatenschutzPage() {
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
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Datenschutz
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">Datenschutzerklärung</h1>
          <p className="text-xl text-slate-300">
            Schutz Ihrer persönlichen Daten bei CLEANtastic
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8">
            {/* Übersicht */}
            <Card className="border-slate-200 bg-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <EyeSlashIcon className="w-6 h-6 mr-3" />
                  Datenschutz auf einen Blick
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Die folgenden Hinweise geben einen einfachen Überblick
                  darüber, was mit Ihren personenbezogenen Daten passiert, wenn
                  Sie diese Website besuchen. Personenbezogene Daten sind alle
                  Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
              </CardContent>
            </Card>

            {/* Verantwortlicher */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Verantwortlicher
                </CardTitle>
                <CardDescription>
                  Verantwortlich für die Datenverarbeitung auf dieser Website
                  ist:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-slate-600">
                    <p className="font-semibold text-neutral-950">
                      CLEANtastic GmbH
                    </p>
                    <p>Max Mustermann</p>
                    <p>Musterstraße 123</p>
                    <p>12345 Berlin</p>
                    <p className="mt-2">
                      <span className="font-medium">Telefon:</span> +49 (0) 30
                      12345678
                      <br />
                      <span className="font-medium">E-Mail:</span>{' '}
                      info@cleantastic.de
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datenerfassung */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <ServerIcon className="w-6 h-6 mr-3" />
                  Datenerfassung auf dieser Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-neutral-950 mb-3">
                    Wer ist verantwortlich für die Datenerfassung?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Die Datenverarbeitung auf dieser Website erfolgt durch den
                    Websitebetreiber. Dessen Kontaktdaten können Sie dem
                    Impressum dieser Website entnehmen.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-950 mb-3">
                    Wie erfassen wir Ihre Daten?
                  </h4>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns
                    diese mitteilen. Hierbei kann es sich z.B. um Daten handeln,
                    die Sie in unser Kontaktformular eingeben.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Andere Daten werden automatisch oder nach Ihrer Einwilligung
                    beim Besuch der Website durch unsere IT-Systeme erfasst. Das
                    sind vor allem technische Daten (z.B. Internetbrowser,
                    Betriebssystem oder Uhrzeit des Seitenaufrufs).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-950 mb-3">
                    Wofür nutzen wir Ihre Daten?
                  </h4>
                  <ul className="text-slate-600 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Zur fehlerfreien Bereitstellung der Website
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Zur Analyse des Nutzerverhaltens
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Zur Bereitstellung personalisierter Produktempfehlungen
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Server-Log-Dateien */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Server-Log-Dateien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Der Provider der Seiten erhebt und speichert automatisch
                  Informationen in so genannten Server-Log-Dateien, die Ihr
                  Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="text-slate-600 space-y-1 mb-4">
                  <li>• Browsertyp und Browserversion</li>
                  <li>• Verwendetes Betriebssystem</li>
                  <li>• Referrer URL</li>
                  <li>• Hostname des zugreifenden Rechners</li>
                  <li>• Uhrzeit der Serveranfrage</li>
                  <li>• IP-Adresse</li>
                </ul>
                <p className="text-slate-600 leading-relaxed">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen
                  wird nicht vorgenommen. Die Daten werden nach einer
                  statistischen Auswertung gelöscht.
                </p>
              </CardContent>
            </Card>

            {/* Kontaktformular */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Kontaktformular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen,
                  werden Ihre Angaben aus dem Anfrageformular inklusive der von
                  Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
                  Anfrage und für den Fall von Anschlussfragen bei uns
                  gespeichert.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die
                  Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
                  DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags
                  zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen
                  erforderlich ist.
                </p>
              </CardContent>
            </Card>

            {/* Fragebogen-Daten */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-neutral-950">
                  Fragebogen-Daten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Die Angaben, die Sie in unserem Fahrzeugpflege-Fragebogen
                  machen, werden ausschließlich zur Erstellung Ihrer
                  personalisierten Produktempfehlungen verwendet. Diese Daten
                  werden verschlüsselt übertragen und sicher gespeichert.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-600 text-sm">
                    <strong>Zweck:</strong> Erstellung personalisierter
                    Produktempfehlungen
                    <br />
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
                    (Einwilligung)
                    <br />
                    <strong>Speicherdauer:</strong> Bis zum Widerruf Ihrer
                    Einwilligung
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <LockClosedIcon className="w-6 h-6 mr-3" />
                  Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Diese Website verwendet Cookies. Cookies richten auf Ihrem
                  Rechner keinen Schaden an und enthalten keine Viren. Cookies
                  dienen dazu, unser Angebot nutzerfreundlicher, effektiver und
                  sicherer zu machen.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Notwendige Cookies
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Für die grundlegende Funktionalität der Website
                      erforderlich.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-950 mb-2">
                      Analyse-Cookies
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Helfen uns, die Nutzung der Website zu verstehen und zu
                      verbessern.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ihre Rechte */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <ShieldCheckIcon className="w-6 h-6 mr-3" />
                  Ihre Rechte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Sie haben jederzeit das Recht:
                </p>
                <ul className="text-slate-600 space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Auskunft</strong> über Ihre gespeicherten
                    personenbezogenen Daten und deren Verarbeitung zu erhalten
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Berichtigung</strong> unrichtiger personenbezogener
                    Daten zu verlangen
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Löschung</strong> Ihrer gespeicherten
                    personenbezogenen Daten zu fordern
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Einschränkung</strong> der Datenverarbeitung zu
                    verlangen
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Widerspruch</strong> gegen die Verarbeitung
                    einzulegen
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <strong>Datenübertragbarkeit</strong> zu verlangen
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Widerspruch */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <ExclamationTriangleIcon className="w-6 h-6 mr-3" />
                  Widerspruch gegen Werbe-E-Mails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 leading-relaxed">
                  Der Nutzung von im Rahmen der Impressumspflicht
                  veröffentlichten Kontaktdaten zur Übersendung von nicht
                  ausdrücklich angeforderter Werbung und Informationsmaterialien
                  wird hiermit widersprochen. Die Betreiber der Seiten behalten
                  sich ausdrücklich rechtliche Schritte im Falle der
                  unverlangten Zusendung von Werbeinformationen vor.
                </p>
              </CardContent>
            </Card>

            {/* Stand */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                Stand dieser Datenschutzerklärung: August 2025
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
