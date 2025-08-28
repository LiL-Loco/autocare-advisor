'use client';

import { useEffect, useState } from 'react';
import { useImageBatchProcessing } from '../../hooks/useImageBatchProcessing';

interface BatchProcessingDashboardProps {
  onClose?: () => void;
  className?: string;
}

export default function BatchProcessingDashboard({
  onClose,
  className = '',
}: BatchProcessingDashboardProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [queueStats, setQueueStats] = useState<any>(null);

  const {
    state,
    startBatchWebPConversion,
    stopProcessing,
    getQueueStats,
    cleanOldJobs,
    isProcessing,
  } = useImageBatchProcessing({
    onJobComplete: (jobId, success) => {
      console.log(`Job ${jobId} ${success ? 'completed' : 'failed'}`);
    },
    onAllComplete: (results) => {
      const successful = results.filter((r) => r.status === 'completed').length;
      const failed = results.filter((r) => r.status === 'failed').length;
      console.log(
        `Batch processing complete: ${successful} successful, ${failed} failed`
      );
    },
    onProgress: (progress) => {
      console.log(`Batch progress: ${Math.round(progress.totalProgress)}%`);
    },
  });

  // Load queue stats on mount
  useEffect(() => {
    const loadStats = async () => {
      const result = await getQueueStats();
      if (result.success) {
        setQueueStats(result.stats);
      }
    };
    loadStats();

    // Refresh stats every 5 seconds when not processing
    const interval = setInterval(() => {
      if (!isProcessing) {
        loadStats();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [getQueueStats, isProcessing]);

  const handleStartProcessing = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    await startBatchWebPConversion(selectedProducts, priority);
  };

  const handleStopProcessing = () => {
    stopProcessing();
  };

  const handleCleanOldJobs = async () => {
    const result = await cleanOldJobs(24);
    if (result.success) {
      // Refresh stats
      const statsResult = await getQueueStats();
      if (statsResult.success) {
        setQueueStats(statsResult.stats);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return '⏳';
      case 'active':
        return '🔄';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-600 bg-yellow-50';
      case 'active':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDuration = (start?: string, end?: string) => {
    if (!start) return '-';
    if (!end && !isProcessing) return '-';

    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.round(duration / 60)}m`;
    return `${Math.round(duration / 3600)}h`;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Batch Image Processing
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Convert multiple product images to WebP format
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Selection
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Product IDs (comma-separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setSelectedProducts(
                    e.target.value
                      .split(',')
                      .map((id) => id.trim())
                      .filter(Boolean)
                  )
                }
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500">
                Selected: {selectedProducts.length} products
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as 'low' | 'normal' | 'high')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-end">
            {!isProcessing ? (
              <button
                onClick={handleStartProcessing}
                disabled={selectedProducts.length === 0}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Processing
              </button>
            ) : (
              <button
                onClick={handleStopProcessing}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Stop Processing
              </button>
            )}
          </div>
        </div>

        {/* Overall Progress */}
        {isProcessing && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(state.totalProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.totalProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Completed: {state.completedJobs}</span>
              <span>Failed: {state.failedJobs}</span>
              <span>Total: {state.jobs.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Job List */}
      {state.jobs.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Active Jobs
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {state.jobs.map((job) => (
              <div
                key={job.jobId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(job.status)}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Job {job.jobId.slice(-8)}
                    </div>
                    <div
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {job.status === 'active' && (
                    <div className="w-24">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 min-w-0">
                    {job.error && (
                      <span className="text-red-600 truncate" title={job.error}>
                        {job.error}
                      </span>
                    )}
                    {!job.error && (
                      <span>
                        {formatDuration(job.startedAt, job.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue Statistics */}
      {queueStats && (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Queue Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {queueStats.waiting || 0}
              </div>
              <div className="text-sm text-gray-500">Waiting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {queueStats.active || 0}
              </div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {queueStats.completed || 0}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {queueStats.failed || 0}
              </div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleCleanOldJobs}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clean jobs older than 24 hours
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
