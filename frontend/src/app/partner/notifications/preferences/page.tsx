'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe,
  Info,
  Mail,
  MessageSquare,
  Package,
  RefreshCw,
  Save,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Users,
  VolumeX,
  Webhook,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PartnerLayout from '../../../../components/partner/layout/PartnerLayout';
import { useAuth } from '../../../../context/AuthContext';

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack' | 'teams';
  enabled: boolean;
  configuration: {
    address?: string;
    endpoint?: string;
    token?: string;
  };
}

interface NotificationTopic {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  defaultChannels: string[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  enabled: boolean;
}

interface NotificationPreferences {
  channels: NotificationChannel[];
  topics: NotificationTopic[];
  globalSettings: {
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    };
    digestMode: {
      enabled: boolean;
      frequency: 'daily' | 'weekly';
      time: string;
    };
    language: string;
    doNotDisturb: boolean;
  };
}

export default function NotificationsPreferencesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState('channels');

  // Mock notification preferences
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    channels: [
      {
        id: 'email',
        name: 'E-Mail',
        type: 'email',
        enabled: true,
        configuration: {
          address: user?.email || 'partner@autocare.de',
        },
      },
      {
        id: 'sms',
        name: 'SMS',
        type: 'sms',
        enabled: false,
        configuration: {
          address: '+49 123 456789',
        },
      },
      {
        id: 'push',
        name: 'Browser-Push',
        type: 'push',
        enabled: true,
        configuration: {},
      },
      {
        id: 'webhook',
        name: 'Webhook',
        type: 'webhook',
        enabled: false,
        configuration: {
          endpoint: 'https://api.partner-system.de/notifications',
        },
      },
      {
        id: 'slack',
        name: 'Slack',
        type: 'slack',
        enabled: true,
        configuration: {
          endpoint: 'https://hooks.slack.com/services/T123/B456/xyz789',
        },
      },
    ],
    topics: [
      {
        id: 'order_created',
        name: 'Neue Bestellung eingegangen',
        description: 'Benachrichtigung bei neuen Bestellungen von Kunden',
        category: 'orders',
        priority: 'high',
        defaultChannels: ['email', 'push'],
        frequency: 'immediate',
        enabled: true,
      },
      {
        id: 'payment_completed',
        name: 'Zahlung abgeschlossen',
        description: 'Bestätigung über erfolgreiche Zahlungen',
        category: 'billing',
        priority: 'medium',
        defaultChannels: ['email'],
        frequency: 'immediate',
        enabled: true,
      },
      {
        id: 'low_stock',
        name: 'Niedriger Lagerbestand',
        description: 'Warnung bei kritischen Lagerbeständen',
        category: 'inventory',
        priority: 'high',
        defaultChannels: ['email', 'slack'],
        frequency: 'immediate',
        enabled: true,
      },
      {
        id: 'customer_registered',
        name: 'Neue Kundenregistrierung',
        description: 'Benachrichtigung über neue Kundenregistrierungen',
        category: 'customers',
        priority: 'medium',
        defaultChannels: ['email'],
        frequency: 'daily',
        enabled: false,
      },
      {
        id: 'weekly_report',
        name: 'Wöchentlicher Bericht',
        description: 'Zusammenfassung der wichtigsten Geschäftskennzahlen',
        category: 'analytics',
        priority: 'low',
        defaultChannels: ['email'],
        frequency: 'weekly',
        enabled: true,
      },
      {
        id: 'api_error',
        name: 'API-Fehler',
        description: 'Benachrichtigung über kritische API-Fehler',
        category: 'system',
        priority: 'critical',
        defaultChannels: ['email', 'sms', 'slack'],
        frequency: 'immediate',
        enabled: true,
      },
      {
        id: 'security_alert',
        name: 'Sicherheitsalarm',
        description: 'Verdächtige Aktivitäten oder Sicherheitswarnungen',
        category: 'security',
        priority: 'critical',
        defaultChannels: ['email', 'sms'],
        frequency: 'immediate',
        enabled: true,
      },
      {
        id: 'maintenance_notice',
        name: 'Wartungsbenachrichtigungen',
        description: 'Informationen über geplante Systemwartungen',
        category: 'system',
        priority: 'medium',
        defaultChannels: ['email'],
        frequency: 'immediate',
        enabled: true,
      },
    ],
    globalSettings: {
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00',
        timezone: 'Europe/Berlin',
      },
      digestMode: {
        enabled: false,
        frequency: 'daily',
        time: '09:00',
      },
      language: 'de',
      doNotDisturb: false,
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/partner/login');
      return;
    }

    const fetchPreferences = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchPreferences();
  }, [user, router]);

  const handleSavePreferences = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSaving(false);
  };

  const updateChannelEnabled = (channelId: string, enabled: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      channels: prev.channels.map((channel) =>
        channel.id === channelId ? { ...channel, enabled } : channel
      ),
    }));
  };

  const updateTopicEnabled = (topicId: string, enabled: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) =>
        topic.id === topicId ? { ...topic, enabled } : topic
      ),
    }));
  };

  const updateTopicChannels = (
    topicId: string,
    channelId: string,
    enabled: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) => {
        if (topic.id === topicId) {
          const defaultChannels = enabled
            ? [...topic.defaultChannels, channelId]
            : topic.defaultChannels.filter((id) => id !== channelId);
          return { ...topic, defaultChannels };
        }
        return topic;
      }),
    }));
  };

  const getChannelIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      email: <Mail className="h-4 w-4" />,
      sms: <Smartphone className="h-4 w-4" />,
      push: <Bell className="h-4 w-4" />,
      webhook: <Webhook className="h-4 w-4" />,
      slack: <MessageSquare className="h-4 w-4" />,
      teams: <MessageSquare className="h-4 w-4" />,
    };
    return icons[type] || <Bell className="h-4 w-4" />;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      orders: <ShoppingCart className="h-4 w-4" />,
      billing: <CreditCard className="h-4 w-4" />,
      inventory: <Package className="h-4 w-4" />,
      customers: <Users className="h-4 w-4" />,
      analytics: <BarChart3 className="h-4 w-4" />,
      system: <Settings className="h-4 w-4" />,
      security: <Shield className="h-4 w-4" />,
    };
    return icons[category] || <Bell className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Niedrig',
      medium: 'Mittel',
      high: 'Hoch',
      critical: 'Kritisch',
    };
    return labels[priority] || priority;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      immediate: 'Sofort',
      hourly: 'Stündlich',
      daily: 'Täglich',
      weekly: 'Wöchentlich',
    };
    return labels[frequency] || frequency;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      orders: 'Bestellungen',
      billing: 'Abrechnung',
      inventory: 'Lager',
      customers: 'Kunden',
      analytics: 'Analytics',
      system: 'System',
      security: 'Sicherheit',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Benachrichtigungseinstellungen werden geladen...
            </p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Benachrichtigungs-Einstellungen
            </h1>
            <p className="text-gray-600 mt-1">
              Konfigurieren Sie Ihre Benachrichtigungskanäle und -präferenzen
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>

            <Button onClick={handleSavePreferences} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Speichern
            </Button>
          </div>
        </div>

        {/* Global Settings Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Hinweis:</strong> Kritische Sicherheitsbenachrichtigungen
            werden unabhängig von Ihren Einstellungen immer zugestellt.
          </AlertDescription>
        </Alert>

        {/* Main Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="channels">Kanäle</TabsTrigger>
            <TabsTrigger value="topics">Themen</TabsTrigger>
            <TabsTrigger value="settings">Globale Einstellungen</TabsTrigger>
          </TabsList>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungskanäle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {preferences.channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(channel.type)}
                        <span className="font-medium">{channel.name}</span>
                      </div>

                      {channel.configuration.address && (
                        <div className="text-sm text-gray-600">
                          {channel.configuration.address}
                        </div>
                      )}

                      {channel.configuration.endpoint && (
                        <div className="text-sm text-gray-600">
                          {channel.configuration.endpoint}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={channel.enabled}
                        onCheckedChange={(checked) =>
                          updateChannelEnabled(channel.id, checked)
                        }
                      />
                      {channel.enabled ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Topics Tab */}
          <TabsContent value="topics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungsthemen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {preferences.topics.map((topic) => (
                  <div key={topic.id} className="border rounded-lg">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(topic.category)}
                            <h3 className="font-medium">{topic.name}</h3>
                            <Badge
                              className={getPriorityColor(topic.priority)}
                              variant="secondary"
                            >
                              {getPriorityLabel(topic.priority)}
                            </Badge>
                            <Badge variant="outline">
                              {getFrequencyLabel(topic.frequency)}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">
                            {topic.description}
                          </p>

                          <div className="text-xs text-gray-500">
                            Kategorie: {getCategoryLabel(topic.category)}
                          </div>
                        </div>

                        <Switch
                          checked={topic.enabled}
                          onCheckedChange={(checked) =>
                            updateTopicEnabled(topic.id, checked)
                          }
                        />
                      </div>

                      {topic.enabled && (
                        <>
                          <Separator className="my-3" />
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Benachrichtigungskanäle
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {preferences.channels.map((channel) => (
                                <div
                                  key={channel.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`${topic.id}-${channel.id}`}
                                    checked={topic.defaultChannels.includes(
                                      channel.id
                                    )}
                                    onCheckedChange={(checked) =>
                                      updateTopicChannels(
                                        topic.id,
                                        channel.id,
                                        !!checked
                                      )
                                    }
                                    disabled={!channel.enabled}
                                  />
                                  <Label
                                    htmlFor={`${topic.id}-${channel.id}`}
                                    className={`text-sm flex items-center gap-1 ${
                                      !channel.enabled ? 'text-gray-400' : ''
                                    }`}
                                  >
                                    {getChannelIcon(channel.type)}
                                    {channel.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quiet Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <VolumeX className="h-5 w-5" />
                    Ruhezeiten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Ruhezeiten aktivieren</Label>
                    <Switch
                      checked={preferences.globalSettings.quietHours.enabled}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            quietHours: {
                              ...prev.globalSettings.quietHours,
                              enabled: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  {preferences.globalSettings.quietHours.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Von</Label>
                          <Input
                            type="time"
                            value={preferences.globalSettings.quietHours.start}
                            onChange={(e) =>
                              setPreferences((prev) => ({
                                ...prev,
                                globalSettings: {
                                  ...prev.globalSettings,
                                  quietHours: {
                                    ...prev.globalSettings.quietHours,
                                    start: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Bis</Label>
                          <Input
                            type="time"
                            value={preferences.globalSettings.quietHours.end}
                            onChange={(e) =>
                              setPreferences((prev) => ({
                                ...prev,
                                globalSettings: {
                                  ...prev.globalSettings,
                                  quietHours: {
                                    ...prev.globalSettings.quietHours,
                                    end: e.target.value,
                                  },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">Zeitzone</Label>
                        <Select
                          value={preferences.globalSettings.quietHours.timezone}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Europe/Berlin">
                              Europa/Berlin
                            </SelectItem>
                            <SelectItem value="Europe/Vienna">
                              Europa/Wien
                            </SelectItem>
                            <SelectItem value="Europe/Zurich">
                              Europa/Zürich
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Digest Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Zusammenfassungs-Modus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Zusammenfassungen aktivieren</Label>
                    <Switch
                      checked={preferences.globalSettings.digestMode.enabled}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            digestMode: {
                              ...prev.globalSettings.digestMode,
                              enabled: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  {preferences.globalSettings.digestMode.enabled && (
                    <>
                      <div>
                        <Label className="text-sm">Häufigkeit</Label>
                        <Select
                          value={
                            preferences.globalSettings.digestMode.frequency
                          }
                          onValueChange={(value) =>
                            setPreferences((prev) => ({
                              ...prev,
                              globalSettings: {
                                ...prev.globalSettings,
                                digestMode: {
                                  ...prev.globalSettings.digestMode,
                                  frequency: value as 'daily' | 'weekly',
                                },
                              },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Täglich</SelectItem>
                            <SelectItem value="weekly">Wöchentlich</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Uhrzeit</Label>
                        <Input
                          type="time"
                          value={preferences.globalSettings.digestMode.time}
                          onChange={(e) =>
                            setPreferences((prev) => ({
                              ...prev,
                              globalSettings: {
                                ...prev.globalSettings,
                                digestMode: {
                                  ...prev.globalSettings.digestMode,
                                  time: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Do Not Disturb */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Nicht stören
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Nicht-stören-Modus</Label>
                      <p className="text-sm text-gray-600">
                        Alle nicht-kritischen Benachrichtigungen deaktivieren
                      </p>
                    </div>
                    <Switch
                      checked={preferences.globalSettings.doNotDisturb}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            doNotDisturb: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  {preferences.globalSettings.doNotDisturb && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Kritische Sicherheitsbenachrichtigungen werden weiterhin
                        zugestellt.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Sprach-Einstellungen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Benachrichtigungssprache</Label>
                    <Select
                      value={preferences.globalSettings.language}
                      onValueChange={(value) =>
                        setPreferences((prev) => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            language: value,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schnellaktionen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/notifications/templates')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Vorlagen verwalten
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => router.push('/partner/notifications/analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics anzeigen
            </Button>

            <Button variant="outline" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Test-Benachrichtigung
            </Button>

            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Erweiterte Einstellungen
            </Button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
