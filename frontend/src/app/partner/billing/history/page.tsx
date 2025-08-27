'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useState } from 'react';

import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  XCircle,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal';
  description: string;
  taxAmount: number;
  subTotal: number;
}

interface Payment {
  id: string;
  invoiceId: string;
  date: Date;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'paypal';
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  description: string;
}

const BillingHistoryPage = () => {
  const [selectedTab, setSelectedTab] = useState<'invoices' | 'payments'>(
    'invoices'
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2024-001',
      date: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      amount: 79.0,
      status: 'paid',
      paymentMethod: 'credit_card',
      description: 'Professional Plan - Januar 2024',
      taxAmount: 15.01,
      subTotal: 63.99,
    },
    {
      id: '2',
      number: 'INV-2024-002',
      date: new Date('2024-02-15'),
      dueDate: new Date('2024-03-15'),
      amount: 79.0,
      status: 'paid',
      paymentMethod: 'bank_transfer',
      description: 'Professional Plan - Februar 2024',
      taxAmount: 15.01,
      subTotal: 63.99,
    },
    {
      id: '3',
      number: 'INV-2024-003',
      date: new Date('2024-03-15'),
      dueDate: new Date('2024-04-15'),
      amount: 79.0,
      status: 'pending',
      paymentMethod: 'credit_card',
      description: 'Professional Plan - März 2024',
      taxAmount: 15.01,
      subTotal: 63.99,
    },
    {
      id: '4',
      number: 'INV-2024-004',
      date: new Date('2024-04-15'),
      dueDate: new Date('2024-05-15'),
      amount: 79.0,
      status: 'overdue',
      paymentMethod: 'credit_card',
      description: 'Professional Plan - April 2024',
      taxAmount: 15.01,
      subTotal: 63.99,
    },
  ];

  const payments: Payment[] = [
    {
      id: '1',
      invoiceId: '1',
      date: new Date('2024-01-16'),
      amount: 79.0,
      method: 'credit_card',
      status: 'completed',
      transactionId: 'txn_1234567890',
      description: 'Zahlung für INV-2024-001',
    },
    {
      id: '2',
      invoiceId: '2',
      date: new Date('2024-02-16'),
      amount: 79.0,
      method: 'bank_transfer',
      status: 'completed',
      transactionId: 'txn_0987654321',
      description: 'Zahlung für INV-2024-002',
    },
    {
      id: '3',
      invoiceId: '3',
      date: new Date('2024-03-16'),
      amount: 79.0,
      method: 'credit_card',
      status: 'pending',
      transactionId: 'txn_1122334455',
      description: 'Zahlung für INV-2024-003',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Bezahlt
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Ausstehend
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Überfällig
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Fehlgeschlagen
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline">
            <FileText className="h-3 w-3 mr-1" />
            Entwurf
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <FileText className="h-4 w-4" />;
      case 'paypal':
        return <div className="h-4 w-4 bg-blue-500 rounded"></div>;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Kreditkarte';
      case 'bank_transfer':
        return 'Banküberweisung';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || invoice.status === filterStatus;
    const matchesDateFrom = !dateFrom || invoice.date >= dateFrom;
    const matchesDateTo = !dateTo || invoice.date <= dateTo;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || payment.status === filterStatus;
    const matchesDateFrom = !dateFrom || payment.date >= dateFrom;
    const matchesDateTo = !dateTo || payment.date <= dateTo;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Download invoice:', invoiceId);
    // Hier würde die Download-Logik implementiert
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('View invoice:', invoiceId);
    // Hier würde die Anzeige-Logik implementiert
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rechnungshistorie
          </h1>
          <p className="text-gray-600 mt-1">
            Verwalten Sie Ihre Rechnungen und Zahlungen
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Alle exportieren
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setSelectedTab('invoices')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            selectedTab === 'invoices'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rechnungen
        </button>
        <button
          onClick={() => setSelectedTab('payments')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            selectedTab === 'payments'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Zahlungen
        </button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filter & Suche</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Filter ausblenden' : 'Filter anzeigen'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nach Rechnungsnummer oder Beschreibung suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        {selectedTab === 'invoices' ? (
                          <>
                            <SelectItem value="paid">Bezahlt</SelectItem>
                            <SelectItem value="pending">Ausstehend</SelectItem>
                            <SelectItem value="overdue">Überfällig</SelectItem>
                            <SelectItem value="draft">Entwurf</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="completed">
                              Abgeschlossen
                            </SelectItem>
                            <SelectItem value="pending">Ausstehend</SelectItem>
                            <SelectItem value="failed">
                              Fehlgeschlagen
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date From */}
                  <div className="space-y-2">
                    <Label>Von Datum</Label>
                    <Input
                      type="date"
                      value={dateFrom ? format(dateFrom, 'yyyy-MM-dd') : ''}
                      onChange={(e) =>
                        setDateFrom(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Date To */}
                  <div className="space-y-2">
                    <Label>Bis Datum</Label>
                    <Input
                      type="date"
                      value={dateTo ? format(dateTo, 'yyyy-MM-dd') : ''}
                      onChange={(e) =>
                        setDateTo(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoices Tab */}
      {selectedTab === 'invoices' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Rechnungen
              <Badge variant="outline">
                {filteredInvoices.length} Einträge
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {invoice.number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {invoice.description}
                        </p>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {invoice.amount.toFixed(2)} €
                      </p>
                      <p className="text-sm text-gray-600">
                        inkl. {invoice.taxAmount.toFixed(2)} € MwSt.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Rechnungsdatum</p>
                      <p className="font-medium">
                        {format(invoice.date, 'dd.MM.yyyy', { locale: de })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fälligkeitsdatum</p>
                      <p className="font-medium">
                        {format(invoice.dueDate, 'dd.MM.yyyy', { locale: de })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Zahlungsmethode</p>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(invoice.paymentMethod)}
                        <span className="font-medium">
                          {getPaymentMethodLabel(invoice.paymentMethod)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Nettobetrag</p>
                      <p className="font-medium">
                        {invoice.subTotal.toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Anzeigen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Herunterladen
                    </Button>
                  </div>
                </div>
              ))}

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Keine Rechnungen gefunden
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filterStatus !== 'all' || dateFrom || dateTo
                      ? 'Versuchen Sie, Ihre Filter zu ändern.'
                      : 'Es wurden noch keine Rechnungen erstellt.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Tab */}
      {selectedTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Zahlungen
              <Badge variant="outline">
                {filteredPayments.length} Einträge
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {payment.transactionId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {payment.description}
                        </p>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {payment.amount.toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Zahlungsdatum</p>
                      <p className="font-medium">
                        {format(payment.date, 'dd.MM.yyyy HH:mm', {
                          locale: de,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Zahlungsmethode</p>
                      <div className="flex items-center space-x-2">
                        {getPaymentMethodIcon(payment.method)}
                        <span className="font-medium">
                          {getPaymentMethodLabel(payment.method)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Rechnung</p>
                      <p className="font-medium">
                        {invoices.find((inv) => inv.id === payment.invoiceId)
                          ?.number || 'Nicht gefunden'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Keine Zahlungen gefunden
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filterStatus !== 'all' || dateFrom || dateTo
                      ? 'Versuchen Sie, Ihre Filter zu ändern.'
                      : 'Es wurden noch keine Zahlungen verarbeitet.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingHistoryPage;
