'use client';

import {
  BuildingStorefrontIcon,
  CheckIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-neutral-950 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <h4 className="text-xl font-bold">CLEANtastic</h4>
            </div>
            <p className="text-slate-400 mb-4">
              Deutschlands führende Plattform für personalisierte
              Autopflege-Beratung. Von Experten entwickelt.
            </p>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-4 flex items-center">
              <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
              Problembereiche
            </h5>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Lackpflege & Politur
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Innenraum & Leder
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Felgen & Reifen
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Glas & Scheiben
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-4 flex items-center">
              <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
              Partner Shops
            </h5>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Amazon.de
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                A.T.U
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Autodoc
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Conrad
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-bold mb-4 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Marken
            </h5>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Meguiar's
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Chemical Guys
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                SONAX
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center">
                <CheckIcon className="w-3 h-3 mr-2" />
                Turtle Wax
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; 2025 CLEANtastic. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 text-slate-400 text-sm">
              <button
                onClick={() => router.push('/impressum')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Impressum
              </button>
              <button
                onClick={() => router.push('/datenschutz')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Datenschutz
              </button>
              <button
                onClick={() => router.push('/agb')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                AGB
              </button>
              <button
                onClick={() => router.push('/kontakt')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Kontakt
              </button>
              <button
                onClick={() => router.push('/partner-werden')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Partner werden
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
