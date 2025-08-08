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

// Dummy exports for backwards compatibility during transition
export const setLoggingOut = () => {};
export const getIsLoggingOut = () => false;

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 30000, // Cache auth status for 30 seconds to prevent infinite polling
  });

  const isAuthenticated = !!user && !error;

  return {
    user: user as User | null,
    isAuthenticated,
    isLoading,
    error
  };
}

// Dummy logout state for backwards compatibility
export const isLoggedOut = false;