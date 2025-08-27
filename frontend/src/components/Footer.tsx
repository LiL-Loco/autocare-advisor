'use client';

import {
  BuildingStorefrontIcon,
  CheckIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
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
      id: 'pflegeanleitungen',
      title: 'Pflegeanleitungen',
      icon: DocumentTextIcon,
      items: [
        {
          name: 'Autowäsche',
          action: () => router.push('/anleitungen/autowasche'),
        },
        {
          name: 'Lackpolitur',
          action: () => router.push('/anleitungen/lackpolitur'),
        },
        {
          name: 'Innenreinigung',
          action: () => router.push('/anleitungen/innenreinigung'),
        },
        {
          name: 'Felgenpflege',
          action: () => router.push('/anleitungen/felgenpflege'),
        },
      ],
    },
    {
      id: 'partnershops',
      title: 'Partner Shops',
      icon: BuildingStorefrontIcon,
      items: [
        {
          name: 'Amazon.de',
          action: () => window.open('https://amazon.de', '_blank'),
        },
        {
          name: 'A.T.U',
          action: () => window.open('https://atu.de', '_blank'),
        },
        {
          name: 'Autodoc',
          action: () => window.open('https://autodoc.de', '_blank'),
        },
        {
          name: 'Conrad',
          action: () => window.open('https://conrad.de', '_blank'),
        },
      ],
    },
    {
      id: 'marken',
      title: 'Marken',
      icon: ShieldCheckIcon,
      items: [
        { name: "Meguiar's", action: () => router.push('/marken/meguiars') },
        {
          name: 'Chemical Guys',
          action: () => router.push('/marken/chemical-guys'),
        },
        { name: 'SONAX', action: () => router.push('/marken/sonax') },
        { name: 'Turtle Wax', action: () => router.push('/marken/turtle-wax') },
      ],
    },
  ];

  return (
    <footer className="bg-neutral-950 text-white py-8 sm:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Mobile Accordion Layout */}
        <div className="block md:hidden space-y-1">
          <div className="mb-8 space-y-4">
            <div className="flex items-center">
              <h4 className="text-xl font-bold">CLEANtastic</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
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
                  <ul className="space-y-3 pl-7">
                    {section.items.map((item, index) => (
                      <li
                        key={index}
                        onClick={item.action}
                        className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors flex items-center"
                      >
                        <CheckIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:flex gap-8 mb-12 items-start">
          <div className="w-1/4 space-y-4">
            <div className="flex items-center">
              <h4 className="text-xl font-bold">CLEANtastic</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Deutschlands führende Plattform für personalisierte
              Autopflege-Beratung. Von Experten entwickelt.
            </p>
          </div>

          {footerSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="w-1/4 space-y-4 min-w-0">
                <h5 className="text-lg font-semibold flex items-center min-h-[28px]">
                  <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{section.title}</span>
                </h5>
                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li
                      key={index}
                      onClick={item.action}
                      className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors flex items-center min-h-[20px]"
                    >
                      <CheckIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-neutral-900 pt-8 mt-8">
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
