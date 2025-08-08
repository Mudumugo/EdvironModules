import { useState, useEffect, useCallback } from "react";

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

// Global authentication state to prevent multiple checks
let globalAuthState: {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastCheck: number;
} = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  lastCheck: 0,
};

const AUTH_CACHE_DURATION = 30000; // 30 seconds
const listeners = new Set<() => void>();

async function checkAuthentication(): Promise<{
  user: User | null;
  isAuthenticated: boolean;
}> {
  try {
    const response = await fetch('/api/auth/user', {
      credentials: 'include',
    });

    if (response.ok) {
      const user = await response.json();
      return { user, isAuthenticated: true };
    } else {
      return { user: null, isAuthenticated: false };
    }
  } catch (error) {
    console.log('Auth check failed:', error);
    return { user: null, isAuthenticated: false };
  }
}

function notifyListeners() {
  listeners.forEach(listener => listener());
}

async function updateGlobalAuthState(force = false) {
  const now = Date.now();
  
  // Only check authentication if cache is expired or forced
  if (!force && (now - globalAuthState.lastCheck) < AUTH_CACHE_DURATION) {
    return;
  }

  globalAuthState.isLoading = true;
  notifyListeners();

  const { user, isAuthenticated } = await checkAuthentication();
  
  globalAuthState = {
    user,
    isAuthenticated,
    isLoading: false,
    lastCheck: now,
  };

  notifyListeners();
}

// Dummy exports for backwards compatibility during transition
export const setLoggingOut = () => {};
export const getIsLoggingOut = () => false;
export const isLoggedOut = false;

export function useAuth() {
  const [state, setState] = useState(globalAuthState);

  const updateState = useCallback(() => {
    setState({ ...globalAuthState });
  }, []);

  useEffect(() => {
    // Add listener for global state changes
    listeners.add(updateState);

    // Check authentication on mount if not recently checked
    updateGlobalAuthState();

    return () => {
      listeners.delete(updateState);
    };
  }, [updateState]);

  const refreshAuth = useCallback(() => {
    updateGlobalAuthState(true);
  }, []);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: null,
    refreshAuth,
  };
}

// Export function to manually refresh authentication (for login/logout)
export const refreshAuthState = () => updateGlobalAuthState(true);