'use client';

import { useCallback, useRef, useState } from 'react';

interface ImportProgress {
  processed: number;
  total: number;
  percentage: number;
  currentRow?: any;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    data: any;
    error: string;
  }>;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  requiredHeaders: string[];
  foundHeaders: string[];
  filename: string;
  fileSize: number;
}

export default function CSVImportInterface() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importId, setImportId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'upload' | 'template' | 'progress'
  >('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const partnerId = '64a12345-6789-4012-9345-678901234568';

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === 'text/csv') {
        setSelectedFile(file);
        setValidation(null);
        setResult(null);
        setProgress(null);
        setImportId(null);
      } else {
        alert('Please select a valid CSV file');
      }
    },
    []
  );

  const validateFile = useCallback(async () => {
    if (!selectedFile) return;

    setIsValidating(true);
    setValidation(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      const response = await fetch('/api/csv-import/validate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const data = await response.json();
      setValidation(data.data);
    } catch (error: any) {
      console.error('Validation error:', error);
      alert('Failed to validate file: ' + error.message);
    } finally {
      setIsValidating(false);
    }
  }, [selectedFile]);

  const uploadFile = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);
      formData.append('partnerId', partnerId);

      const response = await fetch('/api/csv-import/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImportId(data.data.importId);
      setActiveTab('progress');

      // Start polling for progress
      pollProgress(data.data.importId);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Failed to upload file: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, partnerId]);

  const pollProgress = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/csv-import/progress/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.data);

        // Continue polling if not complete
        if (data.data.percentage < 100) {
          setTimeout(() => pollProgress(id), 1000);
        }
      } else if (response.status === 404) {
        // Import completed or failed
        setProgress(null);
      }
    } catch (error) {
      console.error('Progress polling error:', error);
    }
  }, []);

  const downloadTemplate = useCallback(async () => {
    try {
      const response = await fetch('/api/csv-import/sample', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'product-import-template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download error:', error);
      alert('Failed to download template: ' + error.message);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📤 CSV Product Import
        </h1>
        <p className="text-gray-600">
          Bulk import products from CSV files with validation and progress
          tracking
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'upload', label: '📤 Upload CSV', icon: '📤' },
            { id: 'template', label: '📋 Template Info', icon: '📋' },
            { id: 'progress', label: '⏳ Progress', icon: '⏳' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* File Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select CSV File</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-gray-600">
                      Size: {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Choose Different File
                    </button>
                    <button
                      onClick={validateFile}
                      disabled={isValidating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isValidating ? 'Validating...' : 'Validate File'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-3">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop your CSV file here or click to browse
                    </p>
                    <p className="text-gray-600">Maximum file size: 10MB</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Choose File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Validation Results */}
          {validation && (
            <div
              className={`bg-white rounded-lg shadow p-6 ${
                validation.isValid
                  ? 'border-l-4 border-green-500'
                  : 'border-l-4 border-red-500'
              }`}
            >
              <h3 className="text-lg font-semibold mb-4">
                {validation.isValid
                  ? '✅ Validation Passed'
                  : '❌ Validation Failed'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">File Info</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Filename: {validation.filename}</li>
                    <li>Size: {(validation.fileSize / 1024).toFixed(1)} KB</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Headers Found
                  </h4>
                  <div className="text-sm">
                    {validation.foundHeaders.map((header) => (
                      <span
                        key={header}
                        className={`inline-block px-2 py-1 rounded text-xs mr-1 mb-1 ${
                          validation.requiredHeaders.includes(header)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {header}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {validation.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-800 mb-2">Errors</h4>
                  <ul className="text-sm text-red-600 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.isValid && (
                <div className="mt-6">
                  <button
                    onClick={uploadFile}
                    disabled={isUploading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isUploading ? 'Starting Import...' : 'Start Import'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Template Tab */}
      {activeTab === 'template' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">CSV Template</h2>
                <p className="text-gray-600">
                  Download the template file or follow the format guidelines
                  below
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                📥 Download Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Required Columns
                </h3>
                <div className="space-y-2">
                  {[
                    'name',
                    'brand',
                    'category',
                    'price',
                    'partner_shop_name',
                  ].map((col) => (
                    <div key={col} className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {col}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Optional Columns
                </h3>
                <div className="space-y-2">
                  {[
                    'description',
                    'image_urls',
                    'availability',
                    'partner_shop_url',
                    'specifications',
                    'tags',
                  ].map((col) => (
                    <div key={col} className="flex items-center">
                      <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {col}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-2">
                💡 Format Tips
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • Use semicolons for specifications:{' '}
                  <code>type:liquid;volume:500ml</code>
                </li>
                <li>
                  • Use commas for multiple images:{' '}
                  <code>img1.jpg,img2.jpg</code>
                </li>
                <li>
                  • Use commas for tags: <code>wax,shine,protection</code>
                </li>
                <li>
                  • Price can include symbols: <code>29.99</code> or{' '}
                  <code>€29.99</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {progress ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Import Progress</h2>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Processing: {progress.processed} / {progress.total} rows
                  </span>
                  <span className="text-sm font-medium">
                    {progress.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              {progress.currentRow && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium text-blue-800">
                    Currently processing:
                  </p>
                  <p className="text-sm text-blue-600">
                    {progress.currentRow.name}
                  </p>
                </div>
              )}

              {progress.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="font-medium text-red-800 mb-2">
                    Recent Errors
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {progress.errors.slice(-5).map((error, index) => (
                      <div key={index} className="text-sm text-red-600">
                        Row {error.row}: {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : importId ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Import completed or failed. Check your products list for
                results.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">
                No active import. Upload a file to begin.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
