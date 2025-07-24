// Authentication utilities
import { QueryClient } from "@tanstack/react-query";
// Authentication utilities

export const logoutUser = async (queryClient: QueryClient) => {
  try {
    // Simple logout without aggressive blocking
    console.log("[AUTH] Starting logout...");
    
    // Call logout API first
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("[AUTH] Logout successful");
    }

    // Simple cleanup
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();

    return { success: true };
  } catch (error) {
    console.error("[AUTH] Logout error:", error);
    
    // Still perform cleanup even if API fails
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();
    
    return { success: false, error };
  }
};

// Simple redirect after logout
export const redirectAfterLogout = () => {
  window.location.replace("/");
};