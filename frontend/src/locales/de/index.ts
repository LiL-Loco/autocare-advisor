// Central German Localization Index
// Zentrale deutsche Lokalisierungs-Datei

import analyticsTranslations from './analytics';
import apiTranslations from './api';
import billingTranslations from './billing';
import customersTranslations from './customers';
import marketingTranslations from './marketing';
import notificationsTranslations from './notifications';
import productsTranslations from './products';
import settingsTranslations from './settings';

// Complete German Translation Object for AutoCare Advisor B2B Platform
export const deTranslations = {
  // Common App-wide Terms
  common: {
    // Navigation
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    products: 'Produkte',
    customers: 'Kunden',
    marketing: 'Marketing',
    api: 'API',
    notifications: 'Benachrichtigungen',
    billing: 'Abrechnung',
    settings: 'Einstellungen',

    // Actions
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    create: 'Erstellen',
    update: 'Aktualisieren',
    search: 'Suchen',
    filter: 'Filtern',
    export: 'Exportieren',
    import: 'Importieren',
    download: 'Herunterladen',
    upload: 'Hochladen',

    // Status
    active: 'Aktiv',
    inactive: 'Inaktiv',
    enabled: 'Aktiviert',
    disabled: 'Deaktiviert',
    online: 'Online',
    offline: 'Offline',
    loading: 'Lädt...',
    success: 'Erfolgreich',
    error: 'Fehler',
    warning: 'Warnung',

    // Time
    today: 'Heute',
    yesterday: 'Gestern',
    tomorrow: 'Morgen',
    thisWeek: 'Diese Woche',
    thisMonth: 'Dieser Monat',
    thisYear: 'Dieses Jahr',

    // Data
    noData: 'Keine Daten verfügbar',
    noResults: 'Keine Ergebnisse gefunden',
    total: 'Gesamt',
    average: 'Durchschnitt',
    minimum: 'Minimum',
    maximum: 'Maximum',

    // User Interface
    menu: 'Menü',
    profile: 'Profil',
    logout: 'Abmelden',
    welcome: 'Willkommen',
    home: 'Startseite',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherige',
    finish: 'Fertig',
    continue: 'Fortfahren',

    // Business Terms
    revenue: 'Umsatz',
    profit: 'Gewinn',
    loss: 'Verlust',
    growth: 'Wachstum',
    decline: 'Rückgang',
    increase: 'Anstieg',
    decrease: 'Abnahme',
    performance: 'Leistung',
    efficiency: 'Effizienz',
    productivity: 'Produktivität',

    // DACH Region Specific
    germany: 'Deutschland',
    austria: 'Österreich',
    switzerland: 'Schweiz',
    euro: 'Euro',
    vat: 'Mehrwertsteuer',
    company: 'Unternehmen',
    business: 'Geschäft',
    partner: 'Partner',

    // Professional Titles
    manager: 'Manager',
    administrator: 'Administrator',
    user: 'Benutzer',
    customer: 'Kunde',
    client: 'Kunde',
    supplier: 'Lieferant',
    vendor: 'Anbieter',
  },

  // Section-specific translations
  analytics: analyticsTranslations,
  products: productsTranslations,
  customers: customersTranslations,
  marketing: marketingTranslations,
  api: apiTranslations,
  notifications: notificationsTranslations,
  billing: billingTranslations,
  settings: settingsTranslations,

  // AutoCare Specific Terms
  autocare: {
    // Car Care Products
    carCare: 'Autopflege',
    carWash: 'Autowäsche',
    carWax: 'Autowachs',
    carPolish: 'Autopolitur',
    carShampoo: 'Autoshampoo',
    tireCare: 'Reifenpflege',
    interiorCare: 'Innenraumpflege',
    exteriorCare: 'Außenpflege',
    engineCare: 'Motorenpflege',
    paintProtection: 'Lackschutz',

    // Product Categories
    cleaningProducts: 'Reinigungsprodukte',
    protectionProducts: 'Schutzprodukte',
    maintenanceProducts: 'Pflegeprodukte',
    tools: 'Werkzeuge',
    accessories: 'Zubehör',
    chemicals: 'Chemikalien',
    microfiber: 'Mikrofaser',
    applicators: 'Applikatoren',

    // Vehicle Types
    car: 'Auto',
    motorcycle: 'Motorrad',
    truck: 'LKW',
    van: 'Transporter',
    suv: 'SUV',
    convertible: 'Cabrio',
    sedan: 'Limousine',
    hatchback: 'Kleinwagen',

    // Car Parts
    engine: 'Motor',
    wheels: 'Räder',
    tires: 'Reifen',
    paint: 'Lack',
    interior: 'Innenraum',
    exterior: 'Außenbereich',
    dashboard: 'Armaturenbrett',
    seats: 'Sitze',
    carpet: 'Teppich',
    windows: 'Scheiben',

    // Maintenance Types
    washing: 'Waschen',
    waxing: 'Wachsen',
    polishing: 'Polieren',
    cleaning: 'Reinigen',
    protecting: 'Schützen',
    detailing: 'Detaillierung',
    restoration: 'Restaurierung',
    maintenance: 'Wartung',

    // Quality Levels
    professional: 'Professionell',
    premium: 'Premium',
    standard: 'Standard',
    basic: 'Basis',
    luxury: 'Luxus',
    commercial: 'Gewerblich',
    industrial: 'Industriell',

    // Business Model Terms
    partner: 'Partner',
    distributor: 'Händler',
    retailer: 'Einzelhändler',
    wholesaler: 'Großhändler',
    dealer: 'Händler',
    reseller: 'Wiederverkäufer',
    franchise: 'Franchise',

    // Service Types
    consulting: 'Beratung',
    training: 'Schulung',
    support: 'Support',
    installation: 'Installation',
    demonstration: 'Demonstration',
    workshop: 'Workshop',
    seminar: 'Seminar',
    certification: 'Zertifizierung',
  },

  // Forms and Validation
  forms: {
    required: 'Pflichtfeld',
    invalid: 'Ungültig',
    valid: 'Gültig',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    firstName: 'Vorname',
    lastName: 'Nachname',
    company: 'Unternehmen',
    phone: 'Telefon',
    address: 'Adresse',
    city: 'Stadt',
    postalCode: 'Postleitzahl',
    country: 'Land',

    // Validation Messages
    emailRequired: 'E-Mail ist erforderlich',
    emailInvalid: 'Ungültige E-Mail-Adresse',
    passwordRequired: 'Passwort ist erforderlich',
    passwordTooShort: 'Passwort zu kurz',
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
    fieldRequired: 'Dieses Feld ist erforderlich',
    invalidFormat: 'Ungültiges Format',
    valueTooLong: 'Wert zu lang',
    valueTooShort: 'Wert zu kurz',
  },

  // Date and Time Formatting
  dateTime: {
    now: 'Jetzt',
    today: 'Heute',
    yesterday: 'Gestern',
    tomorrow: 'Morgen',

    // Days of Week
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',

    // Months
    january: 'Januar',
    february: 'Februar',
    march: 'März',
    april: 'April',
    may: 'Mai',
    june: 'Juni',
    july: 'Juli',
    august: 'August',
    september: 'September',
    october: 'Oktober',
    november: 'November',
    december: 'Dezember',

    // Time Units
    second: 'Sekunde',
    minute: 'Minute',
    hour: 'Stunde',
    day: 'Tag',
    week: 'Woche',
    month: 'Monat',
    year: 'Jahr',

    seconds: 'Sekunden',
    minutes: 'Minuten',
    hours: 'Stunden',
    days: 'Tage',
    weeks: 'Wochen',
    months: 'Monate',
    years: 'Jahre',
  },
};

export default deTranslations;

// Export individual sections for modular usage
export {
  analyticsTranslations,
  apiTranslations,
  billingTranslations,
  customersTranslations,
  marketingTranslations,
  notificationsTranslations,
  productsTranslations,
  settingsTranslations,
};
