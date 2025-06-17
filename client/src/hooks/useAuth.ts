import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { trackUserLogin, xapiTracker } from "@/lib/xapiTracker";

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  profileImageUrl?: string;
  grade?: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Track user login and set current user for xAPI tracking
  useEffect(() => {
    if (user && !isLoading) {
      xapiTracker.setCurrentUser(user);
      trackUserLogin(user);
    }
  }, [user, isLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
