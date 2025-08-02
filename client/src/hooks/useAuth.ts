import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
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

// Webview-compatible authentication state
let globalAuthState: { user: User | null; isAuthenticated: boolean } = {
  user: null,
  isAuthenticated: false
};

// Direct fetch for webview compatibility
async function fetchUserDirectly(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/user', {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      globalAuthState = { user, isAuthenticated: true };
      return user;
    } else {
      globalAuthState = { user: null, isAuthenticated: false };
      return null;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    globalAuthState = { user: null, isAuthenticated: false };
    return null;
  }
}

// Webview-compatible logout with server-guided redirect
export async function logoutDirectly(): Promise<boolean> {
  try {
    console.log('[AUTH] Calling logout API...');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('[AUTH] Logout API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('[AUTH] Logout response data:', data);
      
      // Aggressively clear global state
      globalAuthState = { user: null, isAuthenticated: false };
      
      // Clear all possible storage
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('[AUTH] Cleared all storage');
      } catch (e) {
        console.log('[AUTH] Storage clear failed:', e);
      }
      
      // Check if server wants us to redirect
      if (data.redirect || data.forceReload) {
        console.log('[AUTH] Server instructed redirect to:', data.redirect);
        
        // Multiple aggressive redirect strategies
        try {
          // Strategy 1: Direct assignment (most reliable)
          console.log('[AUTH] Using window.location.assign...');
          window.location.assign(data.redirect || '/');
        } catch (e1) {
          try {
            // Strategy 2: href assignment
            console.log('[AUTH] Fallback to window.location.href...');
            window.location.href = data.redirect || '/';
          } catch (e2) {
            try {
              // Strategy 3: replace
              console.log('[AUTH] Fallback to window.location.replace...');
              window.location.replace(data.redirect || '/');
            } catch (e3) {
              // Strategy 4: reload as last resort
              console.log('[AUTH] Final fallback - page reload...');
              window.location.reload();
            }
          }
        }
      }
      
      return true;
    }
    
    console.error('[AUTH] Logout API failed with status:', response.status);
    return false;
  } catch (error) {
    console.error('[AUTH] Logout request failed:', error);
    // Even if API fails, clear state and redirect
    globalAuthState = { user: null, isAuthenticated: false };
    window.location.href = '/';
    return false;
  }
}

// Dummy exports for backwards compatibility during transition
export const setLoggingOut = () => {};
export const getIsLoggingOut = () => false;

export function useAuth() {
  const [authState, setAuthState] = useState(globalAuthState);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);

  // Check authentication on mount and periodically
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      // Only show loading on initial check, not during polling
      if (!hasInitialCheck) {
        setIsLoading(true);
      }
      
      const user = await fetchUserDirectly();
      if (mounted) {
        const newState = { user, isAuthenticated: !!user };
        setAuthState(newState);
        globalAuthState = newState; // Keep global state in sync
        
        if (!hasInitialCheck) {
          setHasInitialCheck(true);
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    // Gentle polling only for authenticated users to detect logout
    const interval = setInterval(() => {
      if (mounted && globalAuthState.isAuthenticated) {
        // Only poll if user is authenticated to detect logout
        checkAuth();
      }
    }, 10000); // Reduced frequency: every 10 seconds instead of 2
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Sync with global state immediately
  useEffect(() => {
    setAuthState(globalAuthState);
  }, [globalAuthState.isAuthenticated, globalAuthState.user]);

  // Force logout redirect if no user and currently on authenticated route
  useEffect(() => {
    if (!isLoading && !authState.isAuthenticated && !authState.user) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/signup') {
        console.log('[AUTH] No auth detected, forcing redirect from:', currentPath);
        window.location.href = '/';
      }
    }
  }, [authState.isAuthenticated, authState.user, isLoading]);

  return {
    user: authState.user as User | null,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    error: null
  };
}

// Dummy logout state for backwards compatibility
export const isLoggedOut = false;