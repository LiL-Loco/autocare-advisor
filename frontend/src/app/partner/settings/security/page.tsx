'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Key,
  Lock,
  MapPin,
  Monitor,
  QrCode,
  Shield,
  Smartphone,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
  isActive: boolean;
}

interface LoginAttempt {
  id: string;
  ip: string;
  location: string;
  timestamp: Date;
  success: boolean;
  userAgent: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed?: Date;
  created: Date;
  isActive: boolean;
  expiresAt?: Date;
}

const SettingsSecurityPage = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    sessionTimeout: 24,
    allowMultipleSessions: true,
    logSecurityEvents: true,
    emailSecurityAlerts: true,
    requirePasswordChange: false,
    allowApiAccess: true,
    enableAuditLog: true,
  });

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      ip: '192.168.1.100',
      location: 'München, Deutschland',
      lastActive: new Date(),
      isCurrent: true,
      isActive: true,
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      ip: '192.168.1.101',
      location: 'München, Deutschland',
      lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isCurrent: false,
      isActive: true,
    },
    {
      id: '3',
      device: 'Windows PC',
      browser: 'Firefox 120.0',
      ip: '10.0.0.50',
      location: 'Berlin, Deutschland',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isCurrent: false,
      isActive: false,
    },
  ]);

  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([
    {
      id: '1',
      ip: '192.168.1.100',
      location: 'München, Deutschland',
      timestamp: new Date(),
      success: true,
      userAgent: 'Chrome/120.0 (macOS)',
    },
    {
      id: '2',
      ip: '85.214.132.45',
      location: 'Unbekannt',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
      success: false,
      userAgent: 'Chrome/119.0 (Windows)',
    },
    {
      id: '3',
      ip: '192.168.1.101',
      location: 'München, Deutschland',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      success: true,
      userAgent: 'Safari Mobile (iOS)',
    },
  ]);

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwörter stimmen nicht überein');
      return;
    }
    console.log('Changing password...');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    // Hier würde die API-Logik implementiert
  };

  const handleTwoFactorSetup = () => {
    // Generate backup codes
    const codes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
    setTwoFactorEnabled(true);
    setShowTwoFactorSetup(false);
    setShowBackupCodes(true);
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const handleTerminateAllSessions = () => {
    setSessions((prev) => prev.filter((session) => session.isCurrent));
  };

  const downloadSecurityReport = () => {
    console.log('Downloading security report...');
    // Hier würde die Download-Logik implementiert
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
    setShowBackupCodes(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sicherheitseinstellungen
          </h1>
          <p className="text-gray-600 mt-1">
            Schützen Sie Ihren Account mit erweiterten Sicherheitsfeatures
          </p>
        </div>
        <Button
          variant="outline"
          onClick={downloadSecurityReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Sicherheitsbericht herunterladen
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Passwort & Authentifizierung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="font-medium">Passwort ändern</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Aktuelles Passwort</Label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Neues Passwort</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Passwort bestätigen</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full">
                  Passwort aktualisieren
                </Button>
              </div>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Zwei-Faktor-Authentifizierung</h3>
                  <p className="text-sm text-gray-600">
                    {twoFactorEnabled
                      ? 'Aktiviert und sicher'
                      : 'Zusätzliche Sicherheit für Ihren Account'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactorEnabled && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Aktiv
                    </Badge>
                  )}
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
              </div>

              {twoFactorEnabled ? (
                <div className="space-y-3 bg-green-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-green-800">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">2FA ist aktiviert</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateBackupCodes}
                      className="flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Backup-Codes generieren
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTwoFactorEnabled(false)}
                      className="text-red-600 hover:text-red-700"
                    >
                      2FA deaktivieren
                    </Button>
                  </div>
                </div>
              ) : (
                <Dialog
                  open={showTwoFactorSetup}
                  onOpenChange={setShowTwoFactorSetup}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <QrCode className="h-4 w-4 mr-2" />
                      2FA einrichten
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Zwei-Faktor-Authentifizierung einrichten
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <QrCode className="h-16 w-16 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Scannen Sie den QR-Code mit Ihrer Authenticator-App
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Oder geben Sie diesen Code manuell ein:</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value="JBSWY3DPEHPK3PXP"
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bestätigungscode eingeben:</Label>
                        <Input placeholder="123456" maxLength={6} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowTwoFactorSetup(false)}
                      >
                        Abbrechen
                      </Button>
                      <Button onClick={handleTwoFactorSetup}>
                        2FA aktivieren
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sicherheitsrichtlinien
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>2FA für alle Aktionen erforderlich</Label>
                  <p className="text-sm text-gray-600">
                    Sicherheitskritische Aktionen benötigen 2FA
                  </p>
                </div>
                <Switch
                  checked={securitySettings.requireTwoFactor}
                  onCheckedChange={(value) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      requireTwoFactor: value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mehrere Sessions erlauben</Label>
                  <p className="text-sm text-gray-600">
                    Gleichzeitige Anmeldung auf mehreren Geräten
                  </p>
                </div>
                <Switch
                  checked={securitySettings.allowMultipleSessions}
                  onCheckedChange={(value) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      allowMultipleSessions: value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sicherheitsereignisse protokollieren</Label>
                  <p className="text-sm text-gray-600">
                    Detaillierte Logs für Sicherheitsanalyse
                  </p>
                </div>
                <Switch
                  checked={securitySettings.logSecurityEvents}
                  onCheckedChange={(value) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      logSecurityEvents: value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>E-Mail bei Sicherheitsereignissen</Label>
                  <p className="text-sm text-gray-600">
                    Benachrichtigung bei verdächtigen Aktivitäten
                  </p>
                </div>
                <Switch
                  checked={securitySettings.emailSecurityAlerts}
                  onCheckedChange={(value) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      emailSecurityAlerts: value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>API-Zugriff aktiviert</Label>
                  <p className="text-sm text-gray-600">
                    Programmatischer Zugriff über API-Keys
                  </p>
                </div>
                <Switch
                  checked={securitySettings.allowApiAccess}
                  onCheckedChange={(value) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      allowApiAccess: value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit-Log aktivieren</Label>
                  <p className="text-sm text-gray-600">
                    Vollständige Protokollierung aller Aktionen
                  </p>
                </div>
                <Switch
                  checked={securitySettings.enableAuditLog}
                  onCheckedChange={(value) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      enableAuditLog: value,
                    }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Session-Timeout (Stunden)</Label>
              <Input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    sessionTimeout: parseInt(e.target.value),
                  }))
                }
                min="1"
                max="168"
              />
              <p className="text-sm text-gray-600">
                Automatisches Ausloggen nach Inaktivität
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Aktive Sessions
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTerminateAllSessions}
                className="text-red-600 hover:text-red-700"
              >
                Alle beenden
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{session.device}</h3>
                        <p className="text-sm text-gray-600">
                          {session.browser}
                        </p>
                      </div>
                      {session.isCurrent && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Aktuell
                        </Badge>
                      )}
                      {!session.isActive && (
                        <Badge variant="outline">Inaktiv</Badge>
                      )}
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">IP-Adresse</p>
                      <p className="font-mono">{session.ip}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Standort</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{session.location}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Zuletzt aktiv</p>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>
                          {format(session.lastActive, 'dd.MM.yyyy HH:mm', {
                            locale: de,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Login History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Login-Verlauf
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loginAttempts.map((attempt) => (
                <div key={attempt.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {attempt.success ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Erfolgreich
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <X className="h-3 w-3 mr-1" />
                          Fehlgeschlagen
                        </Badge>
                      )}
                      <span className="text-sm">
                        {format(attempt.timestamp, 'dd.MM.yyyy HH:mm', {
                          locale: de,
                        })}
                      </span>
                    </div>
                    {!attempt.success && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">IP-Adresse</p>
                      <p className="font-mono">{attempt.ip}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Standort</p>
                      <p>{attempt.location}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Browser</p>
                      <p>{attempt.userAgent}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Codes Dialog */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Backup-Codes für 2FA</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">Wichtig!</p>
                  <p>
                    Speichern Sie diese Codes sicher. Sie können jeden Code nur
                    einmal verwenden.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-gray-50 p-4 rounded-md">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded"
                >
                  <span>{code}</span>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowBackupCodes(false)}>
              Codes gespeichert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Button */}
      <div className="flex justify-end bg-white p-4 border-t sticky bottom-0">
        <Button className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Sicherheitseinstellungen speichern
        </Button>
      </div>
    </div>
  );
};

export default SettingsSecurityPage;
