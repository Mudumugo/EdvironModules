import { Shield } from "lucide-react";
import { getRoleDisplayName } from "@/config/rolePermissions";
import { UserRole } from "@shared/schema";

interface SidebarRoleBadgeProps {
  userRole: UserRole;
}

export function SidebarRoleBadge({ userRole }: SidebarRoleBadgeProps) {
  return (
    <div className="mb-6">
      <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium">
        <Shield className="inline mr-2 h-4 w-4" />
        {getRoleDisplayName(userRole)} Portal
      </div>
    </div>
  );
}