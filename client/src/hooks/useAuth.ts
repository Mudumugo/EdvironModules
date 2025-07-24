import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  profileImageUrl?: string;
  institutionId?: string;
  gradeLevel?: string;
}

// Global logout state to prevent API calls during logout
let isLoggingOut = false;

export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: !isLoggingOut, // Disable refetch during logout
    staleTime: 0, // Always consider data stale to force fresh checks
    enabled: !isLoggingOut, // Disable query during logout
  });

  const isAuthenticated = !!user && !error && !isLoggingOut;

  return {
    user: user as User | null,
    isAuthenticated,
    isLoading: isLoading && !isLoggingOut,
    error
  };
}