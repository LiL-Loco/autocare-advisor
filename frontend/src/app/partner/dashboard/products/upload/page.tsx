'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Upload,
  XCircle,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ImportJob {
  id: string;
  original_filename: string;
  file_size: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number;
  processed_rows: number;
  successful_rows: number;
  failed_rows: number;
  error_details: any[];
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

interface UploadError {
  message: string;
  type: 'validation' | 'upload' | 'processing';
}

const CSV_TEMPLATE_HEADERS = [
  'name',
  'description',
  'brand',
  'category',
  'price',
  'image',
  'shopName',
  'shopUrl',
];

const SAMPLE_CSV_DATA = [
  [
    'Chemical Guys WAC_201_16',
    'Premium Carnauba Wax für Tiefglanz',
    'Chemical Guys',
    'Polituren & Wachse',
    '89.99',
    'https://example.com/wax.jpg',
    'AutoCare Shop',
    'https://shop.example.com',
  ],
  [
    'Sonax 03142000',
    'Autoshampoo konzentriert für Handwäsche',
    'Sonax',
    'Lackreinigung',
    '12.99',
    'https://example.com/shampoo.jpg',
    'AutoCare Shop',
    'https://shop.example.com',
  ],
];

export default function ProductImportPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [error, setError] = useState<UploadError | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    setError(null);

    // Validate file type
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError({
        message: 'Bitte wählen Sie eine CSV-Datei aus.',
        type: 'validation',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError({
        message: 'Die Datei ist zu groß. Maximale Dateigröße: 10MB.',
        type: 'validation',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);
      formData.append('partnerId', '64a12345-6789-4012-9345-678901234567'); // Mock partner ID

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-management/import/csv`,
        {
          method: 'POST',
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload fehlgeschlagen');
      }

      const result = await response.json();

      if (result.success) {
        // Add new job to the list
        await fetchImportJobs();
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Upload fehlgeschlagen');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError({
        message: err.message || 'Ein Fehler ist beim Upload aufgetreten.',
        type: 'upload',
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const fetchImportJobs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-management/import/jobs?partnerId=64a12345-6789-4012-9345-678901234567&limit=10`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setImportJobs(result.data.jobs || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch import jobs:', err);
    }
  };

  const downloadTemplate = () => {
    const csvContent = [
      CSV_TEMPLATE_HEADERS.join(','),
      ...SAMPLE_CSV_DATA.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'product_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      processing: 'secondary',
      pending: 'outline',
    } as const;

    const labels = {
      completed: 'Abgeschlossen',
      failed: 'Fehler',
      processing: 'Verarbeitung',
      pending: 'Wartend',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Load import jobs on component mount
  useEffect(() => {
    fetchImportJobs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Produkte Importieren
        </h1>
        <p className="text-gray-600">
          Laden Sie Ihre Produkte per CSV-Datei hoch und verwalten Sie Ihre
          Imports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSV-Datei hochladen
              </CardTitle>
              <CardDescription>
                Ziehen Sie Ihre CSV-Datei hierher oder klicken Sie zum
                Auswählen. Maximale Dateigröße: 10MB
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag & Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />

                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      CSV-Datei hier ablegen
                    </p>
                    <p className="text-sm text-gray-500">
                      oder klicken zum Auswählen
                    </p>
                  </>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <Alert
                  variant={
                    error.type === 'validation' ? 'destructive' : 'destructive'
                  }
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Fehler</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload läuft...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Upload Button */}
              <div className="flex gap-2">
                <Button
                  onClick={uploadFile}
                  disabled={!selectedFile || isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Wird hochgeladen...' : 'CSV hochladen'}
                </Button>

                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Vorlage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CSV-Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">
                  Erforderliche Spalten:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• name (Produktname)</li>
                  <li>• description (Beschreibung)</li>
                  <li>• brand (Marke)</li>
                  <li>• category (Kategorie)</li>
                  <li>• price (Preis in Euro)</li>
                  <li>• image (Bild-URL)</li>
                  <li>• shopName (Shop-Name)</li>
                  <li>• shopUrl (Shop-URL)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Hinweise:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• UTF-8 Kodierung verwenden</li>
                  <li>• Komma als Trenner</li>
                  <li>• Anführungszeichen für Texte mit Kommas</li>
                  <li>• Maximale Dateigröße: 10MB</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Import Jobs History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Import-Verlauf</CardTitle>
          <CardDescription>
            Übersicht über alle CSV-Imports und deren Status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {importJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Noch keine Imports durchgeführt</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datei</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Produkte</TableHead>
                  <TableHead className="text-right">Erfolg/Fehler</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{job.original_filename}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(job.file_size)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono">{job.total_rows || 0}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">
                          {job.successful_rows || 0}
                        </span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-red-600">
                          {job.failed_rows || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(job.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
