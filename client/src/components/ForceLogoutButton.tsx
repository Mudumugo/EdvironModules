import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function ForceLogoutButton() {
  const handleForceLogout = () => {
    // Clear everything immediately
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
    
    // Call logout endpoint
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    }).finally(() => {
      // Force redirect regardless of response
      window.location.replace('/');
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleForceLogout}
      className="w-full mt-2"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Force Logout
    </Button>
  );
}