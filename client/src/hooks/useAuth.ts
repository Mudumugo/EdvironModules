import React from "react";
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

// Ultimate webview-compatible logout with maximum compatibility
export async function logoutDirectly(): Promise<boolean> {
  console.log('[AUTH] ULTIMATE LOGOUT - Starting complete logout process...');
  
  // Step 1: Immediately clear global state
  globalAuthState = { user: null, isAuthenticated: false };
  console.log('[AUTH] Global state cleared');
  
  // Step 2: Clear all storage immediately
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('[AUTH] All storage cleared');
  } catch (e) {
    console.log('[AUTH] Storage clear failed:', e);
  }
  
  // Step 3: Call logout API
  try {
    console.log('[AUTH] Calling logout API...');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('[AUTH] Logout API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('[AUTH] Logout API successful:', data);
    }
  } catch (error) {
    console.log('[AUTH] Logout API error (continuing anyway):', error);
  }
  
  // Step 4: Force redirect using ALL possible methods
  console.log('[AUTH] FORCING REDIRECT - Using all strategies...');
  
  // Immediate redirects
  setTimeout(() => {
    console.log('[AUTH] Strategy 1: window.location.assign');
    try { window.location.assign('/'); } catch (e) { console.log('[AUTH] assign failed'); }
  }, 0);
  
  setTimeout(() => {
    console.log('[AUTH] Strategy 2: window.location.href');
    try { window.location.href = '/'; } catch (e) { console.log('[AUTH] href failed'); }
  }, 50);
  
  setTimeout(() => {
    console.log('[AUTH] Strategy 3: window.location.replace');
    try { window.location.replace('/'); } catch (e) { console.log('[AUTH] replace failed'); }
  }, 100);
  
  setTimeout(() => {
    console.log('[AUTH] Strategy 4: window.location.reload');
    try { window.location.reload(); } catch (e) { console.log('[AUTH] reload failed'); }
  }, 200);
  
  // Emergency fallback
  setTimeout(() => {
    console.log('[AUTH] EMERGENCY: Final reload attempt');
    try { 
      window.location.href = window.location.protocol + '//' + window.location.host + '/';
    } catch (e) { 
      window.location.reload(); 
    }
  }, 500);
  
  return true;
}

// Dummy exports for backwards compatibility during transition
export const setLoggingOut = () => {};
export const getIsLoggingOut = () => false;

export function useAuth() {
  // Simplified direct fetch approach - bypass React Query caching issues
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const checkAuth = React.useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setError(null);
      } else {
        setUser(null);
        setError(null);
      }
    } catch (err) {
      setUser(null);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    checkAuth();
    // Check auth every 2 seconds to catch login state changes (reduced from 500ms)
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  // Also check on window focus
  React.useEffect(() => {
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkAuth]);

  return {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    error
  };
}

// Dummy logout state for backwards compatibility
export const isLoggedOut = false;