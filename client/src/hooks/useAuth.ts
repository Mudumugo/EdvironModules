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

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: true, // Enable refetch to detect logout
    staleTime: 0, // Always consider data stale to force fresh checks
  });

  const isAuthenticated = !!user && !error;

  return {
    user: user as User | null,
    isAuthenticated,
    isLoading,
    error
  };
}