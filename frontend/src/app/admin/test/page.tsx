'use client';

import React, { useState } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
}

export default function AdminTestPage() {
  const [apiUrl, setApiUrl] = useState('http://localhost:5001');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async (
    testName: string,
    endpoint: string,
    method: string = 'GET',
    body?: any
  ) => {
    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: `${testName}: ${response.ok ? 'SUCCESS' : 'FAILED'} (${
          response.status
        })`,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: `${testName}: ERROR - ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];

    // Test 1: Health Check
    results.push(await runTest('Health Check', '/api/health'));

    // Test 2: Database Connection
    results.push(await runTest('Database Status', '/api/health/db'));

    // Test 3: Get Products
    results.push(await runTest('Get Products', '/api/products'));

    // Test 4: Get Recommendations
    const recommendationBody = {
      vehicleType: 'PKW',
      vehicleBrand: 'BMW',
      paintType: 'Metallic',
      primaryProblem: ['Kratzer'],
      experienceLevel: 'Profi',
      careFrequency: 'Monatlich',
      season: 'Sommer',
      timeAvailable: '30-60 min',
      budget: { min: 10, max: 50 },
      limit: 3,
    };
    results.push(
      await runTest(
        'Recommendation Engine',
        '/api/recommendations/generate',
        'POST',
        recommendationBody
      )
    );

    // Test 5: Auth Test (Register)
    const registerBody = {
      email: `test${Date.now()}@autocare-advisor.com`,
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'partner',
      companyName: 'Test Company GmbH',
      phone: '+49 123 456789',
      acceptTerms: true,
      acceptPrivacy: true,
    };
    results.push(
      await runTest(
        'User Registration',
        '/api/auth/register',
        'POST',
        registerBody
      )
    );

    setTestResults(results);
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          🧪 AutoCare Advisor API Test Suite
        </h1>

        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="api-url" className="font-medium">
            API URL:
          </label>
          <input
            id="api-url"
            type="text"
            value={apiUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setApiUrl(e.target.value)
            }
            placeholder="http://localhost:5001"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
          >
            {isLoading ? 'Running Tests...' : '🚀 Run All Tests'}
          </button>
          <button
            onClick={clearResults}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium"
          >
            🧹 Clear Results
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>

          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md border-l-4 ${
                  result.success
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      result.success ? 'text-green-800' : 'text-red-800'
                    }
                  >
                    {result.success ? '✅' : '❌'} {result.message}
                  </span>
                </div>

                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      View Response Data
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32 border">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}

            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold text-gray-800">Summary:</h3>
              <p className="text-sm text-gray-600">
                Passed:{' '}
                <span className="font-bold text-green-600">
                  {testResults.filter((r) => r.success).length}
                </span>{' '}
                / {testResults.length} tests
                {testResults.filter((r) => r.success).length ===
                  testResults.length && (
                  <span className="ml-2 text-green-600">
                    🎉 All tests passed!
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Endpoints */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Available Test Endpoints</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-blue-600 mb-2">
              🏥 Health Checks:
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
              <li>GET /api/health - System health</li>
              <li>GET /api/health/db - Database status</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-600 mb-2">🛠️ Core APIs:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
              <li>GET /api/products - Product catalog</li>
              <li>POST /api/recommendations/generate - AI recommendations</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-600 mb-2">
              🔐 Authentication:
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
              <li>POST /api/auth/register - User registration</li>
              <li>POST /api/auth/login - User login</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-600 mb-2">🤝 Partners:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
              <li>GET /api/partners - Partner management</li>
              <li>POST /api/partners - Create partner</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
