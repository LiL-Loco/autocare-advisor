import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <ExclamationTriangleIcon className="w-16 h-16 text-slate-400 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-neutral-950 mb-4">
          Produkt nicht gefunden
        </h1>

        <p className="text-slate-600 mb-8">
          Das gesuchte Produkt existiert nicht oder ist nicht verfügbar.
          Entdecken Sie andere Produkte in unserer Auswahl.
        </p>

        <div className="space-y-3">
          <Button
            asChild
            className="bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950 w-full"
          >
            <Link href="/marken">Zu den Marken</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-slate-300 hover:bg-slate-50"
          >
            <Link href="/">Zur Startseite</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
