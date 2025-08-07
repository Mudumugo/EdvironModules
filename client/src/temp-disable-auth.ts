// Temporary file to completely disable all auth queries
// This will be used to override any remaining auth polling

export const DISABLE_ALL_AUTH = true;

// Override any remaining useQuery calls that might be polling auth
export const disableAuthQuery = {
  enabled: false,
  queryKey: ['disabled'],
  queryFn: () => null,
  staleTime: Infinity,
  refetchInterval: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: false
};