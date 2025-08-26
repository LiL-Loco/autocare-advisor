import { Badge } from '@/components/ui/badge';
import BubbleAnimation from '@/components/ui/bubble-animation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden relative">
      {/* Bubble Animation Background */}
      <BubbleAnimation bubbleCount={20} />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <Card className="max-w-2xl w-full shadow-2xl border-slate-700 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            {/* 404 mit automotive Style */}
            <div className="mb-8">
              <div className="relative">
                <h1 className="text-8xl lg:text-9xl font-bold text-neutral-950 mb-2">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-16 h-16 text-[#f8de00] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <Badge
                variant="secondary"
                className="mb-4 bg-[#f8de00] text-neutral-950 border-[#f8de00]"
              >
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                Seite nicht gefunden
              </Badge>

              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-950 mb-4">
                Diese Seite existiert nicht
              </h2>
              <p className="text-lg text-slate-600 mb-2">
                Die angeforderte Seite konnte nicht gefunden werden.
              </p>
              <p className="text-slate-500">
                Sie wurde möglicherweise verschoben, gelöscht oder die URL ist
                falsch.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 px-8 py-3 text-lg h-auto"
                >
                  <Link href="/">
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Zur Startseite
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950 font-semibold px-8 py-3 text-lg h-auto group"
                >
                  <Link href="/start-questionnaire">
                    <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                    Fahrzeug analysieren
                  </Link>
                </Button>
              </div>

              {/* Support Info */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center text-slate-500 text-sm mb-2">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  <span>Brauchst du Hilfe?</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Kontaktiere unser Support-Team für weitere Unterstützung.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
