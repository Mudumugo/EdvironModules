import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
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

  const hasTrackedLogin = useRef(false);
  const lastUserId = useRef<string | null>(null);

  // Track user login only once per session or user change
  useEffect(() => {
    if (user && !isLoading) {
      // Only track if this is a new user or first time
      if (!hasTrackedLogin.current || lastUserId.current !== user.id) {
        xapiTracker.setCurrentUser(user);
        trackUserLogin(user);
        hasTrackedLogin.current = true;
        lastUserId.current = user.id;
      }
    }
  }, [user?.id, isLoading]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
