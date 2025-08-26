'use client';

import {
  BuildingStorefrontIcon,
  CheckIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Footer() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const footerSections = [
    {
      id: 'problembereiche',
      title: 'Problembereiche',
      icon: WrenchScrewdriverIcon,
      items: [
        'Lackpflege & Politur',
        'Innenraum & Leder',
        'Felgen & Reifen',
        'Glas & Scheiben',
      ],
    },
    {
      id: 'partnershops',
      title: 'Partner Shops',
      icon: BuildingStorefrontIcon,
      items: ['Amazon.de', 'A.T.U', 'Autodoc', 'Conrad'],
    },
    {
      id: 'marken',
      title: 'Marken',
      icon: ShieldCheckIcon,
      items: ["Meguiar's", 'Chemical Guys', 'SONAX', 'Turtle Wax'],
    },
  ];

  return (
    <footer className="bg-neutral-950 text-white py-8 sm:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Mobile Accordion Layout */}
        <div className="block md:hidden mb-8">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h4 className="text-xl font-bold">CLEANtastic</h4>
            </div>
            <p className="text-slate-400 text-sm">
              Deutschlands führende Plattform für personalisierte
              Autopflege-Beratung. Von Experten entwickelt.
            </p>
          </div>

          {footerSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections[section.id];

            return (
              <div key={section.id} className="border-b border-neutral-800">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full py-4 flex items-center justify-between text-left hover:text-slate-300 transition-colors"
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-48 pb-4' : 'max-h-0'
                  }`}
                >
                  <ul className="space-y-2 pl-7">
                    {section.items.map((item, index) => (
                      <li
                        key={index}
                        className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors flex items-center"
                      >
                        <CheckIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-12">
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

        <div className="border-t border-neutral-900 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; 2025 CLEANtastic. Alle Rechte vorbehalten.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-slate-400 text-sm">
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
