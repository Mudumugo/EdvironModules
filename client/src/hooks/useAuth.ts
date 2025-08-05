import { useQuery } from "@tanstack/react-query";
import { getQueryFn, queryClient } from "@/lib/queryClient";
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
  permissions?: string[];
}

// Authentication hook with real API integration
export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logout = useCallback(async () => {
    try {
      console.log('Force logout - clearing all data...');
      
      // Clear all browser storage first
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });
      
      // Clear query cache
      queryClient.clear();
      
      // Call logout endpoint (don't wait for response)
      fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {}); // Ignore errors
      
      // Force immediate redirect
      window.location.href = '/';
      setTimeout(() => window.location.reload(), 100);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
      return false;
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const result = await refetch();
    return result.data || null;
  }, [refetch]);

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error: error || null,
    refetch,
    logout,
    fetchUser
  };
}

// Direct logout function for when authentication is enabled
export async function logoutDirectly(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}