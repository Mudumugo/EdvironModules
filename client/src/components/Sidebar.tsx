import { useAuth } from "@/hooks/useAuth";
import { getModulesByCategory } from "@/config/rolePermissions";
import { UserRole } from "@shared/schema";
import { 
  SidebarRoleBadge,
  SidebarModuleSections,
  SidebarUserInfo
} from "@/components/sidebar";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user } = useAuth();
  
  if (!user || !user.role) return null;
  
  const userRole = user.role as UserRole;
  const modulesByCategory = getModulesByCategory(userRole);

  return (
    <nav className={`w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto z-50 transition-transform duration-200 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="p-4">
        <SidebarRoleBadge userRole={userRole} />
        <SidebarModuleSections 
          modulesByCategory={modulesByCategory} 
          onClose={onClose} 
        />
        <SidebarUserInfo user={user} />
      </div>
    </nav>
  );
}
