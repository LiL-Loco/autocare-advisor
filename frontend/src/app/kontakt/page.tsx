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
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function KontaktPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
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
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              Kontakt
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">Kontakt</h1>
          <p className="text-xl text-slate-300">
            Wir sind für dich da - sprich uns gerne an!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">
                  Kontaktinformationen
                </h2>
                <div className="space-y-6">
                  {/* Address */}
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-neutral-950">
                        <MapPinIcon className="w-6 h-6 mr-3" />
                        Adresse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-slate-600">
                        <p className="font-semibold text-neutral-950">
                          CLEANtastic GmbH
                        </p>
                        <p>Musterstraße 123</p>
                        <p>12345 Berlin</p>
                        <p>Deutschland</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phone */}
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-neutral-950">
                        <PhoneIcon className="w-6 h-6 mr-3" />
                        Telefon
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="font-medium text-slate-600 w-20">
                            Zentrale:
                          </span>
                          <a
                            href="tel:+4903012345678"
                            className="text-neutral-950 hover:text-slate-600"
                          >
                            +49 (0) 30 12345678
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-slate-600 w-20">
                            Support:
                          </span>
                          <a
                            href="tel:+4903012345679"
                            className="text-neutral-950 hover:text-slate-600"
                          >
                            +49 (0) 30 12345679
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-neutral-950">
                        <EnvelopeIcon className="w-6 h-6 mr-3" />
                        E-Mail
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="font-medium text-slate-600 w-20">
                            Allgemein:
                          </span>
                          <a
                            href="mailto:info@cleantastic.de"
                            className="text-neutral-950 hover:text-slate-600"
                          >
                            info@cleantastic.de
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-slate-600 w-20">
                            Support:
                          </span>
                          <a
                            href="mailto:support@cleantastic.de"
                            className="text-neutral-950 hover:text-slate-600"
                          >
                            support@cleantastic.de
                          </a>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-slate-600 w-20">
                            Vertrieb:
                          </span>
                          <a
                            href="mailto:sales@cleantastic.de"
                            className="text-neutral-950 hover:text-slate-600"
                          >
                            sales@cleantastic.de
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Office Hours */}
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-neutral-950">
                        <ClockIcon className="w-6 h-6 mr-3" />
                        Öffnungszeiten
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            Montag - Freitag:
                          </span>
                          <span className="text-neutral-950 font-medium">
                            09:00 - 18:00
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Samstag:</span>
                          <span className="text-neutral-950 font-medium">
                            10:00 - 16:00
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sonntag:</span>
                          <span className="text-neutral-950 font-medium">
                            Geschlossen
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                        <p className="text-slate-600 text-sm">
                          <strong>Support-Hotline:</strong> Montag - Freitag
                          08:00 - 20:00 Uhr
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 mb-6">
                  Schreib uns
                </h2>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-neutral-950">
                      <PaperAirplaneIcon className="w-6 h-6 mr-3" />
                      Kontaktformular
                    </CardTitle>
                    <CardDescription>
                      Hast du Fragen oder benötigst du Unterstützung? Wir helfen
                      dir gerne weiter!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border-slate-200"
                            placeholder="Dein vollständiger Name"
                          />
                        </div>
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
                            placeholder="ihre@email.de"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefonnummer (optional)</Label>
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

                      <div className="space-y-2">
                        <Label htmlFor="subject">Betreff *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="border-slate-200"
                          placeholder="Worum geht es?"
                        />
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
                          placeholder="Beschreibe dein Anliegen..."
                        />
                      </div>

                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="privacy"
                          required
                          className="mt-1"
                        />
                        <Label
                          htmlFor="privacy"
                          className="text-sm text-slate-600"
                        >
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
                        className="w-full bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950"
                      >
                        <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                        Nachricht senden
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* FAQ Hint */}
                <Card className="border-slate-200 bg-slate-50 mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-neutral-950 mb-2">
                          Häufige Fragen
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Viele Antworten findest du bereits in unserem
                          FAQ-Bereich. Bei technischen Problemen empfehlen wir
                          dir zunächst unsere Support-Dokumentation zu
                          konsultieren.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Additional Contact Options */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-neutral-950 mb-8 text-center">
              Weitere Kontaktmöglichkeiten
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-slate-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-950 mb-2">
                    Telefonischer Support
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Direkter Kontakt zu unserem Support-Team für technische
                    Fragen.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200"
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Anrufen
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-950 mb-2">
                    Live-Chat
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Sofortige Hilfe während unserer Geschäftszeiten.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Chat starten
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <EnvelopeIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-950 mb-2">
                    Newsletter
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Bleib über neue Produkte und Tipps informiert.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200"
                  >
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    Anmelden
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
