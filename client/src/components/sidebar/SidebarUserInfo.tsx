import { Badge } from "@/components/ui/badge";
import { getRoleDisplayName } from "@/config/rolePermissions";
import { UserRole } from "@shared/schema";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

interface SidebarUserInfoProps {
  user: User;
}

export function SidebarUserInfo({ user }: SidebarUserInfoProps) {
  const userRole = user.role as UserRole;
  
  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        <div className="font-medium">{user.firstName} {user.lastName}</div>
        <div className="truncate">{user.email}</div>
        <Badge variant="secondary" className="mt-1 text-xs">
          {getRoleDisplayName(userRole)}
        </Badge>
      </div>
    </div>
  );
}