'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Cloud,
  CreditCard,
  Database,
  Download,
  FileArchive,
  HardDrive,
  History,
  Pause,
  RefreshCw,
  RotateCcw,
  Settings,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface BackupJob {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  progress: number;
  size: string;
  startTime: string;
  endTime?: string;
  duration?: string;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
  includeAttachments: boolean;
  encryptBackups: boolean;
  cloudStorage: boolean;
  storageProvider: 'aws' | 'azure' | 'google' | 'local';
}

const SettingsBackupPage = () => {
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    includeAttachments: true,
    encryptBackups: true,
    cloudStorage: true,
    storageProvider: 'aws',
  });

  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([
    {
      id: '1',
      name: 'Vollständiges System-Backup',
      type: 'full',
      status: 'completed',
      progress: 100,
      size: '2.4 GB',
      startTime: '2024-01-20 02:00:00',
      endTime: '2024-01-20 02:45:00',
      duration: '45 Min',
    },
    {
      id: '2',
      name: 'Inkrementelles Backup',
      type: 'incremental',
      status: 'completed',
      progress: 100,
      size: '156 MB',
      startTime: '2024-01-19 02:00:00',
      endTime: '2024-01-19 02:08:00',
      duration: '8 Min',
    },
    {
      id: '3',
      name: 'System-Backup (Geplant)',
      type: 'full',
      status: 'scheduled',
      progress: 0,
      size: '~2.5 GB',
      startTime: '2024-01-21 02:00:00',
    },
  ]);

  const [currentBackup, setCurrentBackup] = useState<BackupJob | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleSettingChange = (key: keyof BackupSettings, value: any) => {
    setBackupSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartBackup = (type: 'full' | 'incremental' | 'differential') => {
    const newJob: BackupJob = {
      id: Date.now().toString(),
      name:
        type === 'full'
          ? 'Vollständiges System-Backup'
          : type === 'incremental'
          ? 'Inkrementelles Backup'
          : 'Differentielles Backup',
      type,
      status: 'running',
      progress: 0,
      size: type === 'full' ? '~2.5 GB' : '~200 MB',
      startTime: new Date().toISOString(),
    };

    setBackupJobs((prev) => [newJob, ...prev]);
    setCurrentBackup(newJob);

    // Simulate backup progress
    const interval = setInterval(() => {
      setCurrentBackup((current) => {
        if (!current) return null;
        const newProgress = Math.min(current.progress + 10, 100);
        const updatedJob = { ...current, progress: newProgress };

        if (newProgress === 100) {
          updatedJob.status = 'completed';
          updatedJob.endTime = new Date().toISOString();
          updatedJob.duration = '15 Min';
          clearInterval(interval);
          setCurrentBackup(null);
        }

        setBackupJobs((prev) =>
          prev.map((job) => (job.id === current.id ? updatedJob : job))
        );

        return newProgress === 100 ? null : updatedJob;
      });
    }, 1000);
  };

  const handleExportData = async (dataType: string) => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = Math.min(prev + 15, 100);
        if (newProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setExportProgress(0);
            // Hier würde der Download getriggert
            console.log(`Exporting ${dataType} data...`);
          }, 500);
        }
        return newProgress;
      });
    }, 200);
  };

  const handleRestoreBackup = (backupId: string) => {
    console.log('Restoring backup:', backupId);
    // Hier würde die Restore-Logik implementiert
  };

  const getStatusColor = (status: BackupJob['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'scheduled':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: BackupJob['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalBackupSize = '8.7 GB';
  const availableSpace = '2.1 TB';
  const lastBackupDate = '20.01.2024 02:45:00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backup & Export</h1>
          <p className="text-gray-600 mt-1">
            Verwalten Sie Ihre Datensicherungen und Export-Optionen
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Gesichert
          </Badge>
          <Badge variant="outline">Letztes Backup: {lastBackupDate}</Badge>
        </div>
      </div>

      {/* Current Backup Status */}
      {currentBackup && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>{currentBackup.name}</strong> wird ausgeführt...
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {currentBackup.progress}%
                </div>
                <Progress
                  value={currentBackup.progress}
                  className="w-32 mt-1"
                />
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HardDrive className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Backup-Größe</p>
                  <p className="text-xl font-semibold">{totalBackupSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Erfolgreiche Backups</p>
                  <p className="text-xl font-semibold">47</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Geplante Backups</p>
                  <p className="text-xl font-semibold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Cloud className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cloud-Speicher</p>
                  <p className="text-xl font-semibold">{availableSpace}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup erstellen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => handleStartBackup('full')}
              className="w-full justify-start"
              disabled={!!currentBackup}
            >
              <Database className="h-4 w-4 mr-2" />
              Vollständiges Backup
            </Button>

            <Button
              variant="outline"
              onClick={() => handleStartBackup('incremental')}
              className="w-full justify-start"
              disabled={!!currentBackup}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Inkrementelles Backup
            </Button>

            <Button
              variant="outline"
              onClick={() => handleStartBackup('differential')}
              className="w-full justify-start"
              disabled={!!currentBackup}
            >
              <Zap className="h-4 w-4 mr-2" />
              Differentielles Backup
            </Button>

            <Separator />

            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Vollständig:</strong> Alle Daten (2-3 GB)
              </p>
              <p>
                <strong>Inkrementell:</strong> Nur Änderungen (100-300 MB)
              </p>
              <p>
                <strong>Differentiell:</strong> Seit letztem Full-Backup
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Daten exportieren
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isExporting && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Export läuft...</span>
                  <span className="text-sm">{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('customers')}
                disabled={isExporting}
                className="justify-start"
              >
                <Users className="h-3 w-3 mr-1" />
                Kunden
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('analytics')}
                disabled={isExporting}
                className="justify-start"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Analytics
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('billing')}
                disabled={isExporting}
                className="justify-start"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Rechnungen
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData('settings')}
                disabled={isExporting}
                className="justify-start"
              >
                <Settings className="h-3 w-3 mr-1" />
                Einstellungen
              </Button>
            </div>

            <Separator />

            <Button
              variant="outline"
              onClick={() => handleExportData('complete')}
              disabled={isExporting}
              className="w-full justify-start"
            >
              <FileArchive className="h-4 w-4 mr-2" />
              Kompletter Export
            </Button>

            <div className="text-xs text-gray-600">
              Formate: CSV, JSON, XML verfügbar
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Backup-Einstellungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Automatische Backups
                </Label>
                <p className="text-xs text-gray-600">Regelmäßige Sicherungen</p>
              </div>
              <Switch
                checked={backupSettings.autoBackup}
                onCheckedChange={(checked) =>
                  handleSettingChange('autoBackup', checked)
                }
              />
            </div>

            {backupSettings.autoBackup && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm">Häufigkeit</Label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={backupSettings.backupFrequency}
                    onChange={(e) =>
                      handleSettingChange('backupFrequency', e.target.value)
                    }
                  >
                    <option value="daily">Täglich</option>
                    <option value="weekly">Wöchentlich</option>
                    <option value="monthly">Monatlich</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Backup-Zeit</Label>
                  <Input
                    type="time"
                    value={backupSettings.backupTime}
                    onChange={(e) =>
                      handleSettingChange('backupTime', e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label className="text-sm">Aufbewahrung (Tage)</Label>
              <Input
                type="number"
                value={backupSettings.retentionDays}
                onChange={(e) =>
                  handleSettingChange('retentionDays', parseInt(e.target.value))
                }
                min={1}
                max={365}
                className="text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Anhänge einschließen
                </Label>
                <p className="text-xs text-gray-600">Bilder und Dateien</p>
              </div>
              <Switch
                checked={backupSettings.includeAttachments}
                onCheckedChange={(checked) =>
                  handleSettingChange('includeAttachments', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Verschlüsselung</Label>
                <p className="text-xs text-gray-600">AES-256 Verschlüsselung</p>
              </div>
              <Switch
                checked={backupSettings.encryptBackups}
                onCheckedChange={(checked) =>
                  handleSettingChange('encryptBackups', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Cloud-Speicher</Label>
                <p className="text-xs text-gray-600">Externe Sicherung</p>
              </div>
              <Switch
                checked={backupSettings.cloudStorage}
                onCheckedChange={(checked) =>
                  handleSettingChange('cloudStorage', checked)
                }
              />
            </div>

            {backupSettings.cloudStorage && (
              <div className="space-y-2">
                <Label className="text-sm">Storage Provider</Label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={backupSettings.storageProvider}
                  onChange={(e) =>
                    handleSettingChange('storageProvider', e.target.value)
                  }
                >
                  <option value="aws">Amazon S3</option>
                  <option value="azure">Azure Storage</option>
                  <option value="google">Google Cloud</option>
                  <option value="local">Lokal</option>
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backup History */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Backup-Verlauf
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backupJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${getStatusColor(
                        job.status
                      ).replace(
                        'bg-',
                        'bg-opacity-10 bg-'
                      )} flex items-center justify-center`}
                    >
                      {getStatusIcon(job.status)}
                    </div>

                    <div>
                      <h4 className="font-medium">{job.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          {new Date(job.startTime).toLocaleString('de-DE')}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {job.type === 'full'
                            ? 'Vollständig'
                            : job.type === 'incremental'
                            ? 'Inkrementell'
                            : 'Differentiell'}
                        </Badge>
                        <span>{job.size}</span>
                        {job.duration && <span>{job.duration}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {job.status === 'running' && (
                      <div className="flex items-center space-x-2">
                        <Progress value={job.progress} className="w-20" />
                        <span className="text-sm">{job.progress}%</span>
                      </div>
                    )}

                    {job.status === 'completed' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestoreBackup(job.id)}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Wiederherstellen
                        </Button>

                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}

                    {job.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-3 w-3 mr-1" />
                        Pausieren
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {backupJobs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Noch keine Backups erstellt</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white p-4 border-t sticky bottom-0">
        <div className="text-sm text-gray-600">
          Nächstes automatisches Backup: Heute um {backupSettings.backupTime}{' '}
          Uhr
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleStartBackup('full')}
            disabled={!!currentBackup}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Jetzt sichern
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsBackupPage;
