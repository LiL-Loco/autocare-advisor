import { EmailTemplate } from '../models/Email';
import { templateEngine } from './templateEngine';

// ============================================================================
// PARTNER ONBOARDING EMAIL TEMPLATES
// ============================================================================

export const PARTNER_ONBOARDING_TEMPLATES = [
  {
    name: 'Partner Welcome - Step 1',
    subject: 'Willkommen bei AutoCare Advisor! 🚗 Ihr Start als Partner',
    templateType: 'onboarding',
    templateCategory: 'partner_welcome',
    htmlContent: `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen bei AutoCare Advisor</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; margin-top: 20px; margin-bottom: 20px; }
        .header { background: linear-gradient(135deg, #f8de00 0%, #e6c700 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .welcome-text { font-size: 18px; margin-bottom: 0; }
        .content { margin: 20px 0; }
        .highlight { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #f8de00; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #f8de00; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 15px 0; }
        .button:hover { background-color: #e6c700; }
        .steps { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .step { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; border-left: 3px solid #f8de00; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
        .social-links { margin: 20px 0; text-align: center; }
        .social-links a { margin: 0 10px; color: #f8de00; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚗 AutoCare Advisor</div>
            <p class="welcome-text">Willkommen als Partner!</p>
        </div>
        
        <div class="content">
            <h2>Hallo {{user.firstName}}! 👋</h2>
            
            <p>Herzlichen Glückwunsch und willkommen bei AutoCare Advisor! Wir freuen uns riesig, dass <strong>{{partner.companyName}}</strong> Teil unseres Partner-Netzwerks wird.</p>
            
            <div class="highlight">
                <h3>🎯 Was Sie als Partner erwartet:</h3>
                <ul>
                    <li><strong>Qualifizierte Kunden:</strong> Erhalten Sie Anfragen von Autofahrern, die gezielt nach Ihren Produkten suchen</li>
                    <li><strong>Faire Vergütung:</strong> Verdienen Sie an jedem vermittelten Kunden - nur bei Erfolg</li>
                    <li><strong>Marketing-Support:</strong> Professionelle Produktpräsentation ohne Aufwand für Sie</li>
                    <li><strong>Transparente Analytics:</strong> Verfolgen Sie Ihre Performance in Echtzeit</li>
                </ul>
            </div>
            
            <h3>📋 Ihr 7-Schritte Onboarding-Plan:</h3>
            <div class="steps">
                <div class="step">
                    <strong>✅ Schritt 1:</strong> Willkommen & Einführung (Sie sind hier!)
                </div>
                <div class="step">
                    <strong>📋 Schritt 2:</strong> Unternehmensprofile vervollständigen
                </div>
                <div class="step">
                    <strong>🛍️ Schritt 3:</strong> Ihre ersten Produkte hinzufügen
                </div>
                <div class="step">
                    <strong>💰 Schritt 4:</strong> Preise und Provisionen festlegen
                </div>
                <div class="step">
                    <strong>🎯 Schritt 5:</strong> Zielgruppe und Marketing definieren
                </div>
                <div class="step">
                    <strong>📊 Schritt 6:</strong> Analytics-Dashboard kennenlernen
                </div>
                <div class="step">
                    <strong>🚀 Schritt 7:</strong> Live gehen und erste Kunden gewinnen
                </div>
            </div>
            
            <p>In den nächsten Tagen erhalten Sie eine E-Mail pro Schritt mit detaillierten Anleitungen, Tipps und Best Practices von erfolgreichen Partnern.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackClick 'https://partner.autocare-advisor.com/dashboard' messageId}}" class="button">
                    🚀 Zum Partner-Dashboard
                </a>
            </div>
            
            <div class="highlight">
                <h4>🆘 Brauchen Sie Hilfe?</h4>
                <p>Unser Partner-Success-Team ist für Sie da:</p>
                <ul>
                    <li>📧 E-Mail: <a href="mailto:partner@autocare-advisor.com">partner@autocare-advisor.com</a></li>
                    <li>📞 Telefon: +49 (0) 800 123 456 (kostenlos)</li>
                    <li>💬 Live-Chat im Partner-Dashboard verfügbar</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>Diese E-Mail wurde an <strong>{{user.email}}</strong> gesendet.</p>
            <div class="social-links">
                <a href="https://linkedin.com/company/autocare-advisor">LinkedIn</a> |
                <a href="https://twitter.com/autocareadvisor">Twitter</a> |
                <a href="https://facebook.com/autocareadvisor">Facebook</a>
            </div>
            <p><small>
                <a href="{{unsubscribeUrl user.email 'partner_onboarding'}}">Abmelden</a> |
                <a href="https://autocare-advisor.com/datenschutz">Datenschutz</a> |
                <a href="https://autocare-advisor.com/impressum">Impressum</a>
            </small></p>
            
            <!-- Tracking Pixel -->
            <img src="{{trackingPixel messageId}}" width="1" height="1" alt="" style="display: none;">
        </div>
    </div>
</body>
</html>`,
    textContent: `
Willkommen bei AutoCare Advisor!

Hallo {{user.firstName}}!

Herzlichen Glückwunsch und willkommen bei AutoCare Advisor! Wir freuen uns, dass {{partner.companyName}} Teil unseres Partner-Netzwerks wird.

Was Sie als Partner erwartet:
- Qualifizierte Kunden, die gezielt nach Ihren Produkten suchen
- Faire Vergütung - nur bei Erfolg
- Marketing-Support ohne Aufwand für Sie
- Transparente Analytics in Echtzeit

Ihr 7-Schritte Onboarding-Plan:
✅ Schritt 1: Willkommen & Einführung (Sie sind hier!)
📋 Schritt 2: Unternehmensprofile vervollständigen
🛍️ Schritt 3: Ihre ersten Produkte hinzufügen
💰 Schritt 4: Preise und Provisionen festlegen
🎯 Schritt 5: Zielgruppe und Marketing definieren
📊 Schritt 6: Analytics-Dashboard kennenlernen
🚀 Schritt 7: Live gehen und erste Kunden gewinnen

Partner-Dashboard: https://partner.autocare-advisor.com/dashboard

Brauchen Sie Hilfe?
E-Mail: partner@autocare-advisor.com
Telefon: +49 (0) 800 123 456 (kostenlos)

AutoCare Advisor Team
`,
    variables: ['user.firstName', 'user.email', 'partner.companyName', 'messageId'],
    isActive: true
  },

  {
    name: 'Partner Onboarding - Step 2: Company Profile',
    subject: '📋 Schritt 2: Vervollständigen Sie Ihr Unternehmensprofil',
    templateType: 'onboarding',
    templateCategory: 'partner_profile',
    htmlContent: `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schritt 2: Unternehmensprofil</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; margin-top: 20px; margin-bottom: 20px; }
        .header { background: linear-gradient(135deg, #f8de00 0%, #e6c700 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .progress { background-color: #e9ecef; height: 8px; border-radius: 4px; margin: 20px 0; }
        .progress-bar { background-color: #f8de00; height: 100%; border-radius: 4px; width: 28.5%; }
        .content { margin: 20px 0; }
        .highlight { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #f8de00; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #f8de00; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 15px 0; }
        .checklist { list-style: none; padding: 0; }
        .checklist li { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .checklist li:before { content: "☐ "; margin-right: 10px; color: #f8de00; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 24px; font-weight: bold;">🚗 AutoCare Advisor</div>
            <p>Schritt 2 von 7: Unternehmensprofil</p>
            <div class="progress">
                <div class="progress-bar"></div>
            </div>
        </div>
        
        <div class="content">
            <h2>Hallo {{user.firstName}}! 📋</h2>
            
            <p>Großartig, dass Sie dabei sind! Heute kümmern wir uns um Ihr Unternehmensprofil. Ein vollständiges Profil erhöht das Vertrauen potentieller Kunden um bis zu <strong>73%</strong>!</p>
            
            <div class="highlight">
                <h3>🎯 Warum ein vollständiges Profil wichtig ist:</h3>
                <ul>
                    <li><strong>Vertrauen schaffen:</strong> Kunden kaufen lieber bei Unternehmen mit vollständigen Informationen</li>
                    <li><strong>Bessere Rankings:</strong> Vollständige Profile werden in den Suchergebnissen bevorzugt</li>
                    <li><strong>Professioneller Auftritt:</strong> Zeigen Sie, dass Sie ein seriöser Partner sind</li>
                </ul>
            </div>
            
            <h3>📝 Ihre Checkliste für heute:</h3>
            <ul class="checklist">
                <li>Firmenlogo hochladen (empfohlen: 300x300px, PNG/JPG)</li>
                <li>Ausführliche Unternehmensbeschreibung hinzufügen</li>
                <li>Kontaktdaten vervollständigen (Adresse, Telefon, Website)</li>
                <li>Öffnungszeiten eintragen</li>
                <li>Spezialisierungen und Zertifikate angeben</li>
                <li>Teamfotos hinzufügen (optional, aber empfohlen)</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackClick 'https://partner.autocare-advisor.com/profile/edit' messageId}}" class="button">
                    📋 Profil jetzt vervollständigen
                </a>
            </div>
            
            <div class="highlight">
                <h4>💡 Profi-Tipp:</h4>
                <p><strong>Authentische Bilder wirken Wunder!</strong> Zeigen Sie Ihr Team und Ihre Werkstatt. Kunden lieben es zu sehen, mit wem sie es zu tun haben. Ein Foto kann mehr Vertrauen schaffen als tausend Worte.</p>
            </div>
            
            <p><strong>Nächste Schritte:</strong> Morgen erhalten Sie Tipps zum Hinzufügen Ihrer ersten Produkte. Bis dahin können Sie bereits mit dem Profil experimentieren!</p>
        </div>
        
        <div class="footer">
            <p>Fragen? Antworten Sie einfach auf diese E-Mail oder besuchen Sie unser <a href="https://help.autocare-advisor.com">Help Center</a>.</p>
            <p><small>
                <a href="{{unsubscribeUrl user.email 'partner_onboarding'}}">Abmelden</a> |
                <a href="https://autocare-advisor.com/datenschutz">Datenschutz</a>
            </small></p>
            <img src="{{trackingPixel messageId}}" width="1" height="1" alt="" style="display: none;">
        </div>
    </div>
</body>
</html>`,
    textContent: `
Schritt 2: Vervollständigen Sie Ihr Unternehmensprofil

Hallo {{user.firstName}}!

Ein vollständiges Profil erhöht das Vertrauen potentieller Kunden um bis zu 73%!

Ihre Checkliste für heute:
☐ Firmenlogo hochladen
☐ Ausführliche Unternehmensbeschreibung hinzufügen  
☐ Kontaktdaten vervollständigen
☐ Öffnungszeiten eintragen
☐ Spezialisierungen und Zertifikate angeben
☐ Teamfotos hinzufügen

Profil bearbeiten: https://partner.autocare-advisor.com/profile/edit

Profi-Tipp: Authentische Bilder wirken Wunder! Zeigen Sie Ihr Team und Ihre Werkstatt.

AutoCare Advisor Team
`,
    variables: ['user.firstName', 'user.email', 'messageId'],
    isActive: true
  }
];

// ============================================================================
// BUSINESS DEVELOPMENT EMAIL TEMPLATES
// ============================================================================

export const BUSINESS_DEVELOPMENT_TEMPLATES = [
  {
    name: 'Cold Outreach - Autopflege Partner',
    subject: '🚗 {{partner.companyName}}: Neue Kunden für Ihre Autopflege-Produkte?',
    templateType: 'marketing',
    templateCategory: 'cold_outreach',
    htmlContent: `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partnerschaft mit AutoCare Advisor</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; margin-top: 20px; margin-bottom: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #f8de00; margin-bottom: 10px; }
        .content { margin: 20px 0; }
        .stats { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; display: flex; justify-content: space-around; text-align: center; }
        .stat { flex: 1; }
        .stat-number { font-size: 24px; font-weight: bold; color: #f8de00; }
        .stat-label { font-size: 14px; color: #666; }
        .button { display: inline-block; padding: 12px 30px; background-color: #f8de00; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 15px 0; }
        .highlight { background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #f8de00; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚗 AutoCare Advisor</div>
            <p style="color: #666;">Die führende Plattform für Autopflege-Empfehlungen</p>
        </div>
        
        <div class="content">
            <h2>Hallo {{user.firstName}},</h2>
            
            <p>ich bin auf <strong>{{partner.companyName}}</strong> aufmerksam geworden und war beeindruckt von Ihrem Sortiment an Autopflege-Produkten.</p>
            
            <p>AutoCare Advisor verbindet monatlich über <strong>25.000 Autofahrer</strong> mit den richtigen Pflegeprodukten. Dabei setzen wir auf Qualität statt Quantität - und genau das macht Sie als Partner interessant.</p>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">25k+</div>
                    <div class="stat-label">Aktive Nutzer<br>pro Monat</div>
                </div>
                <div class="stat">
                    <div class="stat-number">€1.2M</div>
                    <div class="stat-label">Vermitteltes<br>Umsatzvolumen</div>
                </div>
                <div class="stat">
                    <div class="stat-number">92%</div>
                    <div class="stat-label">Partner-<br>Zufriedenheit</div>
                </div>
            </div>
            
            <div class="highlight">
                <h3>🎯 Was macht uns anders?</h3>
                <ul>
                    <li><strong>Intelligente Empfehlungen:</strong> KI-basierte Produktvorschläge basierend auf Fahrzeugtyp und Nutzung</li>
                    <li><strong>Faire Vergütung:</strong> Sie zahlen nur für tatsächlich vermittelte Kunden</li>
                    <li><strong>Premium-Positionierung:</strong> Wir arbeiten nur mit Qualitätspartnern zusammen</li>
                    <li><strong>Vollständige Transparenz:</strong> Sie sehen jeden Klick und jede Conversion in Echtzeit</li>
                </ul>
            </div>
            
            <p><strong>Konkret für Sie:</strong> Basierend auf Ihrem Produktsortiment schätze ich, dass Sie über unsere Plattform monatlich <strong>15-25 neue Kunden</strong> erreichen könnten.</p>
            
            <p>Hätten Sie Interesse an einem kurzen, unverbindlichen Gespräch? Ich zeige Ihnen gerne, wie andere Autopflege-Anbieter mit uns durchschnittlich <strong>18% mehr Umsatz</strong> generieren.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{trackClick 'https://calendly.com/autocare-advisor/partner-call' messageId}}" class="button">
                    📞 15-Min Gespräch vereinbaren
                </a>
            </div>
            
            <p>Oder antworten Sie einfach auf diese E-Mail - ich melde mich dann bei Ihnen.</p>
            
            <p>Beste Grüße,<br>
            <strong>Max Mustermann</strong><br>
            Business Development Manager<br>
            AutoCare Advisor</p>
        </div>
        
        <div class="footer">
            <p><small>
                Falls Sie keine weiteren E-Mails zu Partnerschaftsmöglichkeiten erhalten möchten, können Sie sich <a href="{{unsubscribeUrl user.email 'business_development'}}">hier abmelden</a>.
            </small></p>
        </div>
    </div>
</body>
</html>`,
    textContent: `
Neue Kunden für Ihre Autopflege-Produkte?

Hallo {{user.firstName}},

ich bin auf {{partner.companyName}} aufmerksam geworden und war beeindruckt von Ihrem Sortiment.

AutoCare Advisor verbindet monatlich über 25.000 Autofahrer mit den richtigen Pflegeprodukten.

Unsere Zahlen:
- 25k+ aktive Nutzer pro Monat
- €1.2M vermitteltes Umsatzvolumen
- 92% Partner-Zufriedenheit

Was macht uns anders?
- Intelligente, KI-basierte Empfehlungen
- Faire Vergütung - Sie zahlen nur für vermittelte Kunden
- Premium-Positionierung mit Qualitätspartnern
- Vollständige Transparenz über alle Metriken

Für Sie: Basierend auf Ihrem Sortiment könnten Sie monatlich 15-25 neue Kunden erreichen.

Interesse an einem 15-minütigen, unverbindlichen Gespräch?
Kalendly: https://calendly.com/autocare-advisor/partner-call

Oder antworten Sie einfach auf diese E-Mail.

Beste Grüße,
Max Mustermann
Business Development Manager
AutoCare Advisor
`,
    variables: ['user.firstName', 'partner.companyName', 'messageId'],
    isActive: true
  }
];

// ============================================================================
// TRANSACTIONAL EMAIL TEMPLATES
// ============================================================================

export const TRANSACTIONAL_TEMPLATES = [
  {
    name: 'Password Reset Request',
    subject: '🔐 Passwort zurücksetzen - AutoCare Advisor',
    templateType: 'transactional',
    templateCategory: 'auth',
    htmlContent: `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passwort zurücksetzen</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; margin-top: 20px; margin-bottom: 20px; }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .logo { font-size: 28px; font-weight: bold; color: #f8de00; margin-bottom: 10px; }
        .content { margin: 20px 0; }
        .button { display: inline-block; padding: 15px 30px; background-color: #f8de00; color: #333; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚗 AutoCare Advisor</div>
            <p style="color: #666; margin: 0;">Passwort zurücksetzen</p>
        </div>
        
        <div class="content">
            <h2>Hallo {{user.firstName}},</h2>
            
            <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{resetUrl}}" class="button">
                    🔐 Passwort zurücksetzen
                </a>
            </div>
            
            <div class="warning">
                <h4>⚠️ Wichtige Sicherheitshinweise:</h4>
                <ul>
                    <li>Dieser Link ist nur <strong>24 Stunden</strong> gültig</li>
                    <li>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail</li>
                    <li>Ihr aktuelles Passwort bleibt aktiv, bis Sie ein neues festgelegt haben</li>
                </ul>
            </div>
            
            <p>Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">{{resetUrl}}</p>
            
            <p>Bei Fragen wenden Sie sich gerne an unseren Support: <a href="mailto:support@autocare-advisor.com">support@autocare-advisor.com</a></p>
        </div>
        
        <div class="footer">
            <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
        </div>
    </div>
</body>
</html>`,
    textContent: `
Passwort zurücksetzen - AutoCare Advisor

Hallo {{user.firstName}},

Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.

Klicken Sie hier, um ein neues Passwort zu erstellen:
{{resetUrl}}

Wichtige Hinweise:
- Dieser Link ist nur 24 Stunden gültig
- Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail
- Ihr aktuelles Passwort bleibt aktiv, bis Sie ein neues festgelegt haben

Support: support@autocare-advisor.com

AutoCare Advisor Team
`,
    variables: ['user.firstName', 'resetUrl'],
    isActive: true
  }
];

// ============================================================================
// SEED TEMPLATES FUNCTION
// ============================================================================

export async function seedEmailTemplates() {
  try {
    console.log('[Template Seeder] Starting email template seeding...');

    const allTemplates = [
      ...PARTNER_ONBOARDING_TEMPLATES,
      ...BUSINESS_DEVELOPMENT_TEMPLATES,
      ...TRANSACTIONAL_TEMPLATES
    ];

    let created = 0;
    let skipped = 0;

    for (const templateData of allTemplates) {
      const existing = await EmailTemplate.findOne({ name: templateData.name });
      
      if (!existing) {
        const template = new EmailTemplate(templateData);
        await template.save();
        created++;
        console.log(`[Template Seeder] ✅ Created template: ${templateData.name}`);
      } else {
        skipped++;
        console.log(`[Template Seeder] ⏭️ Skipped existing template: ${templateData.name}`);
      }
    }

    console.log(`[Template Seeder] ✅ Seeding completed: ${created} created, ${skipped} skipped`);
    
    return {
      success: true,
      created,
      skipped,
      total: allTemplates.length
    };
  } catch (error) {
    console.error('[Template Seeder] ❌ Error seeding templates:', error);
    throw error;
  }
}

export default {
  PARTNER_ONBOARDING_TEMPLATES,
  BUSINESS_DEVELOPMENT_TEMPLATES,
  TRANSACTIONAL_TEMPLATES,
  seedEmailTemplates
};