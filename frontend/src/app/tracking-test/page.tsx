'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  MousePointer,
  Play,
  Target,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function TrackingSystemTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiUrl, setApiUrl] = useState(
    'http://localhost:5001/api/tracking-demo'
  );
  const [useDemoMode, setUseDemoMode] = useState(true);

  const runTest = async (testType: string, endpoint: string, payload?: any) => {
    const startTime = Date.now();

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: payload ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(payload &&
            !useDemoMode && { Authorization: 'Bearer demo-token' }),
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      const result = {
        test: testType,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        duration: `${duration}ms`,
        response: data,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
      return result;
    } catch (error) {
      const result = {
        test: testType,
        status: 'error',
        statusCode: 'Network Error',
        duration: `${Date.now() - startTime}ms`,
        response: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toLocaleTimeString(),
      };

      setTestResults((prev) => [result, ...prev.slice(0, 9)]);
      return result;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Health Check
    await runTest('Health Check', '/health');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Test 2: Click Tracking (will fail auth, but tests endpoint)
    await runTest('Click Tracking', '/click', {
      productId: 'test-product-123',
      partnerUrl: 'https://example.com',
      recommendationRank: 1,
      matchScore: 95,
      metadata: { test: true },
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Test 3: Impressions Tracking
    await runTest('Impressions Tracking', '/impressions', {
      impressions: [
        {
          productId: 'test-product-1',
          viewDuration: 5,
          viewportPosition: 'above-fold',
        },
        {
          productId: 'test-product-2',
          viewDuration: 3,
          viewportPosition: 'below-fold',
        },
      ],
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Test 4: Conversion Tracking
    await runTest('Conversion Tracking', '/conversion', {
      productId: 'test-product-123',
      conversionType: 'purchase',
      conversionValue: 29.99,
      orderId: 'order-123',
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Test 5: Stats Endpoint (will fail auth)
    await runTest('Usage Stats', '/stats');

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Usage Tracking System Test
        </h1>
        <p className="text-gray-600">
          Test the Pay-per-Click tracking system endpoints and functionality
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                API Mode
              </label>
              <div className="flex gap-2">
                <Button
                  variant={useDemoMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setUseDemoMode(true);
                    setApiUrl('http://localhost:5001/api/tracking-demo');
                  }}
                >
                  Demo Mode
                </Button>
                <Button
                  variant={!useDemoMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setUseDemoMode(false);
                    setApiUrl('http://localhost:5001/api/tracking');
                  }}
                >
                  Auth Mode
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                API Base URL
              </label>
              <Input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:5001/api/tracking"
              />
            </div>
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              Test Results
            </span>
            {testResults.length > 0 && (
              <Badge variant="outline">
                {testResults.length} test{testResults.length !== 1 ? 's' : ''}{' '}
                run
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tests run yet. Click "Run All Tests" to start testing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <Card
                  key={index}
                  className={`border ${getStatusColor(result.status)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <h4 className="font-medium">{result.test}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{result.timestamp}</span>
                        <Badge variant="outline">{result.duration}</Badge>
                        <Badge
                          variant={
                            result.status === 'success'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {result.statusCode}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded p-3 mt-2">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📚 Tracking API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-green-600" />
                <h5 className="font-medium">Click Tracking</h5>
              </div>
              <p className="text-sm text-gray-600">
                POST /api/tracking/click - Track product clicks with duplicate
                detection
              </p>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h5 className="font-medium">Impression Tracking</h5>
              </div>
              <p className="text-sm text-gray-600">
                POST /api/tracking/impressions - Track product views in batches
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <h5 className="font-medium">Conversion Tracking</h5>
              </div>
              <p className="text-sm text-gray-600">
                POST /api/tracking/conversion - Track purchases, leads, and
                signups
              </p>

              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <h5 className="font-medium">Analytics</h5>
              </div>
              <p className="text-sm text-gray-600">
                GET /api/tracking/stats - Get usage statistics and billing data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expected Results Info */}
      <Alert className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>{useDemoMode ? 'Demo Mode:' : 'Auth Mode:'}</strong>{' '}
          {useDemoMode
            ? 'All endpoints will succeed with simulated data. Perfect for testing the interface and data flow.'
            : 'Endpoints require valid JWT tokens. Authentication errors (401) confirm proper security implementation.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}
