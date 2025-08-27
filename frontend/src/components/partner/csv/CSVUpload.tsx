'use client';

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
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Trash2,
  Upload,
  XCircle,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface CSVUploadProps {
  partnerId: string;
}

interface ValidationError {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

interface UploadStats {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  warnings: number;
}

export default function CSVUpload({ partnerId }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setUploadComplete(false);
      setValidationErrors([]);
      setUploadStats(null);
      setPreviewData([]);

      // Parse and preview first few rows
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const preview = lines.slice(0, 6).map((line) => line.split(','));
        setPreviewData(preview);
      };
      reader.readAsText(selectedFile);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find((file) => file.type === 'text/csv');

    if (csvFile) {
      handleFileSelect(csvFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const validateCSV = async () => {
    if (!file) return;

    setValidating(true);

    // Simulate validation process
    const errors: ValidationError[] = [
      {
        row: 5,
        column: 'price',
        message: 'Price must be a positive number',
        severity: 'error',
      },
      {
        row: 12,
        column: 'category',
        message: 'Category not recognized, will use default',
        severity: 'warning',
      },
      {
        row: 18,
        column: 'description',
        message: 'Description is empty',
        severity: 'warning',
      },
    ];

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setValidationErrors(errors);
    setValidating(false);
  };

  const uploadCSV = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('partnerId', partnerId);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(interval);
      setUploadProgress(100);

      // Simulate upload results
      setUploadStats({
        total: 150,
        processed: 150,
        successful: 145,
        failed: 3,
        warnings: 2,
      });

      setUploadComplete(true);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      'name,category,price,description,brand,sku,stock_quantity,is_active',
      'Premium Car Wax,Car Care,29.99,High-quality car wax for professional finish,AutoShine,AS-001,50,true',
      'Engine Oil 5W-30,Oil & Fluids,24.95,Synthetic engine oil for modern vehicles,TechnoOil,TO-5W30,100,true',
      'Brake Pads Set,Brakes,89.99,Ceramic brake pads for enhanced stopping power,StopMax,SM-BP001,25,true',
    ].join('\n');

    const blob = new Blob([templateData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearFile = () => {
    setFile(null);
    setUploadComplete(false);
    setValidationErrors([]);
    setUploadStats(null);
    setPreviewData([]);
    setShowPreview(false);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            CSV Product Upload
          </h2>
          <p className="text-gray-600">
            Upload your product catalog in CSV format
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Upload Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Required Columns:
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  • <code>name</code> - Product name
                </li>
                <li>
                  • <code>category</code> - Product category
                </li>
                <li>
                  • <code>price</code> - Product price (decimal)
                </li>
                <li>
                  • <code>description</code> - Product description
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Optional Columns:
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  • <code>brand</code> - Product brand
                </li>
                <li>
                  • <code>sku</code> - Stock keeping unit
                </li>
                <li>
                  • <code>stock_quantity</code> - Available stock
                </li>
                <li>
                  • <code>is_active</code> - Product visibility (true/false)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : file
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => {
              if (!file) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.csv';
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  const selectedFile = target.files?.[0];
                  if (selectedFile) {
                    handleFileSelect(selectedFile);
                  }
                };
                input.click();
              }
            }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
              id="csv-file-input"
            />

            {file ? (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {file.name}
                  </h3>
                  <p className="text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Hide' : 'Preview'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={validateCSV}
                    disabled={validating}
                  >
                    {validating && (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Validate
                  </Button>
                  <Button variant="outline" onClick={clearFile}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isDragActive
                      ? 'Drop your CSV file here'
                      : 'Upload CSV File'}
                  </h3>
                  <p className="text-gray-600">
                    Drag & drop your product CSV file, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Preview */}
      {showPreview && previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>File Preview</CardTitle>
            <CardDescription>First 5 rows of your CSV file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {previewData[0]?.map((header: string, index: number) => (
                      <th
                        key={index}
                        className="text-left py-2 px-3 font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData
                    .slice(1)
                    .map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex} className="border-b">
                        {row.map((cell: string, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            className="py-2 px-3 text-gray-700"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validationErrors.map((error, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    error.severity === 'error' ? 'bg-red-50' : 'bg-yellow-50'
                  }`}
                >
                  {error.severity === 'error' ? (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        error.severity === 'error'
                          ? 'text-red-800'
                          : 'text-yellow-800'
                      }`}
                    >
                      Row {error.row}, Column "{error.column}"
                    </p>
                    <p
                      className={`text-sm ${
                        error.severity === 'error'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {error.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardHeader>
            <CardTitle>Uploading Products...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                Processing... {Math.round(uploadProgress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadComplete && uploadStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Upload Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {uploadStats.total}
                </div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {uploadStats.successful}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {uploadStats.failed}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {uploadStats.warnings}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Action */}
      {file && !uploading && !uploadComplete && (
        <div className="flex justify-center">
          <Button
            onClick={uploadCSV}
            size="lg"
            disabled={validationErrors.some((e) => e.severity === 'error')}
            className="w-full md:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Products
            {validationErrors.some((e) => e.severity === 'error') && (
              <span className="ml-2 text-xs">(Fix errors first)</span>
            )}
          </Button>
        </div>
      )}

      {/* Success Actions */}
      {uploadComplete && (
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={clearFile}>
            Upload Another File
          </Button>
          <Button onClick={() => window.location.reload()}>
            View Products
          </Button>
        </div>
      )}
    </div>
  );
}
