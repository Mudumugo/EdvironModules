import { QueryClient } from '@tanstack/react-query';

// Optimized query client configuration for performance
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Performance optimizations
        staleTime: 30000, // 30 seconds - consider data fresh for 30s
        gcTime: 300000, // 5 minutes - keep in memory for 5 minutes
        retry: 2, // Only retry twice instead of default 3
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Network optimizations
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnReconnect: true, // Do refetch on reconnect
        refetchOnMount: true, // Always refetch on mount
        
        // Error handling
        throwOnError: false, // Handle errors gracefully
      },
      mutations: {
        // Mutation optimizations
        retry: 1, // Only retry mutations once
        retryDelay: 1000,
        
        // Network timeout
        networkMode: 'online',
      },
    },
  });
};

// Performance monitoring for queries
export const performanceLogger = {
  queryStart: (queryKey: any) => {
    const key = JSON.stringify(queryKey);
    const startTime = performance.now();
    console.log(`[QUERY START] ${key}`);
    return startTime;
  },
  
  queryEnd: (queryKey: any, startTime: number, success: boolean) => {
    const key = JSON.stringify(queryKey);
    const duration = performance.now() - startTime;
    const status = success ? 'SUCCESS' : 'ERROR';
    
    if (duration > 1000) {
      console.warn(`[QUERY SLOW] ${key} - ${duration.toFixed(2)}ms - ${status}`);
    } else {
      console.log(`[QUERY END] ${key} - ${duration.toFixed(2)}ms - ${status}`);
    }
  }
};