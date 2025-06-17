import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, User, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RoleOption {
  id: string;
  name: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  { id: "student_elementary", name: "Student", color: "bg-blue-500" },
  { id: "teacher", name: "Teacher", color: "bg-green-500" },
  { id: "school_admin", name: "School Administrator", color: "bg-purple-500" },
  { id: "school_it_staff", name: "IT Staff", color: "bg-orange-500" },
  { id: "school_security", name: "Security Staff", color: "bg-red-500" },
];

export default function RoleSwitcher() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentRole = roleOptions.find(role => role.id === user.role) || roleOptions[0];

  const handleRoleSwitch = async (newRole: RoleOption) => {
    if (newRole.id === user.role) return;

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/demo-login", {
        role: newRole.id,
        name: `Demo ${newRole.name}`,
        email: `demo.${newRole.id}@edvirons.com`
      });

      if (response.ok) {
        toast({
          title: "Role Switched",
          description: `Now logged in as ${newRole.name}`,
        });
        // Reload to trigger auth state update
        window.location.reload();
      } else {
        throw new Error("Role switch failed");
      }
    } catch (error) {
      toast({
        title: "Role Switch Failed",
        description: "Unable to switch roles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/demo-logout", {});
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Unable to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${currentRole.color}`} />
          <span className="font-medium">{currentRole.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Switch Role</p>
          <p className="text-xs text-muted-foreground">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <DropdownMenuSeparator />
        
        {roleOptions.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => handleRoleSwitch(role)}
            disabled={isLoading || role.id === user.role}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className={`w-3 h-3 rounded-full ${role.color}`} />
            <span>{role.name}</span>
            {role.id === user.role && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Current
              </Badge>
            )}
            {isLoading && role.id !== user.role && (
              <RefreshCw className="h-3 w-3 ml-auto animate-spin" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}