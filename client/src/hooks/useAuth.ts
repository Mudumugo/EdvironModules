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

// COMPLETELY DISABLE authentication for landing page demos
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    refetch: () => Promise.resolve(),
    logout: () => Promise.resolve(true),
    fetchUser: () => Promise.resolve(null)
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