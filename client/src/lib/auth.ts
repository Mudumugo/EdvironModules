// Authentication utilities
import { QueryClient } from "@tanstack/react-query";
import { setLoggingOut } from "@/hooks/useAuth";

export const logoutUser = async (queryClient: QueryClient) => {
  try {
    // Set global logout state to prevent all API calls
    setLoggingOut(true);
    
    // Cancel and clear all queries immediately
    queryClient.cancelQueries();
    queryClient.clear();
    
    // Clear all client storage immediately
    localStorage.clear();
    sessionStorage.clear();
    
    // Then call the logout API
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("[AUTH] Logout successful");
    } else {
      console.warn("[AUTH] Logout API failed, but continuing with client cleanup");
    }

    return { success: true };
  } catch (error) {
    console.error("[AUTH] Logout error:", error);
    
    // Still perform cleanup even if API fails
    queryClient.cancelQueries();
    queryClient.clear();
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