import { createRoot } from "react-dom/client";
import "./lib/react-fix"; // Import React fix first
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Emergency logout function for debugging
(window as any).emergencyLogout = async () => {
  try {
    // Clear all browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach(c => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    
    // Call logout endpoint
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Force reload
    window.location.replace('/');
    console.log('Emergency logout completed');
  } catch (error) {
    console.error('Emergency logout failed:', error);
    window.location.replace('/');
  }
};

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
