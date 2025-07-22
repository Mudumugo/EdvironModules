// Authentication utilities
import { QueryClient } from "@tanstack/react-query";

export const logoutUser = async (queryClient: QueryClient) => {
  try {
    // Call the logout API
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Regardless of API response, clear everything
    await Promise.all([
      // Invalidate all queries
      queryClient.invalidateQueries(),
      // Remove all cached data
      queryClient.removeQueries(),
    ]);

    // Clear all client storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear the query client entirely
    queryClient.clear();

    if (response.ok) {
      console.log("[AUTH] Logout successful");
    } else {
      console.warn("[AUTH] Logout API failed, but continuing with client cleanup");
    }

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

// Force redirect after logout
export const redirectAfterLogout = () => {
  // Use replace to prevent back navigation
  window.location.replace("/");
};