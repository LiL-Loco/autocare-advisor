'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface BatchJobProgress {
  jobId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  processedCount?: number;
  totalCount?: number;
  failedCount?: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface BatchProcessingState {
  jobs: BatchJobProgress[];
  isProcessing: boolean;
  totalProgress: number;
  completedJobs: number;
  failedJobs: number;
}

interface BatchProcessingOptions {
  pollInterval?: number;
  onJobComplete?: (jobId: string, success: boolean) => void;
  onAllComplete?: (results: BatchJobProgress[]) => void;
  onProgress?: (progress: BatchProcessingState) => void;
}

export function useImageBatchProcessing(options: BatchProcessingOptions = {}) {
  const {
    pollInterval = 2000,
    onJobComplete,
    onAllComplete,
    onProgress,
  } = options;

  const [state, setState] = useState<BatchProcessingState>({
    jobs: [],
    isProcessing: false,
    totalProgress: 0,
    completedJobs: 0,
    failedJobs: 0,
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Start batch WebP conversion for products
   */
  const startBatchWebPConversion = useCallback(
    async (
      productIds: string[],
      priority: 'low' | 'normal' | 'high' = 'normal'
    ) => {
      try {
        // Cancel any existing polling
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const response = await fetch('/api/products/images/batch/webp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIds, priority }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 'Failed to start batch processing'
          );
        }

        const data = await response.json();
        const jobIds: string[] = data.data.jobIds;

        // Initialize job states
        const initialJobs: BatchJobProgress[] = jobIds.map((jobId) => ({
          jobId,
          status: 'waiting',
          progress: 0,
        }));

        setState({
          jobs: initialJobs,
          isProcessing: true,
          totalProgress: 0,
          completedJobs: 0,
          failedJobs: 0,
        });

        // Start polling for job status
        startPolling(jobIds);

        return { success: true, jobIds };
      } catch (error: any) {
        console.error('Failed to start batch processing:', error);
        setState((prev) => ({ ...prev, isProcessing: false }));
        return { success: false, error: error.message };
      }
    },
    []
  );

  /**
   * Start polling for job status updates
   */
  const startPolling = useCallback(
    (jobIds: string[]) => {
      const pollJobs = async () => {
        try {
          const jobStatuses = await Promise.allSettled(
            jobIds.map(async (jobId) => {
              const response = await fetch(
                `/api/products/images/jobs/${jobId}`,
                {
                  signal: abortControllerRef.current?.signal,
                }
              );

              if (!response.ok) {
                throw new Error(`Failed to get status for job ${jobId}`);
              }

              const data = await response.json();
              return data.data;
            })
          );

          const jobs: BatchJobProgress[] = jobStatuses.map((result, index) => {
            if (result.status === 'fulfilled') {
              const jobData = result.value;
              return {
                jobId: jobIds[index],
                status: jobData.status,
                progress: jobData.progress || 0,
                processedCount: jobData.processedCount,
                totalCount: jobData.totalCount,
                failedCount: jobData.failedCount,
                startedAt: jobData.startedAt,
                completedAt: jobData.completedAt,
                error: jobData.failedReason,
              };
            } else {
              return {
                jobId: jobIds[index],
                status: 'failed',
                progress: 0,
                error: result.reason?.message || 'Unknown error',
              };
            }
          });

          const completedJobs = jobs.filter(
            (job) => job.status === 'completed'
          ).length;
          const failedJobs = jobs.filter(
            (job) => job.status === 'failed'
          ).length;
          const totalProgress =
            jobs.reduce((sum, job) => sum + job.progress, 0) / jobs.length;
          const isProcessing = jobs.some(
            (job) => job.status === 'waiting' || job.status === 'active'
          );

          const newState: BatchProcessingState = {
            jobs,
            isProcessing,
            totalProgress,
            completedJobs,
            failedJobs,
          };

          setState(newState);
          onProgress?.(newState);

          // Check for job completions
          jobs.forEach((job) => {
            if (job.status === 'completed' || job.status === 'failed') {
              onJobComplete?.(job.jobId, job.status === 'completed');
            }
          });

          // Check if all jobs are done
          if (!isProcessing) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            onAllComplete?.(jobs);
          }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Failed to poll job status:', error);
          }
        }
      };

      // Initial poll
      pollJobs();

      // Set up interval polling
      pollIntervalRef.current = setInterval(pollJobs, pollInterval);
    },
    [pollInterval, onJobComplete, onAllComplete, onProgress]
  );

  /**
   * Stop all processing and cleanup
   */
  const stopProcessing = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({ ...prev, isProcessing: false }));
  }, []);

  /**
   * Get queue statistics
   */
  const getQueueStats = useCallback(async () => {
    try {
      const response = await fetch('/api/products/images/queue/stats');
      if (!response.ok) {
        throw new Error('Failed to get queue stats');
      }
      const data = await response.json();
      return { success: true, stats: data.data };
    } catch (error: any) {
      console.error('Failed to get queue stats:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Clean old jobs
   */
  const cleanOldJobs = useCallback(async (olderThanHours: number = 24) => {
    try {
      const response = await fetch(
        `/api/products/images/jobs/cleanup?olderThanHours=${olderThanHours}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to clean old jobs');
      }
      return { success: true };
    } catch (error: any) {
      console.error('Failed to clean old jobs:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    state,
    startBatchWebPConversion,
    stopProcessing,
    getQueueStats,
    cleanOldJobs,
    isProcessing: state.isProcessing,
  };
}

/**
 * Hook for individual job monitoring
 */
export function useJobMonitor(
  jobId: string | null,
  options: { pollInterval?: number } = {}
) {
  const { pollInterval = 2000 } = options;
  const [jobStatus, setJobStatus] = useState<BatchJobProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMonitoring = useCallback(async () => {
    if (!jobId) return;

    setIsLoading(true);

    const pollJob = async () => {
      try {
        const response = await fetch(`/api/products/images/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to get job status');
        }

        const data = await response.json();
        const status: BatchJobProgress = {
          jobId,
          status: data.data.status,
          progress: data.data.progress || 0,
          processedCount: data.data.processedCount,
          totalCount: data.data.totalCount,
          failedCount: data.data.failedCount,
          startedAt: data.data.startedAt,
          completedAt: data.data.completedAt,
          error: data.data.failedReason,
        };

        setJobStatus(status);
        setIsLoading(false);

        // Stop polling if job is complete
        if (status.status === 'completed' || status.status === 'failed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      } catch (error: any) {
        console.error('Failed to poll job status:', error);
        setIsLoading(false);
      }
    };

    // Initial poll
    await pollJob();

    // Set up interval polling
    if (!pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(pollJob, pollInterval);
    }
  }, [jobId, pollInterval]);

  const stopMonitoring = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (jobId) {
      startMonitoring();
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [jobId, startMonitoring]);

  return {
    jobStatus,
    isLoading,
    startMonitoring,
    stopMonitoring,
  };
}
