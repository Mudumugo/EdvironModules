// Authentication utilities
import { QueryClient } from "@tanstack/react-query";
import { setLoggingOut } from "@/hooks/useAuth";
import { setGlobalLogout } from "@/lib/queryClient";

export const logoutUser = async (queryClient: QueryClient) => {
  try {
    // IMMEDIATE: Set global logout states to prevent all API calls
    setLoggingOut(true);
    setGlobalLogout(true);
    
    // IMMEDIATE: Stop all queries and mutations
    queryClient.cancelQueries();
    queryClient.clear();
    queryClient.removeQueries();
    
    // IMMEDIATE: Clear all client storage
    localStorage.clear();
    sessionStorage.clear();
    
    // IMMEDIATE: Disable all future queries by setting default options
    queryClient.setDefaultOptions({
      queries: { enabled: false, retry: false },
      mutations: { retry: false }
    });
    
    // Then call the logout API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        console.log("[AUTH] Logout successful");
      } else {
        console.warn("[AUTH] Logout API failed, but continuing with client cleanup");
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.warn("[AUTH] Logout API timed out or failed, continuing with cleanup");
    }

    return { success: true };
  } catch (error) {
    console.error("[AUTH] Logout error:", error);
    
    // Still perform aggressive cleanup even if API fails
    try {
      queryClient.cancelQueries();
      queryClient.clear();
      queryClient.removeQueries();
    } catch (cleanupError) {
      console.warn("Query cleanup failed:", cleanupError);
    }
    localStorage.clear();
    sessionStorage.clear();
    
    return { success: false, error };
  }
};

// Force redirect after logout
export const redirectAfterLogout = () => {
  // Immediate redirect without delay to prevent any API calls
  window.location.replace("/");
};