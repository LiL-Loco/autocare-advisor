'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Copy,
  Download,
  Eye,
  Globe,
  Image as ImageIcon,
  Monitor,
  Palette,
  RefreshCw,
  Save,
  Smartphone,
  Tablet,
  Type,
  Upload,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface BrandSettings {
  companyName: string;
  companyDescription: string;
  website: string;
  supportEmail: string;

  // Logo & Images
  logo: string;
  logoLight: string;
  logoDark: string;
  favicon: string;
  socialImage: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Typography
  headingFont: string;
  bodyFont: string;
  fontSize: string;

  // Custom CSS
  customCss: string;

  // Templates
  emailTemplate: string;
  invoiceTemplate: string;
  reportTemplate: string;
}

const SettingsBrandingPage = () => {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    companyName: 'AutoCare Partner',
    companyDescription: 'Ihr Partner für professionelle Autopflege',
    website: 'https://partner.autocare.com',
    supportEmail: 'support@autocare.com',

    logo: '/images/logo.png',
    logoLight: '/images/logo-light.png',
    logoDark: '/images/logo-dark.png',
    favicon: '/images/favicon.ico',
    socialImage: '/images/og-image.png',

    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#f97316',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',

    headingFont: 'Inter',
    bodyFont: 'Inter',
    fontSize: 'medium',

    customCss:
      '/* Ihre benutzerdefinierten CSS-Regeln */\n.custom-brand {\n  border-radius: 8px;\n}',

    emailTemplate: 'default',
    invoiceTemplate: 'professional',
    reportTemplate: 'modern',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleSettingChange = (key: keyof BrandSettings, value: string) => {
    setBrandSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = async (
    type: 'logo' | 'logoLight' | 'logoDark' | 'favicon' | 'socialImage'
  ) => {
    setUploadingLogo(true);
    // Hier würde die Upload-Logik implementiert
    setTimeout(() => {
      setUploadingLogo(false);
      console.log(`Uploaded ${type}`);
    }, 1000);
  };

  const handleSaveBranding = () => {
    console.log('Saving branding settings...', brandSettings);
    // Hier würde die API-Logik implementiert
  };

  const handleResetBranding = () => {
    setBrandSettings({
      companyName: 'AutoCare Partner',
      companyDescription: 'Ihr Partner für professionelle Autopflege',
      website: 'https://partner.autocare.com',
      supportEmail: 'support@autocare.com',

      logo: '/images/logo.png',
      logoLight: '/images/logo-light.png',
      logoDark: '/images/logo-dark.png',
      favicon: '/images/favicon.ico',
      socialImage: '/images/og-image.png',

      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#f97316',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',

      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium',

      customCss:
        '/* Ihre benutzerdefinierten CSS-Regeln */\n.custom-brand {\n  border-radius: 8px;\n}',

      emailTemplate: 'default',
      invoiceTemplate: 'professional',
      reportTemplate: 'modern',
    });
  };

  const copyColorToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  const predefinedColors = [
    '#2563eb',
    '#dc2626',
    '#16a34a',
    '#ca8a04',
    '#9333ea',
    '#c2410c',
    '#0891b2',
    '#be123c',
    '#4338ca',
    '#059669',
  ];

  const fonts = [
    { value: 'Inter', label: 'Inter (Empfohlen)' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Arial', label: 'Arial' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Branding & Design
          </h1>
          <p className="text-gray-600 mt-1">
            Personalisieren Sie das Erscheinungsbild Ihres Partner-Dashboards
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Vorschau
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Branding-Vorschau</DialogTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={
                        previewDevice === 'desktop' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setPreviewDevice('desktop')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        previewDevice === 'tablet' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setPreviewDevice('tablet')}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={
                        previewDevice === 'mobile' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setPreviewDevice('mobile')}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex justify-center">
                <div
                  className={`border rounded-lg overflow-hidden ${
                    previewDevice === 'desktop'
                      ? 'w-full max-w-4xl h-96'
                      : previewDevice === 'tablet'
                      ? 'w-96 h-72'
                      : 'w-64 h-96'
                  }`}
                  style={{
                    backgroundColor: brandSettings.backgroundColor,
                    color: brandSettings.textColor,
                    fontFamily: brandSettings.bodyFont,
                  }}
                >
                  <div
                    className="p-4 border-b"
                    style={{
                      backgroundColor: brandSettings.primaryColor,
                      color: 'white',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded"></div>
                      <h3 className="font-semibold">
                        {brandSettings.companyName}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="mb-4">{brandSettings.companyDescription}</p>
                    <div
                      className="p-3 rounded"
                      style={{
                        backgroundColor: brandSettings.accentColor,
                        color: 'white',
                      }}
                    >
                      <p className="text-sm">Beispiel-Widget mit Akzentfarbe</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Badge variant="outline">White-Label Ready</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Unternehmensinformationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Firmenname</Label>
              <Input
                value={brandSettings.companyName}
                onChange={(e) =>
                  handleSettingChange('companyName', e.target.value)
                }
                placeholder="Ihr Firmenname"
              />
            </div>

            <div className="space-y-2">
              <Label>Beschreibung</Label>
              <Textarea
                value={brandSettings.companyDescription}
                onChange={(e) =>
                  handleSettingChange('companyDescription', e.target.value)
                }
                placeholder="Kurze Beschreibung Ihres Unternehmens"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={brandSettings.website}
                onChange={(e) => handleSettingChange('website', e.target.value)}
                placeholder="https://ihre-website.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label>Support E-Mail</Label>
              <Input
                value={brandSettings.supportEmail}
                onChange={(e) =>
                  handleSettingChange('supportEmail', e.target.value)
                }
                placeholder="support@ihre-firma.com"
                type="email"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo & Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Logos & Bilder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Logo */}
            <div className="space-y-3">
              <Label>Haupt-Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded mx-auto mb-3 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  PNG, JPG oder SVG (max. 2MB)
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleLogoUpload('logo')}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploadingLogo ? 'Laden...' : 'Hochladen'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Herunterladen
                  </Button>
                </div>
              </div>
            </div>

            {/* Logo Variants */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Helles Logo</Label>
                <div className="border rounded p-3 bg-gray-800">
                  <div className="w-12 h-8 bg-white/20 rounded mx-auto"></div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Upload className="h-3 w-3 mr-1" />
                  Hochladen
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Dunkles Logo</Label>
                <div className="border rounded p-3 bg-white">
                  <div className="w-12 h-8 bg-gray-200 rounded mx-auto"></div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Upload className="h-3 w-3 mr-1" />
                  Hochladen
                </Button>
              </div>
            </div>

            {/* Additional Images */}
            <div className="space-y-4">
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <Button size="sm" variant="outline" className="w-full">
                    <Upload className="h-3 w-3 mr-1" />
                    .ico hochladen
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Social Media Bild</Label>
                  <Button size="sm" variant="outline" className="w-full">
                    <Upload className="h-3 w-3 mr-1" />
                    OG-Image hochladen
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Farbschema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Color */}
            <div className="space-y-3">
              <Label>Primärfarbe</Label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  style={{ backgroundColor: brandSettings.primaryColor }}
                  onClick={() =>
                    document.getElementById('primary-color')?.click()
                  }
                ></div>
                <Input
                  id="primary-color"
                  type="color"
                  value={brandSettings.primaryColor}
                  onChange={(e) =>
                    handleSettingChange('primaryColor', e.target.value)
                  }
                  className="w-16 h-12 p-1 border-0"
                />
                <Input
                  value={brandSettings.primaryColor}
                  onChange={(e) =>
                    handleSettingChange('primaryColor', e.target.value)
                  }
                  className="font-mono"
                  placeholder="#000000"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyColorToClipboard(brandSettings.primaryColor)
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              {/* Quick Color Presets */}
              <div className="flex space-x-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-200"
                    style={{ backgroundColor: color }}
                    onClick={() => handleSettingChange('primaryColor', color)}
                  />
                ))}
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-3">
              <Label>Sekundärfarbe</Label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  style={{ backgroundColor: brandSettings.secondaryColor }}
                ></div>
                <Input
                  type="color"
                  value={brandSettings.secondaryColor}
                  onChange={(e) =>
                    handleSettingChange('secondaryColor', e.target.value)
                  }
                  className="w-16 h-12 p-1 border-0"
                />
                <Input
                  value={brandSettings.secondaryColor}
                  onChange={(e) =>
                    handleSettingChange('secondaryColor', e.target.value)
                  }
                  className="font-mono"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <Label>Akzentfarbe</Label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  style={{ backgroundColor: brandSettings.accentColor }}
                ></div>
                <Input
                  type="color"
                  value={brandSettings.accentColor}
                  onChange={(e) =>
                    handleSettingChange('accentColor', e.target.value)
                  }
                  className="w-16 h-12 p-1 border-0"
                />
                <Input
                  value={brandSettings.accentColor}
                  onChange={(e) =>
                    handleSettingChange('accentColor', e.target.value)
                  }
                  className="font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typografie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Überschriften-Schriftart</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={brandSettings.headingFont}
                onChange={(e) =>
                  handleSettingChange('headingFont', e.target.value)
                }
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Text-Schriftart</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={brandSettings.bodyFont}
                onChange={(e) =>
                  handleSettingChange('bodyFont', e.target.value)
                }
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Schriftgröße</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={brandSettings.fontSize}
                onChange={(e) =>
                  handleSettingChange('fontSize', e.target.value)
                }
              >
                <option value="small">Klein</option>
                <option value="medium">Mittel</option>
                <option value="large">Groß</option>
              </select>
            </div>

            {/* Font Preview */}
            <div className="border rounded-lg p-4 space-y-2">
              <h3
                className="text-xl font-semibold"
                style={{ fontFamily: brandSettings.headingFont }}
              >
                Überschrift-Beispiel
              </h3>
              <p
                className="text-sm"
                style={{ fontFamily: brandSettings.bodyFont }}
              >
                Dies ist ein Beispieltext in der gewählten Text-Schriftart. Er
                zeigt, wie Ihr Text aussehen wird.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom CSS */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Erweiterte Anpassungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Benutzerdefinierte CSS</Label>
                <Badge variant="outline">Für Experten</Badge>
              </div>
              <Textarea
                value={brandSettings.customCss}
                onChange={(e) =>
                  handleSettingChange('customCss', e.target.value)
                }
                placeholder="/* Ihre CSS-Regeln hier */&#10;.custom-class { color: #000; }"
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-600">
                Fügen Sie benutzerdefinierte CSS-Regeln hinzu, um das
                Erscheinungsbild weiter anzupassen. Seien Sie vorsichtig, da
                falsche CSS-Regeln das Layout beeinträchtigen können.
              </p>
            </div>

            <Separator />

            {/* Template Selection */}
            <div className="space-y-4">
              <h4 className="font-medium">Template-Auswahl</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>E-Mail Template</Label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={brandSettings.emailTemplate}
                    onChange={(e) =>
                      handleSettingChange('emailTemplate', e.target.value)
                    }
                  >
                    <option value="default">Standard</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Rechnungs-Template</Label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={brandSettings.invoiceTemplate}
                    onChange={(e) =>
                      handleSettingChange('invoiceTemplate', e.target.value)
                    }
                  >
                    <option value="professional">Professional</option>
                    <option value="simple">Einfach</option>
                    <option value="detailed">Detailliert</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Report-Template</Label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={brandSettings.reportTemplate}
                    onChange={(e) =>
                      handleSettingChange('reportTemplate', e.target.value)
                    }
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Klassisch</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white p-4 border-t sticky bottom-0">
        <Button
          variant="outline"
          onClick={handleResetBranding}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Zurücksetzen
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Vorschau anzeigen
          </Button>
          <Button
            onClick={handleSaveBranding}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Branding speichern
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsBrandingPage;
