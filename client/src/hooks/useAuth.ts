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

// Webview-compatible logout with multiple redirect strategies
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
    
    if (response.ok) {
      console.log('[AUTH] Logout API successful, clearing state...');
      globalAuthState = { user: null, isAuthenticated: false };
      
      // Multiple redirect strategies for webview compatibility
      try {
        // Strategy 1: Force immediate redirect
        console.log('[AUTH] Attempting window.location.href redirect...');
        window.location.href = '/';
        
        // Strategy 2: Fallback with replace (in case href doesn't work)
        setTimeout(() => {
          console.log('[AUTH] Fallback redirect with replace...');
          window.location.replace('/');
        }, 100);
        
        // Strategy 3: Reload fallback
        setTimeout(() => {
          console.log('[AUTH] Final fallback - page reload...');
          window.location.reload();
        }, 500);
        
      } catch (redirectError) {
        console.error('[AUTH] Redirect error:', redirectError);
        // Last resort: force reload
        window.location.reload();
      }
      
      return true;
    }
    
    console.error('[AUTH] Logout API failed with status:', response.status);
    return false;
  } catch (error) {
    console.error('[AUTH] Logout request failed:', error);
    return false;
  }
}

// Dummy exports for backwards compatibility during transition
export const setLoggingOut = () => {};
export const getIsLoggingOut = () => false;

export function useAuth() {
  const [authState, setAuthState] = useState(globalAuthState);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
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
    
    return () => {
      mounted = false;
    };
  }, []);

  // Sync with global state
  useEffect(() => {
    setAuthState(globalAuthState);
  }, [globalAuthState.isAuthenticated]);

  return {
    user: authState.user as User | null,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    error: null
  };
}

// Dummy logout state for backwards compatibility
export const isLoggedOut = false;