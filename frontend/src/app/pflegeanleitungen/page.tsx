'use client';

import Footer from '@/components/Footer';
import {
  Brush2Icon,
  BucketIcon,
  DetergentIcon,
  FoamIcon,
  GloveIcon,
  HighPressureIcon,
  HoseIcon,
  OilIcon,
  PolisherIcon,
  ShowerIcon,
  SoapIcon,
  VacuumCleanerIcon,
} from '@/components/icons';
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
  BookOpenIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Guide {
  id: string;
  title: string;
  description: string;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Profi';
  duration: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  content: {
    introduction: string;
    sections?: {
      title: string;
      content: string;
    }[];
    materials: string[];
    steps: {
      title: string;
      description: string;
      tips?: string[];
    }[];
    tips: string[];
    maintenance: string[];
  };
}

const guides: Guide[] = [
  {
    id: 'kunststoffpflege',
    title: 'Kunststoffpflege',
    description: 'Stoßstangen: Von grau zu schwarz',
    difficulty: 'Fortgeschritten',
    duration: '1-2 Stunden',
    category: 'Außenpflege',
    icon: DetergentIcon,
    content: {
      introduction:
        'Hey, kennst du das auch? Dein Auto sieht eigentlich top aus, aber die schwarzen Kunststoffteile sehen aus wie... nun ja, grau und ungepflegt? Das muss nicht sein! Ich zeige dir heute, wie du deine Stoßstangen und Zierleisten wieder in tiefes Schwarz tauchst.',
      sections: [
        {
          title: 'Warum werden Kunststoffteile überhaupt grau?',
          content:
            'Bevor wir loslegen, lass mich kurz erklären, was da passiert. Deine Kunststoffteile sind echte Kämpfer - sie halten UV-Strahlung, Regen, Schnee und sogar Streusalz aus. Aber irgendwann geben auch sie auf. Die UV-Strahlung zersetzt die oberste Schicht, und schon hast du diese unschöne graue Patina.',
        },
      ],
      materials: [
        'Kunststoffreiniger',
        'Kunststoffpflege oder -auffrischer',
        'Verschiedene Detailbürsten',
        'Mikrofasertücher',
        'Applikatorschwämme',
      ],
      steps: [
        {
          title: 'Mach eine Bestandsaufnahme',
          description:
            'Schau dir deine Kunststoffteile genau an. Sind sie nur leicht vergraut oder schon richtig "ergraut"? Davon hängt ab, wie intensiv du arbeiten musst.',
        },
        {
          title: 'Erst mal sauber machen',
          description:
            'Wasch die Teile mit normalem Autoshampoo ab. Du willst ja nicht den Dreck in den Kunststoff einarbeiten.',
        },
        {
          title: "Jetzt wird's ernst: Tiefenreinigung",
          description:
            'Sprüh den Kunststoffreiniger auf und lass ihn 3-5 Minuten wirken. Bei diesen strukturierten Stoßstangen nimm eine weiche Bürste - die kleinen Rillen sammeln nämlich gerne Dreck.',
        },
        {
          title: 'Ein bisschen Muskelkraft',
          description:
            'Bei stark vergrauten Stellen darfst du ruhig mit der Bürste kreiseln. Aber sanft! Du willst den Kunststoff pflegen, nicht malträtieren.',
        },
        {
          title: 'Gründlich abspülen',
          description:
            "Wirklich ALLE Reinigungsreste müssen weg. Sonst sieht's nachher fleckig aus.",
        },
        {
          title: 'Die Pflege',
          description:
            'Jetzt kommt der schönste Teil: Trag die Kunststoffpflege mit dem Schwamm dünn und gleichmäßig auf. Weniger ist mehr!',
        },
        {
          title: 'Das Finish',
          description:
            'Nach dem Einziehen noch mal mit einem sauberen Mikrofasertuch drüber - dann hast du einen gleichmäßigen, satten Look.',
        },
      ],
      tips: [
        'Wenn deine Teile richtig hinüber sind, gönn ihnen einen Kunststoffauffrischer. Der hat leicht abrasive Eigenschaften und holt selbst hoffnungslose Fälle zurück ins Leben.',
        'Mach das alle 4-6 Wochen, und du wirst nie wieder graue Stoßstangen haben. Versprochen!',
      ],
      maintenance: [
        'Alle 4-6 Wochen wiederholen',
        'Nach jeder Wäsche kurz kontrollieren',
        'Bei ersten Anzeichen sofort behandeln',
      ],
    },
  },
  {
    id: 'chromteile-polieren',
    title: 'Chromteile polieren',
    description: 'Spiegelglanz wie vom Profi',
    difficulty: 'Fortgeschritten',
    duration: '1-1.5 Stunden',
    category: 'Außenpflege',
    icon: PolisherIcon,
    content: {
      introduction:
        'Du hast Chrome an deinem Auto? Glückwunsch! Aber gleichzeitig auch mein Mitgefühl - denn Chrome ist wunderschön, aber auch zickig wie eine Diva. Heute zeige ich dir, wie du deine Chromteile zum Strahlen bringst, ohne sie zu ruinieren.',
      sections: [
        {
          title: 'Erst mal checken: Ist es überhaupt echtes Chrom?',
          content:
            'Hier ein simpler Trick: Halt einen Magneten dran. Haftet er nicht, hast du echtes Chrom. Haftet er, ist es verchromter Stahl. Das ist wichtig für die Behandlung!',
        },
        {
          title: 'Die typischen Chrome-Probleme:',
          content:
            '- Rostflecken (ärgerlich!)\n- Kalkablagerungen (sieht aus wie Milchglas)\n- Kleine Kratzer (entstehen schneller als du denkst)\n- Oxidation (wird einfach matt und stumpf)',
        },
      ],
      materials: [
        'Chromreiniger',
        'Chrompolitur (leicht abrasiv)',
        'Chromversiegelung',
        'Sehr weiche Mikrofasertücher',
        'Polierwatte',
      ],
      steps: [
        {
          title: 'Materialcheck',
          description:
            'Magnet-Test machen! Dann weißt du, womit du es zu tun hast.',
        },
        {
          title: 'Grundreinigung',
          description:
            'Wasch das Chrome gründlich mit pH-neutralem Shampoo. Trocken das ganze komplett ab - Wassertropfen sind Chroms größter Feind.',
        },
        {
          title: 'Problemzonen angehen',
          description:
            '- Rostflecken? Spezieller Rostentferner für Chrome verwenden\n- Kalk? Essigwasser (1:1 mischen) auftragen und einwirken lassen\n- Kratzer? Feine Chrompolitur mit weichem Tuch einarbeiten',
        },
        {
          title: 'Der Chromreiniger',
          description:
            'Trag ihn auf ein weiches Tuch auf (nie direkt aufs Chrome!) und polier in geraden Bewegungen. Arbeite immer nur kleine Bereiche.',
        },
        {
          title: 'Politur für den Hochglanz',
          description:
            'Wenn dein Chrome matt geworden ist, brauchst du Chrompolitur. Dünn auftragen, kreisend einarbeiten - und Geduld haben!',
        },
        {
          title: 'Versiegeln nicht vergessen',
          description:
            'Die Chromversiegelung ist wie eine unsichtbare Schutzschicht. Sie macht die nächste Reinigung viel einfacher.',
        },
        {
          title: 'Das große Finale',
          description:
            'Mit einem fusselfreien Tuch nachpolieren, bis alles spiegelt.',
        },
      ],
      tips: [
        'Niemals bei praller Sonne arbeiten',
        'Chrome hasst Salz - im Winter öfter reinigen',
        'Einmal im Jahr die Versiegelung erneuern',
        "Chrome ist Arbeit, aber wenn's glänzt, sieht dein Auto aus wie aus der Luxus-Klasse!",
      ],
      maintenance: [
        'Wöchentlich mit klarem Wasser abspülen',
        'Monatlich polieren bei starker Beanspruchung',
        'Salzwasser sofort entfernen (besonders im Winter)',
      ],
    },
  },
  {
    id: 'cabrioverdeck-impraegnieren',
    title: 'Cabrioverdeck imprägnieren',
    description: 'Dein Schutzschild gegen Wind und Wetter',
    difficulty: 'Profi',
    duration: '2-3 Stunden',
    category: 'Außenpflege',
    icon: ShowerIcon,
    content: {
      introduction:
        'Hast du ein Cabrio? Dann kennst du das Problem: Das Verdeck ist ständig Wind und Wetter ausgesetzt. Eine gute Imprägnierung kann hier wahre Wunder wirken - und das Leben deines Verdecks um Jahre verlängern.',
      sections: [
        {
          title: 'Warum ist Imprägnierung so wichtig?',
          content:
            "Stell dir vor, dein Verdeck wäre wie eine Jacke, die du nie imprägnierst. Nach dem ersten Regenschauer wärst du klatschnass. Genauso geht's deinem Verdeck - ohne Schutz dringt Wasser ein, es können Stockflecken entstehen, und irgendwann ist das gute Stück hinüber.",
        },
        {
          title: 'Welche Imprägnierung passt zu dir?',
          content:
            '- Spray-Imprägnierung: Super einfach, aber musst du öfter machen\n- Einwasch-Imprägnierung: Wirkt tiefer, hält länger\n- Kombi-Produkte: Reinigen und imprägnieren in einem Rutsch',
        },
        {
          title: 'Der perfekte Zeitpunkt:',
          content:
            '- Nach gründlicher Reinigung (logisch, oder?)\n- Bei trockenem Wetter (mindestens 24h ohne Regen)\n- Temperatur zwischen 15-25°C\n- Einmal im Jahr oder nach 10.000 km',
        },
      ],
      materials: [
        'Verdeck-Imprägnierung',
        'Sprühflasche oder Schwamm',
        'Weiche Bürste',
        'Abdeckmaterial für Lack und Scheiben',
        'Mikrofasertücher',
      ],
      steps: [
        {
          title: 'Sauber muss es sein',
          description:
            'Dein Verdeck muss blitzsauber und knochentrocken sein. Mindestens 24 Stunden vor der Imprägnierung reinigen!',
        },
        {
          title: 'Drumherum schützen',
          description:
            'Deck alle Lack- und Glasflächen ab. Imprägnierung auf Lack ist echt hartnäckig und sieht scheiße aus.',
        },
        {
          title: 'Gleichmäßig auftragen',
          description:
            'Arbeite in überlappenden Bahnen. Vergiss die Nähte nicht - da sammelt sich gerne Wasser!',
        },
        {
          title: 'Einarbeiten',
          description:
            '- Bei Sprays: Gleichmäßig verteilen und einziehen lassen\n- Bei Einwasch-Produkten: Mit weicher Bürste in das Gewebe einarbeiten',
        },
        {
          title: 'Trocknungszeit einhalten',
          description:
            'Mindestens 4-6 Stunden, besser 24 Stunden. In der Zeit darf KEIN Wasser ans Verdeck!',
        },
        {
          title: 'Zweiter Durchgang',
          description:
            'Für optimalen Schutz nach dem Trocknen nochmal eine Schicht drauf.',
        },
        {
          title: 'Funktionstest',
          description:
            'Ein paar Wassertropfen aufs Verdeck - perlen sie ab? Dann hast du alles richtig gemacht!',
        },
      ],
      tips: [
        'Wasser perlt in großen Tropfen ab',
        'Gleichmäßiger Schutz ohne Flecken',
        'Die Verdeckmechanik läuft noch einwandfrei',
        'Die ersten 48 Stunden kein Wasser ans Verdeck! Danach nur schonend mit klarem Wasser reinigen.',
        "Eine gute Imprägnierung ist wie eine Lebensversicherung für dein Verdeck. Mach's regelmäßig, und du wirst lange Freude daran haben!",
      ],
      maintenance: [
        'Jährlich auffrischen oder alle 10.000km',
        'Nach Verdeckreinigung neu imprägnieren',
        'Kleine Schäden sofort reparieren und nachimprägnieren',
      ],
    },
  },
  {
    id: 'motorraumreinigung',
    title: 'Motorraum reinigen',
    description: 'Sauberkeit unter der Haube',
    difficulty: 'Profi',
    duration: '2-3 Stunden',
    category: 'Außenpflege',
    icon: HighPressureIcon,
    content: {
      introduction:
        'Du öffnest die Motorhaube und denkst dir: "Was ist das denn für ein Schlachtfeld?" Keine Sorge, das geht jedem so! Ein sauberer Motorraum ist nicht nur schön anzusehen, sondern hilft auch dabei, Probleme früh zu erkennen. Ich zeige dir, wie du deinen Motorraum reinigst, ohne dass danach nichts mehr funktioniert.',
      sections: [
        {
          title: 'Warum überhaupt den Motorraum reinigen?',
          content:
            'Ein sauberer Motorraum macht Wartungsarbeiten viel einfacher, verhindert Korrosion und - mal ehrlich - sieht einfach professionell aus. Außerdem kannst du Lecks und Verschleiß viel besser erkennen, wenn nicht alles unter einer Dreckschicht versteckt ist.',
        },
        {
          title: 'WICHTIG: Sicherheit geht vor!',
          content:
            '- Motor MUSS vollständig abgekühlt sein (mindestens 2 Stunden!)\n- Batterie abklemmen\n- Alles Elektronische wasserdicht abdecken\n- Niemals Hochdruck direkt auf Elektronik!',
        },
        {
          title: 'Diese Teile müssen geschützt werden:',
          content:
            '- Luftfilterkasten\n- Sicherungskasten\n- Zündspulen\n- Steuergeräte\n- Batterie',
        },
      ],
      materials: [
        'Motorraumreiniger (entfettend)',
        'Verschiedene Bürsten',
        'Hochdruckreiniger mit einstellbarem Druck',
        'Viel Plastikfolie und Klebeband',
        'Mikrofasertücher',
        'Motorraumkonservierer',
      ],
      steps: [
        {
          title: 'Elektronik schützen',
          description:
            'Das ist der wichtigste Schritt! Pack alles Elektronische wasserdicht ein. Lieber einmal zu viel abgedeckt als hinterher einen Totalschaden.',
        },
        {
          title: 'Groben Dreck entfernen',
          description:
            'Laub, lose Verschmutzungen und größere Brocken einfach mit der Hand raussammeln.',
        },
        {
          title: 'Einweichen lassen',
          description:
            'Motorraumreiniger großzügig auftragen und 5-10 Minuten wirken lassen. Der Dreck soll sich schon mal lösen.',
        },
        {
          title: 'Bürsten, was das Zeug hält',
          description:
            '- Harte Bürste: Für stark verschmutzte Metallteile\n- Weiche Bürste: Für lackierte Sachen\n- Zahnbürste: Für die kleinen Ecken',
        },
        {
          title: 'Vorsichtig abspülen',
          description:
            'Mittlerer Wasserdruck, von oben nach unten arbeiten. Den Wasserstrahl NIE direkt auf Elektronik!',
        },
        {
          title: 'Hartnäckige Stellen',
          description:
            'Öl- und Fettflecken sind Zicken. Die brauchst du meist mehrmals, bis sie weg sind.',
        },
        {
          title: 'Trocknen lassen',
          description:
            'Entweder an der Luft oder mit Druckluft für die schwer erreichbaren Stellen.',
        },
        {
          title: 'Konservieren',
          description:
            'Motorraumkonservierer auf alle Metall- und Kunststoffteile. Das schützt vor neuem Dreck.',
        },
      ],
      tips: [
        'Alle Abdeckungen entfernen',
        'Batterie wieder anschließen',
        'Flüssigkeitsstände checken',
        'Kurze Probefahrt machen',
        '1-2 Mal im Jahr reicht völlig. Bei extremer Beanspruchung (Baustelle, Offroad) entsprechend öfter.',
        'Mach Fotos, bevor du anfängst! Falls du vergisst, wo welches Kabel hingehört, hast du eine Erinnerung.',
        'Ein sauberer Motorraum ist wie ein aufgeräumter Schreibtisch - man arbeitet einfach lieber damit!',
      ],
      maintenance: [
        '1-2 mal jährlich je nach Beanspruchung',
        'Nach Reparaturen oder Ölwechsel kontrollieren',
        'Bei Geländefahrten häufiger reinigen',
      ],
    },
  },
  {
    id: 'wintervorbereitung',
    title: 'Wintervorbereitung',
    description: 'So übersteht dein Auto die kalte Jahreszeit',
    difficulty: 'Fortgeschritten',
    duration: '3-4 Stunden',
    category: 'Sicherheit',
    icon: GloveIcon,
    content: {
      introduction:
        'Der Winter kommt - und mit ihm Streusalz, Matsch und Minusgrade. Zeit, dein Auto winterfest zu machen! Ich zeige dir, wie du mit der richtigen Vorbereitung entspannt durch die kalte Jahreszeit kommst.',
      sections: [
        {
          title: 'Was der Winter deinem Auto antut:',
          content:
            'Streusalz ist wie Säure für dein Auto. Feuchtigkeit kriecht überall rein. Türdichtungen frieren fest. Und der ganze Schneematsch macht dein Auto zur rollenden Dreckschleuder. Aber keine Panik - mit der richtigen Vorbereitung packst du das!',
        },
      ],
      materials: [
        'Hartwachs oder Lackversiegelung',
        'Unterbodenschutz',
        'Gummipflege für Dichtungen',
        'Frostschutzmittel für die Scheibenwaschanlage',
        'Silikonspray',
        'Antifog-Behandlung für Innenscheiben',
      ],
      steps: [
        {
          title: 'Intensive Lackreinigung',
          description:
            'Weg mit allem, was der Sommer hinterlassen hat: Insekten, Baumharz, Teer - alles muss runter, bevor der Winter kommt.',
        },
        {
          title: 'Lackschutz auffrischen',
          description:
            'Eine ordentliche Lackversiegelung oder hochwertiges Hartwachs ist deine erste Verteidigungslinie gegen das Salz.',
        },
        {
          title: 'Unterboden checken',
          description:
            'Schau dir den Unterbodenschutz genau an. Kleine Beschädigungen jetzt reparieren - im Frühling sind sie sonst zu Rostlöchern geworden.',
        },
        {
          title: 'Gummidichtungen verwöhnen',
          description:
            'Alle Türdichtungen gründlich reinigen und mit Gummipflege behandeln. Das verhindert, dass sie anfrieren oder rissig werden.',
        },
        {
          title: 'Innenraum winterfest machen',
          description:
            '- Stoffteppiche gegen wasserdichte Gummimatten tauschen\n- Entfeuchtungsgranulat auslegen (gegen beschlagene Scheiben)\n- Innenscheiben mit Antifog-Mittel behandeln',
        },
        {
          title: 'Scheiben optimal vorbereiten',
          description:
            'Scheibenversiegelung drauf - dann geht das Eiskratzen viel leichter. Und vergiss nicht: Frostschutzmittel in die Waschanlage!',
        },
        {
          title: 'Mechanik winterfit machen',
          description:
            '- Türschlösser mit Graphitspray behandeln\n- Handbremse auf Gängigkeit prüfen\n- Wischerblätter checken',
        },
      ],
      tips: [
        "Wöchentliche Salzentfernung: Das Salz muss runter! Einmal die Woche Unterbodenwäsche - dein Auto wird's dir danken.",
        "Nach jeder Wäsche trocknen: Feuchtigkeit ist im Winter dein Feind. Nach der Wäsche alles gut trocknen, sonst friert's fest.",
        'Türgriffe: Ein bisschen Vaseline drauf, dann frieren sie nicht fest',
        'Scheibenwischer: Hochklappen beim Parken - sonst kleben sie fest',
        'Enteiser: Immer eine Dose im Auto haben (nicht im Haus!)',
        'Nach dem Winter: Im Frühling ist eine intensive Salzentfernung Pflicht. Das Salz arbeitet auch im Sommer weiter, wenn du es nicht entfernst.',
        'Die Wintervorbereitung ist wie eine Versicherung - du merkst erst, wie wichtig sie war, wenn du sie brauchst. Also leg los, bevor der erste Frost kommt!',
      ],
      maintenance: [
        'Alle 1-2 Wochen Salzreste abspülen',
        'Nach Tauwetter: Unterbodenwäsche',
        'Bei Steinschlägen: Sofort reparieren (Rostschutz)',
        'Frühjahr: Intensive Nachbehandlung aller Winter-Schäden',
      ],
    },
  },
  {
    id: 'kratzer-reparatur',
    title: 'Kratzer im Lack',
    description: 'Selbst reparieren oder doch zum Profi?',
    difficulty: 'Fortgeschritten',
    duration: '1-3 Stunden',
    category: 'Außenpflege',
    icon: PolisherIcon,
    content: {
      introduction:
        'Du stehst vor deinem Auto und entdeckst einen Kratzer. Panik? Verständlich! Aber bevor du in die nächste Werkstatt rennst und dein Portemonnaie leerst, lass uns mal schauen, was du selbst machen kannst.',
      sections: [
        {
          title: 'Der Fingernagel-Test: Dein bester Freund',
          content:
            "Hier der einfachste Test überhaupt: Fahr mit dem Fingernagel über den Kratzer. Bleibt er nicht hängen? Dann ist es nur im Klarlack - easy zu reparieren! Hakt er ein? Dann geht's tiefer, aber auch das ist oft noch machbar.",
        },
        {
          title: 'Die Kratzer-Typen verstehen:',
          content:
            'Haarlinien-Kratzer (die Swirl-Marks):\n- Entstehen durch falsche Waschtechnik\n- Nur im Klarlack sichtbar\n- Mit normaler Politur wegzubekommen\n\nOberflächliche Kratzer:\n- Nur im Klarlack, aber tiefer\n- Brauchen Polierpasten\n- Gute Chancen für DIY-Reparatur\n\nTiefe Kratzer:\n- Gehen bis zur Farbe\n- Lackstift und mehrstufige Reparatur nötig\n- Machbar, aber braucht Geduld\n\nBis aufs Blech:\n- Metall ist sichtbar\n- SOFORT behandeln (Rostgefahr!)\n- Meist ein Fall für den Profi',
        },
      ],
      materials: [
        'Verschiedene Polituren (grob bis fein)',
        'Lackstift in deiner Fahrzeugfarbe',
        'Feines Schleifpapier (2000er, 3000er)',
        'Applikator-Schwämme',
        'Mikrofasertücher',
        'Klarlack-Stift',
      ],
      steps: [
        {
          title: 'Saubere Ausgangslage',
          description:
            'Die Stelle muss blitzsauber sein. Silikonentferner oder Waschbenzin verwenden.',
        },
        {
          title: 'Bei tieferen Kratzern: anschleifen',
          description:
            'Mit 2000er Schleifpapier vorsichtig den Kratzer wegschleifen. Aber wirklich vorsichtig!',
        },
        {
          title: 'Stufenweise polieren',
          description:
            '- Grobpolitur: Schleifspuren weg\n- Mittelpolitur: Oberfläche verfeinern\n- Feinpolitur: Glanz zurückholen',
        },
        {
          title: 'Bei tiefen Kratzern: Lackstift',
          description:
            'Dünn auftragen, jede Schicht trocknen lassen. Lieber mehrere dünne als eine dicke Schicht!',
        },
        {
          title: 'Nivellierung',
          description:
            'Nach dem Trocknen mit feinstem Schleifpapier (3000er) plan schleifen.',
        },
        {
          title: 'Klarlack drauf',
          description: 'Mit Klarlack-Stift oder -Spray versiegeln.',
        },
      ],
      tips: [
        'Wann solltest du zum Profi? Kratzer länger als 10 cm, mehrere Lackschichten betroffen, Grundierung oder Rost sichtbar, Metallic- oder Perlmuttlack (schwierige Farbabstimmung)',
        'Die Kosten-Nutzen-Rechnung: DIY: 20-50 Euro Materialkosten, Werkstatt: 150-800 Euro je nach Umfang, Smart-Repair: 80-200 Euro für kleine Schäden',
        'Zur Vorbeugung: Abstand halten beim Parken, nicht unter Bäumen parken, regelmäßig wachsen (schützt vor kleinen Kratzern), vorsichtig waschen und trocknen',
        "Kratzer sind ärgerlich, aber oft kein Weltuntergang. Probier's erst mal selbst - du wirst überrascht sein, was möglich ist!",
      ],
      maintenance: [
        'Kleine Kratzer sofort behandeln (Rostschutz)',
        'Regelmäßiges Wachsen als Prävention',
        'Bei Unsicherheit: Erstberatung beim Lackierer (oft kostenlos)',
      ],
    },
  },
  {
    id: 'oldtimer-pflege',
    title: 'Oldtimer-Pflege',
    description: 'So behandelst du automobile Schätze richtig',
    difficulty: 'Profi',
    duration: '4-6 Stunden',
    category: 'Außenpflege',
    icon: OilIcon,
    content: {
      introduction:
        'Du hast einen Oldtimer? Respekt! Aber gleichzeitig auch eine große Verantwortung. Diese automobilen Schätze brauchen besondere Aufmerksamkeit. Ich zeige dir, wie du deinen Klassiker richtig pflegst, ohne ihm zu schaden.',
      sections: [
        {
          title: 'Warum Oldtimer anders sind:',
          content:
            'Dein Oldtimer kommt aus einer Zeit, als Lacke anders waren, Materialien andere Eigenschaften hatten und "Kunststoff" noch ein Fremdwort war. Was bei modernen Autos funktioniert, kann bei Klassikern Schäden verursachen.',
        },
        {
          title: 'Die besonderen Herausforderungen:',
          content:
            'Lack-Technologien von damals:\n- Acryllacke (1960er-80er): Reagieren empfindlich auf moderne Polituren\n- Zelluloselacke (bis 1960er): Super weich und leicht beschädigbar\n- Einbrennlacke: Härter, aber oft mit wertvoller Patina\n\nHistorische Materialien:\n- Echtes Chrom (korrosionsanfällig wie Sau)\n- Bakelite-Kunststoffe (werden spröde)\n- Mohair-Verdecke (empfindlich wie Seide)\n- Unbehandelte Metallteile',
        },
        {
          title: 'Die Oldtimer-Philosophie: Weniger ist mehr',
          content:
            'Das wichtigste Prinzip: Nicht jeder "Makel" muss weg! Originale Patina kann wertvoller sein als eine Restaurierung. Im Zweifel: Finger weg und Zustand erhalten!',
        },
      ],
      materials: [
        'pH-neutrale Shampoos',
        'Wachse OHNE Schleifmittel',
        'Spezielle Oldtimer-Polituren',
        'Lösungsmittelfreie Reiniger',
        'Gutes altes Carnaubawachs',
      ],
      steps: [
        {
          title: 'Alles dokumentieren',
          description:
            'Mach Fotos von allem, bevor du anfängst. Das hilft bei Bewertungen und Versicherungsfragen.',
        },
        {
          title: 'Sanfte Vorreinigung',
          description:
            'Viel Wasser, wenig Chemie. Die sanftesten Materialien verwenden, die du finden kannst.',
        },
        {
          title: 'Immer erst testen',
          description:
            'ALLE Produkte zuerst an versteckten Stellen testen. Historische Lacke können unberechenbar reagieren.',
        },
        {
          title: 'Kleine Bereiche',
          description:
            'Arbeite immer nur kleine Flächen und kontrolliere ständig das Ergebnis.',
        },
        {
          title: 'Traditionelle Versiegelung',
          description:
            'Carnaubawachs ist authentisch und entspricht der Zeit des Fahrzeugs.',
        },
      ],
      tips: [
        'Weißwandreifen: Spezialreiniger verwenden, niemals scheuern, regelmäßig pflegen verhindert Vergilbung',
        'Verchromte Stoßstangen: Oft dünnere Chromschicht als heute, vorsichtige Politur mit weichsten Tüchern, bei Korrosion: ab zum Profi',
        'Stoffverdecke: Historische Materialien sind empfindlicher, spezielle Textilreiniger für Oldtimer, atmungsaktive Imprägnierungen verwenden',
        'Professionelle Oldtimer-Pflege kann den Wert erheblich steigern. Dokumentiere alle Pflegemaßnahmen - das ist bares Geld bei späteren Bewertungen.',
        'Wann du die Finger weglassen solltest: Originallack-Schäden, Rost an sichtbaren Stellen, historische Polsterstoffe, defekte an Chromteilen',
        "Dein Oldtimer ist ein Stück Automobilgeschichte. Behandle ihn mit dem Respekt, den er verdient - zukünftige Generationen werden's dir danken!",
      ],
      maintenance: [
        'Trocken und temperatursicher lagern',
        'Regelmäßig lüften, auch unter der Abdeckung',
        'Batterie am Erhaltungsladegerät',
        'Ab und zu bewegen (Standschäden vermeiden)',
      ],
    },
  },
  {
    id: 'fleckenentfernung',
    title: 'Fleckenentfernung im Auto',
    description: 'Erste Hilfe für alle Oberflächen',
    difficulty: 'Fortgeschritten',
    duration: '30 Min - 2 Stunden',
    category: 'Innenpflege',
    icon: BucketIcon,
    content: {
      introduction:
        "Oh nein! Kaffee auf dem Sitz, Ketchup am Armaturenbrett, oder noch schlimmer - der Hund hatte einen schlechten Tag... Keine Panik! Mit der richtigen Sofortbehandlung bekommst du fast jeden Fleck weg. Ich zeige dir, wie's geht.",
      sections: [
        {
          title: 'Die goldenen Regeln der Fleckenentfernung:',
          content:
            'Die 30-Minuten-Regel: Je frischer der Fleck, desto einfacher wird\'s. Nach 30 Minuten fängt das Zeug an zu "fixieren" - dann wird\'s schwieriger.\n\nNiemals reiben! Immer tupfen, und zwar von außen nach innen. Reiben macht den Fleck nur größer und drückt ihn tiefer rein.\n\nJedes Material ist anders: Was bei Kunststoff funktioniert, kann Leder ruinieren. Immer materialspezifisch behandeln!',
        },
        {
          title: 'Die häufigsten Flecken und wie du sie bekämpfst:',
          content:
            'Getränkeflecken (Kaffee, Cola, Saft):\n- Sofort: Mit Küchenpapier aufsaugen\n- Verdünnen: Mit klarem Wasser von außen nach innen tupfen\n- Niemals heiß behandeln! Das fixiert Zucker und Proteine\n\nFettflecken (Pommes, Schokolade):\n- Mechanisch entfernen: Groben Schmutz vorsichtig abkratzen\n- Niemals Wasser! Das verteilt das Fett nur\n- Gallseife oder Fettlöser verwenden\n- Lauwarm nachspülen\n\nBlutflecken:\n- Nur kaltes Wasser! Warmes lässt das Eiweiß gerinnen\n- Salzwasser hilft bei der Auflösung\n- Notfall: Wasserstoffperoxid, aber sofort ausspülen!\n\nKaugummi:\n- Mit Eis aushärten\n- Vorsichtig abkratzen\n- Reste mit Kältespray\n- Ölige Rückstände mit Benzin',
        },
      ],
      materials: [
        'Polsterreiniger',
        'Weiche Bürste',
        'Mikrofasertücher',
        'Gallseife',
        'Nasssauger (falls vorhanden)',
        'Universalreiniger',
      ],
      steps: [
        {
          title: 'Groben Schmutz weg',
          description:
            'Mechanisch entfernen was geht, bevor du mit der Flüssigbehandlung anfängst.',
        },
        {
          title: 'Polsterreiniger einsprühen',
          description:
            'Polsterreiniger einsprühen, einwirken lassen - die Chemie soll arbeiten.',
        },
        {
          title: 'Mit weicher Bürste einarbeiten',
          description:
            'Sanft in kreisenden Bewegungen die Verschmutzung lösen.',
        },
        {
          title: 'Mit sauberem Wasser nachspülen',
          description:
            'Alle Reinigungsreste müssen raus, sonst ziehen sie neuen Dreck an.',
        },
        {
          title: 'Feuchtigkeit absaugen',
          description:
            'Mit Nasssauger oder Mikrofasertüchern so viel Feuchtigkeit wie möglich entfernen.',
        },
        {
          title: 'An der Luft trocknen lassen',
          description:
            'Nie föhnen! Das kann das Material beschädigen. Geduld ist hier alles.',
        },
      ],
      tips: [
        'Dein Notfall-Set fürs Auto: Küchenpapier, Sprühflasche mit klarem Wasser, Universalreiniger, Mikrofasertücher, Gallseife, Eisspray',
        'Hartnäckige Fälle - Profi-Tricks: Mehrfach-Behandlung - gib nicht nach dem ersten Versuch auf! Lass zwischen den Durchgängen komplett trocknen.',
        'Enzyme bei organischen Flecken: Schweiß, Körperflüssigkeiten und ähnliches knacken Enzyme am besten.',
        'Wann solltest du kapitulieren? Großflächige Verschmutzungen, Fleck ist schon tief in den Polsterschaum eingedrungen, Material hat sich verfärbt, die Struktur ist beschädigt',
        'Schnell sein ist alles! Ein frischer Fleck ist meist in 5 Minuten weg. Ein alter kann dich stundenlang beschäftigen - und trotzdem bleiben.',
      ],
      maintenance: [
        'Sofortbehandlung bei jedem Fleck',
        'Regelmäßige Grundreinigung verhindert hartnäckige Verschmutzungen',
        'Imprägnierung der Textilien erneuern',
      ],
    },
  },
  {
    id: 'geruchsentfernung',
    title: 'Gerüche im Auto loswerden',
    description: 'Frische Luft für den Innenraum',
    difficulty: 'Fortgeschritten',
    duration: '2-4 Stunden',
    category: 'Innenpflege',
    icon: FoamIcon,
    content: {
      introduction:
        'Steigst du in dein Auto und denkst: "Uff, was riecht hier so?" Das muss nicht sein! Egal ob Zigarettenrauch, Tiergerüche oder mysteriöse Ausdünstungen - ich zeige dir, wie du deinen Innenraum wieder frisch bekommst.',
      sections: [
        {
          title: 'Erst mal Detektiv spielen:',
          content:
            'Bevor du loslegst, musst du die Quelle finden. Gerüche haben verschiedene Ursachen:\n\nOberflächliche Gerüche:\n- Verschüttete Getränke\n- Essensreste (auch die versteckten!)\n- Zigarettenrauch (oberflächlich)\n- Haustiere\n\nTiefliegende Gerüche:\n- Feuchtigkeit und Schimmel\n- Zigarettenrauch (tief eingedrungen)\n- Körperausdünstungen in Polstern\n- Chemische Ausdünstungen\n\nTechnische Probleme:\n- Defekte Klimaanlage\n- Verstopfte Ablaufschläuche\n- Undichtigkeiten\n- Feuchte Dämmstoffe',
        },
      ],
      materials: [
        'Nikotin-Entferner',
        'Enzymatische Reiniger',
        'Aktivkohle-Säckchen',
        'Polsterreiniger',
        'Schimmelentferner',
        'Ozongerät (professionell)',
      ],
      steps: [
        {
          title: 'Komplette Grundreinigung - Alles raus',
          description:
            'Wirklich ALLES! Auch die Fußmatten und alles, was sich abnehmen lässt. Gründlich saugen: Alle Ritzen und Spalten, Luftkanäle der Lüftung, unter den Sitzen (da liegt oft die Überraschung!), Kofferraum und Reserveradmulde.',
        },
        {
          title: 'Zigarettengeruch bekämpfen',
          description:
            'Oberflächenbehandlung: Alle harten Oberflächen mit Nikotin-Entferner, Scheiben von innen mehrfach reinigen (der Nikotin-Film ist zäh!), Luftkanäle mit Spezialreiniger durchspülen. Tiefenreinigung: Polster mit Polsterreiniger behandeln, Himmel vorsichtig reinigen.',
        },
        {
          title: 'Tiergerüche behandeln',
          description:
            'Alle Haare gründlich entfernen (Gummihandschuh hilft!), enzymatische Reiniger verwenden (bauen die Geruchsmoleküle ab), alle abnehmbaren Textilien waschen.',
        },
        {
          title: 'Schimmel und Feuchtegeruch',
          description:
            'Ursachen finden: Undichtigkeiten suchen, Klimaanlage prüfen lassen, Wassereinbrüche identifizieren. Bekämpfung: Komplett trocknen (am besten professionell), Schimmelentferner auf alle befallenen Stellen.',
        },
        {
          title: 'Neutralisierung',
          description:
            'Aktivkohle-Säckchen überall verteilen, bei hartnäckigen Fällen: professionelle Ozonbehandlung (nur vom Profi!), Kaffeebohnen als Notlösung.',
        },
      ],
      tips: [
        'DIY-Methoden die wirklich funktionieren: Kaffeebohnen (nicht gemahlen!), Aktivkohle in offenen Schälchen, Backpulver über Nacht einwirken lassen',
        "Was NICHT funktioniert: Duftbäume überdecken nur, Sprays machen's oft schlimmer, parfümierte Reiniger können kontraproduktiv sein",
        'Ozonbehandlung: Zerstört Geruchsmoleküle komplett, nur vom Profi machen lassen!, danach intensiv lüften, nicht bei Leder anwenden (wird spröde)',
        'Dampfreinigung: Hohe Temperaturen töten Bakterien, dringt tief ins Material ein, braucht professionelle Ausrüstung',
      ],
      maintenance: [
        'Wöchentlich aussaugen',
        'Verschüttetes sofort wegmachen',
        'Innenraumfilter regelmäßig wechseln',
        'Verdampfer jährlich reinigen lassen',
        'Klimaanlage regelmäßig desinfizieren',
      ],
    },
  },
  {
    id: 'detail-pflege',
    title: 'Autopflege im Detail',
    description: 'Kleinteile mit großer Wirkung',
    difficulty: 'Fortgeschritten',
    duration: '3-4 Stunden',
    category: 'Außenpflege',
    icon: Brush2Icon,
    content: {
      introduction:
        "Du kennst das: Das Auto ist gewaschen, poliert, glänzt - aber irgendwie sieht's trotzdem nicht perfekt aus. Warum? Weil die Details nicht stimmen! Heute zeige ich dir, wie du diese kleinen, oft übersehenen Bereiche zum Strahlen bringst.",
      sections: [
        {
          title: 'Die vergessenen Ecken:',
          content:
            "Türrahmen und -falze: Da sammelt sich Dreck und Salz - ein Paradies für Rost, wenn du's ignorierst.\n\nLüftungsgitter: Absolute Staubmagneten! Und jeder sieht sie beim Einsteigen.\n\nRadkästen: Werden extrem beansprucht, sind aber wichtig für den Korrosionsschutz.\n\nTankdeckel-Bereich: Oft verharzt und verklebt durch Kraftstoffrückstände.\n\nEmbleme und Schriftzüge: Sammeln Wachs- und Politurreste wie Magneten.",
        },
      ],
      materials: [
        'Mikro-Bürsten (Zahnbürsten, Künstlerpinsel)',
        'Interdentalbürsten',
        'Wattestäbchen',
        'Zahnstocher mit Mikrofaser umwickelt',
        'Spezielle Detailstifte',
        'Druckluft-Werkzeuge',
      ],
      steps: [
        {
          title: 'Türrahmen perfektionieren',
          description:
            'Türen ganz öffnen und sichern. Groben Schmutz mit weicher Bürste weg, Allzweckreiniger aufsprühen, einwirken lassen, mit Detailbürste in alle Falze und Rillen, gründlich mit klarem Wasser spülen.',
        },
        {
          title: 'Lüftungsgitter sauber machen',
          description:
            'Wenn möglich ausbauen. Mit schmaler Staubsaugerdüse vorab saugen, Druckluft von innen nach außen blasen, feuchte Interdentalbürste für hartnäckigen Schmutz, mit Cockpit-Spray nachbehandeln.',
        },
        {
          title: 'Embleme und Schriftzüge',
          description:
            'Wachs- und Politurreste weg: Zahnstocher mit Mikrofaser umwickeln, vorsichtig in alle Vertiefungen, NIE spitze Gegenstände direkt verwenden! Mit weichem Pinsel trocken nacharbeiten.',
        },
        {
          title: 'Radkasten-Detailing',
          description:
            'Sicherheit zuerst: Auto sicher aufbocken! Hochdruckreiniger für die groben Sachen, Radkasten-Reiniger einwirken lassen, verschiedene Bürsten für verschiedene Bereiche, Unterbodenschutz auf blanke Stellen.',
        },
      ],
      tips: [
        'Zeitmanagement: Vollständige Detailreinigung braucht 3-4 Stunden extra zur normalen Autopflege.',
        'Clevere Reihenfolge: Von innen nach außen, von oben nach unten, nach Verschmutzungsgrad, Trocknungszeiten einplanen.',
        'Beleuchtung: Arbeitslampe oder Taschenlampe decken versteckte Stellen auf.',
        'Verschiedene Reiniger testen: Nicht jeder Reiniger funktioniert überall gleich gut.',
        'Fortschritte dokumentieren: Vorher-Nachher-Fotos motivieren und zeigen, was du geschafft hast.',
      ],
      maintenance: [
        'Monatlich: Innenraum-Details',
        'Vierteljährlich: Türrahmen und Schwellen',
        'Halbjährlich: Motorraum und Radkästen',
      ],
    },
  },
  {
    id: 'politur-wissenschaft',
    title: 'Politur-Chemie entschlüsselt',
    description: 'Was macht deinen Lack wirklich glänzend?',
    difficulty: 'Profi',
    duration: '15-20 Min Lesezeit',
    category: 'Produktwissen',
    icon: OilIcon,
    content: {
      introduction:
        'Stehst du auch ratlos vor dem Politur-Regal und fragst dich: "Was ist eigentlich der Unterschied zwischen Carnauba-Wachs und Nano-Keramik?" Heute lüfte ich das Geheimnis der Politur-Chemie und erkläre dir, warum manche Produkte funktionieren und andere nur Marketing sind.',
      sections: [
        {
          title: 'Die Grundlagen: Was passiert da eigentlich?',
          content:
            'Schleifkörper - die unsichtbaren Helfer:\nAbrasive Polituren haben winzige Schleifpartikel drin - meist Aluminiumoxid oder Siliziumdioxid. Diese "Sandkörner" sind so fein, dass sie Kratzer entfernen, ohne neue zu machen. Je kleiner die Partikel, desto sanfter die Politur.\n\nTrägersubstanzen - das flüssige Fundament:\nMeist Mineralöle oder synthetische Öle. Die sorgen dafür, dass sich die Politur gleichmäßig verteilen lässt und die Schleifpartikel sanft über den Lack gleiten.',
        },
        {
          title: 'Die natürlichen Superstars:',
          content:
            'Carnauba-Wachs: Der Goldstandard\nKommt aus Brasilien von der Carnauba-Palme. Mit über 80°C Schmelzpunkt ist es steinhart und gibt irren Glanz. Der Nachteil: Sauteuer und hält nur wenige Monate.\n\nBienenwachs - der sanfte Allrounder\nWeicher als Carnauba, lässt sich einfacher verarbeiten. Dringt gut in Lackmikroporen ein und gibt soliden Schutz. Aber der Glanz ist nicht ganz so intensiv.',
        },
        {
          title: 'Die synthetische Revolution:',
          content:
            'Polymer-Wachse: Wenn Wissenschaft gewinnt\nSynthetische Polymere wie PTFE (kennst du vom Teflonzeug) halten viel länger als natürliche Wachse. Sie bilden eine gleichmäßigere Schutzschicht und sind nicht so temperaturempfindlich.\n\nSilikone: Kontrovers aber effektiv\nSorgen für spektakulären Sofortglanz und extrem glatte Oberflächen. Viele meckern, dass Silikone Schäden überdecken können. Moderne Formulierungen sind aber meist silikonfreie Alternativen.',
        },
        {
          title: 'Die Nano-Revolution:',
          content:
            'Keramik-Beschichtungen: Härter als dein Lack\nNano-Keramikpartikel (meist SiO₂) bilden eine extrem harte Schutzschicht. Mit 9H Härte sind sie deutlich härter als Autolack (2-4H). Können jahrelang halten, sind aber schwieriger aufzutragen.\n\nWas "Nano" wirklich bedeutet:\nDie Partikel sind 1-100 Nanometer groß - so winzig, dass sie in kleinste Lackporen eindringen und dort eine schützende Barriere bilden.',
        },
      ],
      materials: [
        'Carnauba-Wachs (aus brasilianischen Palmen)',
        'Synthetische Polymere (PTFE, Acrylharze)',
        'Nano-Keramikpartikel (SiO₂)',
        'UV-Filter (Benzotriazole)',
        'Antioxidantien (BHT)',
        'Trägersubstanzen und Lösungsmittel',
      ],
      steps: [
        {
          title: 'Eine typische Premium-Politur könnte enthalten:',
          description:
            '15-25% Carnauba-Wachs (für Glanz), 10-20% synthetische Polymere (für Haltbarkeit), 2-5% Nano-Keramik (für Härte), 1-3% UV-Filter (für Schutz), 60-70% Trägersubstanzen',
        },
      ],
      tips: [
        'Du willst irren Glanz? → Hoher Carnauba-Anteil',
        'Du willst Langzeitschutz? → Polymer- oder Keramik-Basis',
        'Du bist Anfänger? → Kombi-Produkte sind ein guter Kompromiss',
        'Du bist Perfektionist? → Separate Systeme für maximale Kontrolle',
        'UV-Filter wandeln UV-Licht in harmlose Wärme um',
        'Antioxidantien verhindern das Ranzigwerden der Wachse',
        'Lass dich nicht von fancy Namen blenden. Schau auf die Inhaltsstoffe!',
        'Teuer heißt nicht immer besser. Manche 50-Euro-Politur hat dieselben Wirkstoffe wie eine für 15 Euro - nur mit mehr Marketing drumherum.',
        'Versteh die Chemie, und du wirst nie wieder die falsche Politur kaufen. Versprochen!',
      ],
      maintenance: [
        'Inhaltsstoffe-Liste vor Kauf studieren',
        'Nicht von Marketing-Begriffen blenden lassen',
        'Produktwahl an eigene Anforderungen anpassen',
      ],
    },
  },
  {
    id: 'shampoo-chemie',
    title: 'Autoshampoo entschlüsselt',
    description: 'Warum der pH-Wert über Erfolg entscheidet',
    difficulty: 'Fortgeschritten',
    duration: '12-15 Min Lesezeit',
    category: 'Produktwissen',
    icon: SoapIcon,
    content: {
      introduction:
        '"Schäumt gut, riecht gut, wird schon passen" - denkst du dir beim Shampoo-Kauf? Dabei steckt in der Flasche High-Tech-Chemie! Der pH-Wert, die Tenside und clevere Additive entscheiden darüber, ob dein Lack sauber wird oder Schaden nimmt.',
      sections: [
        {
          title: 'Der pH-Wert: Dein unsichtbarer Freund oder Feind',
          content:
            'Die pH-Skala geht von 0 (extrem sauer) bis 14 (extrem alkalisch). Dein Autolack fühlt sich bei pH 6-8 wohl - dem neutralen Bereich. Zu sauer oder zu alkalisch, und der Lack leidet.\n\npH 7-9: Die Komfortzone\nDie meisten guten Autoshampoos bewegen sich hier. Sie reinigen effektiv, ohne Wachs, Versiegelungen oder den Lack anzugreifen.\n\nAlkalische Shampoos (pH 9-11): Die Kraftpakete\nLösen Fett und Öl super. Deshalb nutzen Waschstraßen oft alkalische Shampoos. Für zu Hause meist zu aggressiv - weg ist das schöne Wachs!',
        },
        {
          title: 'Tenside: Die echten Reiniger',
          content:
            'Anionische Tenside - die Arbeitspferde\nNatriumlaurylsulfat (SLS) und Verwandte sind die "Muskeln" der Reinigung. Lösen Schmutz und halten ihn in der Schwebe. Können aber aggressiv sein und schäumen stark.\n\nNicht-ionische Tenside - die Sanften\nAlkylpolyglycoside reinigen sanfter und sind biologisch besser abbaubar. Schäumen weniger, reinigen aber genauso gut. Viele Premium-Shampoos setzen darauf.\n\nAmphotere Tenside - die Allrounder\nCocamidopropylbetain (oft aus Kokosnuss) kann je nach pH-Wert unterschiedlich wirken. Diese "intelligenten" Tenside passen sich an und sind besonders hautverträglich.',
        },
        {
          title: 'Der Schaum-Mythos:',
          content:
            'Viel Schaum ≠ gute Reinigung!\nSchaum ist hauptsächlich Marketing. Tatsächlich kann zu viel Schaum hinderlich sein - du siehst ja nicht, was du machst!\n\nSchaum-Stabilisatoren:\nCocamide DEA sorgen für schönen, stabilen Schaum. Verbessern das "Gefühl", reinigen aber nicht besser. Manche stehen in der Kritik, moderne Shampoos verzichten darauf.',
        },
        {
          title: 'Die geheimen Zusätze:',
          content:
            'Gloss-Enhancer: Glanz aus der Flasche\nWasserlösliche Wachse oder Silikone legen sich beim Waschen auf den Lack. Verstärken den Glanz und geben leichten Schutz. Hält aber nur wenige Wochen.\n\nPolymere Additive: Schutz inklusive\nModerne Shampoos enthalten oft synthetische Polymere, die beim Waschen schon eine schützende Schicht aufbauen. Diese "Wash & Wax"-Produkte sind praktisch, ersetzen aber keine richtige Versiegelung.\n\nChelatbildner: Die unsichtbaren Helfer\nEDTA bindet Kalk und Metallionen im Wasser. Verhindert Kalkflecken und Wasserränder. Besonders wichtig bei hartem Wasser.',
        },
      ],
      materials: [
        'Anionische Tenside (Natriumlaurylsulfat)',
        'Nicht-ionische Tenside (Alkylpolyglycoside)',
        'Amphotere Tenside (Cocamidopropylbetain)',
        'Chelatbildner (EDTA)',
        'Polymere Additive für Schutz',
        'Schaum-Stabilisatoren',
      ],
      steps: [
        {
          title: 'Konzentrat vs. Fertigprodukt:',
          description:
            'Hochkonzentrate: Viele Profi-Shampoos sind extreme Konzentrate (1:100 oder stärker). Spart Verpackung und oft Geld. Aber: Richtige Verdünnung ist entscheidend! Fertige Shampoos: Du bezahlst hauptsächlich für Wasser. Der Wirkstoffanteil liegt meist nur bei 2-5%.',
        },
        {
          title: 'Die richtige Wahl für dich:',
          description:
            'Normale Verschmutzung: pH-neutrales Shampoo (pH 7-8) mit milden Tensiden. Starke Verschmutzung: Leicht alkalisch (pH 8-9) mit höherem Tensidanteil. Empfindliche Lacke: Schwach sauer (pH 6-7) mit amphoteren Tensiden. Hartes Wasser: Shampoo mit Chelatbildnern und Wasserenthärtern.',
        },
      ],
      tips: [
        'Biologisch abbaubar: Moderne Shampoos müssen biologisch abbaubar sein. Achte auf "readily biodegradable" oder entsprechende Zertifikate.',
        'Phosphatfrei: Phosphate sind super Wasserenthärter, belasten aber Gewässer. Gute Shampoos verwenden Alternativen wie Citrate.',
        'Kauf nicht das Billigste und nicht das Teuerste. Ein solides Mittelklasse-Shampoo mit den richtigen Inhaltsstoffen ist meist die beste Wahl.',
        'Versteh die Chemie, und du wirst nie wieder das falsche Shampoo kaufen!',
      ],
      maintenance: [
        'Auf "readily biodegradable" Kennzeichnung achten',
        'Richtige Verdünnung bei Konzentraten beachten',
        'Nach starker Reinigung Schutzschichten überprüfen',
      ],
    },
  },
  {
    id: 'felgenreiniger-chemie',
    title: 'Felgenreiniger durchleuchtet',
    description: 'Warum Säure nicht immer der Bösewicht ist',
    difficulty: 'Profi',
    duration: '18-22 Min Lesezeit',
    category: 'Produktwissen',
    icon: HoseIcon,
    content: {
      introduction:
        'Felgenreiniger haben den schlechtesten Ruf in der Autopflege-Familie. "Zu aggressiv", "zerfrisst Aluminium", "stinkt wie die Hölle" - kennst du diese Vorurteile? Dabei sind moderne Felgenreiniger echte High-Tech-Produkte. Ich erkläre dir, was wirklich drin ist und worauf du achten musst.',
      sections: [
        {
          title: 'Das Bremsstaub-Problem verstehen:',
          content:
            'Metallischer Abrieb: Der Hauptfeind\nBremsstaub besteht hauptsächlich aus Eisenpartikeln, die sich bei hohen Temperaturen in deine Felgen "einbrennen". Das Zeug ist chemisch an die Oberfläche gebunden - normales Shampoo hat da keine Chance.\n\nWarum normale Reiniger versagen:\nDu kannst schrubben wie verrückt - die Eisenpartikel sitzen fest. Du brauchst spezielle Chemie, die diese Verbindung löst.',
        },
        {
          title: 'Die Säure-Fraktion: Die Kraftpakete',
          content:
            'Hydrofluorwasserstoff (HF): Der Profi-Hammer\nHF löst selbst eingebrannte Verschmutzungen. Aber Vorsicht: Das Zeug ist extrem gefährlich! Nur in professionellen Produkten, für dich zu Hause nicht geeignet.\n\nPhosphorsäure: Der sichere Kompromiss\nPhosphorsäure (H₃PO₄) löst Eisenoxide effektiv und ist deutlich sicherer als HF. Reagiert selektiv mit Eisenpartikeln, ohne Aluminium stark anzugreifen.\n\nAmidosulfonsäure: Der moderne Ansatz\nDiese organische Säure ist biologisch abbaubar und felgenschonend. Wirkt langsamer als Mineralsäuren, dafür viel materialverträglicher.',
        },
        {
          title: 'Die alkalische Alternative: Sanft aber effektiv',
          content:
            'Natriumhydroxid (NaOH): Gegen Fett und Öl\nAlkalische Reiniger lösen hauptsächlich organische Verschmutzungen - Bremsflüssigkeit, Fett, Straßendreck. Sanfter zu den Felgen, aber weniger effektiv gegen metallische Ablagerungen.\n\nKaliumhydroxid (KOH): Der sanfte Riese\nÄhnlich wie NaOH, aber weniger aggressiv und hinterlässt weniger Rückstände.',
        },
        {
          title: 'Die pH-neutrale Innovation: Das Beste beider Welten',
          content:
            'Chelatbildner: Die intelligenten Moleküle\nEDTA, DTPA und ähnliche "umhüllen" Metallionen und lösen sie aus der Oberfläche. Wirken selektiv nur auf Verschmutzungen, nicht auf die Felge. pH-neutral und materialschonend.\n\nEisenlöser: Der violette Zauber\nSpezielle Eisenkomplexbildner reagieren mit Eisenpartikeln und färben sich dabei violett. Diese Show zeigt dir, wo und wie stark das Produkt wirkt. Sehr effektiv und trotzdem schonend.',
        },
      ],
      materials: [
        'Phosphorsäure (H₃PO₄) für Eisenoxide',
        'Amidosulfonsäure (biologisch abbaubar)',
        'Chelatbildner (EDTA, DTPA)',
        'Eisenlöser mit visueller Reaktion',
        'Korrosionsinhibitoren (Benzotriazol)',
        'Hochleistungstenside',
      ],
      steps: [
        {
          title: 'Felgentyp = Reiniger-Typ:',
          description:
            'Lackierte Felgen: pH-neutrale Reiniger mit Chelatbildnern. Säure kann den Lack angreifen! Polierte Alufelgen: Milde Phosphorsäure mit Korrosionsinhibitoren. Nie alkalische Produkte! Chromfelgen: Nur pH-neutral! Chrom ist empfindlich gegen alles andere. Stahlfelgen: Vertragen stärkere Reiniger, sind aber rostanfällig.',
        },
      ],
      tips: [
        'Benzotriazol: Der Aluminiumschutz - bildet einen unsichtbaren Schutzfilm auf Aluminium und verhindert Korrosion durch den Reiniger selbst.',
        'Alle Felgenreiniger können Haut und Schleimhäute reizen. Handschuhe und Augenschutz sind keine Option, sondern Pflicht!',
        'Normale Verschmutzung: pH-neutraler Eisenlöser mit Farbindikator. Extreme Verschmutzung: Phosphorsäure mit Korrosionsinhibitoren.',
        'Moderne Felgenreiniger sind sichere, effektive Produkte - wenn du sie richtig einsetzt. Nicht der stärkste ist der beste, sondern der passende für deine Situation.',
      ],
      maintenance: [
        'Gebrauchte Lösungen enthalten Schwermetalle - nicht ins Abwasser',
        'Professionelle Entsorgung oder Sammelsysteme nutzen',
        'Kurze Einwirkzeiten bei säurehaltigen Produkten',
      ],
    },
  },
  {
    id: 'innenraum-materialchemie',
    title: 'Innenraumreiniger erklärt',
    description: 'Jedes Material braucht seine eigene Chemie',
    difficulty: 'Profi',
    duration: '20-25 Min Lesezeit',
    category: 'Produktwissen',
    icon: VacuumCleanerIcon,
    content: {
      introduction:
        'Dein Autoinnenraum ist wie ein Material-Zoo: Leder, Alcantara, Kunststoff, Vinyl, Holz - manchmal alles in einem Auto. Und jedes Material tickt chemisch anders. Ein Einheitsreiniger für alles? Forget it! Ich zeige dir, warum verschiedene Materialien verschiedene Chemie brauchen.',
      sections: [
        {
          title: 'Materialkunde: Die chemischen Unterschiede',
          content:
            "Echtes Leder: Komplexe Proteinstruktur\nLeder besteht aus Kollagenfasern - komplexen Proteinen, die durch Gerbung stabilisiert wurden. Diese Struktur ist pH-empfindlich: Zu sauer oder alkalisch, und die Proteine denaturieren. Ergebnis: hartes, brüchiges Leder.\n\nKunstleder/Vinyl: Kunststoff in Leder-Optik\nMeist PVC oder Polyurethan mit strukturierter Oberfläche. Chemisch resistenter als echtes Leder, aber empfindlich gegen Lösungsmittel und hohe Temperaturen.\n\nAlcantara: High-Tech-Mikrofaser\n20% Polyurethan, 80% Polyester. Die Fasern sind 1/100 der Dicke von Seide - das macht's weich, aber auch empfindlich gegen mechanische Belastung.",
        },
        {
          title: 'Lederreiniger: Sanfte Chemie für empfindliche Proteine',
          content:
            'pH-Wert: Die kritische Zone\nLederreiniger arbeiten bei pH 4-7, also leicht sauer bis neutral. Das entspricht dem natürlichen Säureschutzmantel der Haut und ist optimal für Proteine.\n\nMilde Tenside\nAmphotere Tenside wie Cocamidopropyl-Betain sind ideal. Sie reinigen effektiv, ohne die Proteinstruktur zu schädigen.\n\nLanolin: Der natürliche Rückfetter\nWollwachs ähnelt den natürlichen Hautfetten und wird gut von Leder aufgenommen. Hält die Kollagenfasern geschmeidig.',
        },
        {
          title: 'Kunststoffreiniger: Power für synthetische Oberflächen',
          content:
            'Alkalische Formulierungen\nKunststoffe vertragen pH-Werte von 8-11 problemlos. Alkalische Reiniger lösen Fett, Nikotin und hartnäckige Verschmutzungen super effektiv.\n\nAntistatische Additive\nQuaternäre Ammoniumverbindungen reduzieren elektrostatische Aufladung. Verhindert, dass sich Staub schnell wieder absetzt.',
        },
        {
          title: 'Alcantara: Der Spezialfall',
          content:
            'Extrem milde Reinigung\nDie feinen Fasern können durch aggressive Reinigung verfilzen. Nur schwach konzentrierte, pH-neutrale Reiniger verwenden.\n\nBürstentechnik wichtiger als Chemie\nBei Alcantara ist die mechanische Behandlung oft wichtiger als der Reiniger. Spezielle Mikrofaser-Bürsten richten die Fasern auf.',
        },
      ],
      materials: [
        'Amphotere Tenside (Cocamidopropyl-Betain)',
        'Lanolin (Wollwachs) für Leder',
        'Enzymatische Reiniger (Proteasen, Lipasen)',
        'Quaternäre Ammoniumverbindungen (antistatisch)',
        'VOC-arme Formulierungen',
        'Optische Aufheller für Textilien',
      ],
      steps: [
        {
          title: 'Textilreiniger: Fasertiefe Sauberkeit',
          description:
            'Enzymatische Reinigung: Proteasen spalten Eiweißflecken (Schweiß, Blut), Lipasen zersetzen Fette, Amylasen lösen Stärke. Diese biologischen Katalysatoren arbeiten spezifisch und schonend.',
        },
        {
          title: 'Universal- vs. Spezialreiniger:',
          description:
            'Universalreiniger: Enthalten meist milde amphotere Tenside bei pH 7-8. Reinigen alles akzeptabel, aber nichts optimal. Spezialreiniger: Optimiert auf die chemischen Eigenschaften des jeweiligen Materials. Höhere Effizienz, bessere Materialverträglichkeit.',
        },
      ],
      tips: [
        'Spezielle Problemlösungen: Kaugummi mit Kältespray verspröden, Tintenflecken mit Isopropanol, bei Leder erst mit Milch versuchen',
        'VOC-arme Formulierungen: Flüchtige organische Verbindungen können Kopfschmerzen verursachen. Hochwertige Reiniger verwenden wasserbasierte Systeme.',
        'Die richtige Wahl: Leder: pH-neutrale Reiniger mit Lanolin. Kunststoff: Alkalische Reiniger mit antistatischen Additiven. Alcantara: Nur Spezialprodukte!',
        'Jedes Material hat seine eigenen Bedürfnisse. Ein Universalprodukt kann ein Notbehelf sein, aber für optimale Ergebnisse führt kein Weg an spezifischen Reinigern vorbei.',
      ],
      maintenance: [
        'Materialspezifische Produkte für wertvolle Ausstattungen',
        'Nach Lederreinigung immer Lederpflege auftragen',
        'Alcantara nach Reinigung mit Mikrofaser-Bürste aufrauen',
      ],
    },
  },
];

export default function PflegeanleitungenPage() {
  const router = useRouter();
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Außenpflege',
    'Innenpflege',
    'Sicherheit',
    'Produktwissen',
  ];

  const filteredGuides =
    selectedCategory === 'all'
      ? guides
      : guides.filter((guide) => guide.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Anfänger':
        return 'bg-green-100 hover:bg-green-200 text-green-800 transition-colors cursor-pointer';
      case 'Fortgeschritten':
        return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 transition-colors cursor-pointer';
      case 'Profi':
        return 'bg-red-100 hover:bg-red-200 text-red-800 transition-colors cursor-pointer';
      default:
        return 'bg-slate-100 hover:bg-slate-200 text-neutral-900 transition-colors cursor-pointer';
    }
  };

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-8 px-4 bg-neutral-950 text-white">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGuide(null)}
                className="text-slate-300 hover:text-[#f8de00] hover:bg-slate-800 mr-4 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Zurück zu den Anleitungen
              </Button>
              <Badge className="bg-[#f8de00] text-neutral-950 hover:bg-[#f8de00] hover:text-neutral-950 cursor-default">
                {selectedGuide.category}
              </Badge>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4 flex items-center">
                  <selectedGuide.icon className="w-10 h-10 mr-4" />
                  {selectedGuide.title}
                </h1>
                <p className="text-xl text-slate-300 mb-4">
                  {selectedGuide.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <Badge
                    className={getDifficultyColor(selectedGuide.difficulty)}
                  >
                    {selectedGuide.difficulty}
                  </Badge>
                  <div className="flex items-center text-slate-300">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {selectedGuide.duration}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            {/* Einleitung */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <BookOpenIcon className="w-6 h-6 mr-3" />
                  Einleitung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {selectedGuide.content.introduction}
                </p>
              </CardContent>
            </Card>

            {/* Zusätzliche Abschnitte zwischen Einleitung und Materialien */}
            {selectedGuide.content.sections &&
              selectedGuide.content.sections.map((section, index) => (
                <Card key={index} className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-neutral-950">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}

            {/* Benötigte Materialien - nur für praktische Anleitungen, nicht für Produktwissen */}
            {selectedGuide.category !== 'Produktwissen' && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-neutral-950">
                    <CheckCircleIcon className="w-6 h-6 mr-3" />
                    Benötigte Materialien
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedGuide.content.materials.map((material, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#f8de00] rounded-full flex-shrink-0" />
                        <span className="text-slate-600">{material}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schritt-für-Schritt Anleitung - nur für praktische Anleitungen, nicht für Produktwissen */}
            {selectedGuide.category !== 'Produktwissen' && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-neutral-950">
                    <StarIcon className="w-6 h-6 mr-3" />
                    Schritt-für-Schritt Anleitung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedGuide.content.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#f8de00] text-neutral-950 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-950 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                          {step.tips && step.tips.length > 0 && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <LightBulbIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                  {step.tips.map((tip, tipIndex) => (
                                    <p
                                      key={tipIndex}
                                      className="mb-1 last:mb-0"
                                    >
                                      {tip}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profi-Tipps */}
            <Card className="border-slate-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-600" />
                  Profi-Tipps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedGuide.content.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wartungsintervalle */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-neutral-950">
                  <ClockIcon className="w-6 h-6 mr-3" />
                  Empfohlene Wartungsintervalle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedGuide.content.maintenance.map((interval, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="text-slate-600">{interval}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 px-4 bg-neutral-950 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-slate-300 hover:text-[#f8de00] hover:bg-slate-800 mr-4 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Zurück
            </Button>
            <Badge className="bg-[#f8de00] text-neutral-950 hover:bg-[#f8de00] hover:text-neutral-950 cursor-default">
              <BookOpenIcon className="w-4 h-4 mr-2" />
              Pflegeanleitungen
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Professionelle Autopflege-Anleitungen
          </h1>
          <p className="text-xl text-slate-300">
            Schritt-für-Schritt Anleitungen für die perfekte Fahrzeugpflege -
            von Anfänger bis Profi
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? 'bg-[#f8de00] hover:bg-[#e6c700] text-neutral-950'
                    : 'border-slate-200 hover:bg-slate-100'
                }
              >
                {category === 'all' ? 'Alle Anleitungen' : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card
                key={guide.id}
                className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedGuide(guide)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <guide.icon className="w-8 h-8 text-slate-600" />
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-neutral-950">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {guide.duration}
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-600"
                    >
                      {guide.category}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full bg-neutral-950 hover:bg-neutral-900 text-white"
                      onClick={() => setSelectedGuide(guide)}
                    >
                      Anleitung lesen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pflegeplan Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-950 mb-4">
              Regelmäßiger Pflegeplan
            </h2>
            <p className="text-lg text-slate-600">
              Kontinuierliche Pflege ist effektiver als seltene
              Intensivbehandlungen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                period: 'Wöchentlich',
                tasks: [
                  'Grundwäsche',
                  'Innenraum absaugen',
                  'Scheiben reinigen',
                ],
                color: 'bg-green-100 border-green-200',
              },
              {
                period: 'Monatlich',
                tasks: [
                  'Intensive Reinigung',
                  'Felgenpflege',
                  'Armaturenbrett pflegen',
                ],
                color: 'bg-blue-100 border-blue-200',
              },
              {
                period: 'Vierteljährlich',
                tasks: ['Politur', 'Lederpflege', 'Tiefenreinigung'],
                color: 'bg-yellow-100 border-yellow-200',
              },
              {
                period: 'Halbjährlich',
                tasks: ['Versiegelung', 'Imprägnierung', 'Komplettservice'],
                color: 'bg-purple-100 border-purple-200',
              },
            ].map((schedule, index) => (
              <Card key={index} className={`border-2 ${schedule.color}`}>
                <CardHeader>
                  <CardTitle className="text-neutral-950">
                    {schedule.period}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {schedule.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">{task}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
