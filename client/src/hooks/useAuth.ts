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

// Webview-compatible logout with forced state clearing and redirect
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
      console.log('[AUTH] Logout API successful, forcing state clear...');
      
      // Aggressively clear global state
      globalAuthState = { user: null, isAuthenticated: false };
      
      // Clear all possible storage
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('[AUTH] Cleared localStorage and sessionStorage');
      } catch (e) {
        console.log('[AUTH] Storage clear failed:', e);
      }
      
      // Force immediate redirect without any delays - webview needs this
      console.log('[AUTH] Forcing immediate redirect...');
      
      // Use the most aggressive redirect possible
      window.location.assign('/');
      
      // Backup redirect methods
      setTimeout(() => {
        console.log('[AUTH] Backup redirect 1...');
        window.location.href = '/';
      }, 50);
      
      setTimeout(() => {
        console.log('[AUTH] Backup redirect 2...');
        window.location.replace('/');
      }, 100);
      
      setTimeout(() => {
        console.log('[AUTH] Emergency reload...');
        window.location.reload();
      }, 200);
      
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

  // Check authentication on mount and periodically
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      setIsLoading(true);
      const user = await fetchUserDirectly();
      if (mounted) {
        setAuthState({ user, isAuthenticated: !!user });
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Force recheck every 2 seconds to catch logout state changes
    const interval = setInterval(() => {
      if (mounted) {
        checkAuth();
      }
    }, 2000);
    
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